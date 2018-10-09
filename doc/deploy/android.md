# Building an Android App to Deploy in Google Play

## Requirements
_These instructions assume you are running a Mac. If you're not, the installation
instructions will be vastly different. You can ask for help or, since you're probably
running Linux, just translate them like you're probably used to doing._

### General
- Did you read the [general deploy info](README.md)?
- Do you have access to the [Google Play Developer Console](play.google.com/apps/publish)?
 If not, see @sherson.

### Android Studio
We use Android Studio to easily manage the Android SDK tools. If you wish, you can attempt
to download the tools separately, but these instructions will not help you because I found the
attempt maddening. Plus, Android Studio will keep track of updates for you, which is nice.
1. Get [Android Studio](https://developer.android.com/studio/)
1. Use it to download the SDK platforms and tools: 
  1. Click menu items Android Studio -> Appearance and Behavior -> System Settings -> Android SDK
  1. In the main window, click "sdk platforms"
  1. Click 'edit' to choose an sdk location. Follow the prompts. 
  The default location is fine--keep note of where that is so you can run the tools 
  from the command line.  Wait for it to download the components.
  1. Keep waiting
  1. Check the boxes next to Android 8.0(Oreo) and any others leading up to the latest--you'll see that that's API 
  level 26, which we target at the moment. 
  1. Click on the "tools" tab. Make sure "Android SDK Platform Tools", "Android SDK Tools", and
  "Android SDK Build Tools" are checked. If you don't have access to an Android phone, make sure
  the Emulator is also installed. Click "apply"

### Java 1.8
  1. `$brew update`
  1. `$brew tap caskroom/versions`
  1. `brew search java`
  1. `brew cask install java8`
  1. If you can figure out why this app requires an old version of Java, please
  fix it.

### Gradle
  1. `$brew install gradle`
  1. Follow any additional commands to set Gradle up.

### Node
  1. Install node: `$brew install node`.
  1. Then use it actually install our packages:`$npm install` (You probably
  already did this when doing work on the application, but it can't hurt to
  update if you pulled from master)

## Ready to build?
  1. Open `config.xml`: On line 2, increment `android-versionCode`
  with your appropriately chosen new version number.
  1. You may make a debug build first to try the changes to your application on
  an emulator or phone: `$ionic cordova build android`.
  1. If you have an Android: Plug it into the computer with a USB cable and enable USB
  debugging. Side-load like so, replacing the paths with your own:
 `~/Library/Android/sdk/platform-tools/adb install /Users/my_name/pvta-multiplatform/platforms/android/build/outputs/apk/debug/android-debug.apk
  1. Obtain the PVTrAck signing key. See [the keys doc](android-keys.md) for more info.
  Place it in the `platforms/android` directory. The `jks` extension is gitignored by default.
  1. Obtain the password. See @mboneil, @sherson, or @anbranin for access.
  1. `$cp keystore.properties.example platforms/android/keystore.properties`
  1. Replace the two password lines in `platforms/android/keystore.properties` with the actual
  password. No space between the `=` sign and the password! This file is also gitignored. Please
  do not put the real password in the `.example` file and push it to github.
  1. Now you can build a release APK that should be signed automatically:
  `$ionic cordova build android --prod --release`
The terminal output should tell you your release location. If it's something like this:
`/platforms/android/build/outputs/apk/release/android-release.apk`
you should be fine.
"android-release" and not "android-release-unsigned."
that's a pretty good indication that you do not have a signed release APK.
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
  was `/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home` and I don't know how
  to figure that one out.

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
