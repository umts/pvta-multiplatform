namespace :npm do
  task :install do
    run_locally do
      within fetch(:local_temp_dir).join('release') do
        execute :npm, 'install'
      end
    end
  end
end
