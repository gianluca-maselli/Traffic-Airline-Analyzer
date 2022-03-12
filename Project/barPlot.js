var h_b = document.getElementById('barplot').clientHeight
var w_b = document.getElementById('barplot').clientWidth
var margin = {top:10, right: 30, bottom: 70, left: 60},
    width = w_b/1.2
    height = h_b/1.2

var svg_bar = d3.select("#barplot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")")


 function barPlot(routes2, airlines, airportId){
    links2 = drawFlights2(routes2)
    //console.log(links2[0])

  
    diary = []
    l = []
    k=0

    flag = 0
    airpID = airportId
    console.log(airpID)
    var airportName = ""
    var air_lines = {}
    var arline_name = ""
    var airlines_air = []
    var airline_info = []
    for(i=0;i<links2.length;i++){
           
        if(airpID == links2[i][0][2]){
            flag = 1
            airportName = airpID
            for(k=0;k<airlines.length;k++){
                if(links2[i][0][1]== airlines[k].Airline_ID){
                    arline_name=airlines[k].Name
                    break
                }
            }
            airline_info = [arline_name]
            airlines_air.push(airline_info)
        }
    }

    if(flag ==1){
        const counts = {};
        airlines_air.forEach(function(x){
                counts[x] = (counts[x] || 0) + 1;
        })
            
        var keys = Object.keys(counts)
        var arr = []
        for(s=0;s<keys.length;s++){
            var dic = {}
            dic = { "airlineName" : keys[s], "tot_flights":counts[keys[s]]}
            arr.push(dic)
        }
        air_lines = {
            "airportID":airpID,
            "airlinesID": arr
        }
        diary.push(air_lines)
    }
        
    //console.log(diary)
    //console.log(diary[193])
    var infos = {}
    var arr2 = []
    for(i=0;i<diary.length;i++){
        row = diary[i].airlinesID
   
        for(j=0;j<row.length;j++){
           infos = {
                "Airlines": row[j].airlineName,
                "Flights": row[j].tot_flights
            }
            arr2.push(infos)
        }
    }

    arr2.sort(function(b, a) {
        return a["Flights"] - b["Flights"];
      });

    
    //console.log(arr2)

    min = Number.MAX_VALUE,
    max = -Number.MAX_VALUE;

    arr2.forEach(function (row) {
        Object.keys(row).forEach(function (k) {                
            if (k !== 'Airlines' && row[k] !== null) {
                min = Math.min(min, row[k]);
                max = Math.max(max, row[k]);
            }
        });
    });



    if(arr2.length>3){
        //BARPLOT DESIGN ----------------
        // X axis
        var x = d3.scaleBand()
                    .range([ 0, width])
                    .domain(arr2.map(function(d) { 
                       // console.log(d)
                        return d.Airlines;
                    }))
                    .padding(0.5)
                    
    
    
        svg_bar.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("font-size", "0.6em")
            .attr("fill","#F0E2E7")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .on("mouseover", function (d) {
                d3.select(this).transition()
                    .ease(d3.easeLinear)
                    .duration('0')
                    .style('font-size', 11)
                    .attr('fill', '#0C8346');
            })
            .on('mouseout', function(d) {
                d3.select(this).transition()
                  .ease(d3.easeLinear)
                  .duration('0')
                  .style('font-size', "0.6em")
                  .attr("fill", "#F0E2E7");
              })
            .on('click', function(d){
                //console.log(d)
                iata = get_IATA(d,airlines)
                svg.selectAll("#flights_color").remove()
                outline_routes(iata,airportId,links2)
            })

        // Add Y axis
        var y = d3.scaleLinear()
                    .domain([0, max])
                    .range([ height, 0]);
        svg_bar.append("g")
                .attr("class", "axisY")
                .call(d3.axisLeft(y))
                

        svg_bar.append("text")
                .attr("text-anchor", "end")
                .attr("x", width+30)
                .attr("y", height + margin.top + 22)
                .text("Airlines")
                .style("font-size", "15px")
                .style('fill','#F0E2E7')
            
            // Y axis label:
        svg_bar.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left+20)
                .attr("x", -margin.top)
                .text("Number of flights")
                .style("font-size", "15px")
                .style('fill','#F0E2E7')
                
        // Bars
        svg_bar.selectAll("mybar")
                .data(arr2)
                .enter()
                .append("rect")
                .attr("x", function(d) { 
                    return  x(d.Airlines);
                })
                .attr("y", function(d) { 
                    return  y(d.Flights);

                })
                .attr("width", x.bandwidth())
                .attr("height", function(d) { 
                    return height - y(d.Flights);
                })
                .attr("fill", "#0C8346")
                .on("mouseover", function(d){
                    Tooltip_heat.style("opacity", 1)
                    d3.select(this).classed("selected_heat", true);
                    
                })
                .on("mousemove", function(d){
                    //console.log(d)
                    Tooltip_heat.html(" <p> Airline: " + d.Airlines + "</p> <p> Flights: " + d.Flights + "</p>")
                                .style("left", (d3.event.pageX+20) + "px")		
                                .style("top", (d3.event.pageY-30) + "px");
                })
                .on("mouseout", function(d){
                    Tooltip_heat.style("opacity", 0)
                    d3.select(this).classed("selected_heat", false);
                })

    
        

                    
    }
    else{
        var table = []
        var table_entries = {}
        //console.log(arr2)
        table_maker(arr2,airlines, airportId,links2)
    }


}

