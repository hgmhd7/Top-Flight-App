
// Set the plot dementions
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
};

// Carve out the specific areat to aoply the scatter plot
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initial Params
var chosenXAxis = "total_routes";
var chosenYAxis = "airport_rating";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function used for updating x-scale var upon click on axis label
function xScale(airportData, chosenXAxis) {
    // Create scales
    if (chosenXAxis === "total_routes") {
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(airportData, d => d[chosenXAxis]) - 6, d3.max(airportData, d => d[chosenXAxis])])
            .range([0, width]);
    } else if (chosenXAxis === "altitude") {
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(airportData, d => d[chosenXAxis]) - 50, d3.max(airportData, d => d[chosenXAxis])])
            .range([0, width]);
    } else if (chosenXAxis === "latitude") {
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(airportData, d => d[chosenXAxis]) - 3, d3.max(airportData, d => d[chosenXAxis])])
            .range([0, width]);
    } else {
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(airportData, d => d[chosenXAxis]) - 3, d3.max(airportData, d => d[chosenXAxis])])
            .range([0, width]);
    }


    return xLinearScale;

}


// Function used for updating y-scale var upon click on axis label
function yScale(airportData, chosenYAxis) {
    // Create y scales
    if (chosenYAxis === "airport_rating") {
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(airportData, d => d[chosenYAxis]) - 0.04, d3.max(airportData, d => d[chosenYAxis]) + 0.3])
            .range([height, 0]);
    } else {
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(airportData, d => d[chosenYAxis]) - 170, d3.max(airportData, d => d[chosenYAxis])])
            .range([height, 0]);
    }

    return yLinearScale;

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function used for updating xAxis var upon click on axis label
function xRenderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}


// Function used for updating yAxis var upon click on axis label
function yRenderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Function used for updating circles group with a transition to
// new circles on x-axis change
function xRenderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}


// Function used for updating circles group with a transition to
// new circles on y-axis change
function yRenderCircles(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function used for updating the state abbreviation text group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "total_routes") {
        var label_1 = "Number of Routes: ";
    } else if (chosenXAxis === "altitude") {
        var label_1 = "Altitude: ";
    } else if (chosenXAxis === "longitude") {
        var label_1 = "Longitude: ";
    } else {
        var label_1 = "Latitude: ";
    }


    if (chosenYAxis === "airport_rating") {
        var label_2 = "Airport Rating: ";
    } else {
        var label_2 = "Number of Ratings: ";
    }


    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return (`Airport Name: ${d.name}<br> Country: ${d.country}<br> ${label_1}  ${d[chosenXAxis]}<br>${label_2}  ${d[chosenYAxis]}`)
       
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })
        // Onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
   



    return circlesGroup;
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Retrieve data from the /scatterplots route and execute everything below
d3.json("/scatterplot").then(function(airportData) {

    // parse data
    airportData.forEach(function(data) {
        data.index = +data.index;
        data.latitude = +data.latitude;
        data.longitude = +data.longitude;
        data.altitude = +data.altitude;
        data.timezone = +data.timezone;
        data.airport_rating = +data.airport_rating;
        data.number_ratings = +data.number_ratings;
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Create xLinearScale and yLinearScale data
    var xLinearScale = xScale(airportData, chosenXAxis);
    var yLinearScale = yScale(airportData, chosenYAxis);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(airportData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 3)
        // .attr("fill", "#3399ff")// Other colors I was trying
        // .attr("fill", "#cc99ff")// Other colors I was trying
        .attr("fill", "#66b2ff")
        .attr("opacity", ".7")
        .style("stroke", "black");



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Create group for the 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var numRoutesLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "total_routes") // value to grab for event listener
        .classed("active", true)
        .text("Number of Routes");

    var altitudeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "altitude") // value to grab for event listener
        .classed("inactive", true)
        .text("Altitude");

    var latitudeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "latitude") // value to grab for event listener
        .classed("inactive", true)
        .text("Latitude");

    var longitudeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "longitude") // value to grab for event listener
        .classed("inactive", true)
        .text("Longitude");

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Create group for the 3 y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var ratingLabel = yLabelsGroup.append("text")
        .attr("y", 0 - (margin.left - 40))
        .attr("x", 0 - (height / 2))
        .attr("value", "airport_rating") // value to grab for event listener
        .attr("dy", "1em") //  moves value slightly to the right???
        .classed("active", true)
        .text("Airport Rating (out of 5 stars)");


    var numRatingsLabel = yLabelsGroup.append("text")
        .attr("y", 0 - (margin.left - 20))
        .attr("x", 0 - (height / 2))
        .attr("value", "number_ratings") // value to grab for event listener
        .attr("dy", "1em") //  moves value slightly to the right???
        .classed("inactive", true)
        .text("Number of Ratings");

    //DEBUGGERS
    //console.log(circlesGroup)
    // console.log(chosenXAxis);


    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // x-axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            // Get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // Replaces chosenXAxis with value
                chosenXAxis = value;

                // DEBUGGER TO CHECK VALUES
                // console.log(chosenXAxis)

                // Functions here found above csv import
                // Updates x scale for new data
                xLinearScale = xScale(airportData, chosenXAxis);

                // Updates x axis with transition
                xAxis = xRenderAxes(xLinearScale, xAxis);

                // Updates circles with new x values
                circlesGroup = xRenderCircles(circlesGroup, xLinearScale, chosenXAxis);


                // Updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Changes classes to change bold text
                if (chosenXAxis === "total_routes") {
                    numRoutesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    altitudeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    latitudeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    longitudeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenXAxis === "altitude") {
                    numRoutesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    altitudeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    latitudeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    longitudeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenXAxis === "latitude") {
                    numRoutesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    altitudeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    latitudeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    longitudeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    numRoutesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    altitudeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    latitudeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    longitudeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // y-axis labels event listener
    yLabelsGroup.selectAll("text")
        .on("click", function() {
            // Get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // Replaces chosen YAxis with value
                chosenYAxis = value;

                // DEBUGGER TO CHECK VALUES
                // console.log(chosenYAxis)

                // Functions here found above csv import
                // Updates y scale for new data
                yLinearScale = yScale(airportData, chosenYAxis);

                // Updates y axis with transition
                yAxis = yRenderAxes(yLinearScale, yAxis);

                // Updates circles with new y values
                circlesGroup = yRenderCircles(circlesGroup, yLinearScale, chosenYAxis);


                // Updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Changes classes to change bold text
                if (chosenYAxis === "airport_rating") {
                    ratingLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    numRatingsLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    ratingLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    numRatingsLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }

            }
        });

});