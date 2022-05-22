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
 * @param {...string} str given strings
 * @returns {string}
 * @example
 * // only specifiers like "%1s" "%2s" are available, numbers between % and s are 1-indexed
 * const string = format("I love %2s and %1s!", "tea", "pizza");
 * console.log(string);
 * // I love pizza and tea!
 */
function format(string, ...str) {
  for (let i = str.length - 1; i >= 0; i--) {
    string = string.replaceAll(`%${i+1}s`, str[i]);
  }
  string = string.replace(/\%\d+s/g, '');
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
