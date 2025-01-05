function excludeFromObject(obj, objToExclude) {
    const result = { ...obj };

    for (const key in objToExclude) {
      if (result[key] && Array.isArray(result[key])) {
        result[key] = result[key].filter(item => !objToExclude[key].includes(item));
      }
    }

    return result;
  }

    const obj = {
        a: [1, 2, 3],
        b: [4, 5, 6],
        c: [7, 8, 9]
    };

    const obj1 = {
        a:[1]
    }

    console.log(excludeFromObject(obj, obj1)); // { a: [2, 3], b: [4, 5, 6], c: [7, 8, 9] }