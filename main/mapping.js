
var places = [
    {
        name: 'Rideau Canal',
        address: 'Ottawa, ON',
        latlng: { lat: 45.299958, lng: -75.874278 },
        marker: '',
        infowindow: '',
        wikiinfo: ''
    },

    {
        name: 'ByWard Market',
        address: 'Ottawa, ON',
        latlng: { lat: 45.429313,lng: -75.689535},
        marker: '',
        infowindow: '',
        wikiinfo: ''
    },

    {
        name: 'Kanata',
        address: 'Ontario, Canada',
        latlng: { lat: 45.309880, lng: -75.913814 },
        marker: '',
        infowindow: '',
        wikiinfo: ''

    },

    {
        name: 'IKEA Ottawa',
        address: '2685 Iris St, Ottawa, ON K2C 3S4',
        latlng: { lat:45.351272,lng: -75.783590},
        marker: '',
        infowindow: '',
        wikiinfo: ''

    },


];

var Location = function (data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.marker = ko.observable(data.marker);
    this.latlng = ko.observable(data.latlng);
    this.infowindow = ko.observable(data.infowindow);
    this.wikiinfo = ko.observable(data.wikiinfo);
};




var viewModel = function () {
    this.locations = ko.observableArray([]);
    this.searchRequest = ko.observable('');
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

            
            that.locations()[i].infowindow().close(map,that.locations()[i].marker());

        }
        
        place.infowindow().open(map, place.marker());
      
        
    }
    this.search = function(){
        if(that.searchRequest()== ''){
            for (var i=0; i<that.locations().length;i++){
            var currentPlace = document.getElementsByClassName('place');
            currentPlace[i].className= 'place';
            that.locations()[i].marker().setVisible(true);
            }
        }else{
            for (var i=0; i<that.locations().length;i++){
                var currentPlace = document.getElementsByClassName('place');
                currentPlace[i].className= 'place';
                that.locations()[i].marker().setVisible(true);
                }
            for (var i=0; i<that.locations().length;i++){
            if(that.locations()[i].name().toLowerCase().search(that.searchRequest().toLowerCase()) == -1){
            var currentPlace = document.getElementsByClassName('place');
            currentPlace[i].className= 'place hide';
            that.locations()[i].marker().setVisible(false);
            that.locations()[i].infowindow().close(map,that.locations()[i].marker());
            }
        }
    }
    }    
    
    startup();


    
};

ko.applyBindings(new viewModel());