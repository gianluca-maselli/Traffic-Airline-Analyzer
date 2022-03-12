function init_maps(data,world,heatmap,scatter,barplot){

    var countries = topojson.feature(data,data.objects.countries).features
    if(world == 'WorldMap'){
        // MAP BUILDING INIT ---------------
        svg.selectAll(".country_init")
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
    }
    if(heatmap == 'Heatmap'){
        // HEATMAP BUILDING INIT ---------------
        svg_heat.selectAll(".nation")
            .data(countries)
            .enter()
            .append("path")
            .attr("d",pathHeat)
            .attr("fill","#b8b8b8")
    }
    if(scatter == 'PCA'){
        var x = d3.scaleLinear()
            .domain([-2.5, 17.5])
            .range([ 0, width_pca ])

        var y = d3.scaleLinear()
            .domain([-4, 8])
            .range([ height_pca, 0]);
    
        var xAxis = d3.axisBottom(x)
        var yAxis = d3.axisLeft(y)

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
    }
    if(barplot == 'Barplot'){
        // X axis
        var initl = ['Airline1', 'Airline2', 'Airline3', 'Airline4']
        var x = d3.scaleBand()
                    .range([ 0, width])
                    .domain(initl.map(function(d) { 
                        return d;
                     }))
                    .padding(0.5);
    
    
        svg_bar.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            
        // Add Y axis
        var y = d3.scaleLinear()
                    .domain([0, 100])
                    .range([ height, 0]);
        svg_bar.append("g")
                .attr("class", "axisY")
                .call(d3.axisLeft(y));

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
                
    }
}