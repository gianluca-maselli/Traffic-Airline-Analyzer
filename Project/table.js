function table_maker(arr2){
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
                        console.log(row)
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
                        console.log(d)
                        return d.value
                    })
    
}