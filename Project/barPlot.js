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
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

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
    //console.log(min, max)

    if(arr2.length>3){
        //BARPLOT DESIGN ----------------
        // X axis
        var x = d3.scaleBand()
                    .range([ 0, width])
                    .domain(arr2.map(function(d) { 
                    //console.log(d.Airlines)
                        return d.Airlines;
                    }))
                    .padding(0.7);
    
    
        svg_bar.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("font-size", "0.6em")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .on("mouseover", function (d) {
                d3.select(this).attr("font-size","2em")
            })

        // Add Y axis
        var y = d3.scaleLinear()
                    .domain([0, max])
                    .range([ height, 0]);
        svg_bar.append("g")
                .call(d3.axisLeft(y));
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
                .attr("fill", "#1c9099")
    }
    else{
        var table = []
        var table_entries = {}
        console.log(arr2)
        table_maker(arr2)
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