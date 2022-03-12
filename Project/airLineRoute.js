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
            .style("left", (d3.event.pageX+10) + "px")		
            .style("top", (d3.event.pageY+10) + "px");	
    
}
var c_mouseleave = function(d) {
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

