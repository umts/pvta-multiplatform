# PVTrAck

The official app of the Pioneer Valley Transit Authority ([PVTA](http://pvta.com))!

Current release available at [m.pvta.com](https://m.pvta.com), the [Play Store](https://play.google.com/store/apps/details?id=com.umts.pvtamultiplaform), and the [App Store](https://itunes.apple.com/us/app/pvtrack/id1234619753).

[![Build Status](https://travis-ci.org/umts/pvta-multiplatform.svg?branch=master)](https://travis-ci.org/umts/pvta-multiplatform)
<a href="https://codeclimate.com/github/umts/pvta-multiplatform"><img src="https://codeclimate.com/github/umts/pvta-multiplatform/badges/gpa.svg" /></a>
[![Issue Count](https://codeclimate.com/github/umts/pvta-multiplatform/badges/issue_count.svg)](https://codeclimate.com/github/umts/pvta-multiplatform)

The app is a hybrid that uses Ionic 2+.

All data is live, and comes from endpoints documented [here](http://bustracker.pvta.com/InfoPoint/swagger/ui/index#!).

To begin developing, follow these steps:

## Prerequisites
- [Node.js <b>6+ and NPM 3+</b>](https://nodejs.org/en/)
- Ionic and Cordova CLIs: `npm install -g cordova@7.0.1 ionic@3.4.0`
  - Note the explicit versions. Using versions other than the ones specified can cause local problems and Travis failures.

## Setup

1. Clone repository, cd into it.

2. Run `npm install`

## Developing

The app's source code is in the `src` directory, and consists of Typescript, HTML, and SCSS. Start editing away!

  - Viewing the results of your changes is easy:
   Just run `ionic serve -c` from the root  directory.

  Ionic will open your default browser and navigate to itself for you.

  *Note*: `master` is for PVTrAck 2.0+.  If you wish to contribute to PVTrAck 1.x, please checkout `ionic1/base`.
  - We encourage PRs! Add unit tests for your code and run `npm test` before opening one, please!

### Testing On Devices

You must have

- **Android**: JDK (version 1.7 or 1.8) and the [Android SDK](http://developer.android.com/sdk/installing/index.html) installed.
You must also [create an Android Virtual Device](http://developer.android.com/tools/devices/managing-avds.html).

- **iOS**: macOS, Xcode, and Xcode command line tools installed.

The project has been configured to be an Android and iOS project.  You have 3 options for testing the native app:

   a. `ionic build [ios OR android]` generates necessary files (`.apk` or `.app`) to run on a device, but does nothing more.

   b. `ionic emulate [ios OR android]` builds the app, opens an emulator, and starts the app for you.

   c. `ionic run [ios OR android]` builds the app and installs it on your USB-connected phone (and opens an emulator if no phone is connected). For iPhones, this only works on iOS >= 10, and requires special configuration (see [ionic's docs](http://ionicframework.com/docs/intro/deploying/)).
