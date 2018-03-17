var colors = d3.scaleOrdinal(d3.schemeCategory10);
let width = 500;
let height = 500;
var svg = d3.select("#container").append("svg");
svg.attr("width", width).attr("height", height);

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) {
    return d.id;
  }).distance(100).strength(1))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) {
    return d.id;
  }))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));

var links = svg.selectAll(".links");
var nodes = svg.selectAll(".node");

 var link=svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(jforce.links).enter().append("line")
  .attr("stroke-width", function(d) {
    return Math.sqrt(d.value);
  });

var node = svg.append("g")
  .attr("class", "nodes")
  .selectAll("circle")
  .data(jforce.nodes).enter().append("circle")
  .attr("r", 5)
  .attr("fill", function(d) {
    return color(d.group);
  })
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

node.append("title")
  .text(function(d) {
    return d.id;
  });

function update() {
  simulation
    .nodes(jforce.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(jforce.links);
}

update();

function ticked() {
  link
    .attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });

  node
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

/////////////////////////////////////////////

//クリックで座標取得・nodeの追加
d3.select("#container").on("click", function() {
  var element = document.getElementById("container");
  var coordinates = d3.mouse(element);
  console.log(coordinates);

  //情報を入力する。
  //window.prompt();

  var name = document.getElementById("name").value
  var target = document.getElementById("target").value
  var group = document.getElementById("group").value
  var value = document.getElementById("value").value

  addNode = {
    "id": name,
    "group": group
  };
  addLink = {
    "source": name,
    "target": target,
    "value": value
  };

  jforce.nodes.push(addNode);
  jforce.links.push(addLink);

  // Apply the general update pattern to the nodes.
  node = node.data(jforce.nodes, function(d) {
    return d.id;
  });
  node.exit().remove();
  node = node.enter().enter().append("circle")
    .attr("r", 5)
    .attr("fill", function(d) {
      return color(d.group);
    })
    .attr("cx",coordinates[0])
    .attr("cx",coordinates[1])
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)).merge(node);

  // Apply the general update pattern to the links.
  link = link.data(dforce.links, function(d) {
    return d.source.id + "-" + d.target.id;
  });
  link.exit().remove();
  link = link.enter().append("line").merge(link);



  link.attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });

    // Update and restart the simulation.
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
})
