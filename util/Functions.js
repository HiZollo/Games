function fixedDigits(integer, digits) {
  const string = `${integer}`;

  if (digits <= string.length) return string;
  return '0'.repeat(digits - string.length) + string;
}

function format(string, ...str) {
  str.forEach((s, i) => {
    string = string.replaceAll(`%s${i+1}`, s);
  });
  string = string.replace(/\%s\d+/g, '');
  return string;
}

function overwrite(obj1, obj2) {
  for (let key in obj2) {
    obj1[key] = (typeof obj2[key] === 'object') ? overwrite(obj1[key] ?? {}, obj2[key]) : obj2[key];
  }
  return obj1;
}

module.exports = {
  fixedDigits, format, overwrite
};
