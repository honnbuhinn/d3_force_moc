//枠の大きさ
let width = 500;
let height = 500;

//各オブジェクト
var nodes = jforce.nodes
var links = jforce.links

//ほぼ不変
var svg = d3.select("#container").append("svg")
  .attr("width", width)
  .attr("height", height);
var color = d3.scaleOrdinal(d3.schemeCategory10);

console.log(jforce);
var simulation = d3.forceSimulation(nodes)
  .force("charge", d3.forceManyBody().strength(-30))
  .force("link", d3.forceLink().id(function(d) {
    return d.id;
  }))
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
  var node2 = node1.data(jforce.nodes, function(d) {
    return d.id;
  });
  node2.exit().remove();
  node1 = node2.enter().append("g").attr("class", "nodes").call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)).merge(node2);

  //if文でテキストの挿入をやめる

  //circleの挿入
  node1.append("circle")
    .attr("r", 5)
    .attr("fill", function(d) {
      return color(d.group);
    })
    .merge(node1);

  //textの挿入
  node1.append("text").text(function(d) {
      return d.id;
    })
    .attr("class", "nodeText")
    .attr("x", function(d) {
      return -25;
    })
    .attr("y", function(d) {
      return 25;
    })
    .attr("fill", "black").merge(node1);

  //nodeがくっついて動くようにする
  node1.attr("transform", function(d) {
    return "translate(" + d.x + ", " + d.y + ")";
  });

  // Apply the general update pattern to the links.
  link = link.data(links, function(d) {
    return d.source.id + "-" + d.target.id;
  });
  link.exit().remove();
  link = link.enter().append("line").merge(link);

  // Update and restart the simulation.
  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(1).restart();
}

function ticked() {
  node1.attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })

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

  node1
    .attr("transform", function(d) {
      return "translate(" + d.x + ", " + d.y + ")";
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

//クリックで座標取得・nodeの追加
d3.select("svg").on("click", function() {})

//nodeの削除
d3.select("#removeNode").on("click", function() {
  var name = document.getElementById("removeNodeName").value

  jforce = RemoveNode(jforce, name);
  jforce = jforce;

  console.log(jforce);
  restart();

})

//nodeの追加
d3.select("#addNode").on("click", function() {
  var name = document.getElementById("addNodeName").value
  var target = document.getElementById("addNodeTarget").value
  var group = document.getElementById("addNodeGroup").value
  var value = document.getElementById("addNodeValue").value

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

  if (searchTarget(nodes, target) === false) {
    jforce.links.push(addLink);
  }
  console.log(nodes);
  restart();
});

//if文でtargetがいるときを制御
function searchTarget(nodes, target) {
  for (var objTar in nodes) {
    if (nodes[objTar].id === target) {
      return false;
    }
  }
  return true;
}

//if文でsourceを制御
function RemoveNode(jforce, target) {
  for (var objTar in jforce.nodes) {
    if (nodes[objTar].id === target) {
      delete nodes[objTar];
      break;
    }
  }

  function RemoveLine() {

    //保留
    for (var objTar in jforce.links) {
      if (links[objTar].source.id === target) {
        delete link[objTar];
      }
      if (links[objTar].target === target) {
        delete link[objTar];
      }
    }

    return jforce;
  }

}
