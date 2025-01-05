"use client"; // Add this line at the very top of the file

import { useState, useEffect } from "react";
import axios from "axios";

// Define the type for available time slots
let availableTimeSlots: { [key: string]: string[] } = {}

function getRandomTimeSlots(slots: string[]) {
  return slots.sort(() => Math.random() - 0.5);
}

export default function Home() {

  const [restoTimeSlots, setRestoTimeSlots] = useState<string[]>([]);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    console.log('useEffect');
    // Fetch available time slots from the API
    axios.get("http://localhost:4000/timeslots").then((response: any) => {
      availableTimeSlots = response.data;
      setRestoTimeSlots(response.data);
      console.log(response.data);
    });
  }, [booked]);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    date: "",
    time: "",
    guests: 1,
  });

  const [errors, setErrors] = useState({
    name: "",
    contact: "",
    date: "",
    time: "",
    guests: "",
  });

  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    if (formData.date) {
      const slots = availableTimeSlots[formData.date] || [];
      setTimeSlots(getRandomTimeSlots(slots));
    } else {
      setTimeSlots([]);
    }
  }, [formData.date]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    let valid = true;
    let newErrors = { name: "", contact: "", date: "", time: "", guests: "" };

    if (!formData.name) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!formData.contact) {
      newErrors.contact = "Contact is required";
      valid = false;
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
      valid = false;
    }
    if (!formData.time) {
      newErrors.time = "Time is required";
      valid = false;
    }
    if (formData.guests < 1 || isNaN(formData.guests)) {
      newErrors.guests = "At least one guest is required and must be a number";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleBookMore = () => {
    setBooked(false);
    setFormData({
      name: "",
      contact: "",
      date: "",
      time: "",
      guests: 1,
    });
    setConfirmationMessage(null);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let obj: { [key: string]: string } = {}
    obj[formData.date.toString()] = formData.time;
    console.log(restoTimeSlots);
    console.log(formData.date.toString() + ' ' + formData.time);
    const data = excludeFromObject(restoTimeSlots, obj);
    console.log(obj);
    if (validate()) {
      setBooked(true);
      axios.put("http://localhost:4000/timeslots/677ab37d8b552c82e7049eb8", data).then((response: any) => {
        setConfirmationMessage(`Reservation successful! Name: ${formData.name}, Contact: ${formData.contact}, Date: ${formData.date}, Time: ${formData.time}, Guests: ${formData.guests}`);
      });
    }
  };

  function excludeFromObject(obj: any, objToExclude: any) {
    const result = { ...obj };

    for (const key in objToExclude) {
      if (result[key] && Array.isArray(result[key])) {
        result[key] = result[key].filter(item => !objToExclude[key].includes(item));
      }
    }

    return result;
  }

  return (

    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)] bg-gray-100 text-black">
      {!booked ? <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Book Your Reservation</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
          <label className="flex flex-col">
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded p-2 mt-1"
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
          </label>
          <label className="flex flex-col">
            Contact:
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="border rounded p-2 mt-1"
            />
            {errors.contact && <span className="text-red-500 text-sm">{errors.contact}</span>}
          </label>
          <label className="flex flex-col">
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border rounded p-2 mt-1"
            />
            {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
          </label>
          <label className="flex flex-col">
            Time:
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="border rounded p-2 mt-1"
            >
              <option value="">Select a time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            {errors.time && <span className="text-red-500 text-sm">{errors.time}</span>}
          </label>
          <label className="flex flex-col">
            Number of Guests:
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              className="border rounded p-2 mt-1"
              min="1"
            />
            {errors.guests && <span className="text-red-500 text-sm">{errors.guests}</span>}
          </label>
          <button
            onClick={handleSubmit}
            type="submit"
            className="bg-blue-500 text-white rounded p-2 px-4 mt-4 hover:bg-blue-600 transition"
          >
            Book Now
          </button>
        </form></main> :
        <div id="confirmation" className="flex flex-col fixed top-50% left-50% items-center bg-white p-8 rounded-lg shadow-lg justify-center">
          <h1 className="text-2xl font-bold mb-4">Reservation Successful</h1>
          <table className="mb-4">
            <tbody>
              <tr>
                <td className="font-bold">Name</td>
                <td>{formData.name}</td>
              </tr>
              <tr>
                <td className="font-bold">Contact</td>
                <td>{formData.contact}</td>
              </tr>
              <tr>
                <td className="font-bold">Date</td>
                <td>{formData.date}</td>
              </tr>
              <tr>
                <td className="font-bold">Time</td>
                <td>{formData.time}</td>
              </tr>
              <tr>
                <td className="font-bold">Guests</td>
                <td>{formData.guests}</td>
              </tr>
            </tbody>
          </table>
          <button
            onClick={handleBookMore}
            type="submit"
            className="bg-blue-500 text-white rounded p-2 px-4 hover:bg-blue-600 transition"
          >
            Book More
          </button>
        </div>
      }
    </div>
  );
}
