#!/usr/bin/env node

import { program } from 'commander';

<<<<<<< HEAD
program('0.0.1')
=======
program
  .version('0.0.1')
>>>>>>> ce8418ef643676313ce39eb7a9acacd301e9af90
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);
