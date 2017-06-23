# My Buses Page

App URL: `/my-buses`

Source Code: [src/pages/my-buses/my-buses.component.ts](../../../src/pages/my-buses/my-buses.component.ts).

The My Buses page is a simple page that displays details about PVTrAck.


Services Used:
[FavoriteTripService](../../../src/providers/favorite-trip.service.ts).


## Functions

`constructor(
  NavController,
  Storage,
  AlertService,
  AlertController,
  ModalController,
  FavoriteTripService
)`
> Sends a pageview for /my-buses to Google Analytics.

`private filterAlerts(): void`

`ionViewWillEnter(): void`

`getFavoriteRoutes(): void`

`getSavedTrips(): void`

`showStopModal(): void`

`showRouteModal(): void`

`goToStopPage(stopId: number): void`
> Navigates to the StopComponent using a class-wide reference to a NavController.


`goToRoutePage(routeId: number): void`
> Navigates to the RouteComponent using a class-wide reference to a NavController.

`goToTripPage(trip): void`
> Navigates to the PlanTripComponent using a class-wide reference to a NavController.


`deleteTrip(trip): void`

- @param trip: [FavoriteTrip](../../storage.md#`savedTrips`)

> Removes the parameter object from the class-wide `trips` variable and uses the FavoriteTripService to remove it from the saved favorites too.




  ## HTML

- This page is an `<ion-list>` inside of one `<ion-card>`.
- List items that are a mix of text and links are inside
