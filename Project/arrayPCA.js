
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