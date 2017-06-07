## Deploying PVTrAck to the Web

##### Prerequirements
- You **must** read the [general deploy info](README.md).
- You **must** have SSH access to `app3` at `UMass Amherst`. See @werebus or @sherson.

From your local clone, execute the following commands (this assumes that your machine has a recent version of Ruby):

1. `gem install bundler`
2. `bundle`
3. `cap production deploy` - connects to _app3_ and updates `m.pvta.com` to contain the version of PVTrAck currently on `origin/master`.
