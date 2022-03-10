var h_t = document.getElementById('svg_heat_div').clientHeight
var w_t = document.getElementById('svg_heat_div').clientWidth

width_t = w_t/1
height_t = h_t/1

var margin_h = { top:0, left:100, right:0, bottom:0}

var projectionHeat = d3.geoNaturalEarth1()
    .scale(width / 1.4 / Math.PI)
    .translate([width / 2, height / 2])
    .rotate([0, 0])
    .center([0, 0])
    .precision(.1);

var zoom_heat = d3.zoom()
                    .scaleExtent([1, 20])
                    .on("zoom", zoomed_heat)
                    .on("end", function(){console.log("finish zoom")});
        
    
    //draw lines for map visualization
var pathHeat = d3.geoPath().projection(projectionHeat);

var svg_heat = d3.select("#svg_heatmap")
            .append("svg")
            .attr("width", width_t)
            .attr("height", height_t)
            .call(zoom_heat)
            .append("g")
            .attr("transform","translate(" + margin_h.left + "," + margin_h.top + ")");


var svg_legend = d3.select("#svg_heat_legend").append("svg")
            .attr("height",(height + margin.top + margin.bottom)/2.15)
            .attr("width", 153)
            .append("g")
           // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
           .attr("transform", "translate(" + margin_h.left + "," + margin_h.top + ")")


var colour_scale = {  "100+": "#bd0026",
                    "50-100": "#f03b20", 
                    "25-50": "#fd8d3c", 
                    "10-25": "#fecc5c", 
                    "1-10": "#ffffb2", 
                    "0": "#b8b8b8" }

var colour_scale2 = {  "500+": "#bd0026",
                    "250-500": "#f03b20", 
                    "100-250": "#fd8d3c", 
                    "50-100": "#fecc5c", 
                    "1-50": "#ffffb2", 
                    "0": "#b8b8b8" }

/*
var colorScale_country = {  "50+": "#b10026",
                            "40-50": "#e31a1c", 
                            "30-40": "#fc4e2a", 
                            "20-30": "#fd8d3c", 
                            "10-20": "#feb24c", 
                            "1-10": "#fed976", 
                            "0": "#ffffb2"
}*/
var colorScale_country = {  "50+": "#bd0026",
                            "35-50": "#f03b20", 
                            "20-35": "#fd8d3c", 
                            "5-20": "#fecc5c", 
                            "1-5": "#ffffb2", 
                            "0": "#b8b8b8"
}
var colorScale_country2 = {  "100+": "#bd0026",
                            "50-100": "#f03b20", 
                            "25-50": "#fd8d3c", 
                            "10-25": "#fecc5c", 
                            "1-10": "#ffffb2", 
                            "0": "#b8b8b8"
}

var Tooltip_heat = d3.select("#svg_heat_div")
                .append("div")
                .style("position", "absolute")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")



