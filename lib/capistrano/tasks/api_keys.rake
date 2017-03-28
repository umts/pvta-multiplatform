namespace :api_keys do
  task :link do
    on roles(:web) do
      within release_path do
        execute :ln, '-sf', "assets/keys/keys.js.#{fetch(:stage)}", 'assets/keys/keys.js'
      end
    end
  end
end
