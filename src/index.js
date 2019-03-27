import { has, uniq } from 'lodash';
import { readFileSync } from 'fs';
import getFileExtension from './parser';

const itemChangeStr = [
  {
    state: 'value saved',
    check: (key, obj1, obj2) => has(obj1, key) && has(obj2, key) && obj1[key] === obj2[key],
    result: (key, obj2) => `    ${key}: ${obj2[key]}`,
  },
  {
    state: 'value changed',
    check: (key, obj1, obj2) => has(obj1, key) && has(obj2, key) && obj1[key] !== obj2[key],
    result: (key, obj1, obj2) => `  + ${key}: ${obj2[key]}\n  - ${key}: ${obj1[key]}`,
  },
  {
    state: 'value added',
    check: (key, obj1, obj2) => !has(obj1, key) && has(obj2, key),
    result: (key, obj1, obj2) => `  + ${key}: ${obj2[key]}`,
  },
  {
    state: 'value removed',
    check: (key, obj1, obj2) => has(obj1, key) && !has(obj2, key),
    result: (key, obj1) => `  - ${key}: ${obj1[key]}`,
  },
];

const getItemChangeStr = (k, obj1, obj2) => itemChangeStr.find(({ check }) => check(k, obj1, obj2));

const getContent = filePath => readFileSync(filePath, 'utf8');

export default (filePathBefore, filePathAfter) => {
  const { process } = getFileExtension(filePathBefore);

  const objBefore = process(getContent(filePathBefore));
  const objAfter = process(getContent(filePathAfter));

  const allKeys = uniq([...Object.keys(objBefore), ...Object.keys(objAfter)]);

  const difference = allKeys.reduce((acc, key) => {
    const { result } = getItemChangeStr(key, objBefore, objAfter);
    acc.push(result(key, objBefore, objAfter));
    return acc;
  }, []);

  return `{\n${difference.join('\n')}\n}`;
};