function heatMap(data,links, source_airportId,airports,worldCountry){
    
    //console.log(airports)
    //console.log(worldCountry)
    //console.log(links)
    africa = []
    af= []
    north_america = []
    na = []
    south_america = []
    sa = []
    europe = []
    eu = []
    asia = []
    asi = []
    antarctica = []
    an = []
    oceania = []
    oc = []
    //console.log(airports)
    //notFound = []
    
    for(i=0;i<airports.length;i++){
        air_country = String(airports[i].Country)
        airID = airports[i].Airport_ID
        for(k=0;k<worldCountry.length;k++){
            region = String(worldCountry[k].continent)
            //console.log(region)
            state = String(worldCountry[k].country)
            
            //console.log(state)
            if(air_country == state && region == "AF"){
                africa.push(airID)
                af.push(air_country)
                break
            }
            else if (air_country == state && region == "NA"){
                north_america.push(airID)
                break
            }
            else if (air_country == state && region == "SA"){
                south_america.push(airID)
                break
            }
            else if (air_country == state && region == "EU"){
                europe.push(airID)
                break
            }
            else if (air_country == state && region == "AS"){
                asia.push(airID)
                break
            }
            else if (air_country == state && region == "AN"){
                antarctica.push(airID)
                break
            }
            else if (air_country == state && region == "OC"){
                oceania.push(airID)
                break
            }
            else if(air_country == state && (region != "AF" || region != "SA" || region != "NA" || region != "EU" || region != "AS" || region != "AN" || region != "OC" )){
                notFound.push(airports[i])
                break
            }
            
        }
    }
        //COUNT DESTINATION PER CONTINENT
    destinations = get_departures(source_airportId,links)
    //console.log(destinations)
    country_list = get_departures_country(destinations,airports)
    //console.log(country_list)
    dep_country_n = get_depN_country(country_list)
    console.log(dep_country_n)
    //console.log(africa)
    //console.log(af)
        //console.log(destinations.length)
    AF_count = get_cont_dest(destinations,africa)
    NA_count = get_cont_dest(destinations,north_america)
    SA_count = get_cont_dest(destinations,south_america)
    EU_count = get_cont_dest(destinations,europe)
    AS_count = get_cont_dest(destinations,asia)
    AN_count = get_cont_dest(destinations,antarctica)
    OC_count = get_cont_dest(destinations,oceania) 
    
    /*
        console.log(AF_count)
        console.log(NA_count)
        console.log(SA_count)
        console.log(EU_count)
        console.log(AS_count)
        console.log(AN_count)
        console.log(OC_count) */

    var dict_continent = {
        "AF": AF_count,
        "NA": NA_count,
        "SA": SA_count,
        "EU": EU_count,
        "AS": AS_count,
        "AN": AN_count,
        "OC": OC_count
    }
    console.log(dict_continent)
//c = get_colour(dict_continent,"EU",colour_scale)
//console.log(c)

    //BUILD WORLD CONTINENTS HEATMAP ------------------
    var map_countries = topojson.feature(data,data.objects.countries).features
    //console.log(map_countries)
    /*
    notFound = []
    for(i=0;i<map_countries.length;i++){
        count_name = map_countries[i].properties.name
        for(j=0;j<worldCountry.length;j++){
            c_n = worldCountry[j].country
            if(count_name == c_n){
                break
            }
            else{
                notFound.push(count_name)
                break
            }
        }

    }
    */

    svg_heat.selectAll(".nation")
            .data(map_countries)
            .enter()
            .append("path")
            .attr("d",pathHeat)
        //    .attr("fill","#b8b8b8")
            .attr("fill",function(d){
                col = get_color_continent(dict_continent,d.properties.name,worldCountry)
            //val = dep_country_n[d.properties.name]
            //if(val == null){
            //    val = 0
            //}
            //console.log(d.properties.name, val)
            //console.log(val)
            //return colorScale(val)
            //console.log(count_name)
                return col
            
            })
            .style("stroke", "#252525")
            .style("stroke-width", "0.2")
            .on("mouseover", function(d){
                Tooltip_heat.style("opacity", 1)
                d3.select(this).classed("selected_heat", true);
                
            })
            .on("mousemove", function(d){
                continent = get_continent(d.properties.name, worldCountry)
                Tooltip_heat.html(" <p> Country: " + d.properties.name + "</p> <p> Continent: " + continent + "</p>")
                            .style("left", (d3.event.pageX+20) + "px")		
                            .style("top", (d3.event.pageY+10) + "px");
            })
            .on("mouseout", function(d){
                Tooltip_heat.style("opacity", 0)
                d3.select(this).classed("selected_heat", false);
            })
                                
        svg_legend
            .append("rect")
            .attr("id", "info_box")
            .attr("x", -96)
            .attr("y", 20)
            .attr("width",145)
            .attr("height", 170)
            .attr("rx", 8)
            .attr('fill','#F5F5F5')
            .attr("opacity",0.7)
            .attr('stroke-width',2)
            .attr('stroke','black')
            .style("border-width", "5px")
            .style("border-radius", "5px")
            .style("padding", "5px")
        svg_legend.append("text")
            .style("fill", "#000000")
            .attr("x",-47)
            .attr("y", 39)
            .style("font-size", "17px")
            .text("Flights")
        //100+
        svg_legend
            .append("rect")
            .attr("x",-90)
            .attr("y",55)
            .attr("width",15)
            .attr("height", 15)
            .attr("rx", 2)
            .style("fill","#bd0026")
            .attr('stroke-width',0.5)
            .attr('stroke','black')
            .style("border-radius", "2px")
            
        svg_legend.append("text")
            .style("fill", "#000000")
            .attr("x",-70)
            .attr("y", 67)
            .style("font-size", "15px")
            .text("> 100")
        //50-100
        svg_legend
            .append("rect")
            .attr("x",-90)
            .attr("y",79)
            .attr("width",15)
            .attr("height", 15)
            .attr("rx", 2)
            .style("fill","#f03b20")
            .attr('stroke-width',0.5)
            .attr('stroke','black')
            .style("border-radius", "2px")
        svg_legend.append("text")
            .style("fill", "#000000")
            .attr("x",-70)
            .attr("y", 91)
            .style("font-size", "15px")
            .text("50-100")
        //25-50
        svg_legend
            .append("rect")
            .attr("x",-90)
            .attr("y",101)
            .attr("width",15)
            .attr("height", 15)
            .attr("rx", 2)
            .style("fill","#fd8d3c")
            .attr('stroke-width',0.5)
            .attr('stroke','black')
            .style("border-radius", "2px")
        svg_legend.append("text")
            .style("fill", "#000000")
            .attr("x",-70)
            .attr("y", 113)
            .style("font-size", "15px")
            .text("25-50")
        //10-25
        svg_legend
            .append("rect")
            .attr("x",-90)
            .attr("y",123)
            .attr("width",15)
            .attr("height", 15)
            .attr("rx", 2)
            .style("fill","#fecc5c")
            .attr('stroke-width',0.5)
            .attr('stroke','black')
            .style("border-radius", "2px")
        svg_legend.append("text")
            .style("fill", "#000000")
            .attr("x",-70)
            .attr("y", 135)
            .style("font-size", "15px")
            .text("10-25")
        //1-10
        svg_legend
            .append("rect")
            .attr("x",-90)
            .attr("y",145)
            .attr("width",15)
            .attr("height", 15)
            .attr("rx", 2)
            .style("fill","#ffffb2")
            .attr('stroke-width',0.5)
            .attr('stroke','black')
            .style("border-radius", "2px")
        svg_legend.append("text")
            .style("fill", "#000000")
            .attr("x",-70)
            .attr("y", 157)
            .style("font-size", "15px")
            .text("1-10")
    
        //0
        svg_legend
            .append("rect")
            .attr("x",-90)
            .attr("y",167)
            .attr("width",15)
            .attr("height", 15)
            .attr("rx", 2)
            .style("fill","#b8b8b8")
            .attr('stroke-width',0.5)
            .attr('stroke','black')
            .style("border-radius", "2px")
        svg_legend.append("text")
            .style("fill", "#000000")
            .attr("x",-70)
            .attr("y", 179)
            .style("font-size", "15px")
            .text("0")
        
    
    
    /*
    console.log(africa)
    console.log(north_america)
    console.log(south_america)
    console.log(europe)
    console.log(asia)
    console.log(antarctica)
    console.log(oceania)
    */

    //var tot = (africa.length+north_america.length+south_america.length+europe.length+asia.length+antarctica.length+oceania.length)
    //console.log("tot:", tot)
    //console.log("tot-air: ", airports.length)
    //console.log(notFound)

    //var totCont = africa.concat(north_america,south_america,europe,asia,antarctica,oceania)
    //console.log(totCont)

    /*
    for(i=0;i<airports.length;i++){
        airID = airports[i].Airport_ID
        if(totCont.includes(airID) == false){
            notFound.push(airports[i])
            
        }
        
    }
    */

    
}

