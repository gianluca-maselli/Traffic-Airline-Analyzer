var h_pca = document.getElementById('pca').clientHeight
var w_pca = document.getElementById('pca').clientWidth

var margin_pca = {top:30, right: 30, bottom: 80, left: 40},
    width_pca = w_pca/1.35
    height_pca = h_pca/1.35

var svg_scatter = d3.select("#pca")
    .append("svg")
    .attr("width", width_pca + margin_pca.left + margin_pca.right)
    .attr("height", height_pca + margin_pca.top + margin_pca.bottom)
    .append("g")
    .attr("transform","translate(" + margin_pca.left + "," + margin_pca.top + ")")

var tooltip_pca = d3.select("#pca")
    .append("div")
    .style("position", "absolute")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

//SCATTERPLOT FUNCTION
function scatterPlot(pca_data, Airport_ID, routes2, airports){
    linksArr = drawFlights2(routes2)
    destAirposts = get_airport_destinations(Airport_ID,linksArr)
    
    var x = d3.scaleLinear()
        .domain([-2.5, 17.5])
        .range([ 0, width_pca ])

    var y = d3.scaleLinear()
        .domain([-4, 8])
        .range([ height_pca, 0]);
    
    var xAxis = d3.axisBottom(x)
    var yAxis = d3.axisLeft(y)

    var brush = d3.brush()
        .extent([[0, 0], [width_pca, height_pca]])
        .on("end", brushended),
        idleTimeout,
        idleDelay = 350;


    var clip = svg_scatter.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width_pca )
        .attr("height", height_pca )
        .attr("x", 0) 
        .attr("y", 0);
    
    var xExtent = d3.extent(pca_data, function (d) { return x(d['PCA_pos'][0]) });
    var yExtent = d3.extent(pca_data, function (d) { return y(d['PCA_pos'][1]); });

    var scatter = svg_scatter.append("g")
        .attr("id", "scatterplot")
        .attr("clip-path", "url(#clip)");
    
    scatter.append("g")
        .attr("class", "brush")
        .call(brush);
    
    scatter.selectAll(".dot")
        //.append('g')
        .data(pca_data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function (d) { 
            //console.log(d['PCA_pos'][0])
            return x(d['PCA_pos'][0]); 
        } )
        .attr("cy", function (d) { 
            return y(d['PCA_pos'][1]); 
        } )
        .attr("r", 2)
        .style("fill", function(d){
            color = ""
            airId = d.Airport_ID
           // console.log(airId)
            //console.log(destAirposts.includes(airId))
            if(airId == Airport_ID){
                color = "#f03b20"
            }
            else if(destAirposts.includes(airId)){
                color = "#41b6c4"
            }
            else{
                color = "#deebf7"
            }
            return color
        })
        .on('mouseover', function(x){
            d3.select(this).attr('r',4)
            airport = x.Airport_ID
            info_air = {}
            airports.forEach(function(row){
                if(row.Airport_ID == airport){
                    info_air = {
                        name: row.Airport_Name,
                        iata: row.IATA,
                        city: row.City,
                        country: row.Country
        
                    };
                }
            })
            tooltip_pca.transition()
              .duration(100)        
              .style('opacity', .9);
            tooltip_pca.html("<p> Airport: " + info_air.name + "</p> <p> IATA: " + info_air.iata + "</p> <p> Country: " + info_air.country + "</p>")
              .style('left', `${d3.event.pageX + 10}px`) 
              .style('top', `${d3.event.pageY - 18}px`);
          })
        .on('mouseout', function(d){    
            d3.select(this).attr('r',2)   
            tooltip_pca.transition()        
            .duration(400)      
            .style('opacity', 0);   
          });
        
        // x axis
        svg_scatter.append("g")
           .attr("class", "x axis")
           .attr('id', "axis--x")
           .attr("transform", "translate(0," + height_pca + ")")
           .call(xAxis);


        // y axis
        svg_scatter.append("g")
            .attr("class", "y axis")
            .attr('id', "axis--y")
            .call(yAxis);
        
        
        function brushended() {
            var s = d3.event.selection;
            if (!s) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
                x.domain([ -2.5,17.5]).nice()
                y.domain([ -4,8]).nice();
            } else {
                x.domain([s[0][0], s[1][0]].map(x.invert, x));
                y.domain([s[1][1], s[0][1]].map(y.invert, y));
                scatter.select(".brush").call(brush.move, null);
            }
            zoom();
        }
        function zoom() {

            var t = scatter.transition().duration(750);
            svg_scatter.select("#axis--x").transition(t).call(xAxis);
            svg_scatter.select("#axis--y").transition(t).call(yAxis);
            scatter.selectAll("circle").transition(t)
            .attr("cx", function (d) { return x(d['PCA_pos'][0]); })
            .attr("cy", function (d) { return y(d['PCA_pos'][1]); });
        }
        function idled() {
            idleTimeout = null;
        }
            

}

