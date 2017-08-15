## PVTrAck Signing Keys For Android

To upload a new build of PVTrAck to the Play Store, the `.apk` **must** be signed with the same key that was used to sign all previous builds.

To obtain the key, see @akaplo or @sherson.

Steps to generate a Play Store-ready APK are [here](https://developer.android.com/studio/publish/app-signing.html#release-mode).

Keep reading for assorted info/tips about PVTrAck's Android key.

- The PVTrAck key is stored in a keystore.  

- **"Obtaining the key" actually means obtaining the keystore, which has the key inside of it.**  They come as a pair, and always will.

- Keys have the extension `.jks` and keystores are `.keystore`.  

- Our key and keystore were created simultaneously using the `keytool` command bundled with the JDK.  I followed [this Ionic 1 guide](http://ionicframework.com/docs/v1/guide/publishing.html).


- Save the key somewhere on your computer **outside** of the repository.

- Keystores have a password, which is required to access the keys within.
- Keys have a name (or `alias`), which identifies them within the keystore, and a `password`.
  - Our key's `alias` is `pvtrackrelease`.

  
- When generating an `apk`, leave the build type set to RELEASE unless you want a debug build for a test device.

- We only have 1 module, called `android`.