function heatMap_country(data,links, source_airportId,airports,worldCountry){
//console.log(airports)
    //console.log(worldCountry)
    //console.log(links)
    africa = []
    af= []
    north_america = []
    na = []
    south_america = []
    sa = []
    europe = []
    eu = []
    asia = []
    asi = []
    antarctica = []
    an = []
    oceania = []
    oc = []
    //console.log(airports)
    //notFound = []
    
    for(i=0;i<airports.length;i++){
        air_country = String(airports[i].Country)
        airID = airports[i].Airport_ID
        for(k=0;k<worldCountry.length;k++){
            region = String(worldCountry[k].continent)
            //console.log(region)
            state = String(worldCountry[k].country)
            
            //console.log(state)
            if(air_country == state && region == "AF"){
                africa.push(airID)
                af.push(air_country)
                break
            }
            else if (air_country == state && region == "NA"){
                north_america.push(airID)
                break
            }
            else if (air_country == state && region == "SA"){
                south_america.push(airID)
                break
            }
            else if (air_country == state && region == "EU"){
                europe.push(airID)
                break
            }
            else if (air_country == state && region == "AS"){
                asia.push(airID)
                break
            }
            else if (air_country == state && region == "AN"){
                antarctica.push(airID)
                break
            }
            else if (air_country == state && region == "OC"){
                oceania.push(airID)
                break
            }
            else if(air_country == state && (region != "AF" || region != "SA" || region != "NA" || region != "EU" || region != "AS" || region != "AN" || region != "OC" )){
                notFound.push(airports[i])
                break
            }
            
        }
    }
        //COUNT DESTINATION PER CONTINENT
    destinations = get_departures(source_airportId,links)
    //console.log(destinations)
    country_list = get_departures_country(destinations,airports)
    //console.log(country_list)
    dep_country_n = get_depN_country(country_list)
    console.log(dep_country_n)
    //console.log(africa)
    //console.log(af)
        //console.log(destinations.length)
    AF_count = get_cont_dest(destinations,africa)
    NA_count = get_cont_dest(destinations,north_america)
    SA_count = get_cont_dest(destinations,south_america)
    EU_count = get_cont_dest(destinations,europe)
    AS_count = get_cont_dest(destinations,asia)
    AN_count = get_cont_dest(destinations,antarctica)
    OC_count = get_cont_dest(destinations,oceania) 


    var dict_continent = {
        "AF": AF_count,
        "NA": NA_count,
        "SA": SA_count,
        "EU": EU_count,
        "AS": AS_count,
        "AN": AN_count,
        "OC": OC_count
    }
    //console.log(dict_continent)
//c = get_colour(dict_continent,"EU",colour_scale)
//console.log(c)

    //BUILD WORLD CONTINENTS HEATMAP ------------------
    var map_countries = topojson.feature(data,data.objects.countries).features

    svg_heat.selectAll(".nation")
    .data(map_countries)
    .enter()
    .append("path")
    .attr("d",pathHeat)
//    .attr("fill","#b8b8b8")
    .attr("fill",function(d){
    //col = get_color_continent(dict_continent,d.properties.name,worldCountry)
    val = dep_country_n[d.properties.name]
    if(val == null){
        col = colorScale_country["0"]
        return col
    }
    else{
        col = get_colour_country(dep_country_n,d.properties.name,colorScale_country)
        return col
    }
    //console.log(count_name)
    //return col
    
    })
    .style("stroke", "#252525")
    .style("stroke-width", "0.2")
    .on("mouseover", function(d){
        Tooltip_heat.style("opacity", 1)
        d3.select(this).classed("selected_heat", true);
        
    })
    .on("mousemove", function(d){
        continent = get_continent(d.properties.name, worldCountry)
        Tooltip_heat.html(" <p> Country: " + d.properties.name + "</p> <p> Continent: " + continent + "</p>")
                    .style("left", (d3.event.pageX+20) + "px")		
                    .style("top", (d3.event.pageY+10) + "px");
    })
    .on("mouseout", function(d){
        Tooltip_heat.style("opacity", 0)
        d3.select(this).classed("selected_heat", false);
    })
    svg_legend
        .append("rect")
        .attr("id", "info_box")
        .attr("x", -96)
        .attr("y", 20)
        .attr("width",145)
        .attr("height", 170)
        .attr("rx", 8)
        .attr('fill','#F5F5F5')
        .attr("opacity",0.7)
        .attr('stroke-width',2)
        .attr('stroke','black')
        .style("border-width", "5px")
        .style("border-radius", "5px")
        .style("padding", "5px")
    svg_legend.append("text")
        .style("fill", "#000000")
        .attr("x",-47)
        .attr("y", 39)
        .style("font-size", "17px")
        .text("Flights")
    //50+
    svg_legend
        .append("rect")
        .attr("x",-90)
        .attr("y",55)
        .attr("width",15)
        .attr("height", 15)
        .attr("rx", 2)
        .style("fill","#bd0026")
        .attr('stroke-width',0.5)
        .attr('stroke','black')
        .style("border-radius", "2px")
        
    svg_legend.append("text")
        .style("fill", "#000000")
        .attr("x",-70)
        .attr("y", 67)
        .style("font-size", "15px")
        .text("> 50")
    //35-50
    svg_legend
        .append("rect")
        .attr("x",-90)
        .attr("y",79)
        .attr("width",15)
        .attr("height", 15)
        .attr("rx", 2)
        .style("fill","#f03b20")
        .attr('stroke-width',0.5)
        .attr('stroke','black')
        .style("border-radius", "2px")
    svg_legend.append("text")
        .style("fill", "#000000")
        .attr("x",-70)
        .attr("y", 91)
        .style("font-size", "15px")
        .text("35-50")
    //20-35
    svg_legend
        .append("rect")
        .attr("x",-90)
        .attr("y",101)
        .attr("width",15)
        .attr("height", 15)
        .attr("rx", 2)
        .style("fill","#fd8d3c")
        .attr('stroke-width',0.5)
        .attr('stroke','black')
        .style("border-radius", "2px")
    svg_legend.append("text")
        .style("fill", "#000000")
        .attr("x",-70)
        .attr("y", 113)
        .style("font-size", "15px")
        .text("20-35")
    //5-20
    svg_legend
        .append("rect")
        .attr("x",-90)
        .attr("y",123)
        .attr("width",15)
        .attr("height", 15)
        .attr("rx", 2)
        .style("fill","#fecc5c")
        .attr('stroke-width',0.5)
        .attr('stroke','black')
        .style("border-radius", "2px")
    svg_legend.append("text")
        .style("fill", "#000000")
        .attr("x",-70)
        .attr("y", 135)
        .style("font-size", "15px")
        .text("5-20")
    //1-5
    svg_legend
        .append("rect")
        .attr("x",-90)
        .attr("y",145)
        .attr("width",15)
        .attr("height", 15)
        .attr("rx", 2)
        .style("fill","#ffffb2")
        .attr('stroke-width',0.5)
        .attr('stroke','black')
        .style("border-radius", "2px")
    svg_legend.append("text")
        .style("fill", "#000000")
        .attr("x",-70)
        .attr("y", 157)
        .style("font-size", "15px")
        .text("1-5")

    //0
    svg_legend
        .append("rect")
        .attr("x",-90)
        .attr("y",167)
        .attr("width",15)
        .attr("height", 15)
        .attr("rx", 2)
        .style("fill","#b8b8b8")
        .attr('stroke-width',0.5)
        .attr('stroke','black')
        .style("border-radius", "2px")
    svg_legend.append("text")
        .style("fill", "#000000")
        .attr("x",-70)
        .attr("y", 179)
        .style("font-size", "15px")
        .text("0")
    

}


