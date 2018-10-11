
//places available for the map
var places = [
    {
        name: 'Rideau Canal',
        address: 'Ottawa, ON',

        latlng: { lat: 45.368630, lng: -75.696649 },

        marker: '',
        infowindow: '',
        wikiinfo: ''
    },

    {
        name: 'ByWard Market',
        address: 'Ottawa, ON',
        latlng: { lat: 45.429313, lng: -75.689535 },
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
        name: 'IKEA',
        address: '2685 Iris St, Ottawa, ON K2C 3S4',
        latlng: { lat: 45.351272, lng: -75.783590 },
        marker: '',
        infowindow: '',
        wikiinfo: ''

    },


];
//template location object
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

    //starts up the webpage
    function startup() {

        for (var i = 0; i < places.length; i++) {
            that.locations.push(new Location(places[i]));
        }

        initMap();
        that.getInfoBoxInfo();

    }


    //grabs the information about a place based on its name from wikipediea 
    this.getInfoBoxInfo = function () {

        //incase of an error
        var wikiRequestTimeout = setTimeout(function () {
            for (var i = 0; i < that.locations().length; i++) {
                that.locations()[i].wikiinfo(' An error occured');
            }
        }, 1000);

        //for each place it gets info about it and uses it as the content for the infoWindow
        for (var i = 0; i < that.locations().length; i++) {
            var wikiSearch = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + that.locations()[i].name() + '&srproperties=snippet&format=json&callback=wikiCallback';

            $.ajax({
                url: wikiSearch,
                dataType: 'jsonp',
                success: function (data) {
                    for (var i = 0; i < that.locations().length; i++) {
                        if (data[1][0] == that.locations()[i].name()) {
                            that.locations()[i].wikiinfo(data[2][0]);
                            that.locations()[i].infowindow(new google.maps.InfoWindow({
                                content: '<div class ="wiki">' + that.locations()[i].wikiinfo() + '</div>',

                            }));
                        }
                    }

                    clearTimeout(wikiRequestTimeout);
                }
            });
        }


    };
    //initalizes the google map
    function initMap() {
        //default view
        canvas = document.getElementById('map');
        settings = {
            zoom: 12,
            center: { lat: 45.4215, lng: -75.6972 },
        };
        var map = new google.maps.Map(canvas, settings);
        var bounds = new google.maps.LatLngBounds();
        //creating a marker for each place and adding an infowindow
        for (var i = 0; i < that.locations().length; i++) {
            var marker = new google.maps.Marker({
                position: that.locations()[i].latlng(),
                map: map,
                title: that.locations()[i].name(),
                animation: google.maps.Animation.DROP
            });
            that.markerclickes(that.locations()[i], marker)
            that.locations()[i].marker(marker);
            //adds a temporary infowindow
            that.locations()[i].infowindow(new google.maps.InfoWindow({
                content: "This is an error"
            }));

            bounds.extend(that.locations()[i].marker().position);
            map.fitBounds(bounds);
        }
    };
    //adds a click listener to the markers
    this.markerclickes = function (place, marker) {
        marker.addListener('click', function () {
            that.clicked(place);
        });

    }
    //function called when a place is clicked
    this.clicked = function (place) {
        //closes all open markers then opens the selected marker
        for (var i = 0; i < that.locations().length; i++) {
            that.locations()[i].infowindow().close(map, that.locations()[i].marker());
            that.locations()[i].marker().setAnimation(null);
        }
        place.marker().setAnimation(google.maps.Animation.BOUNCE);
        place.infowindow().open(map, place.marker());
    }

    //function shows the searched place
    this.search = function () {
        //shows all places if nothing is being searched
        if (that.searchRequest() == '') {
            for (var i = 0; i < that.locations().length; i++) {
                var currentPlace = document.getElementsByClassName('place');
                currentPlace[i].className = 'place';
                that.locations()[i].marker().setVisible(true);
            }
        } else {
            //clears the search and then checks if the searched name is in any of the places' names
            for (var i = 0; i < that.locations().length; i++) {
                var currentPlace = document.getElementsByClassName('place');
                currentPlace[i].className = 'place';
                that.locations()[i].marker().setVisible(true);
            }
            for (var i = 0; i < that.locations().length; i++) {
                if (that.locations()[i].name().toLowerCase().search(that.searchRequest().toLowerCase()) == -1) {
                    var currentPlace = document.getElementsByClassName('place');
                    currentPlace[i].className = 'place hide';
                    that.locations()[i].marker().setVisible(false);
                    that.locations()[i].infowindow().close(map, that.locations()[i].marker());
                }
            }
        }
    }

    startup();



};

ko.applyBindings(new viewModel());