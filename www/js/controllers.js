
angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('GalleryCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('GalleryDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.galleryId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('MapCtrl', ['RouteService', 'UserService', '$scope', '$ionicLoading', '$compile', function(RouteService, UserService, $scope, $ionicLoading, $compile) {



//     // NEW ZOOM MENU
    // L.Control.ZoomMin = L.Control.Zoom.extend({
    //   options: {
    //     position: "topleft",
    //     zoomInText: "+",
    //     zoomInTitle: "Zoom in",
    //     zoomOutText: "-",
    //     zoomOutTitle: "Zoom out",
    //     zoomFindMe: "<i class='fa fa-map-marker'></i>",
    //     zoomFindMeTitle: "Find me"
    //   },
    //   onAdd: function (map) {
    //     var zoomName = "leaflet-control-zoom",
    //     container = L.DomUtil.create("div", zoomName + " leaflet-bar"),
    //     options = this.options;

    //     this._map = map;

    //     this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
    //      zoomName + '-in', container, this._zoomIn, this);

    //     this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
    //      zoomName + '-out', container, this._zoomOut, this);

    //     this._zoomFindMeButton = this._createButton(options.zoomFindMe, options.zoomFindMeTitle,
    //      zoomName + '-me', container, this._zoomMe, this);

    //     this._updateDisabled();
    //     map.on('zoomend zoomlevelschange', this._updateDisabled, this);

    //     return container;
    //   },
    //   _zoomMe: function () {
    //     $scope.centerOnMe();
    //   },
    //   _updateDisabled: function () {
    //     var map = this._map,
    //     className = "leaflet-disabled";

    //     L.DomUtil.removeClass(this._zoomInButton, className);
    //     L.DomUtil.removeClass(this._zoomOutButton, className);
    //     L.DomUtil.removeClass(this._zoomFindMeButton, className);

    //     if (map._zoom === map.getMinZoom()) {
    //       L.DomUtil.addClass(this._zoomOutButton, className);
    //     }

    //     if (map._zoom === map.getMaxZoom()) {
    //       L.DomUtil.addClass(this._zoomInButton, className);
    //     }

    //     if (map._zoom === map.getMinZoom()) {
    //       L.DomUtil.addClass(this._zoomFindMeButton, className);
    //     }
    //   }
    // });
  angular.extend($scope, {
     honolulu: {
         lat: 21.3,
         lng: -157.8,
         zoom: 13
     },
     events: {
      map : {
        enable : ['click'],
        logic : 'broadcast'
      }
     },
     layers: {
         baselayers: {
             osm: {
                 name: 'OpenStreetMap',
                 url: 'https://{s}.tiles.mapbox.com/v3/examples.map-i875mjb7/{z}/{x}/{y}.png',
                 type: 'xyz'
             }
         }
     },
     defaults: {
         scrollWheelZoom: false
     }
  });


  $scope.$on('leafletDirectiveMap.map.click', function(event, args){
      var leafEvent = args.leafletEvent;
      console.log(leafEvent);
  });

}]);
