# Deploying PVTrAck

Developers may use this document as a tutorial for deploying PVTrAck updates to its various distribution channels.

Play Store and App Store sections loosely follow the [Ionic documentation for publishing](http://ionicframework.com/docs/guide/publishing.html). Many of the steps described there have already been done for you.

## Do Before Every Release

1. Determine a version number for your release. For example, 1.1.3. See Google Play section for more details.
2. Create a tag for the release using the version from above. ex: `git tag 1.1.3 && git push --tags`


## To the Web

_Prerequirements_
- You must have SSH access to `af-transit-app3.admin.umass.edu`. See @werebus.

From your local clone, execute the following commands:

1. `bundle install` - installs [Capistrano](http://capistranorb.com/), a Ruby tool for deployment automation.
2. `cap production deploy` - connects to _app3_ and updates `m.pvta.com` to contain the version of PVTrAck currently on `origin/master`.

## To the Google Play Store
_Prerequirements_
- You **must** have the official PVTrAck signing key. See @akaplo.
- You *should* have [Android Studio](https://developer.android.com/studio/index.html) installed.
- You **must** have the Android SDK and Android build tools installed (both bundled with Android Studio, see above). We target API level 25 (Nougat, 7.1).
- You **must** have access to the [Google Play Developer Console](play.google.com/apps/publish) (see @sherson with your Google username, who will contact @jpbagley26).

From your local clone, execute the following commands:

1. `npm install` and `bower install`
2. Open `config.xml`. On line 2, increment `android-versionCode`, which is (currently) a 4 digit integer, as follows:

  - Round up to the nearest thousand for a major release (i.e. 1010 -> 2000, or in Semantic Versioning terms, this would be represented as 1.0.1 -> 2.0.0).
  
  - Round up to the nearest 100 for a minor release that may include bugfixes and features, but nothing crazy (i.e. 1120 -> 1200 or in Semantic Versioning terms, this would be represented as 1.1.2 -> 1.2.0).

  - Round up to the nearest 10 for a release that ONLY includes bugfixes, large or small (i.e. 1120 -> 1130 or in Semantic Versioning terms, this would be represented as 1.1.2 -> 1.1.3).

  - **INCREMENT** by one for a miniscule bugfix release. In Semantic Versioning terms, a change this small would not warrant a new version number.  Use at your own discretion.
  
 
3. On the same line in `config.xml`, update `version` to match your work in step 2, translated into Semantic Versioning.

 
4. `ionic prepare android --release`
    
    Troubleshooting: if you get an error related to whether this repo is an Android project, do the following:
      - `ionic platform rm android`
      - `ionic platform add android@6.1.0` <-- a/o 12/30/16, Cordova isn't giving you 6.1.0 by default, which fixes a nasty bug related to image assets. Remove the specific version at your own discretion.
      
  *Steps 5-10 can be done in terminal and easily automated. See [Ionic's docs](http://ionicframework.com/docs/guide/publishing.html)*
   
5. Open the project in Android Studio, where the Android project root is at /platforms/android/.

6. In Android Studio, select Build -> Generate Signed APK. An appropriately titled dialog box should appear.
7. Select Next to choose the module we wish to build the APK against. We have only one, called `android`.
8. Browse for your keystore that contains the official PVTrAck signing key. Enter the password for the store itself, the key alias, and key password. Enter your master password if prompted.
9. Specify a destination folder for the APK (default is OK). Leave the build type set to RELEASE unless you want a debug build for a test device. Select Finish.
10. Navigate to where your new APK is.
11. In the [Google Play Developer Console](play.google.com/apps/publish), navigate to the APK subpage from the sidemenu.
Select `Upload new APK to production`. If you wish to beta test your build, first select the `Best Test` tab. In the popup, drag/drop the APK.  Write a quick blurb about what changed, and click Submit Update.
12. Rejoice.


## To the Apple App Store
Forthcoming.
