/**
 * Adds 0's in fromt of an integer to make it a string of desired length.
 * @param integer the integer
 * @param length the desired length
 * @returns the result string
 */
export function fixedDigits(integer: number, length: number): string {
  const string = `${integer}`;

  if (length <= string.length) return string;
  return '0'.repeat(length - string.length) + string;
}

/**
 * Replaces format specifiers with given strings.
 * @param formatString the format string with format specifiers inside
 * @param specifiers the values that replace <key>
 * @returns the result string
 * @example
 * // only specifiers like "<string>" are available
 * const string = format("I love <drink> and <food>!", { food: "pizza", drink: "tea" });
 * console.log(string);
 * // I love tea and pizza!
 */
export function format(formatString: string, specifiers: {[key: string]: boolean | number | string | null}): string {
  for (let key in specifiers) {
    const regexp = new RegExp(`<${key}>`, 'g');
    formatString = formatString.replaceAll(regexp, `${specifiers[key]}`);
  }
  return formatString;
}

/**
 * Deep-overwrites obj2 into obj1.
 * @param obj1
 * @param obj2
 * @returns the overwrited object
 */
export function overwrite<T>(obj1: T, obj2: T): T {
  for (let key in obj2) {
    obj1[key] = (typeof obj2[key] === 'object') ? overwrite(obj1[key], obj2[key]) : obj2[key];
  }
  return obj1;
}

/**
 * Returns a promise that takes a certain amount of time to resolve.
 * @param time in milliseconds
 * @param message the message to resolve
 * @returns a promise that always resolves
 */
export function sleep(time: number, message: any): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(message);
    }, time);
  });
}