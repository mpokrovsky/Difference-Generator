import {
  has, union, isPlainObject,
} from 'lodash';
import { readFileSync } from 'fs';
import path from 'path';
import parse from './parsers';

const itemLines = {
  added: (item, depth) => `${'    '.repeat(depth - 1)}  + ${item.key}: ${item.value}`,
  removed: (item, depth) => `${'    '.repeat(depth - 1)}  - ${item.key}: ${item.value}`,
  unchanged: (item, depth) => `${'    '.repeat(depth - 1)}    ${item.key}: ${item.value}`,
  changed: (item, depth) => `${'    '.repeat(depth - 1)}  + ${item.key}: ${item.valueAfter}\n${'    '.repeat(depth - 1)}  - ${item.key}: ${item.valueBefore}`,
  parent: (item, depth, fun) => `${'    '.repeat(depth)}    ${item.key}: {\n${fun(item.children, depth + 1)}\n}`,
};

const render = (data, depth = 1) => data.map(item => itemLines[item.type](item, depth, render)).join('\n');

const itemToAst = [
  {
    type: 'parent',
    check: (key, obj1, obj2) => isPlainObject(obj1[key]) && isPlainObject(obj2[key]),
    result: (key, obj1, obj2, fun) => ({ key, children: fun(obj1[key], obj2[key]) }),
  },
  {
    type: 'added',
    check: (key, obj1, obj2) => !has(obj1, key) && has(obj2, key),
    result: (key, obj1, obj2) => ({ key, value: obj2[key] }),
  },
  {
    type: 'removed',
    check: (key, obj1, obj2) => has(obj1, key) && !has(obj2, key),
    result: (key, obj1) => ({ key, value: obj1[key] }),
  },
  {
    type: 'unchanged',
    check: (key, obj1, obj2) => obj1[key] === obj2[key],
    result: (key, obj2) => ({ key, value: obj2[key] }),
  },
  {
    type: 'changed',
    check: (key, obj1, obj2) => obj1[key] !== obj2[key],
    result: (key, obj1, obj2) => ({ key, valueBefore: obj1[key], valueAfter: obj2[key] }),
  },
];

const getItemToAst = (key, objBefore, objAfter, fun) => itemToAst
  .find(({ check }) => check(key, objBefore, objAfter, fun));

const buildAst = (obj1, obj2) => {
  const allKeys = union(Object.keys(obj1), Object.keys(obj2));
  return allKeys.map((key) => {
    const { type, result } = getItemToAst(key, obj1, obj2, buildAst);
    return { ...result(key, obj1, obj2, buildAst), type };
  });
};

const getContent = filePath => readFileSync(filePath, 'utf8');
const getExtension = filepath => path.extname(filepath);

export default (filePathBefore, filePathAfter) => {
  const objBefore = parse(getContent(filePathBefore), getExtension(filePathBefore));
  const objAfter = parse(getContent(filePathAfter), getExtension(filePathAfter));

  const ast = buildAst(objBefore, objAfter);
  return `{\n${render(ast)}\n}`;
};
