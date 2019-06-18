/* data route */
var url = "/jsonifiedsummary";
d3.json(url).then(function(response) {
  console.log(response);
  var shoot_type = [];
  var incidents = [];
  
  for(var i=0; i < response.length; i++) {
    shoot_type.push(response[i].shoot_type);
    incidents.push(response[i].Incidents_per_100M);
  }
  console.log(shoot_type);
  console.log(incidents);
    
    // 0: "injuries only"
    // 1: "mass shooting"
    // 2: "no injuries"
    // 3: "some dead"

    console.log(incidents[0]);
    var value = incidents[0];

  var trace1 = {
    x: ['benchmark'],
    y: [incidents[2]],
    name: shoot_type[2],
    type: 'bar'
  };

  var trace2 = {
    x: ['benchmark'],
    y: [incidents[0]],
    name: shoot_type[0],
    type: 'bar'
  };

  var trace3 = {
      x: ['benchmark'],
      y: [incidents[3]],
      name: shoot_type[3],
      type: 'bar'
  };

  var trace4 = {
    x: ['benchmark'],
    y: [incidents[1]],
    name: shoot_type[1],
    type: 'bar'
  };

  var data = [trace1, trace2, trace3, trace4];

  var layout = {
    barmode: 'stack',
    title: "# of Incidents per 100M people",
  };

  Plotly.newPlot('plot', data, layout);
});