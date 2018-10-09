
var places = [
  {
      name: 'Old Quarry Trail',
      address: 'Eagleson Rd, Kanata, ON K2M 1A9',
      selected: false,
      infowindow: 'Good place to go for a hike!',
      latlng: {lat :45.299958, lng : -75.874278},
      marker: '',
      infowindow: '',
      wiki: ''
    },

  {
      name: 'Market Square',
      address: '457 Hazeldean Rd, Kanata, ON K2L 3P3',
      selected: false,
      infowindow: 'Good place to go for shopping!',
      latlng: {lat :45.300226,lng: -75.886980},
      marker: '',
      infowindow: '',
      wiki: ''
  },
 
  {
      name: 'Kanata Centrum Shopping Centre',
      address: '130 Earl Grey Dr, Kanata, ON',
      selected: false,
      infowindow: 'Good place to go and hang out with friends!',
      latlng: {lat :45.309880, lng:-75.913814},
      marker: '',
      infowindow: '',
      wiki: ''

  },

  {
      name: 'The Loft Board Game Lounge',
      address: '14 Waller St, Ottawa, ON K1N 9C4',
      selected: false,
      infowindow: 'Good place to go for playing board games!',
      latlng: {lat :45.427266,lng: -75.688753},
      marker: '',
      infowindow: '',
      wiki: ''

  },


];

var location = function (data) {
  this.name = ko.observable(data.name);
  this.address = ko.observable(data.address);
  this.selected = ko.observable(data.selected);
  this.infowindow = ko.observable(data.infowindow);
  this.marker = ko.observable(data.marker);
  this.wiki = ko.observable(data.wiki);
};





  var viewModel =function(){
    this.locations =ko.observable(ko.observableArray([]));
    
    

    function initMap() {
        canvas = document.getElementById('map');
        settings ={
            zoom: 12,
            center: {lat: 45.4215 , lng:  -75.6972},
          };
        var map = new google.maps.Map(canvas,settings);
        var bounds =new google.maps.LatLngBounds();
        
        for (place of places){
        var marker = new google.maps.Marker({
            position: place["latlng"],
            map: map,
            title: place["name"],
            animation: google.maps.Animation.DROP
        });
    
        var infowindow = new google.maps.InfoWindow({
            content: "This is an info marker!"
        });
        marker.addListener('click',function(){
            infowindow.open(map,marker);
        });
        bounds.extend(marker.position);
        map.fitBounds(bounds);
        }
      };

    initMap();

  };
 
  ko.applyBindings(new viewModel());