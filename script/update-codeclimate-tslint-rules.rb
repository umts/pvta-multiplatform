#!/usr/bin/env ruby
require 'json'
require 'tmpdir'

Dir.chdir(Dir.mktmpdir)

File.open('package.json', 'w') do |file|
  json = {
    name: 'dummy',
    version: '0.0.1',
    private: true,
    dependencies: {
      'codeclimate-tslint' => 'github:tkqubo/codeclimate-tslint',
      'tslint-ionic-rules' => '0.0.14'
    }
  }.to_json
  file.write json
end

`npm install --only=prod`

tslint_conf = './node_modules/tslint-ionic-rules/tslint.js'
extends = JSON.parse(`node -e 'console.log(JSON.stringify(require("#{tslint_conf}").extends))'`)
builtin_rules = JSON.parse(`node -e 'console.log(JSON.stringify(require("#{tslint_conf}").rules))'`)

rules = File.open(File.join(__dir__, '..', 'tslint.json')) do |file|
  builtin_rules.merge JSON.parse(file.read)['rules']
end

File.open(File.join(__dir__, '..', 'tslint-codeclimate.json'), 'w') do |file|
  json = {
    extends: extends,
    rules: rules,
    rulesDirectory: '/usr/src/app/node_modules/tslint-eslint-rules/dist/rules'
  }.to_json

  file.write json
end
