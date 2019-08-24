
// Create globe builder
const myGlobe = Globe()
    (document.getElementById('globeViz'))
    // Get the image wrapper to render our 3D globe
    .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')



    // Start POV over the USA
    .pointOfView({
        lat: 39.6,
        lng: -98.5,
        altitude: 2
    })



    //Attatch archs
    .arcStartLat(d => +d.srcAirport.latitude)
    .arcStartLng(d => +d.srcAirport.longitude)
    .arcEndLat(d => +d.dstAirport.latitude)
    .arcEndLng(d => +d.dstAirport.longitude)
    .arcDashLength(0.25)
    .arcDashGap(1)
    .arcDashInitialGap(() => Math.random())
    .arcDashAnimateTime(4000)
    .arcColor(d => [`rgba(0, 255, 0, ${0.1})`, `rgba(255, 0, 0, ${0.1})`])
    .arcsTransitionDuration(0)


    //Attatch labels
    .labelLat(d => +d.latitude)
    .labelLng(d => +d.longitude)
    .labelText(d => "")
    .labelSize(d => 0)
    .labelDotRadius(d => scale_ratings(+d.airport_rating))
    .labelColor(() => 'orange')
    .labelResolution(5)
    .onLabelClick(d => visit_website(d.website))
    .labelLabel(d => ` <b>Name: ${d.name} </b> <br/>
                       <b>Country: ${d.country} </b> <br/>
                       <b>Rating: ${d.airport_rating} </b> <br/>
                       <b>Number of ratings: ${d.number_ratings}`);


//UNUSED CODE KEPT IN FOR FUTURE REFERENCE
//  // Attatch points
//  .pointLat(d => +d.latitude)
//  .pointLng(d => +d.longitude)
//  .pointAltitude(d => scale_height(+d.airport_rating))
//  .pointRadius(d => scale_ratings(+d.airport_rating))
//  .pointColor(() => 'orange')
//  .pointLabel(d => d.google_airport_name)





// Add auto-rotation
myGlobe.controls().autoRotate = true;
myGlobe.controls().autoRotateSpeed = 0.4;


// Function to auto scale our labels according to the airpot rating
function scale_ratings(rating) {

    // Abriviatted switch case clase to change label sizes
    return rating > 4 ? rating / 8 :
        rating > 3 ? rating / 16 :
            rating > 2 ? rating / 24 :
                rating > 1 ? rating / 32 :
                    rating / 64;

    // return rating > 4 ? rating / 12 :
    //         rating > 3 ? rating / 24 :
    //         rating > 2 ? rating / 36 :
    //         rating > 1 ? rating / 48 :
    //         rating / 96 ;

}


//UNUSED FUNCTION KEPT IN FOR FUTURE REFERENCE
// function scale_height(rating){

//     return rating > 4 ? rating / -320000 :
//            rating > 3 ? rating / -640000 :
//            rating > 2 ? rating / -960000 :
//            rating > 1 ? rating / -1280000 :
//            rating / -2560000;

//     // return rating > 4 ? rating / 12 :
//     //         rating > 3 ? rating / 24 :
//     //         rating > 2 ? rating / 36 :
//     //         rating > 1 ? rating / 48 :
//     //         rating / 96 ;

//     }



// Function to visite the airports websie on right click of a node
// If there is no website, we default to Google.com
function visit_website(website) {

    if (website !== "not found") {

        window.open(website);
    } else {
        window.open("https://www.expedia.com");
    }

}

