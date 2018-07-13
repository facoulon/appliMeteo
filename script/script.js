jQuery(document).ready(function($) {

    var mymap = L.map('mapid').setView([46.52863469527167, 2.43896484375], 7);

    var chefLieu = []

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);

    $.get({
        url: 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=contours-simplifies-des-departements-francais-2015&rows=200&facet=code_dept',
        dataType: 'json',
        success: function(data_json, statut) {
            var listDept = data_json.records;
            for (var i = 0; i < listDept.length; i++) {
                var fieldList = listDept[i].fields;
                var geoshapeCoor = fieldList.geo_shape;
                chefLieu.push(fieldList.nom_chf);

                L.geoJSON(geoshapeCoor).addTo(mymap);

                $.get({
                    url: 'http://api.openweathermap.org/data/2.5/weather?q=' + chefLieu[i] + ',fr&APPID=6d2f216decbe34283f3ca5f9de28ddf0',
                    dataType: 'json';
                    success: function(weather_json, statut) {
                        var x = weather_json.coord.lat;
                        var y = weather_json.coord.lon;
                        var markerLocation = new L.LatLng(x, y);
                        var marker = new L.Marker(markerLocation);
                        mymap.addLayer(marker)
                        // L.marker([x, y]).addTo(mymap);
                        var iconId = weather_json.weather[0].icon;
                        console.log(iconId);
                        marker.bindPopup('<b>' + weather_json.name + '</b> <img src="http://openweathermap.org/img/w/' + iconId + '.png">');

                    },
                });
            }

        },
        error: function(resultat, statut, erreur) {

        },
        complete: function(resultat, statut) {

        },
    });


});
