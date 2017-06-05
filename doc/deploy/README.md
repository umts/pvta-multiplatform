# Deploying PVTrAck

Developers may use this document as a tutorial for deploying PVTrAck updates to its various distribution channels.

Play Store and App Store sections loosely follow the [Ionic documentation for publishing](http://ionicframework.com/docs/guide/publishing.html). Many of the steps described there have already been done for you.

## Do Before Every Release

1. Determine a version number for your release. For example, 1.1.3. See the versioning doc for more details.
2. Create a tag for the release using the version from above. ex: `git tag 1.1.3 && git push --tags`


## Deploying to the Web

For detailed steps, see [the deploy/web doc](https://github.com/umts/pvta-multiplatform/tree/master/doc/deploy/web.md).

## Deploying to the Google Play Store

For detailed steps, see [the deploy/android doc](https://github.com/umts/pvta-multiplatform/tree/master/doc/deploy/android.md).


## Deploying to the Apple App Store

For detailed steps, see [the deploy/ios doc](https://github.com/umts/pvta-multiplatform/tree/master/doc/deploy/ios.md).
