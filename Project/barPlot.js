var h_b = document.getElementById('barplot').clientHeight
var w_b = document.getElementById('barplot').clientWidth

console.log(h_b,w_b)
var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = w_b
    height = h_b

var svg_bar = d3.select("#barplot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

d3.queue()
    .defer(d3.csv, "./dataset/airports2.csv")
    .defer(d3.csv, "./dataset/routes2.csv")
    .defer(d3.csv, "./dataset/airlines.csv")
    .await(barPlot);



function barPlot(error, airports, routes2,airlines){
    links2 = drawFlights2(routes2)
    console.log(links2[0])
  
    diary = []
    l = []
    k=0
    for(j=0;j<airports.length;j++){
        airpID = airports[j].Airport_ID
        flag = 0
        
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
                
                airline_info = [links2[i][0][1],arline_name]
                airlines_air.push(airline_info)
                
            }
            
           
        }
        if(flag ==1){
            const counts = {};
            airlines_air.forEach(function(x){
                counts[x] = (counts[x] || 0) + 1;
            })
            console.log(counts)
            air_lines = {
                "airportID":airportName,
                "airlinesID":airlines_air
            }
            
            diary.push(air_lines)
        }
        
    break
    }
    console.log(diary)
    
    
    
    

/*
    // X axis
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.Country; }))
    .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
                .domain([0, 13000])
                .range([ height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));


*/

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