//FUNCTIONS ------------------------------

function get_departures(air_id,links){
    destinations  = []
    j = 0
    for(i=0; i<links.length;i++){
        if(air_id == links[i][0][1]){
            destinations.push(links[i][0][3])
        }
    }
    return destinations
}
function get_departures_country(dep_array,airports){
    country_list = []
    for(i=0;i<dep_array.length;i++){
        idAir = dep_array[i]
        for(j=0;j<airports.length;j++){
            if(idAir == airports[j].Airport_ID){
                country_list.push(airports[j].Country)
                break
            }
        }
    }
    return country_list
}

function get_depN_country(list){
    n_dep_c = list.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
      
    return n_dep_c
}


function get_cont_dest(airp_dest, cont_array){
    var cont_dest = 0
    for(i=0;i<airp_dest.length;i++){
        airID = airp_dest[i]
        for(j=0;j<cont_array.length;j++){
            if(airID == cont_array[j]){
                cont_dest++
                break
            }
        }
    }
    return cont_dest
}

function get_continent(country_name,worldCountry){
    continent = ""
    for(i=0;i<worldCountry.length;i++){
        if(country_name==worldCountry[i].country){
            if(worldCountry[i].continent == "AF"){
                continent = "Africa"
                break
            }
            else if(worldCountry[i].continent == "NA"){
                continent = "North America"
                break
            }
            else if(worldCountry[i].continent == "SA"){
                continent = "South America"
                break
            }
            else if(worldCountry[i].continent == "EU"){
                continent = "Europe"
                break
            }
            else if(worldCountry[i].continent == "AS"){
                continent = "Asia"
                break
            }
            else if(worldCountry[i].continent == "AN"){
                continent = "Antarctica"
                break
            }
            else if(worldCountry[i].continent == "OC"){
                continent = "Oceania"
                break
            }
        }
    }
    return continent;
}

