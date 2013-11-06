function locationInfo(method, input) {
    this.method = method,
    this.input = input,
    this.getLocationInfo = function (callback) {
        var callback = callback;
        var getLocObj = this.getLonLatObject;
        if (this.method == "address" && this.input != null && this.input != "") {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': this.input
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    lat = (results[0].geometry.location.lat());
                    lng = (results[0].geometry.location.lng());
                    if (results[0].address_components[7]) {
                        zip = (results[0].address_components[0].short_name);
                        city = (results[0].address_components[1].short_name);
                        state = (results[0].address_components[4].short_name);
                        address = city + ", " + state + " " + zip;
                        callback(true, lat, lng, city, state, zip, address, callback);
                    }
                    else {
                        var loc = getLocObj(lat, lng);
                        locationSuccess(loc);
                    }
                } else {
                    callback(false);
                }
            });
        }
        else {
            if (navigator.geolocation != null) {
                navigator.geolocation.getCurrentPosition(locationSuccess, locationFail);
            }
            else {
                if (typeof pos != 'undefined') {
                    var lat = pos.coords.latitude;
                    var lng = pos.coords.longitude;
                }
                else {
                    var lat = 42.800808;
                    var lng = -71.562538;
                }
                var loc = getLocObj(lat, lng);
                locationSuccess(loc);
            }

        }
        function locationSuccess(loc) {
            var good = false;
            var city;
            var zip;
            var state;
            var address;
            if (loc.coords) {
                var lat = loc.coords.latitude;
                var lng = loc.coords.longitude;
            }
            else {
                var lat = loc.lat();
                var lng = loc.lng();
            }
            $.ajax({
                url: "http://api.geonames.org/findNearbyPostalCodesJSON",
                dataType: "json",
                async: false,
                data: {
                    username: "ektronse",
                    lat: lat,
                    lng: lng
                },
                success: function (data) {
                    if (data.postalCodes[0]) {
                        zip = data.postalCodes[0].postalCode;
                        city = data.postalCodes[0].placeName;
                        state = data.postalCodes[0].adminCode1;
                        address = city + ", " + state + " " + zip;
                        good = true;
                    }
                    else {
                        city = "";
                        state = "";
                        zip = "";
                        address = "";
                    }
                }
            }).done(callback(good, lat, lng, city, state, zip, address));
        };
        function locationFail(error) {
            callback(false);
        }
    }
    ,
    this.getLonLatObject = function (lat, lng) {
        return new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    }
    ,
    this.getAddress = function (which) {
        switch (which) {
            case "a":
                return "239 Main Street, " + this.city + ". " + this.state + " " + this.zip;
                break;

            case "b":
                return "42 Haverill Road, " + this.city + ". " + this.state + " " + this.zip;
                break;

            case "c":
                return "939 South Gate Road, " + this.city + ". " + this.state + " " + this.zip;
                break;
        }
    }
}


function locationMap(mapid, location) {
    this.location = location,
        this.mapid = mapid,
        this.createMarkers = function () {
            this.markers = [{
                title: "<p class='storeTitle'>EkoVision Store</p><p class='storeAddress'>" + location.getAddress("a") + "</p>",
                lat: this.location.lat,
                lng: this.location.lng,
                name: "EkoVision Store"
            }, {
                title: "<p class='storeTitle'>EkoVision Store</p><p class='storeAddress'>" + location.getAddress("b") + "</p>",
                lat: this.location.lat + 0.03,
                lng: this.location.lng + 0.001,
                name: "EkoVision Store"
            }, {
                title: "<p class='storeTitle'>EkoVision Store</p><p class='storeAddress'>" + location.getAddress("c") + "</p>",
                lat: this.location.lat + 0.01,
                lng: this.location.lng + 0.03,
                name: "EkoVision Store"
            }
            ];
            // Create the markers
            for (index in this.markers) {
                this.addMarker(this.markers[index], this.map);
            }
        }
         ,
         this.addMarker = function (data, map) {
             var storeLocation = new google.maps.LatLng(parseFloat(data.lat), parseFloat(data.lng));
             var marker = new google.maps.Marker({
                 position: storeLocation,
                 map: map,
                 title: data.name,
                 content: data.title
             });

             var pin = new google.maps.MVCObject();
             google.maps.event.addListener(marker, "click", function () {
                 infowindow.content = marker.content;
                 pin.set("position", marker.getPosition());
                 infowindow.open(map, marker);
                 var t = 1;
             });
         }
        ,
        this.createBounds = function () {
            // Zoom and center the map to fit the markers
            // This logic could be conbined with the marker creation.
            // Just keeping it separate for code clarity.
            var bounds = new google.maps.LatLngBounds();
            for (index in this.markers) {
                var data = this.markers[index];
                bounds.extend(new google.maps.LatLng(data.lat, data.lng));
            }
            this.map.fitBounds(bounds);
        }
        ,
        this.createInfoWindow = function () {
            var content = document.createElement("DIV");
            var title = document.createElement("DIV");
            content.appendChild(title);
            var address = document.createElement("DIV");
            address.style.width = "100px";
            address.style.height = "80px";
            content.appendChild(address);
            infowindow = new google.maps.InfoWindow({
                content: content
            });
        }
        ,
        this.createMap = function () {
            // Zoom in on user's location on map
            this.map = new google.maps.Map(document.getElementById(this.mapid), {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false
            });
            this.zip = this.location.zip;
            this.state = this.location.state;
            this.city = this.location.city;
            this.createMarkers();
            this.createBounds();
            this.displayAddresses();
        }
        ,
        this.displayAddresses = function () {
            this.storeMarkup = "";
            for (index in this.markers) {
                this.storeMarkup += this.markers[index].title;
            }
            return this.storeMarkup;
        }
} 