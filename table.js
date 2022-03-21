function table_maker(arr2,airlines, airportId,links2){
    //console.log("i'm in table")
    var columns = ["Airlines", "Flights"]

    var table = svg_bar.append("g").append("foreignObject")
            .attr("width", 500)
            .attr("height", 500)
            .attr("x", 45)
            .attr("y", 90)
        //    .style("border", "2px black solid")
        //    .style("background", "orange")
            .append("xhtml:table")
            
    // headers
    table.append("table")
    var thead = table.append('thead')
	var	tbody = table.append('tbody');

		// append the header row
	thead.append('tr')
		  .selectAll('th')
		  .data(columns).enter()
		  .append('th')
		    .text(function (d,i) { 
               // console.log(d)
                return d;
            });
    
    var rows = tbody.selectAll("tr")
                    .data(arr2)
                    .enter()
                    .append("tr");
    var cells = rows.selectAll("td")
                    .data(function(row){
                        return columns.map(function(column){
                           // console.log(column)
                            
                            return{
                                column: column,
                                value: row[column]
                            }

                        })
                    })
                    .enter()
                    .append("td")
                    .text(function(d,i){
                        return d.value
                    })
                    .on("click",function(d){
                        air_name= d.value
                        iata = get_IATA(air_name,airlines)
                        svg.selectAll("#flights_color").remove()
                        outline_routes(iata,airportId,links2)
                    })
    
}

function table_maker_country(diary,airlines, country,links2,airports,country_coords){
    //console.log("i'm in table")
    var columns = ["Airline", "Flights"]

    var table = svg_bar.append("g").append("foreignObject")
            .attr("width", 500)
            .attr("height", 500)
            .attr("x", 45)
            .attr("y", 90)
        //    .style("border", "2px black solid")
        //    .style("background", "orange")
            .append("xhtml:table")
            
    // headers
    table.append("table")
    var thead = table.append('thead')
	var	tbody = table.append('tbody');

		// append the header row
	thead.append('tr')
		  .selectAll('th')
		  .data(columns).enter()
		  .append('th')
		    .text(function (d,i) { 
               // console.log(d)
                return d;
            });
    
    var rows = tbody.selectAll("tr")
                    .data(diary)
                    .enter()
                    .append("tr");
    var cells = rows.selectAll("td")
                    .data(function(row){
                       return columns.map(function(column){
                           // console.log(column)
                            
                            return{
                                column: column,
                                value: row[column]
                            }

                        })
                    })
                    .enter()
                    .append("td")
                    .text(function(d,i){
                        return d.value
                    })
                    .on("click",function(d){
                        nameClicked = d.value
                        var airlineID
                        for(f=0;f<airlines.length;f++){
                            air_name = airlines[f].Name
                            if(nameClicked == air_name){
                                airlineID = airlines[f].Airline_ID
                                break
                            }
                        }
                        svg.selectAll("#flights_color").remove()
                        iata = get_IATA(nameClicked,airlines)
                        outline_routes_countries(airlineID,iata,country,airlines,airports,links2,country_coords)
                    })
}