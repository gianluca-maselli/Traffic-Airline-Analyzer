var h_pca = document.getElementById('pca').clientHeight
var w_pca = document.getElementById('pca').clientWidth

var margin_pca = {top:20, right: 30, bottom:30, left: 35},
    width_pca = 450 - margin_pca.left - margin_pca.right,
    height_pca = 280 - margin_pca.top - margin_pca.bottom;
var svg_scatter = d3.select("#pca")
    .append("svg")
    .attr("width", width_pca + margin_pca.left + margin_pca.right)
    .attr("height", height_pca + margin_pca.top + margin_pca.bottom)
    .append("g")
    .attr("transform","translate(" + margin_pca.left + "," + margin_pca.top + ")")

var legend_pca = d3.select("#legend_pca").append("svg")
    .attr("id", "pca_legend")
    .attr("height",(height + margin.top + margin.bottom)/5)
    .attr("width", 120)
    .append("g")
   // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
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
function scatterPlot(pca_data, Airport_ID, routes2, airports,data, airlines, worldCountry){
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
        //.attr("r", 2)
        .attr("r",function(d){
            r = 0
            airId = d.Airport_ID
            if(airId == Airport_ID){
                r = 3.5
            }
            else{
                r = 2
            }
            return r
        })
        .style("fill", function(d){
            color = ""
            airId = d.Airport_ID
           // console.log(airId)
            //console.log(destAirposts.includes(airId))
            if(airId == Airport_ID){
                color = "#f03b20"
            }
            else if(destAirposts.includes(airId)){
                color = "#266DD3"
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
            airId = d.Airport_ID
            if(airId == Airport_ID){
                d3.select(this).attr('r',3.5)   
            }
            else{   
                d3.select(this).attr('r',2) 
            }  
            tooltip_pca.transition()        
            .duration(400)      
            .style('opacity', 0);   
        })
        // AIRPORT SELECTION ---------
        .on("click", function(d){
            // console.log(d.Airport_ID)
            svg.selectAll("#point-airports").remove()
            svg.selectAll("#flights_d").remove()
            svg.selectAll("#flights_color").remove()
            svg.selectAll("#Country_c").remove()
            svg_air_inf.selectAll("*").remove()
            svg_bar.selectAll("*").remove()
            svg_heat.selectAll("*").remove()
            svg_legend.selectAll("*").remove()
            svg_scatter.selectAll("*").remove()
            svg.selectAll("#centroids").remove()
            legend_worldmap.selectAll("*").remove()
            legend_pca.selectAll("*").remove()

            id_airport = d.Airport_ID
            var countries = topojson.feature(data,data.objects.countries).features
            svg.call(zoom_w.transform, d3.zoomIdentity.translate(0,0).scale(1));
            
            // MAP BUILDING INIT ---------------
            svg.selectAll(".country")
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
            
            //AIRPORTS POINTS --------------------------
            svg.selectAll(".world-airports")
                .data(airports)
                .enter()
                .append("g")
                .attr("id","point-airports")
                .append("circle")
                .attr("r", 0.2)
                .attr("cx", function(d){
                    var coords = projection([d.Longitude, d.Latitude])
                    return coords[0] //longitude;
                })
                .attr("cy", function(d){
                    var coords = projection([d.Longitude, d.Latitude])
                    return coords[1] //latitude;
                })
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                tot_d_a = f_click(d,links,airports)
                barPlot(routes2, airlines,id_airport)
                svg_legend.selectAll("*").remove()
                svg_scatter.selectAll("*").remove()
                heatMap_country(data,links,id_airport,airports,worldCountry)
                scatterPlot(pca_data, id_airport, routes2, airports,data, airlines, worldCountry)
                getLegendPCA('Airport')
                document.getElementById("check1").checked = true;
                document.getElementById("check2").checked = false;
                let allCheckBox = document.querySelectorAll('.mCheckbox')
                allCheckBox.forEach((checkbox) => { 
                    checkbox.addEventListener('change', (event) => {
                        if (event.target.checked) {
                            if(event.target.value == "continents"){
                                svg_heat.selectAll("*").remove()
                                svg_legend.selectAll("*").remove()
                                    heatMap(data,links,id_airport, airports,worldCountry)
                                }
                            else if(event.target.value == "countries"){
                                svg_heat.selectAll("*").remove()
                                svg_legend.selectAll("*").remove()
                                heatMap_country(data,links,id_airport,airports,worldCountry)
                            }
                        }
                    })
                })
                svg.selectAll("#point-airports")
                    .on("click", function(d){
                        console.log(d)
                    tot_d_a = f_click(d,links,airports)
                        if(tot_d_a[0]>0){
                        //barplot design
                            barPlot(routes2, airlines,d.Airport_ID)
                            svg_legend.selectAll("*").remove()
                            svg_scatter.selectAll("*").remove()
                            heatMap_country(data,links,d.Airport_ID,airports,worldCountry)
                            scatterPlot(pca_data, d.Airport_ID, routes2, airports,data, airlines, worldCountry)
                            getLegendPCA('Airport')
                            document.getElementById("check1").checked = true;
                            document.getElementById("check2").checked = false;
                            let allCheckBox = document.querySelectorAll('.mCheckbox')
                            allCheckBox.forEach((checkbox) => { 
                                checkbox.addEventListener('change', (event) => {
                                    if (event.target.checked) {
                                        if(event.target.value == "continents"){
                                            svg_heat.selectAll("*").remove()
                                            svg_legend.selectAll("*").remove()
                                            heatMap(data,links,d.Airport_ID, airports,worldCountry)
                                        }
                                        else if(event.target.value == "countries"){
                                            svg_heat.selectAll("*").remove()
                                            svg_legend.selectAll("*").remove()
                                            heatMap_country(data,links,d.Airport_ID,airports,worldCountry)
                                        }
                                    }
                                })
                            })
                           
                        }
                        else{
                            document.getElementById("check1").checked = true;
                            document.getElementById("check2").checked = false;
                            svg_heat.selectAll("*").remove()
                            svg_legend.selectAll("*").remove()
                            svg_scatter.selectAll("*").remove()
                            legend_pca.selectAll("*").remove()
                            missing(data)
                        }
                    })

        })
        

        
        // x axis
        svg_scatter.append("g")
           .attr("class", "axisX")
           .attr('id', "axis--x")
           .attr("transform", "translate(0," + height_pca + ")")
           .call(xAxis);


        // y axis
        svg_scatter.append("g")
            .attr("class", "axisY")
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
function scatterPlot_countries(pca_data_c,country,links,airports,data,c_centroids,routes2, airlines, worldCountry){
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
    var destination_countries = []
    $.each(all_dest, function(i, el){
        if($.inArray(el, destination_countries) === -1) destination_countries.push(el);
    });
    //console.log(destination_countries)

    var x = d3.scaleLinear()
        .domain([-2, 12])
        .range([ 0, width_pca ])

    var y = d3.scaleLinear()
        .domain([-3, 8])
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
        //.attr("r", 2)
        .attr("r",function(d){
            r = 0
            country_c = d.country
            if(country_c == country){
                r = 3.5
            }
            else{
                r = 2
            }
            return r
        })
        .style("fill", function(d){
            //console.log(d)
            color = ""
            country_c = d.country
           // console.log(airId)
            //console.log(destAirposts.includes(airId))
            if(country_c == country){
                color = "#f03b20"
            }
            else if(destination_countries.includes(country_c)){
                color = "#266DD3"
            }
            else{
                color = "#deebf7"
            }
            return color
        })
        .on('mouseover', function(x){
            //console.log(x)
            d3.select(this).attr('r',4)
            c_name = x.country
            
            tooltip_pca.transition()
              .duration(100)        
              .style('opacity', .9);
            tooltip_pca.html("<p> Country: " + c_name + "</p>")
              .style('left', `${d3.event.pageX + 10}px`) 
              .style('top', `${d3.event.pageY - 18}px`);
        })
        .on('mouseout', function(d){    
            country_c = d.country
            if(country_c == country){
                d3.select(this).attr('r',3.5)   
            }
            else{   
                d3.select(this).attr('r',2) 
            }  
            tooltip_pca.transition()        
            .duration(400)      
            .style('opacity', 0);   
        })
        .on("click",function(d){
        //COUNTRY SELECTION
            svg.selectAll("#point-airports").remove()
            svg.selectAll("#flights_d").remove()
            svg.selectAll("#flights_color").remove()
            svg.selectAll("#Country_c").remove()
            svg_air_inf.selectAll("*").remove()
            svg_bar.selectAll("*").remove()
            svg_heat.selectAll("*").remove()
            svg_legend.selectAll("*").remove()
            svg_scatter.selectAll("*").remove()
            svg.selectAll("#centroids").remove()
            legend_worldmap.selectAll("*").remove()
            legend_pca.selectAll("*").remove()
 
            var countries = topojson.feature(data,data.objects.countries).features
            svg.call(zoom_w.transform, d3.zoomIdentity.translate(0,0).scale(1));
             
            // MAP BUILDING INIT ---------------
            svg.selectAll(".country_c")
                .data(countries)
                .enter()
                .append("g")
                .attr("id","Country_c")
                .append("path")
                .attr("class", "country")
                .attr("d",path) //coordinates of country borders
                .style("stroke", "#fff")
                .style("stroke-width", "0.2")
                .attr("fill", "#b8b8b8")
                .on("mouseover", function(d){
                    d3.select(this).classed("selected", true);
                })
                .on("mouseout", function(d){
                    d3.select(this).classed("selected", false);
                })
                
                svg.selectAll(".world-country_points")
                    .data(c_centroids)
                    .enter()
                    .append("g")
                    .attr("id","centroids")
                    .append("circle")
                    .attr("r", 0.5)
                    .attr("cx", function (d){ 
                    //console.log(d)
                        var coords = projection([d.longitude, d.latitude])
                        return coords[0]; 
                    })
                    .attr("cy", function (d){ 
                        var coords = projection([d.longitude, d.latitude])
                        return coords[1]; 
                    })
                    .on('mouseover', mouseover)
                    .on('mousemove', function(d){
                        Tooltip.html("<p> Country: " + d.country + " </p>")
                            .style("left", (d3.event.pageX+2) + "px")		
                            .style("top", (d3.event.pageY-20) + "px");
                    })
                    .on('mouseleave', mouseleave)
                
                tot_dep = c_click(d,links,airports, c_centroids)
                var country_coords = []
                for(z=0;z<c_centroids.length;z++){
                    if(d.country == c_centroids[z].country){
                        country_coords = [c_centroids[z].latitude,c_centroids[z].longitude]
                    }
                }

                barplot_country(routes2,airports,airlines,d.country,country_coords)
                countryHeatMap_country(data,d.country,links,airports,worldCountry)
                scatterPlot_countries(pca_data_c,d.country,links,airports,data,c_centroids,routes2, airlines, worldCountry)
                getLegendPCA('Country')
                document.getElementById("check1").checked = true;
                document.getElementById("check2").checked = false;
                let allCheckBox = document.querySelectorAll('.mCheckbox')
                allCheckBox.forEach((checkbox) => { 
                    checkbox.addEventListener('change', (event) => {
                        if (event.target.checked) {
                            if(event.target.value == "continents"){
                                svg_heat.selectAll("*").remove()
                                svg_legend.selectAll("*").remove()
                                countryHeatMap_continents(data,d.country,links,airports,worldCountry)
                            }
                            else if(event.target.value == "countries"){
                                svg_heat.selectAll("*").remove()
                                svg_legend.selectAll("*").remove()
                                countryHeatMap_country(data,d.country,links,airports,worldCountry)
                            }
                        }
                    })
                })
                svg.selectAll("#centroids")
                    .on("click",function(d){
                        tot_dep = c_click(d,links,airports, c_centroids)
                        //console.log(tot_dep)
                        if(tot_dep>0){
                            country_coords = [d.latitude,d.longitude]
                            barplot_country(routes2,airports,airlines,d.country,country_coords)
                            countryHeatMap_country(data,d.country,links,airports,worldCountry)
                            scatterPlot_countries(pca_data_c, d.country,links,airports,data,c_centroids,routes2,airlines, worldCountry)
                            getLegendPCA('Country')

                            document.getElementById("check1").checked = true;
                            document.getElementById("check2").checked = false;
                            let allCheckBox = document.querySelectorAll('.mCheckbox')
                            allCheckBox.forEach((checkbox) => { 
                                checkbox.addEventListener('change', (event) => {
                                    if (event.target.checked) {
                                        if(event.target.value == "continents"){
                                            svg_heat.selectAll("*").remove()
                                            svg_legend.selectAll("*").remove()
                                            countryHeatMap_continents(data,d.country,links,airports,worldCountry)
                                        }
                                        else if(event.target.value == "countries"){
                                            svg_heat.selectAll("*").remove()
                                            svg_legend.selectAll("*").remove()
                                            countryHeatMap_country(data,d.country,links,airports,worldCountry)
                                        }
                                    }
                                })
                            })

                        }
                        else{
                            document.getElementById("check1").checked = true;
                            document.getElementById("check2").checked = false;
                            svg_heat.selectAll("*").remove()
                            svg_legend.selectAll("*").remove()
                            svg_scatter.selectAll("*").remove()
                            legend_pca.selectAll("*").remove()
                            missing_country(data)
                        }
                    })

        })
        
        
        
        // x axis
        svg_scatter.append("g")
           .attr("class", "axisX")
           .attr('id', "axis--x")
           .attr("transform", "translate(0," + height_pca + ")")
           .call(xAxis);


        // y axis
        svg_scatter.append("g")
            .attr("class", "axisY")
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

function getLegendPCA(button_pushed){
    //LEGEND FOR AIRPORTS WORLDMAP --------------------
    if(button_pushed == 'Airport'){
        legend_pca.append("g")
                    .append("rect")
                    .attr("id", "legend_box")
                    .attr("x", 2)
                    .attr("y", 2)
                    .attr("width",115)
                    .attr("height", 65)
                    .attr("rx", 8)
                    .attr('fill','#F8F8FF')
                    .attr("opacity",0.7)
                    .attr('stroke-width',2)
                    .attr('stroke','black')
                    .style("border-width", "5px")
                    .style("border-radius", "5px")
                    .style("padding", "5px")
    
        legend_pca.append("circle")
                    .attr("r", 4)
                    .attr("cx",15)
                    .attr("cy",20)
                    .style("fill","#f03b20")

        legend_pca.append("text")
                    .style("fill", "#000000")
                    .attr("x",25)
                    .attr("y", 25)
                    .style("font-size", "15px")
                    .text(button_pushed)
    
        legend_pca.append("circle")
                    .attr("r", 4)
                    .attr("cx",15)
                    .attr("cy",40)
                    .style("fill","#266DD3")

        legend_pca.append("text")
                    .style("fill", "#000000")
                    .attr("x",25)
                    .attr("y", 45)
                    .style("font-size", "15px")
                    .text('Destinations')
    }
    else if(button_pushed == 'Country'){
        legend_pca.append("g")
                    .append("rect")
                    .attr("id", "legend_box")
                    .attr("x", 2)
                    .attr("y", 2)
                    .attr("width",115)
                    .attr("height", 65)
                    .attr("rx", 8)
                    .attr('fill','#F8F8FF')
                    .attr("opacity",0.7)
                    .attr('stroke-width',2)
                    .attr('stroke','black')
                    .style("border-width", "5px")
                    .style("border-radius", "5px")
                    .style("padding", "5px")
    
        legend_pca.append("circle")
                    .attr("r", 4)
                    .attr("cx",15)
                    .attr("cy",20)
                    .style("fill","#f03b20")

        legend_pca.append("text")
                    .style("fill", "#000000")
                    .attr("x",25)
                    .attr("y", 25)
                    .style("font-size", "15px")
                    .text(button_pushed)
    
        legend_pca.append("circle")
                    .attr("r", 4)
                    .attr("cx",15)
                    .attr("cy",40)
                    .style("fill","#266DD3")

        legend_pca.append("text")
                    .style("fill", "#000000")
                    .attr("x",25)
                    .attr("y", 45)
                    .style("font-size", "15px")
                    .text('Destinations')
    
    }
    
}


