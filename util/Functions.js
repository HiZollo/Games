/**
 * Adds 0's in fromt of an integer to make it a string of desired length.
 * @param {number} integer
 * @param {number} length
 * @returns {string}
 */
function fixedDigits(integer, length) {
  const string = `${integer}`;

  if (length <= string.length) return string;
  return '0'.repeat(length - string.length) + string;
}

/**
 * Replaces format specifiers with given strings.
 * @param {string} string the format string with format specifiers inside
 * @param {<string: string>} object the values that replace <key>
 * @returns {string}
 * @example
 * // only specifiers like "<string>" are available
 * const string = format("I love <drink> and <food>!", { food: "pizza", drink: "tea" });
 * console.log(string);
 * // I love tea and pizza!
 */
function format(string, object) {
  for (let key in object) {
    const regexp = new RegExp(`<${key}>`, 'g');
    string = string.replaceAll(regexp, object[key]);
  }
  return string;
}

/**
 * Deep-overwrites abj2 into abj1.
 * @param {Object} obj1
 * @param {Object} obj2
 * @returns {Object} the overwrited object
 */
function overwrite(obj1, obj2) {
  for (let key in obj2) {
    obj1[key] = (typeof obj2[key] === 'object') ? overwrite(obj1[key] ?? {}, obj2[key]) : obj2[key];
  }
  return obj1;
}

/**
 * Returns a promise that takes a certain amount of time to resolve.
 * @param {number} time in milliseconds
 * @param {*} message the message to resolve
 * @returns {Promise<*>} a promise that always resolves
 */
function sleep(time, message) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(message);
    }, time);
  });
}

module.exports = {
  fixedDigits, format, overwrite, sleep
};
