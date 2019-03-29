import { has, union } from 'lodash';
import { readFileSync } from 'fs';
import path from 'path';
import parse from './parsers';

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

const getItemChangeStr = (key, objBefore, objAfter) => itemChangeStr
  .find(({ check }) => check(key, objBefore, objAfter));

const getContent = filePath => readFileSync(filePath, 'utf8');

const getExtension = filepath => path.extname(filepath);

export default (filePathBefore, filePathAfter) => {
  const objBefore = parse(getContent(filePathBefore), getExtension(filePathBefore));
  const objAfter = parse(getContent(filePathAfter), getExtension(filePathAfter));

  const allKeys = union(Object.keys(objBefore), Object.keys(objAfter));

  const difference = allKeys.reduce((acc, key) => {
    const { result } = getItemChangeStr(key, objBefore, objAfter);
    return [...acc, result(key, objBefore, objAfter)];
  }, []);

  return `{\n${difference.join('\n')}\n}`;
};
