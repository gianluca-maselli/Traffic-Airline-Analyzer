
function getArrayPCA(airports,airlines,routes2){
    linksArr = drawFlights2(routes2)
    arrPCA = []
    dictPCA = {}
    fileName = "dataPCA"
    delimiter = ";"
    //console.log(linksArr)
    for(i=0;i<airports.length;i++){
        airportID = airports[i].Airport_ID
        destinations = get_airport_destinations(airportID,linksArr)
        airlines = get_airport_airlines(airportID,linksArr,airlines)
        tot_flights = get_total_flights(airportID,linksArr)
        //console.log(destinations)
        if(destinations.length>0){
            dictPCA = {
                "AirportID": airportID,
                "Destination_Airports": destinations,
                "Airlines": airlines,
                "Tot_Flights": tot_flights
            }
            arrPCA.push(dictPCA)
        }
        //break
        
    }
    //console.log(arrPCA)
    let arrayHeader = ["AirportID","Destination_Airports","Airlines","Tot_Flights"];
    export_csv(arrayHeader,arrPCA, delimiter, fileName)
    
    
}


function get_airport_airlines(airportID,linksArr,airlines){
    airlines = []
    air_used = []
    for(j=0; j<linksArr.length;j++){
        if(airportID == linksArr[j][0][2]){
            airlines.push(linksArr[j][0][1])
        
        }
       
    }
    
    
    $.each(airlines, function(i, el){
        if($.inArray(el, air_used) === -1) air_used.push(el);
    });
    return air_used
}

function get_total_flights(airportID,linksArr){
    var tot_flights = 0
    airID = airportID
    for(s=0;s<linksArr.length;s++){
        source_airID = linksArr[s][0][2]
        dest_airID = linksArr[s][0][4]
        if(airID == source_airID || airID == dest_airID){
            tot_flights++

        }
    }
    return tot_flights
}
function export_csv(arrayHeader, arrayData, delimiter, fileName) {
    let header = arrayHeader.join(delimiter) + '\n';
    let csv = header;
    arrayData.forEach( obj => {
        let row = [];
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                row.push(obj[key]);
                
            }
        }
        csv += row.join(delimiter)+"\n";
        console.log(csv)
    });

    let csvData = new Blob([csv], { type: 'text/csv' }); 
    let csvUrl = URL.createObjectURL(csvData);
    

    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName + '.csv';
    hiddenElement.click();
}

function removeSpecialChar(str){
    if(str == null || str == ''){
       return '';
   }
   return str.replace(/[^a-zA-Z0-9 ]/g, '')
}

function getArrayPCA_country(countries,links,airports,airlines, routes2){
    //console.log('ready for pca')
    fileName = "dataPCA_countries"
    delimiter = ";"
    forCSV = {}
    toPrint = []
    links2 = drawFlights2(routes2)
    flag_new = 0
    for(h=1;h<countries.length;h++){
        country = countries[h].country
        tot_destinations = []
        tot_airl = []
        info = get_country_info(country,links, airports)
        infos = info[0]
        for(l=0;l<infos.length;l++){
            destinations = infos[l].dest_air_ids
            for(s=0;s<destinations.length;s++){
                tot_destinations.push(destinations[s])
            }
            id_airport = infos[l].id_source_c_air

            var airlines_air = []
            //console.log(id_airport)
            for(j=0;j<links2.length;j++){
           
                if(id_airport == links2[j][0][2]){
                    flag_new = 1
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
            if(flag_new==1){
                for(v=0;v<airlines_air.length;v++){
                    tot_airl.push(airlines_air[v])
                }
            }
        }
        //console.log(infos)
        tot_dep = info[1]
        tot_arr = info[2]
        tot_flights = tot_dep+tot_arr
        const counts = {};
        tot_airl.forEach(function(x){
            counts[x] = (counts[x] || 0) + 1;
        })
        var airlines_used = Object.keys(counts)
        //console.log(keys)
        forCSV = {
            'Country': country,
            'Destination_Airports':tot_destinations.length,
            'Airlines': airlines_used.length,
            'Tot_Flights':tot_flights

        }
        toPrint.push(forCSV)

    }
    console.log(toPrint)
    let arrayHeader = ["Country","Destination_Airports","Airlines","Tot_Flights"];
    export_csv(arrayHeader,toPrint, delimiter, fileName)
    
    //one field for pca
    
    //console.log(tot_flights)
    //airports reached for a certain country

}