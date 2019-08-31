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
-   To develop and test on Android, you need the prerequisites for the
    [Cordova Android platform][cordova-android] installed. You must also
    [create an Android Virtual Device][avd].
-   To develop and test on iOS, you need the prerequisites for the
    [Cordova iOS platform][cordova-ios] installed.

## Setup

1.  Clone repository, cd into it.
2.  Run `npm install`

## Developing

The app's source code is in the `src` directory, and consists of Typescript,
HTML, and SCSS. Start editing away!

-   Viewing the results of your changes is easy:

    Just run `ionic serve -c` from the root  directory. Ionic will open your 
    default browser and navigate to itself for you.

-   We encourage PRs! Add unit tests for your code and run `npm test` before
    opening one, please!

### Testing On Devices

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
[cordova-andriod]: https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#installing-the-requirements
[cordova-ios]: https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html#installing-the-requirements
[avd]: http://developer.android.com/tools/devices/managing-avds.html

## Archived

This project was started years ago to learn about mobile development and JavaScript frameworks, and to provide PVTA's passengers with a mobile app to retrieve realtime information. Since then, PVTA's vendor has released two major revisions, overhauling and significantly improving its realtime mobile app, and PVTA’s information has also started appearing in TransitApp.  
