import yaml from 'js-yaml';
import ini from 'ini';

const extensionParsers = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

export default (content, extension) => extensionParsers[extension](content);
