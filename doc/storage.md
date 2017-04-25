# PVTrAck Storage

## Introduction

pvtrack stores data.

## Database Schema from PVTrAck 1.x

The format in which data is stored has changed from 1.x to 2.x.

In 1.x, data was stored using the localForage library, which always stores data in
realm of the browser (i.e. using WebSql, IndexDb, or localstorage).

In 2.x, we use the ionic/Storage library, which, in a browser, stores data the same
way, but on a device, uses native SQLite storage when possible.

### 1.x Configuration and Schema

The configuration and schema for pvtrack 1.x is as follows:

**LocalForage Configuration**

localForage uses its defaults in PVTrAck 1.x.  Follow the link to the
[localForage configuration](https://localforage.github.io/localForage/#settings-api-config)
page for all the details.

**Schema**

The schema consists of JSON objects, each with a key and a value.

`favoriteRoutes`

A JSON array containing the user's 'favorite' routes.

Each property comes from Avail.
A basic schema is as follows:
```javascript
[
  {
    RouteId: Integer,
    GoogleDescription: String,
    ShortName: String,
    RouteAbbreviation: String,
    Color: String
  }
]
```
An example (this could be a full example or truncated, depending on how many favorites the user has), is as follows:
```javascript
[
  {
    RouteId: 20030,
    GoogleDescription: "North Amherst / Old Belchertown Rd",
    ShortName: "30",
    RouteAbbreviation: "30",
    Color:"C7A020"
  }
]
```
`favoriteStops`

A JSON array containing the user's 'favorite' stops.

Each property comes from Avail.
A basic schema is as follows:
```javascript
[
  {
    StopId: Integer,
    Description: String
  }
]
```
An example (this could be a full example or truncated, depending on how many favorites the user has), is as follows:
```javascript
[
  {
    StopId: 50,
    Description: "Computer Science"
  },
  {
    StopId: 8001,
    Description: "UMass Bus Garage"
  }
]
```

`returningUser`
A boolean.

`plan-trip-update`
A boolean. Can be safely ignored.

schema-11-7-2016_longname_and_stopname_cutoff_fix
A boolean. Can be safely ignored.

`routes`

An object that contains the list of routes.
```javascript
{
  list: Array,
  time: String "A MomentJS parsable date string, i.e. 2017-04-25T18:32:36.900Z"
}
```

The `list` property can take many forms. All properties of a route from the list come from Avail.
The basic schema is as follows.
```javascript
[
  {
    RouteAbbreviation: String,
    GoogleDescription: String,
    ShortName: String,
    Color: String,
    RouteId: Integer
  }
]
```
An example, highly truncated version, is as follows:

```javascript
[
  {
    RouteAbbreviation: "30",
    GoogleDescription: "North Amherst / Old Belchertown Rd",
    ShortName: "30",
    Color: "C7A020",
    RouteId: 20030
  },
  {
    RouteAbbreviation: "31",
    GoogleDescription: "Sunderland / South Amherst",
    ShortName: "31",
    Color: "EF4E91",
    RouteId: 20031
  }
]
```

`stops`
An object that contains the list of stops.
```javascript
{
  list: Array,
  time: String "A MomentJS parsable date string, i.e. 2017-04-25T18:32:36.900Z"
}
```
The `list` property can take many forms.
The basic schema is as follows:
```javascript
[
  {
    StopId: Integer - comes from Avail,
    Name: String - comes from Avail,
    Description: String - comes from Avail,
    Latitude: Float - comes from Avail,
    Longitude: Float - comes from Avail,
    Distance: Float - Assigned by our `Routes and Stops` code; the distance between the stop and the users last known location
  }
]
```
An example, highly truncated version, is as follows:

```javascript
[
  {
    StopId: 58,
    Name: "GRC",
    Liked: false,
    Description: "Graduate Research Center",
    Latitude: 42.393483,
    Longitude: -72.526075,
    Distance: 0.007249853698507604
  },
  {
    StopId: 63,
    Name: "Morrill Sci Ctr",
    Liked: false,
    Description: "Morrill Science Center",
    Latitude: 42.391471,
    Longitude: -72.525237,
    Distance: 0.008355904729575873
  }
]
```

`savedTrips`
A **stringified** JSON array.
There are an innumerable number of possible values.
```json
{
  "name": "A string. The name that the user has arbitrarily decided to give their trip",
  "time": {
    "datetime": "A string. Some MomentJS parsable date string, i.e. '2017-04-25T18:17:43.911Z'",
    "option": {
      "title": "A string. Can be (1) 'Leaving Now',  (2) 'Departing At...', or (3) 'Arriving By...'",
      "type": "A string. Can be (1) 'departure' or (2) 'arrival'",
      "isASAP": "A boolean",
      "id": "An integer. Can be 0, 1, or 2",
      "$$hashKey": "A result of nesting an Object into JSON. Can be safely ignored"
    }
  },
  "origin": {
    "name":"A string. The name from Google's Geocoder given to the place the user chose, i.e. 'Old Belchertown Road'",
    "id": "A string. Google's Geocoder PlaceId that they assign, i.e. 'ChIJ9yh1I3_O5okReeFljL1URBk'"
  },
  "destination": {
    "name" :"See 'origin'",
    "id": "See 'origin'"
  },
  "destinationOnly": "A boolean",
  "saved": "A boolean"
}
```


`autoRefresh`
An integer value.

Possible options are `-1, 15000, 30000, 45000, or 60000`
Values `> 0` indicate a number of seconds, `-1` means "autoRefresh off."

`stopDepartureOrdering`
A string value.

Possible options are `0, 1`.  `0` means the user wants stop departures sorted by `RouteDirection`, `1` means the user wants stop departures sorted by time.
