import yaml from 'js-yaml';
import path from 'path';

const parsers = {
  '.json': file => JSON.parse(file),
  '.yml': file => yaml.safeLoad(file),
};

export default file => parsers[path.extname(file)];
