#!/usr/bin/env node

const program = require('commander');

program
  .version('0.0.1')
  .command('gendiff')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-V, --version', 'output the version number')
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);
