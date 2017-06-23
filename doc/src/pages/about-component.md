# About Page

App URL: `/settings/about`

Source Code: [src/pages/about/about.component.ts](../../../src/pages/about/about.component.ts).

The About page is a simple page that displays details about PVTrAck.


Services Used:
[InfoService](../../../src/providers/info.service.ts).


## Functions

`constructor(NavController, InfoService)`
> Gets the versionNumber and versionName from the InfoService.

> Sends a pageview for /settings/about to Google Analytics.

`goToPrivacyPolicyPage()`: `void`
> Navigates to the PrivacyPolicyComponent using a class-wide reference to a NavController.


  ## HTML

- This page is an `<ion-list>` inside of one `<ion-card>`.
- List items that are a mix of text and links are inside `<div>`s
- List items that are only links are `<button>`s
- Links are placed in tags using the following pattern
  ```
    <button ... onclick="window.open('https://some_link', '_system');" ... >
  ```
  The `onclick` event handler is calling `window.open(...)`, which is defined differently by every browser.

  `_system`, the second parameter, tells the browser to use the system's default method of opening a new browser window.

  On a desktop and in a mobile _browser_, `_system` opens a new tab. In _Cordova_, the result varies by OS. Generally, current versions open a new WebView that maintains a back button to our app.
