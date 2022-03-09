
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
                                .style("left", (d3.event.pageX+2) + "px")		
                                .style("top", (d3.event.pageY-20) + "px");	
                        
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

 //for country_flights information
 var country_mouseover = function(d) {
    Tooltip
        .style("opacity", 1)
    d3.select(this)
        .style("stroke", "blue")
        .style("opacity", 1)
}
var country_mousemove = function(d) {
    Tooltip.html("<p> Source country: " + d[0][0] + "</p> <p> Destination country: " + d[0][1])
            .style("left", (d3.event.pageX+10) + "px")		
            .style("top", (d3.event.pageY+10) + "px");	
    
}
var country_mouseleave = function(d) {
    Tooltip
        .style("opacity", 0)
    d3.select(this)
        .style("stroke", "#756bb1")
        .style("opacity", 0.8)
}

//empy map initialization
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
        svg_scatter.selectAll("*").remove()
            
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
                //console.log(x[1])
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

//COUNTRY FUNCTIONS ------------------------------------------------
function c_click(d,links, airports,centroids_dict){
    if(last_clicked != d || last_clicked == d ){
        last_clicked = ""
        svg.selectAll("#flights_c").remove()
        svg_air_inf.selectAll("*").remove()
        svg_bar.selectAll("*").remove()
        svg_heat.selectAll("*").remove()
        svg_heat.selectAll("*").remove()
    }
    
    tot_departures = c_departures(d.country,links, airports,centroids_dict)
    //arrivals(d.IATA, links)
    // all_flights(d.IATA, links)
    //var tot = tot_dep_arr(d.Airport_ID,links)
    last_clicked = d
    return tot_departures;
}





function c_departures(country,links, airports,centroids_dict){
    
    links_c = country_departures(country,links, airports,centroids_dict)
    links_country = links_c[0]
    tot_departures = links_c[1]
    //console.log('qui--->',links_country)
       
    svg.selectAll("air_flights_c")
            .data(links_country)
            .enter()
            .append("g")
            .append("path")
            .attr("id","flights_c")
            .attr("d", function(s) { 
                //console.log(s[1])
                return path(s[1])
            })
            .style("fill", "none")
            .style("stroke", "#756bb1")
            .style("stroke-width", 0.1)
            .on("mouseover", country_mouseover)
            .on("mousemove", country_mousemove)
            .on("mouseleave", country_mouseleave)
    
    return tot_departures;
}

function country_departures(country,links, airports,centroids_dict){
    info = get_country_info(country,links, airports)
    infos = info[0]
    tot_departures = info[1]
    tot_arrivals = info[2]
    //console.log(tot_departures,tot_arrivals)
    //console.log(infos)
    all_dest = []
    notFound = []
    notFound1 = []
    for(j=0;j<infos.length;j++){
        arr = infos[j].dest_air_ids
        for(v=0;v<arr.length;v++){
            if(isNaN(arr[v])){continue;}
            country_dest = get_countryByIdAir(arr[v],airports)
            if(country_dest == null){notFound.push(arr[v])}
            //console.log(arr[v],country_dest)
            all_dest.push(country_dest)
            //}
            
        }
    }
    //console.log(all_dest)
    //console.log(notFound)
    //console.log(notFound1)
    var destination_countries = []
    $.each(all_dest, function(i, el){
        if($.inArray(el, destination_countries) === -1) destination_countries.push(el);
    });
    //console.log(destination_countries)
    
    
    source_country_centroids = get_Country_centroids(country,centroids_dict)
    
    //console.log(source_country_centroids)
    path_country = []
    link = []
    for(n=0;n<destination_countries.length;n++){
        dest_c = destination_countries[n]
        if(dest_c == 'Burma'){ 
            dest_c = 'Myanmar'}
        if(dest_c == 'Virgin Islands'){ 
            dest_c = 'United States Virgin Islands'}
        if(dest_c == 'South Sudan'){ 
                dest_c = 'Sudan'}
        if(dest_c == 'Cocos (Keeling) Islands'){
            dest_c = 'Cocos Islands'
        }     
        centroid_dest = get_Country_centroids(dest_c,centroids_dict)
        source_dest = [country,dest_c]
        topush = {type: "LineString", coordinates: [source_country_centroids, centroid_dest]}
        path_country.push(topush)
        link[n] = [source_dest, topush]
    }
    country_info(country,tot_departures,tot_arrivals)
    //console.log(link)
    return [link,tot_departures]
    
    

}

function get_countries_airports(countries,airports){
     
    country_airports = {}
    list_country_airps = []
    
    for(i=0;i<countries.length;i++){
        c_name = countries[i].properties.name
        airps = get_country_airports(c_name,airports)
        country_airports = {
            'country':c_name,
            'airports':airps
        }
        list_country_airps.push(country_airports)
        
    }
    
    //console.log(list_country_airps)
}
function get_country_airports(country_name, airports){
    airps = []
    for(s=0;s<airports.length;s++){
        air_country = airports[s].Country
        if(country_name == air_country){
            airps.push(airports[s].Airport_ID)
        }
    }
    return airps
}
function get_countryByIdAir(id_air,airports){
    var dest_country
    for(i=0;i<airports.length;i++){
        id_A = airports[i].Airport_ID
        if(id_air == id_A){
           dest_country = airports[i].Country
        }
    }
    return dest_country
}
function get_Country_centroids(country,centroids_dict){
    var centroid
    for(i=0;i<centroids_dict.length;i++){
        if(country == centroids_dict[i].country){
            centroid_x = centroids_dict[i].longitude
            centroid_y = centroids_dict[i].latitude
            //console.log(country,centroid_x,centroid_y)
            centroid = [centroid_x,centroid_y]
        }
    }
    return centroid
}

function country_info(country,tot_departures,tot_arrivals){
    svg_air_inf.append("g").attr("id", "info_country_box")
                .append("rect")
                .attr("id", "info_box")
                .attr("x", 5)
                .attr("y", 75)
                .attr("width",167)
                .attr("height", 150)
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
                .attr("y", 115)
                .style("font-size", "15px")
                .text("Country:")
    svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",9)
                .attr("y", 135)
                .style("font-size", "15px")
                .text(country)
            
    svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",9)
                .attr("y", 170)
                .style("font-size", "15px")
                .text("Total departures: " + tot_departures)
                    
    svg_air_inf.append("text")
                .style("fill", "#f0f0f0")
                .attr("x", 9)
                .attr("y", 200)
                .style("font-size", "15px")
                .text("Total arrivals: " + tot_arrivals)
                    
    
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

function get_country_info(country,links, airports){
    country_airports = get_country_airports(country,airports)
    var source_country = {
        'name':country,
        'airports':country_airports
    }
    var infos = []
    var source_air_country_Dest = {}
    var tot_departures = 0
    var tot_arrivals = 0
    for(l=0;l<source_country.airports.length;l++){
        source_air_id = source_country.airports[l]
        
        var dest_airs = []
        for(i=0;i<links.length;i++){
            source_id = links[i][0][1]
            if(source_air_id == source_id){
                dest_airs.push(links[i][0][3])
                tot_departures+=1

            }
            else if(source_air_id == links[i][0][3]){
                tot_arrivals+=1
            }
            
        }
        source_air_country_Dest = {
            'id_source_c_air': source_air_id,
            'dest_air_ids': dest_airs
        }
        infos.push(source_air_country_Dest)
    }
    return [infos,tot_departures,tot_arrivals]
}