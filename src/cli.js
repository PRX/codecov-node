#!/usr/bin/env node
import argv from 'argv'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

import codecov from './'
import json from '../package.json'

const args = argv.option([
  {name: 'token', short: 't', type: 'string', description: 'Private repository token. Not required for public repos on Travis, CircleCI and AppVeyor'},
  {name: 'file', short: 'f', type: 'path', description: 'Target a specific file for uploading and disabling automatic detection of coverage files.'},
  {name: 'env', short: 'e', type: 'string', description: 'Store environment variables to help distinguish CI builds. Example: http://bit.ly/1ElohCu', example: '--env=VAR1,VAR2,VAR3'},
  {name: 'root', short: 'p', type: 'path', description: 'Project root, if not current directory'},
  {name: 'gcov-root', type: 'path', description: 'Project root directory when preparing gcov'},
  {name: 'gcov-glob', type: 'string', description: 'Paths to ignore during gcov gathering'},
  {name: 'gcov-exec', type: 'string', description: 'gcov executable to run. Defaults to \'gcov\''},
  {name: 'gcov-args', type: 'string', description: 'extra arguments to pass to gcov'},
  {name: 'disable', short: 'X', type: 'string', description: 'Disable features. Accepting `search` to disable crawling through directories, `detect` to disable detecting CI provider, `gcov` disable gcov commands'},
  {name: 'commit', short: 'c', type: 'string', description: 'Commit sha, set automatically'},
  {name: 'branch', short: 'b', type: 'string', description: 'Branch name'},
  {name: 'build', short: 'B', type: 'string', description: 'Specify a custom build number to distinguish ci jobs, provided automatically for supported ci companies'},
  {name: 'slug', short: 'r', type: 'string', description: 'Specify repository slug for Enterprise ex. owner/repo'},
  {name: 'url', short: 'u', type: 'string', description: 'Your Codecov endpoint'},
  {name: 'dump', type: 'boolean', description: 'Dump collected data and do not send to Codecov'},
]).run()

const fileNamePatterns = [
  '*coverage.*',
  'nosetests.xml',
  'jacoco*.xml',
  'clover.xml',
  'report.xml',
  'cobertura.xml',
  'luacov.report.out',
  'lcov.info',
  '*.lcov',
  'gcov.info',
  '*.gcov',
  '*.lst',
]

const fileNameExcludes = [
  '*.sh',
  '*.data',
  '*.py',
  '*.class',
  '*.xcconfig',
  'Coverage.profdata',
  'phpunit-code-coverage.xml',
  'coverage.serialized',
  '*.pyc',
  '*.cfg',
  '*.egg',
  '*.whl',
  '*.html',
  '*.js',
  '*.cpp',
  'coverage.jade',
  'include.lst',
  'inputFiles.lst',
  'createdFiles.lst',
  'coverage.html',
  'scoverage.measurements.*',
  'test_*_coverage.txt',
  'conftest_*.c.gcov',
  '.egg-info*',
]

const pathExcludes = [
  'vendor',
  'htmlcov',
  'home/cainus',
  'virtualenv',
  'js/generated/coverage',
  '.virtualenv',
  'virtualenvs',
  '.virtualenvs',
  '.env',
  '.envs',
  'env',
  'envs',
  '.venv',
  '.venvs',
  'venv',
  'venvs',
  '.git',
  '.hg',
  '.tox',
  '__pycache__',
  '.egg-info*',
  '$bower_components',
  'node_modules',
]

console.log(`
  _____          _
 / ____|        | |
| |     ___   __| | ___  ___ _____   __
| |    / _ \\ / _\` |/ _ \\/ __/ _ \\ \\ / /
| |___| (_) | (_| |  __/ (_| (_) \\ V /
 \\_____\\___/ \\__,_|\\___|\\___\\___/ \\_/
                                ${json.version}`)

const url = args.options.url || process.env.codecov_url || process.env.CODECOV_URL || 'https://codecov.io'
const yaml = ['codecov.yml', '.codecov.yml'].reduce((result, file) => (
  result ||
    (fs.existsSync(path.resolve(process.cwd(), file)) ? file : undefined)
), undefined)
const token = args.options.token || process.env.codecov_token || process.env.CODECOV_TOKEN

const options = {
  ...args.options,
  url,
  yaml,
  token,
  package: `node-${json.version}`,
}

console.log('==> Configuration: ')
console.log('    Endpoint: ' + url)
console.log(options)

// Add specified env vars
const data = [args.options.env, process.env.CODECOV_ENV, process.env.codecov_env]
  .filter(i => !!i)
  .reduce((upload, env) => upload.concat(`${env}=${process.env[env]}\n`), '')

const endData = data.concat(data === '' ? '<<<<<< ENV\n' : '')

codecov
  .send({
    ...options,
    data,
  })
  .catch(err => console.error(err.message))