function get_airport_destinations(airportID,linksArr){
    dest = []
    var destination_airports = []
    for(j=0; j<linksArr.length;j++){
        if(airportID == linksArr[j][0][2]){
            dest.push(linksArr[j][0][4])
        
        }
       
    }
    
    
    $.each(dest, function(i, el){
        if($.inArray(el, destination_airports) === -1) destination_airports.push(el);
    });
    return destination_airports
}

//SCATTERPLOT COUNTRIES
function scatterPlot_countries(pca_data_c,country,links,airports){
    //console.log(pca_data_c)
    info = get_country_info(country,links, airports)
    infos = info[0]
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

    var x = d3.scaleLinear()
        .domain([-2, 17.5])
        .range([ 0, width_pca ])

    var y = d3.scaleLinear()
        .domain([-3, 6])
        .range([ height_pca, 0]);
    
    var xAxis = d3.axisBottom(x)
    var yAxis = d3.axisLeft(y)

    var brush = d3.brush()
        .extent([[0, 0], [width_pca, height_pca]])
        .on("end", brushended),
        idleTimeout,
        idleDelay = 350;


    var clip = svg_scatter.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width_pca )
        .attr("height", height_pca )
        .attr("x", 0) 
        .attr("y", 0);
    
    var xExtent = d3.extent(pca_data_c, function (d) { return x(d['PCA_pos'][0]) });
    var yExtent = d3.extent(pca_data_c, function (d) { return y(d['PCA_pos'][1]); });

    var scatter = svg_scatter.append("g")
        .attr("id", "scatterplot")
        .attr("clip-path", "url(#clip)");
    
    scatter.append("g")
        .attr("class", "brush")
        .call(brush);
    
    scatter.selectAll(".dot")
        //.append('g')
        .data(pca_data_c)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function (d) { 
            //console.log(d['PCA_pos'][0])
            return x(d['PCA_pos'][0]); 
        } )
        .attr("cy", function (d) { 
            return y(d['PCA_pos'][1]); 
        } )
        .attr("r", 2)
        .style("fill", function(d){
            //console.log(d)
            color = ""
            country_c = d.Country
           // console.log(airId)
            //console.log(destAirposts.includes(airId))
            if(country_c == country){
                color = "#f03b20"
            }
            else if(destination_countries.includes(country_c)){
                color = "#41b6c4"
            }
            else{
                color = "#deebf7"
            }
            return color
        })
        .on('mouseover', function(x){
            //console.log(x)
            d3.select(this).attr('r',4)
            c_name = x.Country
            
            tooltip_pca.transition()
              .duration(100)        
              .style('opacity', .9);
            tooltip_pca.html("<p> Country: " + c_name + "</p>")
              .style('left', `${d3.event.pageX + 10}px`) 
              .style('top', `${d3.event.pageY - 18}px`);
          })
        .on('mouseout', function(d){    
            d3.select(this).attr('r',2)   
            tooltip_pca.transition()        
            .duration(400)      
            .style('opacity', 0);   
          });
        
        // x axis
        svg_scatter.append("g")
           .attr("class", "x axis")
           .attr('id', "axis--x")
           .attr("transform", "translate(0," + height_pca + ")")
           .call(xAxis);


        // y axis
        svg_scatter.append("g")
            .attr("class", "y axis")
            .attr('id', "axis--y")
            .call(yAxis);
        
        
        function brushended() {
            var s = d3.event.selection;
            if (!s) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
                x.domain([ -2.5,17.5]).nice()
                y.domain([ -4,8]).nice();
            } else {
                x.domain([s[0][0], s[1][0]].map(x.invert, x));
                y.domain([s[1][1], s[0][1]].map(y.invert, y));
                scatter.select(".brush").call(brush.move, null);
            }
            zoom();
        }
        function zoom() {

            var t = scatter.transition().duration(750);
            svg_scatter.select("#axis--x").transition(t).call(xAxis);
            svg_scatter.select("#axis--y").transition(t).call(yAxis);
            scatter.selectAll("circle").transition(t)
            .attr("cx", function (d) { return x(d['PCA_pos'][0]); })
            .attr("cy", function (d) { return y(d['PCA_pos'][1]); });
        }
        function idled() {
            idleTimeout = null;
        }
}



