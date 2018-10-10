
var places = [
    {
        name: 'Rideau Canal',
        address: 'Ottawa, ON',
        selected: false,
        latlng: { lat: 45.368630,lng: -75.696649 },
        marker: '',
        infowindow: '',
        wikiinfo: ''
    },

    {
        name: 'ByWard Market',
        address: 'Ottawa, ON',
        selected: false,
        latlng: { lat: 45.429313,lng: -75.689535},
        marker: '',
        infowindow: '',
        wikiinfo: ''
    },

    {
        name: 'Kanata',
        address: 'Ontario, Canada',
        selected: false,
        latlng: { lat: 45.309880, lng: -75.913814 },
        marker: '',
        infowindow: '',
        wikiinfo: ''

    },

    {
        name: 'IKEA Ottawa',
        address: '2685 Iris St, Ottawa, ON K2C 3S4',
        selected: false,
        latlng: { lat:45.351272,lng: -75.783590},
        marker: '',
        infowindow: '',
        wikiinfo: ''

    },


];

var Location = function (data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.selected = ko.observable(data.selected);
    this.marker = ko.observable(data.marker);
    this.latlng = ko.observable(data.latlng);
    this.infowindow = ko.observable(data.infowindow);
    this.wikiinfo = ko.observable(data.wikiinfo);
};




var viewModel = function () {
    this.locations = ko.observableArray([]);
    var that = this;
    function startup(){

        for(var i=0; i<places.length;i++){
            that.locations.push(new Location(places[i]));
        }
        initMap();

    }
    
    
    
    
    function initMap() {
        canvas = document.getElementById('map');
        settings = {
            zoom: 12,
            center: { lat: 45.4215, lng: -75.6972 },
        };
        var map = new google.maps.Map(canvas, settings);
        var bounds = new google.maps.LatLngBounds();

        for (var i=0; i<that.locations().length;i++) {
            var marker = new google.maps.Marker({
                position: that.locations()[i].latlng(),
                map: map,
                title: that.locations()[i].name(),
                animation: google.maps.Animation.DROP
            });
            that.markerclickes(that.locations()[i],marker)
            that.locations()[i].marker(marker);
           
            that.locations()[i].infowindow(new google.maps.InfoWindow({
                content: "This is an info marker!"
            }));
           
            bounds.extend(that.locations()[i].marker().position);
            map.fitBounds(bounds);
        }
    };
    
    this.markerclickes = function(place,marker){
        marker.addListener('click', function() {
            that.clicked(place);
        });

    }
    this.clicked = function(place){
        for (var i=0; i<that.locations().length;i++){

            that.locations()[i].selected(false);
            that.locations()[i].infowindow().close(map,that.locations()[i].marker());
            that.locations()[i].marker().setAnimation(null);

        }
        place.marker().setAnimation(google.maps.Animation.BOUNCE);
        place.selected(true);
        place.infowindow().open(map, place.marker());
      
        
    }
    
    startup();


    
};

ko.applyBindings(new viewModel());