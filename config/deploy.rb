require 'tmpdir'

# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'pvta-multiplatform'
set :scm, :scm
set :branch, 'master'
set :repo_url, 'git@github.com:umts/pvta-multiplatform.git'

set :local_temp_dir, Pathname.new(Dir.mktmpdir)
set :deploy_to, "/srv/#{fetch :application}"

set :app_subdirectory, 'www'
set :rsync_opts, '--recursive --links --times --perms --chmod=g+w'

set :log_level, :info

# Default value for :linked_files is []
# set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')

# Default value for linked_dirs is []
# set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system')

namespace :scm do
  task :check do
    invoke 'local_copy:check'
  end

  task :create_release do
    invoke 'local_copy:create_release'
    invoke 'local_copy:upload_release'
  end

  task :set_current_revision do
    invoke 'local_copy:set_current_revision'
  end
end
