# pvta-multiplatform 

UMass Transit's PVTA realtime app (name TBD)!

<a href="https://codeclimate.com/github/umts/pvta-multiplatform"><img src="https://codeclimate.com/github/umts/pvta-multiplatform/badges/gpa.svg" /></a>
[![Issue Count](https://codeclimate.com/github/umts/pvta-multiplatform/badges/issue_count.svg)](https://codeclimate.com/github/umts/pvta-multiplatform)

The app is a hybrid that uses Ionic.

All data is live, and comes from endpoints located on the PVTA's website.

To begin developing, follow these steps:

## Prerequisites
- [Node.js <b>4.x and NPM</b>](https://nodejs.org/en/)
- Angular.js (no explicit installation necessary)
- Ionic and Cordova: `npm install -g cordova ionic`

## Setup

1. Fork this repository

1. Clone your fork onto your local machine

1. In your fork's directory, run the following setup stuff:
  1. `npm install`
  2. `bower install`

## Developing

The javascript is contained in `www/js`.Start editing away!

2. Viewing the results of your changes is quick and easy to do:
   In the browser (do this during development):
   Run `ionic serve -c` from the root project directory.

### Emulating

1. The project has been configured to be an Android and iOS project.  If you want to build a
   copy for an emulator on your machine, or you'd like to run it on your phone, do the following:

   a. `ionic build` generates necessary files.
   
      You must have
      
      **android**: JDK (version 1.7 or 1.8) and the [Android SDK](http://developer.android.com/sdk/installing/index.html) installed.
      You must also [create an Android Virtual Device](http://developer.android.com/tools/devices/managing-avds.html).
      
      **ios**: OS X, Xcode, and Xcode command line tools installed.
   
   b. `ionic emulate {platform}` where `platform` is `android` or `ios` will open an emulator and run the app.
   
   Installing it on your phone can be tricky.  Consult [Ionic's page](http://ionicframework.com/docs/guide/testing.html) for basic info.  Recommend online tutorials.  **To use a stable, approved version of pvta-multiplatform on your phone, see [releases](https://github.com/umts/pvta-multiplatform/releases).**
   
## Research/Learning:

### Angular

I've found that the Angular APIs have a learning curve that flattens out fairly quickly.
While confusing at first, I absolutely recommend them, as other tutorials have steered me
wrong in ways that I now have to refactor into better code.

[Angular APIDocs Root Page](https://docs.angularjs.org/api)

### Ionic

Ionic is what makes our app pretty.  It has little else to do, but it is built *on top of* Cordova and Angular.
The Ionic team made it easy to do things with the `ionic {command}` syntax instead of switching between
Cordova and Angular calls.

The Ionic API is fine, but kind of sparse.  Their forums are AWFUL. 
Recommend random tutorials as a second resource if the API isn't sufficient (in many cases it IS).

[IonicDocs Root](http://ionicframework.com/docs/)

### Cordova

Cordova does all the real heavy lifting that makes our app a mobile app. Since ionic has aliases for the most
common cordova commands, searching out Cordova features is currently on a need-to-know basis.  (Read: use Google)

Their API is thorough but has some quirks.  The real gem of Cordova is their plugins that will make our app
seem native, such as push notifications and local database support.  

Currently, we leverage only 2 plugins: keyboard and statusbar.

[CordovaDocs](https://cordova.apache.org/docs/en/5.0.0/) (loves to say it's outdated, but the updated version
doesn't cover everything and has too many 404s)

## Standard error help:

- The first time you boot an ionic server after installing all your dependencies, it's possible you'll run into errors.
The error codes are long and mostly useless; the source of your problem is assuredly the very first line of the first error block in the trace.
  - If you haven't changed any code, it's an error with your dependency binaries.
    This is common, and a better way to organize them is being worked on.  
    - See which dependencies you seem to be missing.  In `index.html`, make sure the import statements (`<script >` tags) have paths
      to files that actually exist in your project.  bower installs to `bower_components`, a directory in the
      project's root, but `index.html` has trouble finding this directory.
    - To fix, I recommend moving the file from bower_components (assuming it's there and it's causing you trouble) to the
      `www/lib`, which, in unison with updating `index.html` to point there, should resolve this.  
    
    - **Before you push it, holler at Aaron, who thinks he has it set up with so many redundancies that you really shouldn't encounter this problem at all.**
 - If it worked before, but doesn't after you've begun editing, it's likely that you're using a service that you need to import in controllers that now use
   this service (or your code just has problems).
