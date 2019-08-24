
// Create the multi dementional object to house the parent, child, grandchild relationships for the nodes and links
const data = {
  "name": "W",
  "size": 23000,
  "label": "test",
  "children": [

    {
      "name": "NA",
      "size": 25000,
      "children": [
        { "name": "Cd", "size": 23000 },
        { "name": "Mx", "size": 21000 },
        { "name": "US", "size": 24500 },
      ]
    },
    {
      "name": "SA",
      "size": 25000,
      "children": [
        { "name": "Bz", "size": 21000 },
        { "name": "Pru", "size": 24500 },
        { "name": "Arg", "size": 23000 },
      ]
    },
    {
      "name": "AF",
      "size": 25000,
      "children": [
        { "name": "Mc", "size": 24000 },
        { "name": "Egy", "size": 20000 },
        { "name": "Saf", "size": 22000 },
        { "name": "Ng", "size": 23000 },
      ]
    },
    {
      "name": "AS",
      "size": 25000,
      "children": [
        { "name": "Jp", "size": 17000 },
        { "name": "Ch", "size": 24800, },
        { "name": "Mly", "size": 20000 },
        { "name": "Hk", "size": 18000 },
        { "name": "Ind", "size": 22000 },
      ]
    },
    {
      "name": "EU",
      "size": 25000,
      "children": [
        { "name": "Fr", "size": 24000 },
        { "name": "Grm", "size": 23000 },
        { "name": "Uk", "size": 20000 },
      ]
    },
    {
      "name": "AU",
      "size": 25000,
      "children": [
        { "name": "Dar", "size": 21000 },
        { "name": "Brs", "size": 24000 },
        { "name": "Mel", "size": 23000 },

      ]
    }
  ]
}







// Create height and width
const width = 10,
  height = 10;

let i = 0;

// Declare variables for the root, transform, node, and links
const root = d3.hierarchy(data);
const transform = d3.zoomIdentity;
let node, link;

// Create SVG wrapper for navigator
const svg = d3.select('#navigator').append('svg')
  .call(d3.zoom().scaleExtent([1 / 4, 8]).on('zoom', zoomed))
  .append('g')
  .attr('transform', 'translate(300, 141.9)');


// Create the gravity simulation and parameters
const simulation = d3.forceSimulation()
  .force('link', d3.forceLink().id(function (d) { return d.id; }))
  .force('charge', d3.forceManyBody().strength(-73).distanceMax(500))
  .force('center', d3.forceCenter(width / 2, height / 4))
  .on('tick', ticked)

// Update nodes and links
function update() {
  const nodes = flatten(root)
  const links = root.links()

  link = svg
    .selectAll('.link')
    .data(links, function (d) { return d.target.id })

  link.exit().remove()

  // Use D3 to bind desired attributes to the links
  const linkEnter = link
    .enter()
    .append('line')
    .attr('class', 'link')
    .style('stroke', '#51a1dc')
    .style('opacity', '0.3')
    .style('stroke-width', 4)

  link = linkEnter.merge(link)

  node = svg
    .selectAll('.node')
    .data(nodes, function (d) { return d.id })

  node.exit().remove()

  // Use D3 to bind desired attributes and functions to the nodes
  const nodeEnter = node
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('stroke', '#666')
    .attr('stroke-width', 2)
    .style('fill', color)
    .style('opacity', 1)
    .on('click', clicked)
    .on('contextmenu', contextmenu)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))

  // Create circles for the nodes
  nodeEnter.append('circle')
    .attr("r", function (d) { return Math.sqrt(d.data.size) / 10 || 4.5; })
    .style('text-anchor', function (d) { return d.children ? 'end' : 'start'; })
    
  // Create text for the nodes
  nodeEnter.append("text")
    .attr("x", 0)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("class", "text")
    .style("fill", "black")
    .style("stroke", "black")
    .style("color", "black")
    .style("font-size", "14")
    .style("font-weight", "medium")
    .text(function (d) {
      return d.data.name
    });
    
  
  // Apply gravity simulation to the nodes
  node = nodeEnter.merge(node)
  simulation.nodes(nodes)
  simulation.force('link').links(links)
}


// Control the node sizes bassed off of declared size
function sizeContain(num) {
  num = num > 1000 ? num / 1000 : num / 100
  if (num < 4) num = 4
  return num
}

// Create controls for node colors in different states
function color(d) {
  return d._children ? "#51A1DC" // collapsed package
    : d.children ? "#51A1DC" // expanded package
      : "#F94B4C"; // leaf node
}

// Create controls for node radiai
function radius(d) {
  return d._children ? 8
    : d.children ? 8
      : 4
}


function ticked() {
  link
    .attr('x1', function (d) { return d.source.x; })
    .attr('y1', function (d) { return d.source.y; })
    .attr('x2', function (d) { return d.target.x; })
    .attr('y2', function (d) { return d.target.y; })

  node
    .attr('transform', function (d) { return `translate(${d.x}, ${d.y})` })
    
}


// Create function to expand and contract node children on a left mouse click
function clicked(d) {
  if (!d3.event.defaultPrevented) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update()
  }
}

// Create function to call the location changing functions in the build charts page on a right click 
function contextmenu(d) {

  d3.event.preventDefault();

  var location = this.textContent;

  console.log(location)

  if (location == "W") {

    entire_world(location);


  } else if (location !== "W") {

    visit_region(location);

  }


}

//  Functions to control the physics of the nodes and links when they are dragged
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart()
  d.fx = d.x
  d.fy = d.y
}

function dragged(d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0)
  d.fx = null
  d.fy = null
}

// Fucursive function to control the flattening of nodes
function flatten(root) {
  const nodes = []
  function recurse(node) {
    if (node.children) node.children.forEach(recurse)
    if (!node.id) node.id = ++i;
    else ++i;
    nodes.push(node)
  }
  recurse(root)
  return nodes
}

// Function to contro the zoom of the navigator
function zoomed() {
  svg.attr('transform', d3.event.transform)
}


// Initiate navigator build
update()

