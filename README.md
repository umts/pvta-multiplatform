# pvta-multiplatform 

UMass Transit's PVTA realtime app (name TBD)!

[See our demo page for a live browser preview of the release candidate!](http://umts.github.io/pvta-multiplatform)

<a href="https://codeclimate.com/github/umts/pvta-multiplatform"><img src="https://codeclimate.com/github/umts/pvta-multiplatform/badges/gpa.svg" /></a>
[![Issue Count](https://codeclimate.com/github/umts/pvta-multiplatform/badges/issue_count.svg)](https://codeclimate.com/github/umts/pvta-multiplatform)

The app is a hybrid that uses Ionic.

All data is live, and comes from endpoints documented [here](http://bustracker.pvta.com/InfoPoint/swagger/ui/index#!).

To begin developing, follow these steps:

## Prerequisites
- [Node.js <b>4.x and NPM</b>](https://nodejs.org/en/)
- Ionic, Angular, and Cordova: `npm install -g cordova ionic`

## Setup

1. Clone repository

2. In your clone's directory, run the following setup stuff:
  1. `npm install`
  2. `bower install`

## Developing

The javascript and corresponding HTML is contained in `www`.Start editing away!

  - Viewing the results of your changes is easy:
   Just run `ionic serve -c` from the root project directory.

  Ionic will open your default browser and navigate to itself for you.

### Emulating

1. The project has been configured to be an Android and iOS project.  If you want to build a
   copy for an emulator on your machine, or you'd like to run it on your phone, do the following:

   a. Run `ionic state reset`, which will use your ionic.config.json and package.json to install the proper plugins and dependencies.

   b. `ionic build [ios OR android]` generates necessary files to run on a device.
   
      You must have
      
      **android**: JDK (version 1.7 or 1.8) and the [Android SDK](http://developer.android.com/sdk/installing/index.html) installed.
      You must also [create an Android Virtual Device](http://developer.android.com/tools/devices/managing-avds.html).
      
      **ios**: OS X, Xcode, and Xcode command line tools installed.
   
   c. `ionic emulate {platform}` where `platform` is `android` or `ios` will open an emulator and run the app.
   
   Installing it on your phone can be tricky.  Consult [Ionic's page](http://ionicframework.com/docs/guide/testing.html) for basic info.  Recommend online tutorials.  **To use a stable, approved version of pvta-multiplatform on your phone, see [releases](https://github.com/umts/pvta-multiplatform/releases).**
   
## Research/Learning:

### Angular

[Angular APIDocs Root Page](https://docs.angularjs.org/api)

### Ionic

Ionic is what makes our app pretty and is built *on top of* Cordova and Angular.  Although it looks like that's all it does, Ionic includes powerful JavaScript modules for simplifying TONS of view logic in our app.

The Ionic team made it easy to do things with the `ionic {command}` syntax instead of switching between
Cordova and Angular calls.

The Ionic API is fine, but kind of sparse.  Their forums are mediocre. 
Recommend random tutorials as a second resource if the API isn't sufficient (in many cases it IS).

[IonicDocs Root](http://ionicframework.com/docs/)

### Cordova

Cordova provides plugins that bridge the gap between Web app and native app. Since ionic has aliases for the most
common cordova commands, searching out Cordova features is currently on a need-to-know basis.  (Read: use Google)

Their API is thorough but quirky.  When seeking out Cordova documentation, remember that the Ionic team has written an Angular wrapper called [ng-cordova](http://ngcordova.com), which is what we actually use.

## Standard error help:

- The first time you boot an ionic server after installing all your dependencies, it's possible you'll run into errors.
The error codes are long and mostly useless; the source of your problem is assuredly the very first line of the first error block in the trace.
  - If you haven't changed any code, it's an error with your dependency binaries.
    bower installs to `bower_components`, a subdirectory of `www` . 

    Ensure that this directory exists and is populated.  run `npm install` and `bower install` again.
    
 - If it worked before, but doesn't after you've begun editing, it's likely that you're using a dependency that you need to import in controllers that require it (or your code just has problems). Search google for "angular dependency injection examples."
