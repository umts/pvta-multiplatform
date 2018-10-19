# Deploying PVTrAck

Developers may use this document as a tutorial for deploying PVTrAck updates to
its various distribution channels.

Play Store and App Store sections loosely follow the
[Ionic documentation for publishing](http://ionicframework.com/docs/guide/publishing.html).
Many of the steps described there have already been done for you.

## Requirements

We use some Ruby tooling for deploying our web platform and managing versions.
They're installed using bundler:

```
$bundle install
```

## Do Before Every Release

1.  Determine what kind of release this is. See the
    [Semantic Versioning specification](https://semver.org/) for more details.
2.  Increment the stored version as appropriate:
    * `semver inc major` for a major release
    * `semver inc minor` for a minor release
    * `semver inc patch` for a patch release
3.  Update the app version: `rake version:general` _(If you're going to release
    on all platforms, you can also just `rake version` to update all of the
    version codes at once)_
3.  Create a tag for the release.
    ```
    git tag -a $(semver tag) -m "Release: $(semver tag)"
    ```


## Deploying to the Web

For detailed steps, see [the deploy/web doc](web.md).

## Deploying to the Google Play Store

For detailed steps, see [the deploy/android doc](android.md).


## Deploying to the Apple App Store

For detailed steps, see [the deploy/ios doc](ios.md).
