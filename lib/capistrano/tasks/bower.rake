namespace :bower do
  task :install do
    run_locally do
      within fetch(:local_temp_dir).join('release') do
        execute :bower, 'install'
      end
    end
  end
end
