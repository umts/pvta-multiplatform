## Deploying to the Google Play Store
##### Prerequirements
- You **must** read the [general deploy info](https://github.com/umts/pvta-multiplatform/tree/master/doc/deploy.README.md).
- You **must** have the official PVTrAck signing key. See @akaplo or @sherson.
- You **must** have the Android SDK and Android build tools installed (both bundled with Android Studio). We target API level 25 (Nougat, 7.1).
- You **must** have access to the [Google Play Developer Console](play.google.com/apps/publish) (see @sherson).
- You *should* have [Android Studio](https://developer.android.com/studio/index.html) installed.

From your local clone, execute the following commands:

1. `npm install`

2. (PVTrAck 1.x only) `bower install`

3. Open `config.xml`. On line 2, increment `android-versionCode` with your appropriately chosen new version number.

4. On the same line in `config.xml`, update `version` to match your work in step 2, translated into Semantic Versioning.

5. (PVTrAck 2+) `ionic build android --prod --release`

  (PVTrAck 1.x) `ionic prepare android --release`

  ```
    Troubleshooting: if you get an error related to whether this is an Android project, try the following:
      $ ionic platform rm android
      $ ionic platform add android
  ```
  *Steps 5-10 can be done in terminal and easily automated. See [Ionic's docs](http://ionicframework.com/docs/guide/publishing.html)*

6. Open the project in Android Studio, where the Android project root is at `platforms/android/`.

7. In Android Studio, select Build -> Generate Signed APK. An appropriately titled dialog box should appear.
8. Select Next to choose the module we wish to build the APK against. We have only one, called `android`.

9. Browse for your keystore that contains the official PVTrAck signing key. Enter the password for the store itself, the key alias, and key password. Enter your master password if prompted.

10. Specify a destination folder for the APK (default is OK). Leave the build type set to RELEASE unless you want a debug build for a test device. Select Finish.

11. Navigate to where your new APK is.

12. In the [Google Play Developer Console](play.google.com/apps/publish), follow the instructions for uploading a new APK.

13. Rejoice! :party:
