require 'tmpdir'

# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'pvta-multiplatform'
set :scm, :scm

set :local_temp_dir, Pathname.new(Dir.mktmpdir)

set :app_subdirectory, 'www'
set :rsync_opts, '--recursive --links --times --perms --chmod=g+w,Dg+s'
set :log_level, :info

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
