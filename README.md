# PVTrAck

The official app of the Pioneer Valley Transit Authority
([PVTA](http://pvta.com))!

Current release available at [m.pvta.com](https://m.pvta.com), the
[Play Store][play-store], and the [App Store][app-store].

[![Build Status][travis-badge]][travis]
[![Maintainability][codeclimate-gpa-badge]][codeclimate]
[![Issue Count][codeclimate-issues-badge]][codeclimate]

The app is a hybrid that uses Ionic 2+.

All data is live, and comes from endpoints documented [here][swagger].

To begin developing, follow these steps:

## Prerequisites
-   [Node.js <b>6+ and NPM 3+</b>](https://nodejs.org/en/)
-   Ionic and Cordova CLIs: `npm install -g cordova@^7.0.1 ionic@^3.7.0`

    Note the explicit versions. Using versions other than the ones specified can
    cause local problems and Travis failures.

## Setup

1.  Clone repository, cd into it.
2.  Run `npm install`

## Developing

The app's source code is in the `src` directory, and consists of Typescript,
HTML, and SCSS. Start editing away!

-   Viewing the results of your changes is easy:

    Just run `ionic serve -c` from the root  directory. Ionic will open your 
    default browser and navigate to itself for you.

*Note*: `master` is for PVTrAck 2.0+.  If you wish to contribute to PVTrAck 1.x,
please checkout `ionic1/base`.

-   We encourage PRs! Add unit tests for your code and run `npm test` before
    opening one, please!

### Testing On Devices

You must have

-   **Android**: JDK (version 1.7 or 1.8) and the
    [Android SDK](http://developer.android.com/sdk/installing/index.html)
    installed.

    You must also
    [create an Android Virtual Device](http://developer.android.com/tools/devices/managing-avds.html).

-   **iOS**: macOS, Xcode, and Xcode command line tools installed.

The project has been configured to be an Android and iOS project.  You have 3
options for testing the native app:

1.  `ionic cordova build [ios OR android]` generates necessary files (`.apk` or
    `.app`) to run on a device, but does nothing more.

2.  `ionic cordova emulate [ios OR android]` builds the app, opens an emulator,
    and starts the app for you.

3.  `ionic cordova run [ios OR android]` builds the app and installs it on your
    USB-connected phone (and opens an emulator if no phone is connected). For
    iPhones, this only works on iOS >= 10, and requires special configuration
    (see [ionic's docs](http://ionicframework.com/docs/intro/deploying/)).

[play-store]: https://play.google.com/store/apps/details?id=com.umts.pvtamultiplaform
[app-store]: https://itunes.apple.com/us/app/pvtrack/id1234619753
[travis]: https://travis-ci.org/umts/pvta-multiplatform
[travis-badge]: https://travis-ci.org/umts/pvta-multiplatform.svg?branch=master
[codeclimate]: https://codeclimate.com/github/umts/pvta-multiplatform
[codeclimate-gpa-badge]: https://codeclimate.com/github/umts/pvta-multiplatform/badges/gpa.svg
[codeclimate-issues-badge]: https://codeclimate.com/github/umts/pvta-multiplatform/badges/issue_count.svg
[swagger]: http://bustracker.pvta.com/InfoPoint/swagger/ui/index#!
