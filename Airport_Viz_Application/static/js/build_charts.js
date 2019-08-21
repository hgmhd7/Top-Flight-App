function interimAirports(airports) {
    return airports;
}

function interimRoutes(routes) {
    return routes;
}

function combineAll() {

    finalAirports = interimAirports();
    finalRoutes = interimRoutes();

    return [finalAirports, finalRoutes];

}



function getAirports() {
    const COUNTRY = 'United States';
    const OPACITY = 0.1;

    const myGlobe = Globe()
        (document.getElementById('globeViz'))

    .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
        .pointOfView({
            lat: 39.6,
            lng: -98.5,
            altitude: 2
        }) // aim at continental US centroid

    .arcLabel(d => `${d.airline}: ${d.srcIata} &#8594; ${d.dstIata}`)
        .arcStartLat(d => +d.srcAirport.latitude)
        .arcStartLng(d => +d.srcAirport.longitude)
        .arcEndLat(d => +d.dstAirport.latitude)
        .arcEndLng(d => +d.dstAirport.longitude)
        .arcDashLength(0.25)
        .arcDashGap(1)
        .arcDashInitialGap(() => Math.random())
        .arcDashAnimateTime(4000)
        .arcColor(d => [`rgba(0, 255, 0, ${OPACITY})`, `rgba(255, 0, 0, ${OPACITY})`])
        .arcsTransitionDuration(0)

    .labelLat(d => +d.latitude)
        .labelLng(d => +d.longitude)
        .labelText(d => "")
        .labelLabel(d => d.name)
        .labelSize(d => 0)
        .labelDotRadius(d => +d.altitude / 25000)
        .labelColor(() => 'orange')
        .labelResolution(2)
        .onLabelClick(d => window.open("http://www.google.com"))
        // .onLabelClick(d => window.open(d.name))

    // .pointColor(() => 'orange')
    //     .pointAltitude(0)
    //     .pointRadius(0.02)
    //     .pointsMerge(true);

    // load data

    var airportdata;
    var routedata;
    Promise.all([
        fetch('/airports').then(response => response.json()).then(data => {
            console.log("Airport Promise In Progress");
            airportdata = data;
        }),
        fetch('/routes').then(response => response.json()).then(data => {
            console.log("Routes Promise In Progress");
            routedata = data;
        })
    ]).then(([airports, routes]) => {

        //console.log(airports);
        // console.log(routedata);
        const byIata = indexBy(airportdata, 'IATA', false);

        // console.log(byIata);

        const filteredRoutes = routedata
            .filter(d => byIata.hasOwnProperty(d.srcIata) && byIata.hasOwnProperty(d.dstIata)) // exclude unknown airports
            .filter(d => d.stops === 0) // non-stop flights only
            .map(d => Object.assign(d, {
                srcAirport: byIata[d.srcIata],
                dstAirport: byIata[d.dstIata]
            }))
            .filter(d => d.srcAirport.country === COUNTRY && d.dstAirport.country !== COUNTRY); // international routes from country

        console.log(airportdata);
        myGlobe
            .labelsData(airportdata)
            .arcsData(filteredRoutes);
    });
}




function endpoints() {
    var airports, routes;
    //airports =  d3.json("/airports").then((datain) => {



    //     interimAirports(airports);
    //});
    // d3.json("/routes").then((datain) => {

    //     routes = datain;

    //     interimRoutes(routes);
    // })

    airports = d3.json("/airports").then((datain) => { ap = datain; });
    console.log(airports);

}

//endpoints();
//var airportdata, routedata = combineAll();
getAirports();