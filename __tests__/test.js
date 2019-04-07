import fs from 'fs';
import path from 'path';
import gendiff from '../src';

const getPath = fileName => path.join('__tests__', '__fixtures__', fileName);

test.each([
  ['before.json', 'after.json', 'expected.txt'],
  ['before.yml', 'after.yml', 'expected.txt'],
  ['before.ini', 'after.ini', 'expected.txt'],
  // ['beforeTree.json', 'afterTree.json', 'expectedTree.txt'],
  // ['beforeTree.yml', 'afterTree.yml', 'expectedTree.txt'],
  // ['beforeTree.ini', 'afterTree.ini', 'expectedTree.txt'],
])('add(%s, %s)',
  (a, b, c) => {
    const beforePath = getPath(a);
    const afterPath = getPath(b);
    const expected = fs.readFileSync(getPath(c), 'utf8');
    expect(gendiff(beforePath, afterPath)).toBe(expected);
  });
