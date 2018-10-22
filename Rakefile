require 'json'
require 'nokogiri'
require 'semver'

desc <<~DESC
Update all version strings to match the current version.
This includes the "general", Android, iOS version codes in config.xml
as well as the version stored in package.json.
DESC
task version: 'version:default'

namespace :version do

  task default: [:deps, :modify_general, :modify_android, :modify_ios] do
    Rake::Task['version:cleanup'].invoke
  end

  desc <<~DESC
  Update the "general" version code to match the current version.
  Also updates the version stored in package.json.
  DESC
  task general: [:deps, :modify_general] do
    Rake::Task['version:cleanup'].invoke
  end

  desc 'Update the Android version code to match the current version.'
  task android: [:deps, :modify_android] do
    Rake::Task['version:cleanup'].invoke
  end

  desc 'Update the iOS version code to match the current version.'
  task ios: [:deps, :modify_ios] do
    Rake::Task['version:cleanup'].invoke
  end

  task :modify_general do
    attribute = @doc.at_css('widget').attributes['version']
    version = @version.format("%M.%m.%p%s")
    attribute.value = @json['version']  = version
  end

  task :modify_android do
    attribute = @doc.at_css('widget').attributes['android-versionCode']
    version = "%d%02d%02d" % [@version.major, @version.minor, @version.patch]
    attribute.value = version
  end

  task :modify_ios do
    attribute = @doc.at_css('widget').attributes['ios-CFBundleVersion']
    attribute.value = @version.format("%M.%m.%p%s")
  end

  task :deps do
    @version = SemVer.find

    config_filename = File.join(__dir__, 'config.xml')
    config_file = File.open(config_filename, 'r')
    @doc = Nokogiri::XML(config_file)
    @config_file = config_file.reopen(config_filename, 'w')

    package_filename = File.join(__dir__, 'package.json')
    package_file = File.open(package_filename, 'r')
    @json = JSON.parse(package_file.read)
    @package_file = package_file.reopen(package_filename, 'w')
  end

  task :cleanup do
    @config_file.write @doc.to_xml
    @config_file.close

    @package_file.write JSON.pretty_generate(@json)
    @package_file.close
  end
end
