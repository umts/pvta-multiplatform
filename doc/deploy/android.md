## Deploying to the Google Play Store
##### Prerequirements
- You **must** read the [general deploy info](README.md).
- You **must** have the official PVTrAck signing key. See [the keys doc](android-keys.md) for more info.
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

4. Open the project in Android Studio, where the Android project root is at `platforms/android/`.

5. Follow the [official Android docs' guide](https://developer.android.com/studio/publish/app-signing.html#release-mode) for generating a signed `apk`. PVTrAck-specific details can be found in the [signing keys doc](android-keys.md).


6. Navigate to where your new APK is.

7. In the [Google Play Developer Console](play.google.com/apps/publish), follow the instructions for uploading a new APK.

8. Rejoice! :party:
