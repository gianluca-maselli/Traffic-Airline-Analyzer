
var h = document.getElementById('svg_map').clientHeight
var w = document.getElementById('svg_map').clientWidth

var h_r1 = document.getElementById('body').clientHeight
var h_r2 = document.getElementById('body').clientWidth

var margin = { top:0, left:0, right:0, bottom:0},
        height = h,
        width = w;
    
var zoom = d3.zoom()
            .scaleExtent([1, 20])
            .on("zoom", zoomed)
            .on("end", function(){console.log("finish zoom")});
  
var svg = d3.select("#map").append("svg")
                .attr("id", "svg_div")
                .attr("height",height+ margin.left + margin.right)
                .attr("width", width + margin.left + margin.right)
                .call(zoom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                
                //.attr("transform","translate(-1000,20)scale(13)");       


var svg_air_inf = d3.select("#air_info").append("svg")
                    .attr("id", "svg_infoAir_div")
                    .attr("height",(height + margin.top + margin.bottom)/1.25)
                    .attr("width", 173)
                    .append("g")
                   // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                   .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var last_clicked = "" 
  
var checkedValue = null; 

d3.json("world.topojson",function(data) {
    ready1(data)
});



var projection = //d3.geoEquirectangular()
    d3.geoMercator()
    .scale(100)
    .translate([width/2, height/2])
    .precision(.1);

        
    
    //draw lines for map visualization
var path = d3.geoPath().projection(projection);

var Tooltip = d3.select("#map")
                .append("div")
                .style("position", "absolute")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")

    var mouseover = function(d) {
                        Tooltip
                            .style("opacity", 1)
                        d3.select(this)
                            .style("stroke", "red")
                            .style("opacity", 1)
                    }
    var mousemove = function(d) {
                        Tooltip.html("<p> " + d.Airport_Name + " </p> <p> IATA: " + d.IATA + "</p> <p>" + d.City + ", " + d.Country + "</p>")
                                .style("left", (d3.event.pageX+20) + "px")		
                                .style("top", (d3.event.pageY+10) + "px");	
                        
                    }
    var mouseleave = function(d) {
                        Tooltip
                            .style("opacity", 0)
                        d3.select(this)
                            .style("stroke", "none")
                            .style("opacity", 0.8)
                    }

    //for flights information
    var f_mouseover = function(d) {
                        Tooltip
                            .style("opacity", 1)
                        d3.select(this)
                            .style("stroke", "blue")
                            .style("opacity", 1)
                    }
    var f_mousemove = function(d) {
                        Tooltip.html("<p> Airline: " + d[0][0] + "</p> <p> Source Airport: " + d[0][2] + "</p> <p> Destination Airport: " + d[0][4])
                                .style("left", (d3.event.pageX+10) + "px")		
                                .style("top", (d3.event.pageY+10) + "px");	
                        
                    }
    var f_mouseleave = function(d) {
                        Tooltip
                            .style("opacity", 0)
                        d3.select(this)
                            .style("stroke", "#756bb1")
                            .style("opacity", 0.8)
                    }
function ready1(data){
    
    var countries = topojson.feature(data,data.objects.countries).features
    // MAP BUILDING ---------------
        svg.selectAll(".country_init")
                .data(countries)
                .enter()
                .append("g")
                .attr("id","init_map")
                .append("path")
                .attr("class", "country")
                .attr("d",path) //coordinates of country borders
                .style("stroke", "#fff")
                .style("stroke-width", "0.2")
                .attr("fill", "#b8b8b8")
}
/*
function ready(error, data, airports, routes2, airlines,worldCountry){
    //console.log(data)
    var countries = topojson.feature(data,data.objects.countries).features
    //console.log(countries)

    //AIRLINE ROUTES CONNECTION --------------------
    links = drawFlights(routes2)
    //console.log(links[0])
    random_air = airports[Math.floor(Math.random() * airports.length)];
    rand_name = air_len(random_air.Airport_Name)
    rand_tot = tot_dep_arr(random_air.Airport_ID, links)
    
    
    
    /* IATA NON UNIVOCO, USARE ID AEREPORTO 
    var j=0;
    var k = 0;
    for(l=0;l<airports.length;l++){
        air_id = airports[l].Airport_ID
        for(i=0;i<links.length;i++){
           if(air_id == links[i][0][1]){
                j++
            }
            if(air_id == links[i][0][3]){
                k++
            }
        
        }
    }
    var tot_dep = j
    var tot_arr = k
    console.log("dep: " + tot_dep, "arr: "+tot_arr)

    var j=0;
    var k = 0;
    for(l=0;l<airports.length;l++){
        air_iata = airports[l].IATA
        for(i=0;i<links.length;i++){
           if(air_iata == links[i][0][2]){
                j++
            }
            if(air_iata == links[i][0][4]){
                k++
            }
        
    }
    }
    var tot_dep = j
    var tot_arr = k
    console.log("dep: " + tot_dep, "arr: "+tot_arr)
    
    
    // MAP BUILDING ---------------
    svg.selectAll(".country")
        .data(countries)
        .enter().append("path")
        .attr("class", "country")
        .attr("d",path) //coordinates of country borders
        .style("stroke", "#fff")
        .style("stroke-width", "0.2")
        .attr("fill", "#b8b8b8")
            //.attr("fill", function(d){
              // return d.properties.color --> COLOR EACH COUNTRY DIFFENTLY
              
           // })
        
        .on("mouseover", function(d){
            d3.select(this).classed("selected", true);
                //qui qualcosa si può inserire per quando si cliccal una nazione
                // si potrebbe zoommare sulla nazione e vedere gli aereoporti ed i suoi collegamenti
                // le classi si gestiscono poi nel css per dare effetti

            })
            .on("mouseout", function(d){
                d3.select(this).classed("selected", false);
    
            })
            //aggiungere ora gli aereoporti
           // .on("onclick", function(d){
            //    svg.call(zoom);
           // })
            
            //console.log(airports)

            //COUNTRY NAMES --------
            /*
            svg.selectAll("country_names")
                .data(countries)
                .enter()
                .append("text")
                .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .text(function(d) { return d.properties.name; });
            
        
            //AIRPORTS POINTS --------------------------
            svg.selectAll(".world-airports")
                .data(airports)
                .enter()
                .append("circle")
                    .attr("r", 0.2)
                    .attr("cx", function(d){
                    //define latitude to map in the screen
                    //the projection is needed to pass from the real world to the flat one on the screen
                        var coords = projection([d.Longitude, d.Latitude])
                    //console.log(coords)
                        return coords[0] //longitude;
                        })
                    .attr("cy", function(d){
                        var coords = projection([d.Longitude, d.Latitude])
            
                        return coords[1] //latitude;
                    })
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                .on("click", function(d){
                    
                    //continuare da qui
                    tot_d_a = f_click(d,links,airports)
                   // console.log(tot_d_a)
                    if(tot_d_a[0]>0){
                        //barplot design
                        barPlot(routes2, airlines,d.Airport_ID)
                        heatMap(data,links,d.Airport_ID, airports,worldCountry)
                    }
                    else{
                        missing()
                    }
                  })
            
            //FIRST AIRPORT RANDOMLY INITIALIZED
            svg_air_inf
                .append("rect")
                .attr("id", "info_box")
                .attr("x", 5)
                .attr("y", 2)
                .attr("width",165)
                .attr("height", 250)
                .attr("rx", 8)
                .attr('fill','#3182bd')
                .attr("opacity",0.7)
                .attr('stroke-width',2)
                .attr('stroke','black')
                .style("border-width", "5px")
                .style("border-radius", "5px")
                .style("padding", "5px")
            svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",9)
                .attr("y", 30)
                .style("font-size", "15px")
                .text("Airport Name:")
            svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",9)
                .attr("y", 50)
                .style("font-size", "15px")
                .text(rand_name)
            
            svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",9)
                .attr("y", 80)
                .style("font-size", "15px")
                .text("IATA: " + random_air.IATA)
                    
            svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x", 9)
                .attr("y", 110)
                .style("font-size", "15px")
                .text("City: ")
                    
            svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x", 9)
                .attr("y", 130)
                .style("font-size", "15px")
                .text(random_air.City)
                    
            svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x", 9)
                .attr("y", 160)
                .style("font-size", "15px")
                .text("Country: ")
                    
            svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x", 9)
                .attr("y", 180)
                .style("font-size", "15px")
                .text(random_air.Country)
            svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x", 9)
                .attr("y", 210)
                .style("font-size", "15px")
                .text("Total departures: " + rand_tot[0])
                    
            svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x", 9)
                .attr("y", 230)
                .style("font-size", "15px")
                .text("Total arrivals: " + rand_tot[1])

                
                
                
                
                        
            
            //FLIGH PATHS creation ---------------------------       
        //    svg.selectAll(".flights")
        //        .data(links)
        //        .enter()
        //        .append("path")
        //            .attr("d", function(d){ return path(d[1])})
        //            .style("fill", "none")
        //            .style("stroke", "#756bb1")
        //            .style("stroke-width", 0.1)
        //        .on("mouseover", f_mouseover)
        //        .on("mousemove", f_mousemove)
        //        .on("mouseleave", f_mouseleave)
    }
    */
function zoomed() {
    svg.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");
        
}
    //lat_source_air,
    //long_source_air,
    //lat_dest_air,
    //long_dest_air
    function drawFlights(flights_database){
        var link = []
        //good version
      //  flights_database.forEach(function(row){
      //      //source airport
      //      lat_s_air = row.lat_source_air
      //      long_s_air = row.long_source_air
      //      source = [+long_s_air,+lat_s_air]
            //destination airport
      //      lat_d_air = row.lat_dest_air
      //      long_d_air = row.long_dest_air
      //      target = [+long_d_air,+lat_d_air]
            
      //      topush = {type: "LineString", coordinates: [source, target]}
      //      link.push(topush)
      //  })
      //version handle partial dataset
        for(i=0; i<flights_database.length;i++){
            row = flights_database[i]
            airline = row.airline
            source_air_ID=row.source_airport_id

            source_name = row.source_airport
            lat_s_air = row.lat_source_air
            long_s_air = row.long_source_air

            source = [+long_s_air,+lat_s_air]

            dest_air_ID=row.destination_airport_id
            dest_name = row.destination_airport
            lat_d_air = row.lat_dest_air
            long_d_air = row.long_dest_air
            target = [+long_d_air,+lat_d_air]
            
            source_dest = [airline, source_air_ID, source_name, dest_air_ID, dest_name]
            topush = {type: "LineString", coordinates: [source, target]}
            link[i] = [source_dest, topush]
            
        }
        
        return link;
    }
    
    // calculates the distance between two nodes
    // sqrt( (x2 - x1)^2 + (y2 - y1)^2 )
    function distance(source, target){
        const dx2 = Math.pow(target.x - source.x, 2);
        const dy2 = Math.pow(target.y - source.y, 2);
        return Math.sqrt(dx2 + dy2);
    }
 

function f_click(d, links, airports){
    if(last_clicked != d || last_clicked == d ){
        last_clicked = ""
        svg.selectAll("#flights_d").remove()
        svg.selectAll("#flights_color").remove()
        svg_air_inf.selectAll("*").remove()
        svg_bar.selectAll("*").remove()
        svg_heat.selectAll("*").remove()
            
    }
    airport_info(d,airports)
    departures(d.Airport_ID, links)
    //arrivals(d.IATA, links)
    // all_flights(d.IATA, links)
    var tot = tot_dep_arr(d.Airport_ID,links)
    last_clicked = d
    return tot;
}

function departures(air_id,links){
    arr = []
    j = 0
    for(i=0; i<links.length;i++){
        if(air_id == links[i][0][1]){
            arr[j] = links[i]
            j++
        }
    }
       
    svg.selectAll("air_flights_d")
            .data(arr)
            .enter()
            .append("g")
            .append("path")
            .attr("id","flights_d")
            .attr("d", function(x) { 
            
                return path(x[1])
            })
                .style("fill", "none")
                .style("stroke", "#756bb1")
                .style("stroke-width", 0.1)
                        
            .on("mouseover", f_mouseover)
            .on("mousemove", f_mousemove)
            .on("mouseleave", f_mouseleave)
            
        
}
function airport_info(d,airports){
    var info = air_info(d, airports)
    var dep_arr = tot_dep_arr(d.Airport_ID,links)
    a_name = air_len(info.name)
    svg_air_inf.append("g").attr("id", "info_box")
                .append("rect")
                .attr("id", "info_box")
                .attr("x", 5)
                .attr("y", 2)
                .attr("width",165)
                .attr("height", 250)
                .attr("rx", 8)
                .attr('fill','#3182bd')
                .attr("opacity",0.7)
                .attr('stroke-width',2)
                .attr('stroke','black')
                .style("border-width", "5px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                  
    svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",9)
                .attr("y", 30)
                .style("font-size", "15px")
                .text("Airport Name:")
    svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",9)
                .attr("y", 50)
                .style("font-size", "15px")
                .text(a_name)
            
    svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",9)
                .attr("y", 80)
                .style("font-size", "15px")
                .text("IATA: " + info.iata)
                    
    svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x", 9)
                .attr("y", 110)
                .style("font-size", "15px")
                .text("City: ")
                    
    svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x", 9)
                .attr("y", 130)
                .style("font-size", "15px")
                .text(info.city)
                    
    svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x", 9)
                .attr("y", 160)
                .style("font-size", "15px")
                .text("Country: ")
                    
    svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x", 9)
                .attr("y", 180)
                .style("font-size", "15px")
                .text(info.country)
    svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x", 9)
                .attr("y", 210)
                .style("font-size", "15px")
                .text("Total departures: " + dep_arr[0])
                    
    svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x", 9)
                .attr("y", 230)
                .style("font-size", "15px")
                .text("Total arrivals: " + dep_arr[1])
}

function air_info(d,airports){
    
    airports.forEach(function(row){
        if(row.Airport_ID == d.Airport_ID){
            info_air = {
                name: row.Airport_Name,
                iata: row.IATA,
                city: row.City,
                country: row.Country

            };
        }
    })
    
    return info_air
}

/*
function arrivals(iata,links){
    arr_a = []
    j = 0
    s = iata

    for(i=0;i<links.length;i++){
        if(s == links[i][0][2]){
            arr_a[j] = links[i]
            j++
        }
    }
    console.log("arrivals" +arr_a.length)
        
    svg.selectAll("air_flights_a")
            .data(arr_a)
            .enter()
            .append("g")
            .append("path")
            .attr("id","flights_a")
            .attr("d", function(x) { 
            
                return path(x[1])
            })
                .style("fill", "none")
                .style("stroke", "#31a354")
                .style("stroke-width", 0.1)
                        
            .on("mouseover", f_mouseover)
            .on("mousemove", f_mousemove)
            .on("mouseleave", f_mouseleave)
            
        
}
*/

function tot_dep_arr(air_id,links){
    j = 0
    k = 0
    tot = []
    //departures
    for(i=0;i<links.length;i++){
        if(air_id == links[i][0][1]){
            j++
        }
        if(air_id == links[i][0][3]){
            k++
        }

    }
    var tot_dep = j
    var tot_arr = k
    tot = [tot_dep,tot_arr]
    return tot;
}

function air_len(air_name){
    var rand_name = ""
    if(air_name.length > 17){
        for(i=0; i<17; i++){
            rand_name += air_name[i]
        }
        
     }
     else{
         rand_name = air_name
     }
    rand_name = rand_name+"..."
    return rand_name
}


