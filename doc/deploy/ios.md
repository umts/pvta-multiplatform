## Deploying to the Apple App Store

Forthcoming, aka @akaplo doesn't entirely remember and will document when he steps through the process next. However, the general process is as follows.

##### Prerequirements
- You **must** read the [general deploy info](README.md).
- You **must** have access to the PVTA's [Apple Developer](developer.apple.com) account.
- You **must** have Xcode >= 7 installed on macOS >= 10.11.

##### Steps

1. `npm install`

2. Open `config.xml`. On line 2, increment `ios-CFBundleVersion` with your appropriately chosen new version number.

3. (PVTrAck 2+) `ionic cordova build ios --prod --release`

    Troubleshooting: if you get an error related to whether this is an iOS project, try the following:

  ```
      $ ionic platform rm ios
      $ ionic platform add ios
  ```
4. Open the project in Xcode, where the iOS project root is at `platforms/ios/`.

5. `TODO` Add detail and break into multiple steps.

  Build a release archive and upload it to iTunes Connect through Xcode.
