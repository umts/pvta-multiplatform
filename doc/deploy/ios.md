# Building an iOS app to Deploy in XCode.

## Requirements
_It is assumed that you are using a Mac._

### General
- Read the [general deploy doc information](README.md) first.
- Assure that you have access to [App Store Connect](https://appstoreconnect.apple.com/).
Ask @sherson if you don't have it.

### XCode
- Apple will most likely require the latest version of XCode.
That is, you maybe able to build the app in XCode x.x,
but it can't be submitted to the app store.
The latest version of XCode may involve updating to the latest
macOS and reinstalling the latest version of XCode.
1. XCode is probably already on your Mac. If not, or if you need the latest version,
  download it from [apple](https://developer.apple.com/download)

## Build the app
1. In `config.xml`, replace the value of `ios-CFBundleVersion` with the new version number.
1. Run `ionic cordova build ios --prod --release`.
1. To open the project in XCode, let's use the terminal:
  1. cd into the project directory
  1. Then, `cd /pvta-multiplatform/platforms/ios/`
  1. From there, run `open -a Finder .`.
  1. The file `PVTrAck.xcodeproj` is the one that we want to open with XCode.
1. Sign into XCode:
  1. XCode > Preferences > Accounts > + > Apple ID
  1. Click "Continue"
  1. Fill in apple ID with "pvtadeveloper@gmail.com" and password with the password from Karin, Adam, or Molly.
  1. Click "Next".
  1. Exit out of Preferences.
1. Cosign the app:
  1. Go into the project editor. Click "PVTrAck" under "TARGETS".
  1. Go to the "Signing" section.
  1. Uncheck "Automatically manage signing", select "Pioneer Valley Transit Authority"
  from the "Team" dropdown, and check "Automatically manage signing"
  (this prevents the build from failing for some reason).
1. Create an archive:
  1. In XCode, select Product > Scheme > Edit Scheme.
  1. Choose "Archive" from the list on the left.
  1. The build config should be "Release" unless you're making a debug build.
1. Product > Run for debug, but otherwise:
1. Product > Build
  1. Follow the proper steps to fix the code if the build fails. If the build passes, continue on.

## Troubleshooting

- You get an error related to whether this is an iOS project, try adding and removing the platform:
  ```
      $ ionic platform rm ios
      $ ionic platform add ios
  ```
