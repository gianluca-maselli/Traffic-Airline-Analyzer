
function getValue(element){
    var btnValue = element.innerText;
    /*
    cb = document.getElementsByClassName('mCheckbox')[0]
    cb.addEventListener('change', function(){
        some_var = this.checked
        console.log(this.value)
    })*/

    
    
    console.log(btnValue)
    d3.queue()
        .defer(d3.json, "world.topojson")
        .defer(d3.csv, "./dataset/airports2.csv")
        .defer(d3.csv, "./dataset/routes2.csv")
        .defer(d3.csv, "./dataset/airlines.csv")
        .defer(d3.csv, "./dataset/worldCountry.csv")
        .await(ready);

        function ready(error, data, airports, routes2, airlines,worldCountry){
            var countries = topojson.feature(data,data.objects.countries).features
            //console.log(countries)
            //AIRLINE ROUTES CONNECTION --------------------
            links = drawFlights(routes2)
            //console.log(links)
            svg.selectAll("#init_map").remove()
            // MAP BUILDING ---------------
            svg.selectAll(".country")
                .data(countries)
                .enter()
                .append("path")
                .attr("class", "country")
                .attr("d",path) //coordinates of country borders
                .style("stroke", "#fff")
                .style("stroke-width", "0.2")
                .attr("fill", "#b8b8b8")
                .on("mouseover", function(d){
                    d3.select(this).classed("selected", true);
                        //qui qualcosa si può inserire per quando si cliccal una nazione
                        // si potrebbe zoommare sulla nazione e vedere gli aereoporti ed i suoi collegamenti
                        // le classi si gestiscono poi nel css per dare effetti
        
                })
                .on("mouseout", function(d){
                    d3.select(this).classed("selected", false);
            
                })
               
            if(btnValue=="Airport"){
                svg.selectAll("#point-airports").remove()
                svg.selectAll("#Country_c").remove()
                
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
                    .on("click", function(d){
                        
                        tot_d_a = f_click(d,links,airports)
                        // console.log(tot_d_a)
                        if(tot_d_a[0]>0){
                        //barplot design
                           barPlot(routes2, airlines,d.Airport_ID)
                           svg_legend.selectAll("*").remove()
                           heatMap_country(data,links,d.Airport_ID,airports,worldCountry)
                           document.getElementById("check1").checked = true;
                           document.getElementById("check2").checked = false;
                           //svg_legend.selectAll("*").remove()
                           //heatMap_country(data,links,d.Airport_ID, airports,worldCountry)
                           let allCheckBox = document.querySelectorAll('.mCheckbox')
                            allCheckBox.forEach((checkbox) => { 
                                checkbox.addEventListener('change', (event) => {
                                    if (event.target.checked) {
                                        //console.log(event.target.value)
                                        
                                        if(event.target.value == "continents"){
                                            svg_heat.selectAll("*").remove()
                                            svg_legend.selectAll("*").remove()
                                            //svg_heat.selectAll("#heatMap-continents").remove()
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
                            svg_legend.selectAll("*").remove()
                            missing()
                        }
                    })
            }
            //DA SISTEMARE
            else if(btnValue=="Country"){
                
                svg.selectAll("#point-airports").remove()
                svg.selectAll("#flights_d").remove()
                svg.selectAll("#flights_color").remove()
                svg.selectAll("#Country_c").remove()
                svg_air_inf.selectAll("*").remove()
                svg_bar.selectAll("*").remove()
                svg_heat.selectAll("*").remove()
                svg_legend.selectAll("*").remove()

                document.getElementById("check1").checked = true;
                document.getElementById("check2").checked = false;

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
                        //qui qualcosa si può inserire per quando si cliccal una nazione
                        // si potrebbe zoommare sulla nazione e vedere gli aereoporti ed i suoi collegamenti
                        // le classi si gestiscono poi nel css per dare effetti
                        
                })
                .on("mouseout", function(d){
                    d3.select(this).classed("selected", false);
                    
                })
                .on("click", function(d){
                    console.log(d.properties.name)
                    //DA FARE E SISTEMARE ZOOM
                })
                
            }
            else{ console.log("sono vuoto")}

    
    }  

    
        
}