# Deploying PVTrAck

Developers may use this document as a tutorial for deploying PVTrAck updates to its various distribution channels.

Play Store and App Store sections loosely follow the [Ionic documentation for publishing](http://ionicframework.com/docs/guide/publishing.html). Many of the steps described there have already been done for you.

## To the Web

_Prerequirements_
- You must have SSH access to `af-transit-app3.admin.umass.edu`. See @sherson or @werebus.

From your local clone or fork of this repository, execute the following commands:

1. `bundle install` - installs [Capistrano](http://capistranorb.com/), a Ruby tool for deployment automation.
2. `cap production deploy` - connects to _app3_ and updates `m.pvta.com` to contain the version of PVTrAck currently on `origin/master`.

## To the Play Store
_Prerequirements_
- You **must** have the official PVTrAck signing key. See @akaplo.
- You *should* have [Android Studio](https://developer.android.com/studio/index.html) installed.
- You **must** have the Android SDK and Android build tools installed (both bundled with Android Studio, see above).
- You **must** have access to the [Google Play Developer Console](play.google.com/apps/publish) (see @sherson with your Google username, who will contact @jpbagley26).

From your local clone or fork of this repository, execute the following commands:

1. `npm install` and `bower install`
2. Open `config.xml`. On line 2, update
