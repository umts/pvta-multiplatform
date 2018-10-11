# Building an Android App to Deploy in Google Play

### Before you continue...
- Did you read the [general deploy info](README.md)?
- Do you have access to the [Google Play Developer Console](play.google.com/apps/publish)?
 If not, see Adam.

### Notes on Java
Our app can't use the most recent version of the JDK, so please install Java 1.8 like so:
  1. `$brew update`
  1. `$brew tap caskroom/versions`
  1. `brew search java`
  1. `brew cask install java8`
  1. If you can figure out why this app requires an old version of Java, please
  fix it.

## Ready to build?
  1. Open `config.xml`: On line 2, increment `android-versionCode`
  with your appropriately chosen new version number.
  1. You may make a debug build first to try the changes to your application on
  an emulator or phone: `$ionic cordova build android`.
  1. If you have an Android: Plug it into the computer with a USB cable and enable USB
  debugging. Side-load like so, replacing the paths with your own:
 `<android-sdk>/platform-tools/adb install /Users/my_name/pvta-multiplatform/platforms/android/build/outputs/apk/debug/android-debug.apk
  1. Obtain the PVTrAck signing key. See [the keys doc](android-keys.md) for more info.
  Place it in the `platforms/android` directory. The `jks` extension is gitignored by default.
  1. Obtain the password. See Molly, Adam, or Karin for access.
  1. `$cp keystore.properties.example platforms/android/keystore.properties`
  1. Replace the two password lines in `platforms/android/keystore.properties` with the actual
  password. No space between the `=` sign and the password! This file is also gitignored. Please
  do not put the real password in the `.example` file and push it to github.
  1. Now you can build a release APK that should be signed automatically:
  `$ionic cordova build android --prod --release`
The terminal output should tell you your release location. The name will be
something like this: `platforms/android/build/outputs/apk/release/android-release.apk`.
It should not include the words "unsigned" or "debug".
  1. You can verify the signature with `jarsigner` like so: `$jarsigner -verify -verbose -certs my_app.apk`
  1. In the [Google Play Developer Console](play.google.com/apps/publish), follow the instructions for uploading a new APK.
  1. 🎉

## Troubleshooting

  - **You get an error related to whether this is an Android project**
    
    Try adding and removing the platform: `$ionic platform rm android`,`$ionic platform add android`

  - **Your error message occurred when running `$cordova`**
  
  Try running`$cordova requirements`.  Did you meet all of them? 
  Did you miss a step? If you're missing IOS requirements, that's OK until
  you decide to build the IOS app--you don't need any of them for Android.

  - **Error: Failed to find 'ANDROID_HOME' or 'JAVA_HOME' environment variable. Try setting it manually.**
  
  For "ANDROID_HOME" issues, find the location of your sdk tools.
  Android studio should have told you where they were installed. For example,
  my location was `/Users/my_name/Library/Android/sdk`

  For "JAVA_HOME" problems, find the location of your JDK installation. My location
  was `/Library/Java/JavaVirtualMachines/jdk1.8.0_181.jdk/Contents/Home`. YRMV

  Put either or both of these lines in your `.bashrc` or `.bash_profile`:
  ```
    export ANDROID_HOME=/Users/keichelm/Library/Android/sdk
    export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_181.jdk/Contents/Home/
  ```

  - **Error: Requirements check failed for JDK 1.8 or greater**

  You don't have the correct version of Java. Install the correct version of Java using
  the steps above.

  - **Error: Could not find an installed version of Gradle either in Android Studio,
  or on your system to install the gradle wrapper. Please include gradle
  in your path, or install Android Studio**
  
  You don't have Gradle. Install Gradle using the steps above.

  - **You tried to build a signed release APK but instead your filename has the word "unsigned"
  in it**

  Your keystore.properties file is probably incorrect or does not contain the
  correct password. Go through the instructions related to the keystore.properties file
   again and make sure you didn't miss anything.

  - **You have not accepted the license agreements of the following SDK components:
  [Android SDK Platform X].**
  
  You should have accepted the agreements when installing them through Android Studio.
  Open Android Studio and navigate to where you install Platforms and Tools, making sure
  all required installations are present (follow instructions above)

  - **Other errors**

  Ask for help, and we'll update the docs accordingly.
