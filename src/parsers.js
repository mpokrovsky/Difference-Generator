import yaml from 'js-yaml';
import path from 'path';

const parsers = [
  {
    name: 'json',
    check: arg => path.extname(arg) === '.json',
    parser: file => JSON.parse(file),
  },
  {
    name: 'yaml',
    check: arg => path.extname(arg) === '.yml',
    parser: arg => yaml.safeLoad(arg),
  },
];

export default arg => parsers.find(({ check }) => check(arg));
