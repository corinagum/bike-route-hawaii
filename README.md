Ride Hawaii
=====================
### [ridehawaii.us](http://ridehawaii.us)

## Introduction
Ride Hawaii was originally created by four students as their final project in Cohort 9 of DevLeague in Honolulu, HI. The goal of this project is to create a geolocation app usable by bikers in the Honolulu area and to provide the following map information:
* Locations of future Bike Share sites, where bike rentals will be possible.
* History about nearby sites as a self-created tour.
* Locations of the bike racks that are available in Honolulu.
Other features of this app include user feedback and reporting, favoriting, and user location to marker location route information.

Cohort 9 Collaborators:
* [Nick Cadiente](https://github.com/ncadiente)

* [Corina Jacobson](https://github.com/corinajacobson)

* [Rizhia Ortega](https://github.com/RizOrt218)

* [Kent Salcedo](https://github.com/kentsalcedo)

## Installation
In order to run this app, please run the following in your terminal after cloning the project:

```bash
$ npm i
```
```bash
$ bower i
```
```bash
$ nodemon server/server.js
```
```bash
$ sequelize db:seed:all
```
This installs the necessary dependecies and seeds the point details into a database.

To use the working version of this app please visit [ridehawaii.us](http://ridehawaii.us)


## Version
As of March 2 2016, the current version of this app is 1.0.

## User Guide

While this app was created with mobile use in mind, it is accessible using any modern browser.

1. When first loading this app, the user should receive a popup requesting access to location information.
2. Tapping 'Allow' will enable app functionality while 'Don't Allow' will likewise prevent it.
3. Once the app is loaded, it will wait for user confirmation, 'tap to find location', before loading the initial map view, where the user's location marker (blue) will be centered on the screen.
4. User can zoom in or out by tapping the + or - in the upper left corner.
5. The green markers are the proposed BikeShare Stations nearby.
6. Tapping a marker will show a popup with the location name. Tapping the right-chevron on the popup will bring up Location Details, where the user can:
  1. See detailed information and a photo, where applicable
  2. Mark the point as a favorite
  3. Indicate a safety incident
  4. Make a report or suggestion related to this point.
  5. Close this view by tapping the down-arrow in the upper right corner of the screen.
7. The bottom navigation buttons of the map view, listed left to right, have the following functionalities:
  1. Find my location
  2. Show List View of nearby BikeShare Stations
  3. Show List View of nearby history landmarks
  4. Show List View of nearby public bike racks

8. In List View, user can
  1. Immediately see the distance of the mark from his or her current location.
  2. Side swipe left on any location to show buttons that will generate route directions to this point (left) or show Location Details of the point(right).
  3. Close List View by tapping the down-arrow placed in the upper-right corner of the screen.
9. Once returned to map view, the user can modify map settings by tapping the grey gear in the upper right corner. This shows the filters. Green highlight indicates the current options in use. From top to bottom:
  1. 'My Favorites' will show the marker pins saved by the user
  2. 'Show Points on Drag' will reload nearby pins as the user moves across the map. This is helpful for situations where the user is viewing points on the map that is distant from his or her location.
  3. Show different types of points. BikeShare Stations is chosen by default, but the other two options are to show Landmarks (yellow markers) or public bike racks (black markers)
  4. Choose radius of shown markers by distance from user. Radius options from left to right are 0.5 mile, 1 mile, 5 miles, or all points available on the map.
  5. Tapping 'Done' will close this view

## Implementation

## Testing

## Related Resources and Appreciation
We would like to thank the following people and organizations for providing the data and support utilized to make this app a reality.
  [BikeShare Hawaii](http://www.bikesharehawaii.org/) for providing the BikeShare location points.
  [Peter T. Young ](http://hookuleana.com/about-2/peter/) from Hookuleana for providing carefully compiled history locations and information with photos.
  [Data Hawaii Gov](https://data.hawaii.gov/) for general descriptions of bike rack locations in the city of Honolulu (and a little beyond).
  Kelli Borgonia of Goma Games for providing design specs and files.
  DevLeague teachers and staff for guidance, support, and advice.