//COUNTRY BARPLOT -----------------------------------
function barplot_country(routes2,airports,airlines,country){
    links2 = drawFlights2(routes2)
    country_airports = get_country_airports(country,airports)
    var source_country = {
        'name':country,
        'airports':country_airports
    }
    var airline_name = ""
    
    var air_id_airlines = {}
    infos = []
    flag = 0
    //console.log(source_country)
    for(i=0;i<country_airports.length;i++){
        id_airport = country_airports[i]
        var airlines_air = []
        //console.log(id_airport)
        for(j=0;j<links2.length;j++){
           
            if(id_airport == links2[j][0][2]){
                flag = 1
                airportName = id_airport
                for(k=0;k<airlines.length;k++){
                    if(links2[j][0][1]== airlines[k].Airline_ID){
                        airline_name=airlines[k].Name
                        airlines_air.push(airline_name)
                        break
                    }
                }
            }
        }
        if(flag==1){
            air_id_airlines = {
                'air_id':id_airport,
                'flights': airlines_air
            }
            infos.push(air_id_airlines)
        }

    }
    //console.log(infos)
    diary = []
    tot_airlines = []
    for(i=0;i<infos.length;i++){
        flight_in_air = infos[i].flights
        for(k=0;k<flight_in_air.length;k++){
            tot_airlines.push(flight_in_air[k])
        }
    }
    //console.log(tot_airlines)
    const counts = {};
    tot_airlines.forEach(function(x){
        counts[x] = (counts[x] || 0) + 1;
    })
    var keys = Object.keys(counts)
    var diary = []
    for(s=0;s<keys.length;s++){
        var dic = {}
        dic = { "Airline" : keys[s], "Flights":counts[keys[s]]}
        diary.push(dic)
    }

    //console.log(diary)

    diary.sort(function(b, a) {
        return a["Flights"] - b["Flights"];
      });

    
    //console.log(arr2)

    min = Number.MAX_VALUE,
    max = -Number.MAX_VALUE;

    diary.forEach(function (row) {
        Object.keys(row).forEach(function (k) {                
            if (k !== 'Airline' && row[k] !== null) {
                min = Math.min(min, row[k]);
                max = Math.max(max, row[k]);
            }
        });
    });

    //COUNTRY BARPLOT
    if(diary.length>3){
        //BARPLOT DESIGN ----------------
        // X axis
        var x = d3.scaleBand()
                    .range([ 0, width])
                    .domain(diary.map(function(d) { 
                       // console.log(d)
                        return d.Airline;
                    }))
                    .padding(0.5);
    
    
        svg_bar.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("font-size", "0.6em")
            .attr('fill','#F0E2E7')
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .on("mouseover", function (d) {
                d3.select(this).transition()
                    .ease(d3.easeLinear)
                    .duration('0')
                    .style('font-size', 11)
                    .attr('fill', '#0C8346');
            })
            .on('mouseout', function(d) {
                d3.select(this).transition()
                  .ease(d3.easeLinear)
                  .duration('0')
                  .style('font-size', "0.6em")
                  .attr('fill', '#F0E2E7');
              })
            .on('click', function(d){
                //console.log(d)
                //iata = get_IATA(d,airlines)
                //svg.selectAll("#flights_color").remove()
                //outline_routes(iata,airportId,links2)
            })

        // Add Y axis
        var y = d3.scaleLinear()
                    .domain([0, max])
                    .range([ height, 0]);
        svg_bar.append("g")
                .attr("class", "axisY")
                .call(d3.axisLeft(y));

        svg_bar.append("text")
                .attr("text-anchor", "end")
                .attr("x", width+31)
                .attr("y", height + margin.top + 22)
                .text("Airlines")
                .style("font-size", "15px")
                .style('fill','#F0E2E7')
            
            // Y axis label:
        svg_bar.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left+20)
                .attr("x", -margin.top)
                .text("Number of flights")
                .style("font-size", "15px")
                .style('fill','#F0E2E7')
                
        // Bars
        svg_bar.selectAll("mybar")
                .data(diary)
                .enter()
                .append("rect")
                .attr("x", function(d) { 
                    return  x(d.Airline);
                })
                .attr("y", function(d) { 
                    return  y(d.Flights);

                })
                .attr("width", x.bandwidth())
                .attr("height", function(d) { 
                    return height - y(d.Flights);
                })
                .attr("fill", "#0C8346")
                .on("mouseover", function(d){
                    Tooltip_heat.style("opacity", 1)
                    d3.select(this).classed("selected_heat", true);
                    
                })
                .on("mousemove", function(d){
                    //console.log(d)
                    Tooltip_heat.html(" <p> Airline: " + d.Airline + "</p> <p> Flights: " + d.Flights + "</p>")
                                .style("left", (d3.event.pageX+20) + "px")		
                                .style("top", (d3.event.pageY-30) + "px");
                })
                .on("mouseout", function(d){
                    Tooltip_heat.style("opacity", 0)
                    d3.select(this).classed("selected_heat", false);
                })
    }
    else{
        table_maker_country(diary,airlines, country,links2)
    }

}



