namespace :local_copy do
  task :clone do
    run_locally do
      clone_path = fetch(:local_temp_dir).join('release')
      execute :git, :clone, fetch(:repo_url),
              '--depth=1 --branch', fetch(:branch), clone_path
    end
  end

  task create_release: :clone do
    invoke 'bower:install'
  end

  task :upload_release do
    run_locally do
      roles(:web).each do |host|
        execute :rsync, fetch(:rsync_opts),
          fetch(:local_temp_dir).join('release', fetch(:app_subdirectory), '*'),
          "#{host.user}@#{host.hostname}:#{release_path}"
      end
    end
  end

  task :check do
    run_locally do
      execute :git, 'ls-remote --heads', repo_url
      execute :rsync, '--version'
    end
  end

  task :set_current_revision do
    run_locally do
      set :current_revision,
          capture(:git, "ls-remote --heads", fetch(:repo_url), fetch(:branch), '| cut -f 1')
    end
  end
end