function get_colour(dict,key,colours){
    count = dict[key]
    //console.log(count)
    col = ""
    if(count > 100){
        col = colours["100+"]
    }
    else if(count<=100 && count > 50){
        col = colours["50-100"]
    }
    else if(count<=50 && count > 25){
        col = colours["25-50"]
    }
    else if(count<=25 && count > 10){
        col = colours["10-25"]
    }
    else if(count<=10 && count >= 1){
        col = colours["1-10"]
    }
    else if(count==0){
        col = colours["0"]
    }
    return col;
}
/*
function get_colour_country(dict,key,colours){
    count = dict[key]
    console.log(count, key)
    //console.log(count)
    col = ""
    if(count > 50){
        col = colours["50+"]
    }
    else if(count<=50 && count > 40){
        col = colours["40-50"]
    }
    else if(count<=40 && count > 30){
        col = colours["30-40"]
    }
    else if(count<=30 && count > 20){
        col = colours["20-30"]
    }
    else if(count<=20 && count > 10){
        col = colours["10-20"]
    }
    else if(count<=10 && count >= 1){
        col = colours["1-10"]
    }
    else if(count==0){
        col = colours["0"]
    }
    return col;
}*/
function get_colour_country(dict,key,colours){
    count = dict[key]
    //console.log(count, key)
    //console.log(count)
    col = ""
    if(count > 50){
        col = colours["50+"]
    }
    else if(count<=50 && count > 35){
        col = colours["35-50"]
    }
    else if(count<=35 && count > 20){
        col = colours["20-35"]
    }
    else if(count<=20 && count > 5){
        col = colours["5-20"]
    }
    else if(count<=5 && count >= 1){
        col = colours["1-5"]
    }
    else if(count==0){
        col = colours["0"]
    }
    return col;
}

function get_color_continent(dict_continent,country_name,worldCountry){
    count_name = country_name
    col = ""
    for(i=0;i<worldCountry.length;i++){
        c_n = worldCountry[i].country
        //console.log(c_n)
        main = worldCountry[i].continent
        if(count_name == c_n && main == "AF"){
            col = get_colour(dict_continent,"AF",colour_scale)
            break
        }
        else if (count_name == c_n && main == "NA"){
            col = get_colour(dict_continent,"NA",colour_scale)
            break
        }
        else if (count_name == c_n && main == "SA"){
            col = get_colour(dict_continent,"SA",colour_scale)
            break
        }
        else if(count_name == c_n && main == "EU"){
            col = get_colour(dict_continent,"EU",colour_scale)
            break
        }
        else if(count_name == c_n && main == "AS"){
            col = get_colour(dict_continent,"AS",colour_scale)
            break
        }
        else if (count_name == c_n && main == "AN"){
            col = get_colour(dict_continent,"AN",colour_scale)
            break
        }
        else if (count_name == c_n && main == "OC"){
            col = get_colour(dict_continent,"OC",colour_scale)
            break
                                }
        }
        return col
}

function zoomed_heat() {
    svg_heat.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");
}


