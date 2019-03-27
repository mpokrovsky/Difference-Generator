import yaml from 'js-yaml';
import path from 'path';

const fileExtension = [
  {
    name: 'json',
    check: arg => path.extname(arg) === '.json',
    process: file => JSON.parse(file),
  },
  {
    name: 'yaml',
    check: arg => path.extname(arg) === '.yml',
    process: arg => yaml.safeLoad(arg),
  },
];

export default arg => fileExtension.find(({ check }) => check(arg));
