import { has, uniq } from 'lodash';
import { readFileSync } from 'fs';


const fileExtension = [
  {
    name: 'json',
    check: arg => arg.split('.').pop() === 'json',
    process: file => JSON.parse(file),
  },
];

const getFileExtension = arg => fileExtension.find(({ check }) => check(arg));

const resFormat = [
  {
    name: 'save value',
    check: (key, obj1, obj2) => has(obj1, key) && has(obj2, key) && obj1[key] === obj2[key],
    result: (key, obj2) => `    ${key}: ${obj2[key]}\n`,
  },
  {
    name: 'change value',
    check: (key, obj1, obj2) => has(obj1, key) && has(obj2, key) && obj1[key] !== obj2[key],
    result: (key, obj1, obj2) => `  + ${key}: ${obj2[key]}\n  - ${key}: ${obj1[key]}\n`,
  },
  {
    name: 'add value',
    check: (key, obj1, obj2) => !has(obj1, key) && has(obj2, key),
    result: (key, obj1, obj2) => `  + ${key}: ${obj2[key]}\n`,
  },
  {
    name: 'remove value',
    check: (key, obj1, obj2) => has(obj1, key) && !has(obj2, key),
    result: (key, obj1) => `  - ${key}: ${obj1[key]}\n`,
  },
];

const getResultFormat = (arg, obj1, obj2) => resFormat.find(({ check }) => check(arg, obj1, obj2));
/*
export default (filePathBefore, filePathAfter) => {
  const { process } = getFileExtension(filePathBefore);

  const contentBefore = readFileSync(filePathBefore, 'utf8');
  const objBefore = process(contentBefore);

  const contentAfter = readFileSync(filePathAfter, 'utf8');
  const objAfter = process(contentAfter);

  const allKeys = uniq([...Object.keys(objBefore), ...Object.keys(objAfter)]);

  const difference = allKeys.reduce((acc, key) => {
    const { result } = getResultFormat(key, objBefore, objAfter);
    return acc + result(key, objBefore, objAfter);
  }, '');

  return `{\n${difference}}`;
};
*/

export default (filePathBefore, filePathAfter) => {
  console.log('hi!!!!');
};
