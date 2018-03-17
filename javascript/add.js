var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    color = d3.scaleOrdinal(d3.schemeCategory10);

var a = {id: "a"},
    b = {id: "b"},
    c = {id: "c"},
    nodes = [a, b, c],
    links = [];

var simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("link", d3.forceLink(links).distance(200))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .alphaTarget(1)
    .on("tick", ticked);

var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
    link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link"),
    node1 = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");

restart();



function restart() {

  // Apply the general update pattern to the nodes.
  var node2 = node1.data(nodes, function(d) { return d.id;});
  node2.exit().remove();
  node1 = node2.enter().append("circle").attr("fill", function(d) { return color(d.id); }).attr("r", 8).call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)).merge(node2);

//if文でテキストの挿入をやめる


    //textの挿入
  node1.append("title").text(function(d) {
       return d.id;
   }).merge(node1);
  console.log(node1);


  // Apply the general update pattern to the links.
  link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
  link.exit().remove();
  link = link.enter().append("line").merge(link);

  // Update and restart the simulation.
  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(1).restart();
}

function ticked() {
  node1.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
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

//クリックで座標取得・nodeの追加
d3.select("svg").on("click", function() {
  links.push({source: a, target: b}); // Add a-b.
  links.push({source: b, target: c}); // Add b-c.
  links.push({source: c, target: a}); // Add c-a.
  restart();
})

d3.select("#remove").on("click", function() {
  nodes.pop(); // Remove c.
  links.pop(); // Remove c-a.
  links.pop(); // Remove b-c.
  restart();
})

d3.select("#add").on("click", function() {
  nodes.push(c); // Re-add c.
  links.push({source: b, target: c}); // Re-add b-c.
  links.push({source: c, target: a}); // Re-add c-a.
  restart();
})
