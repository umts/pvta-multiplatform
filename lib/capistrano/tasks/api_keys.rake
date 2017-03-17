namespace :api_keys do
  task :link do
    on roles(:web) do
      within release_path do
        execute :ln, '-sf', "keys.js.#{fetch(:stage)}", 'keys.js'
      end
    end
  end
end