//COUNTRY HEATMAP COUNTRY --------------------------------------------------------
function countryHeatMap_country(data,country,links,airports,worldCountry){
    info = get_country_info(country,links,airports)
    infos = info[0]
    //console.log(infos)
    departures_countries = {}
    dep_countries = []
    for(a=0;a<infos.length;a++){
        dep_airIDs = infos[a].dest_air_ids
        //console.log(dep_airIDs)
        if(dep_airIDs.length>0){
            //console.log(dep_airIDs)
            country_list = get_departures_country(dep_airIDs,airports)
            departures_countries = {
                'air_id':infos[a].id_source_c_air,
                'departure_countries':country_list
            }
            dep_countries.push(departures_countries)
           
        }
        
        //get_departures_country(dep_array,airports)
    }
    //console.log(dep_countries)
    tot_countries_arr = []
    for(l=0;l<dep_countries.length;l++){
        arr = dep_countries[l].departure_countries
        for(h=0;h<arr.length;h++){
            tot_countries_arr.push(arr[h])
        }
    }
    //console.log(tot_countries_arr)
    country_n = get_depN_country(tot_countries_arr)
    //console.log(country_n)

    //COUNTRY HEATMAP BUILDING
    var map_countries = topojson.feature(data,data.objects.countries).features

    svg_heat.selectAll(".nation")
    .data(map_countries)
    .enter()
    .append("path")
    .attr("d",pathHeat)
//    .attr("fill","#b8b8b8")
    .attr("fill",function(d){
    //col = get_color_continent(dict_continent,d.properties.name,worldCountry)
    val = country_n[d.properties.name]
    if(val == null){
        col = colorScale_country2["0"]
        return col
    }
    else{
        col = get_colour_country2(country_n,d.properties.name,colorScale_country2)
        return col
    }
    //console.log(count_name)
    //return col
    
    })
    .style("stroke", "#252525")
    .style("stroke-width", "0.2")
    .on("mouseover", function(d){
        Tooltip_heat.style("opacity", 1)
        d3.select(this).classed("selected_heat", true);
        
    })
    .on("mousemove", function(d){
        continent = get_continent(d.properties.name, worldCountry)
        Tooltip_heat.html(" <p> Country: " + d.properties.name + "</p> <p> Continent: " + continent + "</p>")
                    .style("left", (d3.event.pageX+10) + "px")		
                    .style("top", (d3.event.pageY+10) + "px");
    })
    .on("mouseout", function(d){
        Tooltip_heat.style("opacity", 0)
        d3.select(this).classed("selected_heat", false);
    })

    svg_legend
        .append("rect")
        .attr("id", "info_box")
        .attr("x", -96)
        .attr("y", 20)
        .attr("width",145)
        .attr("height", 170)
        .attr("rx", 8)
        .attr('fill','#F5F5F5')
        .attr("opacity",0.7)
        .attr('stroke-width',2)
        .attr('stroke','black')
        .style("border-width", "5px")
        .style("border-radius", "5px")
        .style("padding", "5px")
    svg_legend.append("text")
        .style("fill", "#000000")
        .attr("x",-47)
        .attr("y", 39)
        .style("font-size", "17px")
        .text("Flights")
    //50+
    svg_legend
        .append("rect")
        .attr("x",-90)
        .attr("y",55)
        .attr("width",15)
        .attr("height", 15)
        .attr("rx", 2)
        .style("fill","#bd0026")
        .attr('stroke-width',0.5)
        .attr('stroke','black')
        .style("border-radius", "2px")
        
    svg_legend.append("text")
        .style("fill", "#000000")
        .attr("x",-70)
        .attr("y", 67)
        .style("font-size", "15px")
        .text("> 100")
    //35-50
    svg_legend
        .append("rect")
        .attr("x",-90)
        .attr("y",79)
        .attr("width",15)
        .attr("height", 15)
        .attr("rx", 2)
        .style("fill","#f03b20")
        .attr('stroke-width',0.5)
        .attr('stroke','black')
        .style("border-radius", "2px")
    svg_legend.append("text")
        .style("fill", "#000000")
        .attr("x",-70)
        .attr("y", 91)
        .style("font-size", "15px")
        .text("50-100")
    //20-35
    svg_legend
        .append("rect")
        .attr("x",-90)
        .attr("y",101)
        .attr("width",15)
        .attr("height", 15)
        .attr("rx", 2)
        .style("fill","#fd8d3c")
        .attr('stroke-width',0.5)
        .attr('stroke','black')
        .style("border-radius", "2px")
    svg_legend.append("text")
        .style("fill", "#000000")
        .attr("x",-70)
        .attr("y", 113)
        .style("font-size", "15px")
        .text("25-50")
    //5-20
    svg_legend
        .append("rect")
        .attr("x",-90)
        .attr("y",123)
        .attr("width",15)
        .attr("height", 15)
        .attr("rx", 2)
        .style("fill","#fecc5c")
        .attr('stroke-width',0.5)
        .attr('stroke','black')
        .style("border-radius", "2px")
    svg_legend.append("text")
        .style("fill", "#000000")
        .attr("x",-70)
        .attr("y", 135)
        .style("font-size", "15px")
        .text("10-25")
    //1-5
    svg_legend
        .append("rect")
        .attr("x",-90)
        .attr("y",145)
        .attr("width",15)
        .attr("height", 15)
        .attr("rx", 2)
        .style("fill","#ffffb2")
        .attr('stroke-width',0.5)
        .attr('stroke','black')
        .style("border-radius", "2px")
    svg_legend.append("text")
        .style("fill", "#000000")
        .attr("x",-70)
        .attr("y", 157)
        .style("font-size", "15px")
        .text("1-10")

    //0
    svg_legend
        .append("rect")
        .attr("x",-90)
        .attr("y",167)
        .attr("width",15)
        .attr("height", 15)
        .attr("rx", 2)
        .style("fill","#b8b8b8")
        .attr('stroke-width',0.5)
        .attr('stroke','black')
        .style("border-radius", "2px")
    svg_legend.append("text")
        .style("fill", "#000000")
        .attr("x",-70)
        .attr("y", 179)
        .style("font-size", "15px")
        .text("0")
    

    


}

