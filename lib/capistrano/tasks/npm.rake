namespace :npm do
  task :install do
    run_locally do
      within fetch(:local_temp_dir).join('release') do
        execute :npm, 'install'
      end
    end
  end

  task :build do
    run_locally do
      within fetch(:local_temp_dir).join('release') do
        stagemap = {'development' => 'dev',
                    'staging' => 'prod',
                    'production' => 'prod'
        }
        execute :npm, 'run', 'ionic:build', "--#{stagemap[fetch(:stage)]}", '--release'
      end
    end
  end
end
