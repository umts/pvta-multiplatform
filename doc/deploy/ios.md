# Building an iOS app to Deploy in XCode.

## Requirements
_Mac_

### General
- Read the [general deploy doc information](README.md) first.
- Assure that you have access to [Itunes Connect](https://itunesconnect.apple.com/).
Ask @sherson if you don't have it.

### XCode
- Apple will most likely require the latest version of XCode.
That is, you may be able to build the app in XCode x.x,
but it can't be submitted to the app store.
The latest version of XCode may involve updating to the latest
macOS and reinstalling XCode.
- XCode is probably already on your Mac. If not, or if you need the latest version,
  you can download it from [apple](https://developer.apple.com/download) or the app store.

## Build the app
1. General instructions can be found in the [ionic docs](https://ionicframework.com/docs/intro/deploying/). I'll be referring to them periodically.
1. In `config.xml`, replace the value of `ios-CFBundleVersion` with the new version number.
1. Run `npm install`.
1. Then, run `ionic cordova build ios --prod --release`.
1. Open the project in XCode, following the ionic doc iOS instructions for "Running your App".
   The file `PVTrAck.xcodeproj` is the one that we want to open with XCode.
1. Sign into XCode using steps from the ionic docs.
    1. Fill in apple ID with "pvtadeveloper@gmail.com" and password with the password from @anbranin, @sherson, or @mboneil10.
    1. Click "Next".
    1. Exit out of Preferences.
1. Code Sign the app (these steps are not on the ionic docs for XCode 9+).
    1. Select "General".
    1. Go into the project editor. Click "PVTrAck" under "TARGETS".
    1. Go to the "Signing" section.
    1. Uncheck "Automatically manage signing", recheck it, and select "Pioneer Valley Transit Authority"
  from the "Team" dropdown (this prevents the build from failing for some reason).
1. Set the Build to Legacy Build
    1. cordova-ios doesn't support the new build system yet and would result in failures.
    1. To do so: File > Project Settings > Select "Legacy Build System" from "Build System" drop down.
1. Create an archive:
    1. In XCode, select Product > Scheme > Edit Scheme.
    1. Choose "Archive" from the list on the left.
    1. The build config should be "Release" unless you're making a debug build.
1. Select Product > Build (use Product > Run for debugging purposes.).
    1. Follow the proper steps to fix the code if the build fails. The XCode Organizer should pop up when the build succeeds.
1. Click the "Validate App" button on the right. All preselected options are okay.
1. If the build is valid, click "Distribute App". Again, accept with the preselected options to upload to the app store.
1. At the end of the process, XCode will confirm that the build was uploaded to apple.

## Resubmitting a Build
- In XCode, go to the project editor. In TARGETS > PVTrAck, look at the "Identity" section.
  There is a field for "Build". This value is for App Store Connect
  and it does _not_ affect the version number. However, there is a chance
  that the build and version numbers are the same.
- In order to submit a new build (due to any relevant issues below or not listed),
  increment the build number. Then, rebuild. That's it!

## Troubleshooting
- **Problems with `ionic cordova build ios --prod --release`.**
Make sure all requirements are installed by running `ionic cordova requirements`.

- **Error related to whether this is an iOS project**
Try adding and removing the platform:
```
    $ ionic platform rm ios
    $ ionic platform add ios
```
- **Build "disappears" once uploaded and processing in App Store Connect**
Resubmit the build and try again.

- **Duplicate Error on Build**
Resubmit the build and try again.