//COUNTRY HEATMAP CONTINENT -------------------------------------------------
function countryHeatMap_continents(data,country,links,airports,worldCountry){
    info = get_country_info(country,links,airports)
    infos = info[0]
    //console.log(infos)
    departures_countries = {}
    dep_countries = []
    for(a=0;a<infos.length;a++){
        dep_airIDs = infos[a].dest_air_ids
        //console.log(dep_airIDs)
        if(dep_airIDs.length>0){
            //console.log(dep_airIDs)
            country_list = get_departures_country(dep_airIDs,airports)
            departures_countries = {
                'air_id':infos[a].id_source_c_air,
                'departure_countries':country_list
            }
            dep_countries.push(departures_countries)
           
        }
        
        //get_departures_country(dep_array,airports)
    }
    //console.log(dep_countries)
    
    tot_countries_arr = []
    for(l=0;l<dep_countries.length;l++){
        arr = dep_countries[l].departure_countries
        for(h=0;h<arr.length;h++){
            tot_countries_arr.push(arr[h])
        }
    }
    //console.log(tot_countries_arr)
    country_n = get_depN_country(tot_countries_arr)
    countries_used = Object.keys(country_n)
    dict = {}
    arr3 = []
    for(n=0;n<countries_used.length;n++){
        country_name = countries_used[n]
        continent_c = get_continent(country_name,worldCountry)
        //console.log(country_name,continent_c,country_n[country_name])
        dict = {'continent':continent_c, 'flights':country_n[country_name]}
        arr3.push(dict)
    }
    //console.log(arr3)
    let dict_continent = arr3.reduce((c, v) => {
        c[v.continent] = (c[v.continent] || 0) + v.flights;
        return c;
      }, {});
    check = ['Antarctica','North America','South America','Oceania','Europe','Asia','Africa']
    inside_ar = Object.keys(dict_continent)
    for(i=0;i<check.length;i++){
        if(inside_ar.includes(check[i])){continue;}
        else{
            dict_continent[check[i]] = 0
        }
    }
    console.log(dict_continent)

    //BUILD COUNTRY-CONTINENTS HEATMAP ----------------------
    var map_countries = topojson.feature(data,data.objects.countries).features
    
    svg_heat.selectAll(".nation")
            .data(map_countries)
            .enter()
            .append("path")
            .attr("d",pathHeat)
        //    .attr("fill","#b8b8b8")
            .attr("fill",function(d){
                col = get_color_continent2(dict_continent,d.properties.name,worldCountry)
                return col
            
            })
            .style("stroke", "#252525")
            .style("stroke-width", "0.2")
            .on("mouseover", function(d){
                Tooltip_heat.style("opacity", 1)
                d3.select(this).classed("selected_heat", true);
                
            })
            .on("mousemove", function(d){
                continent = get_continent(d.properties.name, worldCountry)
                Tooltip_heat.html(" <p> Country: " + d.properties.name + "</p> <p> Continent: " + continent + "</p>")
                            .style("left", (d3.event.pageX+20) + "px")		
                            .style("top", (d3.event.pageY+10) + "px");
            })
            .on("mouseout", function(d){
                Tooltip_heat.style("opacity", 0)
                d3.select(this).classed("selected_heat", false);
            })
    svg_legend
            .append("rect")
            .attr("id", "info_box")
            .attr("x", -96)
            .attr("y", 20)
            .attr("width",145)
            .attr("height", 170)
            .attr("rx", 8)
            .attr('fill','#F5F5F5')
            .attr("opacity",0.7)
            .attr('stroke-width',2)
            .attr('stroke','black')
            .style("border-width", "5px")
            .style("border-radius", "5px")
            .style("padding", "5px")
        svg_legend.append("text")
            .style("fill", "#000000")
            .attr("x",-47)
            .attr("y", 39)
            .style("font-size", "17px")
            .text("Flights")
        //100+
        svg_legend
            .append("rect")
            .attr("x",-90)
            .attr("y",55)
            .attr("width",15)
            .attr("height", 15)
            .attr("rx", 2)
            .style("fill","#bd0026")
            .attr('stroke-width',0.5)
            .attr('stroke','black')
            .style("border-radius", "2px")
            
        svg_legend.append("text")
            .style("fill", "#000000")
            .attr("x",-70)
            .attr("y", 67)
            .style("font-size", "15px")
            .text("> 500")
        //50-100
        svg_legend
            .append("rect")
            .attr("x",-90)
            .attr("y",79)
            .attr("width",15)
            .attr("height", 15)
            .attr("rx", 2)
            .style("fill","#f03b20")
            .attr('stroke-width',0.5)
            .attr('stroke','black')
            .style("border-radius", "2px")
        svg_legend.append("text")
            .style("fill", "#000000")
            .attr("x",-70)
            .attr("y", 91)
            .style("font-size", "15px")
            .text("250-500")
        //25-50
        svg_legend
            .append("rect")
            .attr("x",-90)
            .attr("y",101)
            .attr("width",15)
            .attr("height", 15)
            .attr("rx", 2)
            .style("fill","#fd8d3c")
            .attr('stroke-width',0.5)
            .attr('stroke','black')
            .style("border-radius", "2px")
        svg_legend.append("text")
            .style("fill", "#000000")
            .attr("x",-70)
            .attr("y", 113)
            .style("font-size", "15px")
            .text("100-250")
        //10-25
        svg_legend
            .append("rect")
            .attr("x",-90)
            .attr("y",123)
            .attr("width",15)
            .attr("height", 15)
            .attr("rx", 2)
            .style("fill","#fecc5c")
            .attr('stroke-width',0.5)
            .attr('stroke','black')
            .style("border-radius", "2px")
        svg_legend.append("text")
            .style("fill", "#000000")
            .attr("x",-70)
            .attr("y", 135)
            .style("font-size", "15px")
            .text("50-100")
        //1-10
        svg_legend
            .append("rect")
            .attr("x",-90)
            .attr("y",145)
            .attr("width",15)
            .attr("height", 15)
            .attr("rx", 2)
            .style("fill","#ffffb2")
            .attr('stroke-width',0.5)
            .attr('stroke','black')
            .style("border-radius", "2px")
        svg_legend.append("text")
            .style("fill", "#000000")
            .attr("x",-70)
            .attr("y", 157)
            .style("font-size", "15px")
            .text("1-50")
    
        //0
        svg_legend
            .append("rect")
            .attr("x",-90)
            .attr("y",167)
            .attr("width",15)
            .attr("height", 15)
            .attr("rx", 2)
            .style("fill","#b8b8b8")
            .attr('stroke-width',0.5)
            .attr('stroke','black')
            .style("border-radius", "2px")
        svg_legend.append("text")
            .style("fill", "#000000")
            .attr("x",-70)
            .attr("y", 179)
            .style("font-size", "15px")
            .text("0")
        


}

