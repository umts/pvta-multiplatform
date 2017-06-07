## Deploying to the Google Play Store
##### Prerequirements
- You **must** read the [general deploy info](README.md).
- You **must** have the official PVTrAck signing key. See @akaplo or @sherson.
- You **must** have the Android SDK and Android build tools installed (both bundled with Android Studio). We target API level 25 (Nougat, 7.1).
- You **must** have access to the [Google Play Developer Console](play.google.com/apps/publish) (see @sherson).
- You *should* have [Android Studio](https://developer.android.com/studio/index.html) installed.

##### Steps

1. `npm install`

2. Open `config.xml`. On line 2, increment `android-versionCode` with your appropriately chosen new version number.

3. (PVTrAck 2+) `ionic build android --prod --release`

    Troubleshooting: if you get an error related to whether this is an Android project, try the following:

  ```
      $ ionic platform rm android
      $ ionic platform add android
  ```
  *Steps 4-10 can be done in terminal and easily automated. See [Ionic's docs](http://ionicframework.com/docs/guide/publishing.html)*

4. Open the project in Android Studio, where the Android project root is at `platforms/android/`.

5. In Android Studio, select Build -> Generate Signed APK. An appropriately titled dialog box should appear.

6. Select Next to choose the module we wish to build the APK against. We have only one, called `android`.

7. Browse for your keystore that contains the official PVTrAck signing key. Enter the password for the store itself, the key alias, and key password. Enter your master password if prompted.

8. Specify a destination folder for the APK (default is OK). Leave the build type set to RELEASE unless you want a debug build for a test device. Select Finish.

9. Navigate to where your new APK is.

10. In the [Google Play Developer Console](play.google.com/apps/publish), follow the instructions for uploading a new APK.

12. Rejoice! :party:
