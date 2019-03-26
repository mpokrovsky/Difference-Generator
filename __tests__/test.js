import fs from 'fs';
import gendiff from '../src';

const path = require('path');

const getPath = fileName => path.join('__tests__', '__fixtures__', fileName);

const fileNameBefore = 'before.json';
const beforePath = getPath(fileNameBefore);

const fileNameAfter = 'after.json';
const afterPath = getPath(fileNameAfter);

const fileExpected = 'expected.txt';
const expected = fs.readFileSync(getPath(fileExpected), 'utf8');

test('test json configs', () => {
  expect(gendiff(beforePath, afterPath)).toBe(expected);
});
