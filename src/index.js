import { has, union } from 'lodash';
import { readFileSync } from 'fs';
import getParser from './parsers';

const itemChangeStr = [
  {
    check: (key, obj1, obj2) => has(obj1, key) && has(obj2, key) && obj1[key] === obj2[key],
    result: (key, obj2) => `    ${key}: ${obj2[key]}`,
  },
  {
    check: (key, obj1, obj2) => has(obj1, key) && has(obj2, key) && obj1[key] !== obj2[key],
    result: (key, obj1, obj2) => `  + ${key}: ${obj2[key]}\n  - ${key}: ${obj1[key]}`,
  },
  {
    check: (key, obj1, obj2) => !has(obj1, key) && has(obj2, key),
    result: (key, obj1, obj2) => `  + ${key}: ${obj2[key]}`,
  },
  {
    check: (key, obj1, obj2) => has(obj1, key) && !has(obj2, key),
    result: (key, obj1) => `  - ${key}: ${obj1[key]}`,
  },
];

const getItemChangeStr = (key, obj1, obj2) => itemChangeStr
  .find(({ check }) => check(key, obj1, obj2));

const getContent = filePath => readFileSync(filePath, 'utf8');

export default (filePathBefore, filePathAfter) => {
  const parse = getParser(filePathBefore);

  const objBefore = parse(getContent(filePathBefore));
  const objAfter = parse(getContent(filePathAfter));

  const allKeys = union(Object.keys(objBefore), Object.keys(objAfter));

  const difference = allKeys.reduce((acc, key) => {
    const { result } = getItemChangeStr(key, objBefore, objAfter);
    return [...acc, result(key, objBefore, objAfter)];
  }, []);

  return `{\n${difference.join('\n')}\n}`;
};