function get_colour_country2(dict,key,colours){
    count = dict[key]
    //console.log(count, key)
    //console.log(count)
    col = ""
    if(count > 100){
        col = colours["100+"]
    }
    else if(count<=100 && count > 50){
        col = colours["50-100"]
    }
    else if(count<=50 && count > 25){
        col = colours["25-50"]
    }
    else if(count<=25 && count > 10){
        col = colours["10-25"]
    }
    else if(count<=10 && count >= 1){
        col = colours["1-10"]
    }
    else if(count==0){
        col = colours["0"]
    }
    return col;
}

function get_color_continent2(dict_continent,country_name,worldCountry){
    count_name = country_name
    col = ""
    //console.log(dict_continent)
    for(i=0;i<worldCountry.length;i++){
        c_n = worldCountry[i].country
        //console.log(c_n)
        main = worldCountry[i].continent
        if(count_name == c_n && main == "AF"){
            col = get_colour_cont(dict_continent['Africa'],"AF",colour_scale2)
            break
        }
        else if (count_name == c_n && main == "NA"){
            col = get_colour_cont(dict_continent['North America'],"NA",colour_scale2)
            break
        }
        else if (count_name == c_n && main == "SA"){
            col = get_colour_cont(dict_continent['South America'],"SA",colour_scale2)
            break
        }
        else if(count_name == c_n && main == "EU"){
            col = get_colour_cont(dict_continent['Europe'],"EU",colour_scale2)
            break
        }
        else if(count_name == c_n && main == "AS"){
            col = get_colour_cont(dict_continent['Asia'],"AS",colour_scale2)
            break
        }
        else if (count_name == c_n && main == "AN"){
            col = get_colour_cont(dict_continent['Antarctica'],"AN",colour_scale2)
            break
        }
        else if (count_name == c_n && main == "OC"){
            col = get_colour_cont(dict_continent['Oceania'],"OC",colour_scale2)
            break
        }
        else{
            col = colour_scale2["0"]
        }
    }

        return col
}

function get_colour_cont(count,key,colours){

    col = ""
    if(count > 500){
        col = colours["500+"]
    }
    else if(count<=500 && count > 250){
        col = colours["250-500"]
    }
    else if(count<=250 && count > 100){
        col = colours["100-250"]
    }
    else if(count<=100 && count > 50){
        col = colours["50-100"]
    }
    else if(count<=50 && count >= 1){
        col = colours["1-50"]
    }
    else if(count==0){
        col = colours["0"]
    }
    return col;
}