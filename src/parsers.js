import yaml from 'js-yaml';
import path from 'path';
import ini from 'ini';

const parsers = {
  '.json': file => JSON.parse(file),
  '.yml': file => yaml.safeLoad(file),
  '.ini': file => ini.parse(file),
};

export default file => parsers[path.extname(file)];
