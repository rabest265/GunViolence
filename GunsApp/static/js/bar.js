var ShootList = ["injuries only", "mass shooting", "no injuries", "some dead"]

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
    var injonly = [];
    var massht = [];
    var noinj = [];
    var dead = [];

    var injonlypop = [];
    var masshtpop = [];
    var noinjpop = [];
    var deadpop = [];

    for(var j=0; j < response2.length; j++) {
      if (response2[j].shoot_type == "injuries only")
        injonly.push(response2[j].Count),
        injonlypop.push(response2[j].pop_estimate_2015);
      else if (response2[j].shoot_type == "mass shooting")
        massht.push(response2[j].Count),
        masshtpop.push(response2[j].pop_estimate_2015);
      else if (response2[j].shoot_type == "no injuries")
        noinj.push(response2[j].Count),
        noinjpop.push(response2[j].pop_estimate_2015);
      else if (response2[j].shoot_type == "some dead")
        dead.push(response2[j].Count),
        deadpop.push(response2[j].pop_estimate_2015);
    }

    var incidents2 = []; 
    incidents2.push((injonly.reduce((a, b) => a + b, 0)/injonlypop.reduce((a, b) => a + b,))*100000000);
    incidents2.push((massht.reduce((a, b) => a + b, 0)/masshtpop.reduce((a, b) => a + b,))*100000000);
    incidents2.push((noinj.reduce((a, b) => a + b, 0)/noinjpop.reduce((a, b) => a + b,))*100000000);
    incidents2.push((dead.reduce((a, b) => a + b, 0)/deadpop.reduce((a, b) => a + b,))*100000000);
    

    console.log(incidents2);

    var trace1 = {
      x: ['benchmark','sample'],
      y: [incidents[2], incidents2[2]],
      name: shoot_type[2],
      type: 'bar'
    };

    var trace2 = {
      x: ['benchmark','sample'],
      y: [incidents[0], incidents2[0]],
      name: shoot_type[0],
      type: 'bar'
    };

    var trace3 = {
      x: ['benchmark','sample'],
      y: [incidents[3], incidents2[3]],
      name: shoot_type[3],
      type: 'bar'
    };

    var trace4 = {
      x: ['benchmark','sample'],
      y: [incidents[1], incidents2[1]],
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