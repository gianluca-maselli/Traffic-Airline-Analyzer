//for flights information
var c_mouseover = function(d) {
    //console.log(d)
    Tooltip
        .style("opacity", 1)
    d3.select(this)
        .style("stroke", "#22AED1")
        .style("opacity", 1)
}
var c_mousemove = function(d) {
    Tooltip.html("<p> Airline: " + d[0][0] + "</p> <p> Source Airport: " + d[0][3] + "</p> <p> Destination Airport: " + d[0][5])
            .style("left", (d3.event.pageX+7) + "px")		
            .style("top", (d3.event.pageY-90) + "px");	
    
}
var c_mouseleave = function(d) {
    Tooltip
        .style("opacity", 0)
    d3.select(this)
        .style("stroke", "#0C8346")
        .style("opacity", 0.8)
}
//-------------------------------------
var a_mouseover = function(d) {
    //console.log(d)
    Tooltip
        .style("opacity", 1)
    d3.select(this)
        .style("stroke", "#22AED1")
        .style("opacity", 1)
    }
var a_mousemove = function(d) {
    console.log(d)
    Tooltip.html("<p> Airline: " + d[0][1] + "</p> <p> Source country: " + d[0][0] + "</p> <p> Destination City,Country: " + d[0][3] +", " + d[0][4] )
            .style("left", (d3.event.pageX+7) + "px")		
            .style("top", (d3.event.pageY-90) + "px");	
    
}
var a_mouseleave = function(d) {
    Tooltip
        .style("opacity", 0)
    d3.select(this)
        .style("stroke", "#0C8346")
        .style("opacity", 0.8)
}

function outline_routes(iata,airportId,links2){
    //console.log(links2[0])
    to_color = []
    for(i=0;i<links2.length;i++){
        iata_air = links2[i][0][0]
        air_id = links2[i][0][2]
        if(iata==iata_air && airportId == air_id){
           to_color.push(links2[i])
        }
    }
    //console.log(to_color)
    svg.selectAll("#flights_d").remove()
    svg.selectAll("flights_d")
            .data(to_color)
            .enter()
            .append("g")
            .append("path")
            .attr("id","flights_color")
            .attr("d", function(x) { 
            
                return path(x[1])
            })
                .style("fill", "none")
                .style("stroke", "#0C8346")
                .style("stroke-width", 0.1)
            .on("mouseover", c_mouseover)
            .on("mousemove", c_mousemove)
            .on("mouseleave", c_mouseleave)
}

function outline_routes_countries(airlineID,iata,country,airlines,airports,links2,country_coords){
    //console.log(country_coords)
    info = get_c_info(country,links2, airports)
    source = [+country_coords[1],+country_coords[0]]
    //console.log(info)
    var dest = []
    for(s=0;s<info.length;s++){
        destAndAirl = info[s].dest_air_ids
        if(destAndAirl.length>=1){
            destForAirline = get_destAir_f_Airlines(airlineID,destAndAirl)
            dest.push(destForAirline)
            //console.log(destForAirline)
        }
    }
        
    //console.log(dest)
    var all_air_dest = []
    for(h=0;h<dest.length;h++){
        inside_arr = dest[h]
        for(b=0;b<inside_arr.length;b++){
            all_air_dest.push(inside_arr[b])
        }
    }
    //console.log(all_air_dest)
    // outlines routes countries
    var c_to_air = []
    links_routes = []
    for(u=0;u<all_air_dest.length;u++){
        destID = all_air_dest[u]
        for(z=0;z<airports.length;z++){
            if(destID == airports[z].Airport_ID){
                air_name =  airports[z].Airport_Name
                air_city = airports[z].City 
                air_c = airports[z].Country
                lat_dest = airports[z].Latitude
                long_dest = airports[z].Longitude
                target = [+long_dest,+lat_dest]
                break
            }
        }
        
        c_to_air = [country,iata,air_name, air_city,air_c]
        topush = {type: "LineString", coordinates: [source, target]}
        links_routes[u] = [c_to_air, topush]

    }
    console.log(links_routes)
    svg.selectAll("#flights_d").remove()
    svg.selectAll("#flights_c").remove()

    svg.selectAll("flights_d")
            .data(links_routes)
            .enter()
            .append("g")
            .append("path")
            .attr("id","flights_color")
            .attr("d", function(x) { 
            
                return path(x[1])
            })
                .style("fill", "none")
                .style("stroke", "#0C8346")
                .style("stroke-width", 0.1)
            .on("mouseover", a_mouseover)
            .on("mousemove", a_mousemove)
            .on("mouseleave", a_mouseleave)
}

function get_c_info(country,links2, airports){
    country_airports = get_country_airports(country,airports)
    var source_country = {
        'name':country,
        'airports':country_airports
    }
    var infos = []
    var source_air_country_Dest = {}
    for(l=0;l<source_country.airports.length;l++){
        source_air_id = source_country.airports[l]
        
        var dest_airs = []
        for(i=0;i<links2.length;i++){
            source_id = links2[i][0][2]
            if(source_air_id == source_id){
                //put airline id + destination airport
                dest_airs.push([links2[i][0][1],links2[i][0][4]])
                
                
            }
        }
        source_air_country_Dest = {
            'id_source_c_air': source_air_id,
            'dest_air_ids': dest_airs
        }
        infos.push(source_air_country_Dest)
    }
    return infos
}

function get_destAir_f_Airlines(id_air,array){
    var dest_for_airlines = []
    var airlineAndDest = {}
    for(m=0;m<array.length;m++){
        airlinesIDs= array[m][0]
        if(id_air ==  airlinesIDs){
            dest_for_airlines.push(array[m][1])
        }
       
    }
    
    return dest_for_airlines
}