function drawFlights2(flights_database){
    var link2 = []
    for(i=0; i<flights_database.length;i++){
        row = flights_database[i]
        //airline information
        airline = row.airline
        airline_ID = row.airline_ID
        
        //source airport information
        source_air_ID=row.source_airport_id
        source_name = row.source_airport
        lat_s_air = row.lat_source_air
        long_s_air = row.long_source_air

        source = [+long_s_air,+lat_s_air]
        
        //destination airport information
        dest_air_ID=row.destination_airport_id
        dest_name = row.destination_airport
        lat_d_air = row.lat_dest_air
        long_d_air = row.long_dest_air
        target = [+long_d_air,+lat_d_air]
        
        source_dest = [airline,airline_ID, source_air_ID, source_name, dest_air_ID, dest_name]
        topush = {type: "LineString", coordinates: [source, target]}
        link2[i] = [source_dest, topush]
        
    }
    
    return link2;
}
function airlines_len(air_name){
    var rand_name = ""
    if(air_name.length > 11){
        for(i=0; i<11; i++){
            rand_name += air_name[i]
        }
        rand_name = rand_name+"..."
        
     }
     else{
         rand_name = air_name
     }
    
    return rand_name
}

function get_IATA(airline,airlines){
    for(i=0;i<airlines.length;i++){
        air_name = airlines[i].Name
        if(airline==air_name){
            return airlines[i].IATA
        }
    }
}


