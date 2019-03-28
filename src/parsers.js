import yaml from 'js-yaml';
import path from 'path';

const parsers = [
  {
    check: arg => path.extname(arg) === '.json',
    parse: file => JSON.parse(file),
  },
  {
    check: arg => path.extname(arg) === '.yml',
    parse: arg => yaml.safeLoad(arg),
  },
];

export default arg => parsers.find(({ check }) => check(arg));
