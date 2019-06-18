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

  var url2 = "/jsonifiedstatesummary";
  d3.json(url2).then(function(response2) {
    console.log(response2);
    var shoot_type2 = [];
    var incidents2 = [];

    for(var j=0; j < response2.length; j++) {
      shoot_type2.push(response2[j].shoot_type);
      incidents2.push(response2[j].Incidents_per_100M);
    }

    console.log(shoot_type2);
    console.log(incidents2);

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
});