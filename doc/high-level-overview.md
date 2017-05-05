## pvtrack high level document

### Part 1 - Introduction

## 1.1
Hello, and welcome to pvtrack.  "pvtrack" can be pronounced as "pee-vee-track" or "pivv-track". The name is stylized in all public spaces as "PVTrAck" (note that the capital letters are `P`, `V`, `T`, and `A`). The app is referred to in code and package names as `pvta-multiplatform`.

This document will provide a high level overview of
1. `why` pvtrack exists, and
2. `what` it seeks to accomplish.

Further documents will highlight `how` pvtrack accomplishes these goals.

## 1.2

First, some common terms that will be seen throughout these documents must be defined.

1. `Avail` (noun)

 Avail is a contractor from PA that supplies PVTA's realtime data.  They additionally provide a public API for consumption of this data by anyone.

 Often, when we refer to "Avail", we are referring to their API that provides the data pvtrack relies on.

 Avail's data model/schema for the realtime data we consume is entirely of their choosing and does not conform to any standards.

2. `General Transit Feed Specification (GTFS)` (noun)

  GTFS is a standardized system of formatting public transit schedules.  It generally consists of a handful of plaintext files formatted as CSVs that describe every single minute detail of a transit agency's operations.

  From a scheduling point of view, GTFS is, at this point, a commonly supported data format.  Google uses it when providing public transit options in Maps.

3. `GTFS-realtime` (noun)

  Recently, GTFS has been expanded with a component called GTFS-realtime.  Simply put, this is a standardized way of representing realtime data.


### Part 2 - Why Does PVTrAck Exist?

pvtrack was started in November of 2015 by a UMass Transit driver/programmer who wished that the PVTA had an elegant solution for public-facing bus tracking in real time.  There are/were some existing solutions:

1. Avail's ("MyStop", Android and iOS app) was ugly and unfriendly.  

2. CS grad student developed "UMass BusTrack" (iOS and Android) with some assistance from us ~2010, but was  not "official," __didn't cater to our whole service area__, and was reportedly buggy.

3. There are groups who focus on providing a beautiful app for transit agencies ("OneBusAway" is an open-source example; "Transit App" is a commercial but free-to-agencies example).  

  The MBTA, for example, made Transit App its "official app" in late 2016.

At this point, our best bet is a 3rd party solution like OneBusAway or Transit App.  The 3rd party solutions, however require `GTFS-realtime` standards support, which Avail has been "working on" for years.

With no `GTFS-realtime` support in sight, Transit IT decided that developing an "official" app and releasing it as the PVTA was feasible and reasonable.  

Transit IT has a history of embarking on large projects that support our employees, and this is our first in support of our passengers.

`pvtrack exists because the three solutions above are either unfeasible at present (#3) or are insufficient for our passengers to use comfortably and reliably (#1 and #2).`


### Part 3 - What Does PVTrAck Seek to Accomplish?

pvtrack seeks to be a full-featured mobile application for PVTA's passengers to track their desired bus in real time.

It seeks to **be** the solution to the problems from `Part 2` - (1) the solutions available for Avail's clients stink and (2) the solutions available to transit agencies at large aren't available to the PVTA.


**pvtrack is for our passengers.**

The PVTA serves the entire valley, from the well-off students of Amherst to the single parent of 3 headed to their minimum-wage job to the blind student headed to class.  pvtrack needs to provide the same experience to everyone and should work well on all types of devices.
