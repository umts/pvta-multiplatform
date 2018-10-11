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
1. General instructions can be found in the [ionic docs](https://ionicframework.com/docs/intro/deploying/). I'll be referring to them.
1. In `config.xml`, replace the value of `ios-CFBundleVersion` with the new version number.
1. Run `ionic cordova build ios --prod --release`.
1. Open the project in XCode, following the instructions for "Running your App". The file `PVTrAck.xcodeproj` is the one that we want to open with XCode.
1. Sign into XCode using steps from ionic docs.
  1. Fill in apple ID with "pvtadeveloper@gmail.com" and password with the password from Karin, Adam, or Molly.
  1. Click "Next".
  1. Exit out of Preferences.
1. Code Sign the app (these steps are not on the ionic docs).
  1. Select "General".
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

## Resubmitting a Build
1. In XCode, go to the project editor. In "TARGETS" > PVTrAck, look at the "Identity" section.
  There is a field for "Build". This value is for App Store Connect
  and it does _not_ affect the version number. However, there is a chance
  that the build and version numbers are the same.
1. In order to submit a new build (due to any relevant issues below or not listed),
increment the build number. Then, rebuild. That's it!

## Troubleshooting

- Error related to whether this is an iOS project, try adding and removing the platform:
  ```
      $ ionic platform rm ios
      $ ionic platform add ios
  ```
- Build "disappears" once uploaded and processing in App Store Connect
  
  Resubmit the build and try again.

- Duplicate Error
- Legacy Build
- Not signed
