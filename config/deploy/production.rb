remote_user = Net::SSH::Config.for('af-transit-app3.admin.umass.edu')[:user] || ENV['USER']
server 'af-transit-app3.admin.umass.edu',
       roles: %w(web),
       user: remote_user
set :tmp_dir, "/tmp/#{remote_user}"

set :repo_url, 'git@github.com:umts/pvta-multiplatform.git'
set :branch, 'master'

set :deploy_to, '/srv/pvta-multiplatform'