// Function to travel around the world using a series of longitudes and latitudes for eack specified country of contenent
function visit_region(location) {

    // Switch case for flying to selected locations 
    switch (location) {

        // North America
        case "NA":
            coordinates = { lat: 40.5, lng: -98.5, altitude: 2 }
            break;

        case "Cd":
            coordinates = { lat: 60.1, lng: -106.3, altitude: 0.67 }
            break;
        case "US":
            coordinates = { lat: 37.1, lng: -98.1, altitude: 0.7 }
            break;
        case "Mx":
            coordinates = { lat: 23.6, lng: -102.6, altitude: 0.54 }
            break;



        // South America
        case "SA":
            coordinates = { lat: -15.8, lng: -61.0, altitude: 2 }
            break;

        case "Bz":
            coordinates = { lat: -14.2, lng: -51.9, altitude: 0.47 }
            break;
        case "Pru":
            coordinates = { lat: -9.2, lng: -75.0, altitude: 0.6 }
            break;
        case "Arg":
            coordinates = { lat: -34.4, lng: -63.6, altitude: 0.6 }
            break;


        //Africa
        case "AF":
            coordinates = { lat: 4, lng: 20.5, altitude: 2 }
            break;

        case "Egy":
            coordinates = { lat: 26.8, lng: 30.8, altitude: 0.6 }
            break;
        case "Saf":
            coordinates = { lat: -30.6, lng: 22.9, altitude: 0.6 }
            break;
        case "Mc":
            coordinates = { lat: 31.8, lng: -7.1, altitude: 0.6 }
            break;
        case "Ng":
            coordinates = { lat: 9.1, lng: 8.7, altitude: 0.6 }
            break;


        // Asia
        case "AS":
            coordinates = { lat: 34.0, lng: 90.6, altitude: 2 }
            break;
        case "Hk":
            coordinates = { lat: 22.3, lng: 114.2, altitude: .4 }
            break;
        case "Mly":
            coordinates = { lat: 4.2, lng: 102, altitude: .6 }
            break;
        case "Ch":
            coordinates = { lat: 35.9, lng: 104.2, altitude: .7 }
            break;
        case "Ind":
            coordinates = { lat: 20.6, lng: 79, altitude: .7 }
            break;
        case "Jp":
            coordinates = { lat: 36.2, lng: 138.3, altitude: .4 }
            break;


        // Europe            
        case "EU":
            coordinates = { lat: 48.5, lng: 15.3, altitude: 2 }
            break;

        case "Grm":
            coordinates = { lat: 55.2, lng: 10.5, altitude: 0.25 }
            break;
        case "Fr":
            coordinates = { lat: 46.2, lng: 2.2, altitude: 0.25 }
            break;
        case "Uk":
            coordinates = { lat: 55.3, lng: 3.4, altitude: 0.25 }
            break;


        // Australia            
        case "AU":
            coordinates = { lat: -28.3, lng: 133.8, altitude: 2 }
            break;

        case "Brs":
            coordinates = { lat: -27.5, lng: 153.0, altitude: 0.4 }
            break;
        case "Dar":
            coordinates = { lat: -12.5, lng: 130.8, altitude: 0.44 }
            break;
        case "Mel":
            coordinates = { lat: -37.8, lng: 145, altitude: 0.33 }
            break;
        default:

    }

    //Debugger to make sure the location was captured correctly
    console.log(location);


    // Focus on new location in a 3000ms transition and stop the spinning of the globe
    myGlobe
        .pointOfView(coordinates, 3000)
        .controls().autoRotate = false;
}


// Function to go back to the spinning overview of the globe
function entire_world(location) {

    // Debugger to 
    console.log(location);
    MAP_CENTER_2 = { lat: 39.6, lng: -98.5, altitude: 2 };
    myGlobe
        .pointOfView(MAP_CENTER_2, 2000)
        .controls().autoRotate = true;
}



function getAirports() {

    // load data using promises to fetch the JSON data
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

        // DEBUGGER TO CHECK THE DATA
        // console.log(airportdata);
        // console.log(routedata);


    ]).then(([airports, routes]) => {

        // DEBUGGER TO CHECK THE DATA
        // console.log(airports);
        // console.log(routedata);

        // Rearrange the data to make the IATA the unique key
        const byIata = indexBy(airportdata, 'IATA', false);

        // DEBUGGER TO CHECK THE DATA
        // console.log(byIata);

        // Filter the routes data to show nonstop flights to legitimate airports
        const filteredRoutes = routedata
            .filter(d => byIata.hasOwnProperty(d.srcIata) && byIata.hasOwnProperty(d.dstIata)) // exclude unknown/ undefined airports
            .filter(d => d.stops === 0) // pull in non-stop flights only
            .map(d => Object.assign(d, {
                srcAirport: byIata[d.srcIata],
                dstAirport: byIata[d.dstIata]
            }))

        // DEBUGGER TO TOGGLE INTERNATIONAL ROUTES FOR QUICKER RUNTIME DURING TESTS
        // .filter(d => (d.srcAirport.country === "United States" && d.dstAirport.country !== "United States")); 

        // DEBUGGER TO RUN VISUAL WITH A SMALLER AMOUNT OF DATA FOR FASTER TESTING
        // const filtered_airports = airportdata
        //     .filter(d => d.country === "United States");


        // DEBUGGER TO CHECK THE DATA
        // console.log(airportdata);

        // Call the globe builder function and append the data
        myGlobe
            .labelsData(airportdata)
            .arcsData(filteredRoutes);
        // .pointsData(airportdata);
    });
}


// Initiate code
getAirports();