var booli = require('./booliGetter');
var SL = require('./SLGetter');
var Postgres = require('./postgres_caller');

counter = 0;
var Apartments = "";
var geoLocationsToLookup = [];
var SLGeodata = [];

/* 
 * FuncationName: saveSLData - gets the SL data and saves it to an array
 * 			data: the array with distanceVariables
 */
var saveSLData = function(SLdata){
	//2 resp. response from SL api with distance variables
	if (SLdata.isSuccess){
		console.log('--- getting SL data for lookup: ' + (counter+1) + ' of ' + geoLocationsToLookup.length + ' : Success')
		geoLocationsToLookup[counter].distanceVariables = SLdata.variables
	}else{
		console.log('--- getting SL data for lookup: ' + (counter+1) + ' of ' + geoLocationsToLookup.length + ' : Success')
	}
	getNextDelay()
}

/* 
 * FuncationName: SendBooliDataToSLAPI - takes array with apartments and sends it to 
 * 			data: the array with distanceVariables
 */
var SendBooliDataToSLAPI = function(booliApartments){
	console.log("--------------------------------------------------")
	console.log("Step 2: Get response from Booli: " + booliApartments.length + " apartments ...")
	console.log("--------------------------------------------------")
	Apartments = booliApartments;
	if (Apartments.length > 0) {
		Postgres.insertMultiApartments(Apartments, checkGeoPositionAndSendToSL())
		
		console.log("--------------------------------------------------")
		console.log("Step 3: sending booli data to SL ...");
		console.log("--------------------------------------------------")
		
	}
}
function getNext(){
	counter = counter + 1;
	if (counter < geoLocationsToLookup.length){
		var func = SL.calcDistVars(geoLocationsToLookup[counter].lon, geoLocationsToLookup[counter].lat, 'apts', saveSLData)
	}
	else{
		console.log("--------------------------------------------------")
		console.log("Step 4: SL Data Complete ...");
		console.log("--------------------------------------------------")
		console.log("--------------------------------------------------")
		console.log(" Step 5: Send SL and Booli Data to DB ...");
		console.log("--------------------------------------------------")
		
		Postgres.insertMultiSLgeo(geoLocationsToLookup, function(){console.log(" ------ Everything is finished ------")})
	}	
}

function getNextDelay(){
	setTimeout(getNext, 3000);
}

/*  ------  MAIN  ------
 * Step 1: Send data to Booli ...
 * Step 2: Get response from Booli: 
 * Step 3: sending booli data to SL ...
 * Step 4: SL Data Complete ...
 * Step 5: Send SL and Booli Data to DB ...
*/

console.log("--------------------------------------------------")
console.log("Step 1: Send data to Booli ...")
console.log("--------------------------------------------------")
// booli.getApartments(process.argv[3],process.argv[3], SendBooliDataToSLAPI);
var startDate = process.argv[2].substr(0,4) + process.argv[2].substr(5,2) + process.argv[2].substr(8,2)
var endDate = process.argv[3].substr(0,4) + process.argv[3].substr(5,2) + process.argv[3].substr(8,2)
console.log(startDate + " " + endDate);
booli.getApartments(process.argv[2], process.argv[3], SendBooliDataToSLAPI);


function isLookupPosition(geopos, positionsToday){
	isLookup = true;
	for (j in positionsToday){
		if (positionsToday[j]["lon"] == geopos["lon"] && positionsToday[j]["lat"] == geopos["lat"]){
			isLookup = false;
		}
	}
	console.log(isLookup)
	return isLookup;
}

function checkGeoPositionAndSendToSL(callback){
	Postgres.runQuery("select lon,lat from geo_data_sl limit 1000", function(data){
			for (i in Apartments){
					appGeoPos = {lon: parseFloat(Apartments[i].lon).toFixed(3), lat: parseFloat(Apartments[i].lat).toFixed(3)};
					if (isLookupPosition(appGeoPos, data.data)){
						geoLocationsToLookup.push(appGeoPos);
					}
				}
			console.log(geoLocationsToLookup)
			SL.calcDistVars(geoLocationsToLookup[counter].lon, geoLocationsToLookup[counter].lat, 'apts', saveSLData);
	})

}
