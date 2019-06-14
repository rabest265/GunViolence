var mapboxAccessToken = API_KEY;
var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light'
}).addTo(map);

var url = "/jsonifiedstates";
d3.json(url, function(response) {


  for (var i = 0; i < response.length; i++) {
    var state  = response[i].State.toLowerCase();
    var population = response[i].Population;
    var income = response[i]['Median Income'];

    for (var j = 0; j< statesData.features.length; j++) {
      if (state == statesData.features[j].properties.name.toLowerCase()) {
        statesData.features[j]["population"] = population;
        statesData.features[j]["income"] = income;
      }
    }  
  }

  console.log(statesData);

  function getColor(d) {
    return d > 15 ? '#800026' :
          d > 14  ? '#BD0026' :
          d > 13  ? '#E31A1C' :
          d > 12  ? '#FC4E2A' :
          d > 11   ? '#FD8D3C' :
          d > 10   ? '#FEB24C' :
          d > 1   ? '#FED976' :
                      '#FFEDA0';
  }

  L.geoJson(statesData).addTo(map);

  function style(data) {
    console.log(data)
    return {
        fillColor: getColor(data.population/1000000),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
  }

  L.geoJson(statesData, {style: style}).addTo(map);
  // L.geoJson(statesData, {fillColor: getColor(statesData.features.population)}).addTo(map);
  // console.log(statesData.features.population);

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
      this._div.innerHTML = '<h4>US Population in Millions</h4>' +  (feat ?
          '<b>' + feat.properties.name + '</b><br />' + feat.population/1000000 + 'M people'
          : 'Hover over a state');
  };

  info.addTo(map);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 10, 11, 12, 13, 14, 15],
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




})