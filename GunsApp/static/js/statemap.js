var mapboxAccessToken = API_KEY;
var map = L.map('map').setView([38, -96], 5);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light'
}).addTo(map);

var url = "/jsonifiedstates";
d3.json(url, function(response) {
  console.log(response);

  for (var i = 0; i < response.length; i++) {
    var state  = response[i].state.toLowerCase();
    var population = response[i]['pop_estimate_2015'];
    var income = response[i]['2015_median_income'];

    for (var j = 0; j< statesData.features.length; j++) {
      if (state == statesData.features[j].properties.name.toLowerCase()) {
        statesData.features[j]["population"] = population;
        statesData.features[j]["income"] = income;
      }
    }  
  }

  console.log(statesData);

  function getColor(d) {
    return d > 75 ? '#000099' :
          d > 65  ? '#0000cc' :
          d > 60  ? '#0000ff' :
          d > 55  ? '#3333ff' :
          d > 50  ? '#6666ff' :
          d > 45  ? '#9999ff' :
          d > 40  ? '#ccccff' :
                    '#e6e6ff';
  }

  L.geoJson(statesData).addTo(map);

  function style(data) {
    console.log(data)
    return {
        fillColor: getColor(data.income/1000),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
  }

  L.geoJson(statesData, {style: style}).addTo(map);

  function highlightFeature(e) {
    var layer = e.target;
  
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
  
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature)
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }

  var geojson;
  geojson = L.geoJson(statesData, {style: style}).addTo(map);

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
  }

  geojson = L.geoJson(statesData, {
      style: style,
      onEachFeature: onEachFeature
  }).addTo(map);

  var info = L.control();

  info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
  };

  // method that we will use to update the control based on features passed
  info.update = function (feat) {
      this._div.innerHTML = '<h4>2015 US Median Income in Thousands</h4>' +  (feat ?
          '<b>' + feat.properties.name + '</b><br />' + feat.income/1000 + 'K median income'
          : 'Hover over a state');
  };

  info.addTo(map);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 40, 45, 50, 55, 60, 65, 75],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(map);

  
  // Assemble guns URL
  var newurl = "/jsonifiedguns";

  // Grab the data with d3
  d3.json(newurl, function(response2) {

    // Create a new marker cluster group
    var markers = L.markerClusterGroup();

    // Loop through data
    for (var i = 0; i < response2.length; i++) {

      // Set the data location property to a variable
      var lat = response2[i].latitude;
      var lng = response2[i].longitude;

      // Check for location property
      if (lat) {

        // Add a new marker to the cluster group and bind a pop-up
        markers.addLayer(L.marker([lat, lng])
          .bindPopup(response2[i].incident_characteristics));
      }

    }

    // Add our marker cluster layer to the map
    map.addLayer(markers);

  });


})