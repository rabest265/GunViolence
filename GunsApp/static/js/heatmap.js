var myMap = L.map("map", {
  center: [38, -100],
  zoom: 4
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);



var url = "/jsonifiedcities";
d3.json(url, function(response) {

  // console.log(response);

  var heatArray = [];

  for (var i = 0; i < response.length; i++) {
    var lat = response[i].Lat;
    var lng = response[i].Lng;
    var income = response[i]['Median Income'];
    var poverty = response[i].poverty_rate;
  
    var select = "poverty"
 
    var data = poverty;
    var nblur = 0.00001
    if (select =="income"){
      data = income;
      nblur = 9;
    }
    console.log (nblur);
    if (lat) {
      heatArray.push([lat, lng, data]);
    }
   } 
  // });

  console.log(heatArray);

  var heat = L.heatLayer(heatArray, {
    radius: 5,
    blur: nblur
  }).addTo(myMap);

});
