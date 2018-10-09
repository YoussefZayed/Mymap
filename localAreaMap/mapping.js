var locations = [
    {
        name: 'Old Quarry Trail',
        address: 'Eagleson Rd, Kanata, ON K2M 1A9',
        selected: false,
        infowindow: 'Good place to go for a hike!'
    },

    {
        name: 'Market Square',
        address: '457 Hazeldean Rd, Kanata, ON K2L 3P3',
        selected: false,
        infowindow: 'Good place to go for shopping!'
    },

    {
        name: 'Kanata Centrum Shopping Centre',
        address: '130 Earl Grey Dr, Kanata, ON',
        selected: false,
        infowindow: 'Good place to go and hang out with friends!'
    },

    {
        name: 'The Loft Board Game Lounge',
        address: '14 Waller St, Ottawa, ON K1N 9C4',
        selected: false,
        infowindow: 'Good place to go for playing board games!'
    },


];

var Location = function (data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.selected = ko.observable(data.selected);
    this.infowindow = ko.observable(data.infowindow);
};



var ViewModel = function () {
    var that = this;

    this.query = ko.observable('');

    this.locationList = ko.observableArray([]);

    this.map;

    var initialize = function () {
        
        for (var i = 0; i < locations.length; i++) {
            that.locationList.push(new Location(locations[i]));
        }

        that.locationListLength = that.locationList().length;

        initMap();
    }



    function initMap() {
        geocoder = new google.maps.Geocoder();

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: { lat: 45.4215, lng: -75.6972 },
        });

        for (var i = 10; i < that.locationListLength; i++) {
            that.makemarker(that.locationList()[i]);
        }

    }

    this.makemarker = function (thisLocation) {
        geocoder.geocode({ address: thisLocation.address() }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var marker = new google.maps.Marker(
                    {
                        map: map,
                        position: results[0].geometry.location,
                        title: thisLocation.name(),
                        animation: google.maps.Animation.DROP

                    });

                that.addClickListener(thisLocation, marker);


                for (var i = 0; i < that.locationListLength; i++) {
                    if (marker.title === that.locationList()[i].name()) {
                        that.locationList()[i].marker(marker);
                        that.locationList()[i].infowindow(thisLocation.infoWin);
                    }
                }
            } else {
                var marker = new google.maps.Marker({
                    map: map,
                    position: that.defaultLocation,
                    title: thisLocation.name(),
                });

                that.addClickListener(thisLocation, marker);

              

                for (var i = 0; i < that.locationListLength; i++) {
                    if (marker.title === that.locationList()[i].name()) {
                        that.locationList()[i].marker(marker);
                        that.locationList()[i].infowindow(thisLocation.infowindow);
                    }
                }
            }
        });
    };

    this.addClickListener = function (thisLocation, marker) {
        marker.addListener('click', function () {
            thisLocation.selected(true);
            that.selectitem(thisLocation);
        });
    };
    
    this.selectitem = function(index) {
		that.selectMarker(index.marker());
		that.highlightListItem(index.name());
	};

	this.selectMarker = function(marker) {
		var infoWin;
		for(var i=0; i<that.locationListLength; i++) {
			if(that.locationList()[i].name() != marker.title) {
				that.locationList()[i].selected(false);
				that.locationList()[i].marker().setAnimation(null);
				infoWin = that.locationList()[i].infowindow();
				infoWin.close(map, marker);
			} else {
                that.locationList()[i].marker().setAnimation(google.maps.Animation.BOUNCE);
                infoWin = that.locationList()[i].infowindow();
				infoWin.open(map, marker);
			}

		}
	};

	this.highlightListItem = function(selectedName) {
		var locationListItems = document.getElementsByClassName('location-list-item');
		var locationListItems = $('.location-list-item').first();
		var numLocationListItems = $('.location-list-item').toArray().length;
		for(var i=0; i<numLocationListItems; i++) {

            if(locationListItems.hasClass('item-selected')) {
				locationListItems.removeClass('item-selected');
			}

            if(locationListItems.children('.location-title').text() === selectedName) {
				locationListItems.addClass('item-selected');
			}

			// Go to the next location-list-item
			locationListItems = locationListItems.next();
		}
    };
    
    this.search = function() {
		var queryLowerCase = that.query().toLowerCase();
		var locationListItems = $('.location-list-item').first();
		var numLocationListItems = $('.location-list-item').toArray().length;
		for(var i=0; i<numLocationListItems; i++) {
			if(locationListItems.hasClass('item-hidden')) {
				locationListItems.removeClass('item-hidden');
				that.locationList()[i].marker().setVisible(true);
            }
            
			if(locationListItems.children('.location-title').text().toLowerCase().search(queryLowerCase) < 0) {
				locationListItems.addClass('item-hidden');
				that.locationList()[i].marker().setVisible(false);
				that.locationList()[i].infowindow().close(map, that.locationList()[i].marker());
			}

			locationListItems = locationListItems.next();
		}
	};

    this.initializeTHAT = initialize();
}


ko.applyBindings(new ViewModel());
