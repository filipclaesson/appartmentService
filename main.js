var booli = require('./booliGetter');
var SL = require('./SLGetter');
var Postgres = require('./postgres_caller');

counter = 0;
var Appartments = ""

/* 
 * FuncationName: saveSLData - gets the SL data and saves it to an array
 * 			data: the array with distanceVariables
 */
var saveSLData = function(SLdata){
	//2 resp. response from SL api with distance variables
	if (SLdata.isSuccess){
		console.log('--- getting SL data booliApts: ' + (counter+1) + ' of ' + Appartments.length + ' : Success')
		Appartments[counter].distanceVariables = SLdata.variables
	}else{
		console.log('--- getting SL data booliApts: ' + (counter+1) + ' of ' + Appartments.length + ' : Success')
	}
	getNextDelay()
}

/* 
 * FuncationName: SendBooliDataToSLAPI - takes array with appartments and sends it to 
 * 			data: the array with distanceVariables
 */
var SendBooliDataToSLAPI = function(booliAppartments){
	console.log("--------------------------------------------------")
	console.log("Step 2: Get response from Booli: " + booliAppartments.length + " apartments ...")
	console.log("--------------------------------------------------")
	Appartments = booliAppartments;
	if (Appartments.length > 0) {
		console.log("--------------------------------------------------")
		console.log("Step 3: sending booli data to SL ...");
		console.log("--------------------------------------------------")
		SL.calcDistVars(Appartments[counter].lon, Appartments[counter].lat, 'apts', saveSLData);
	}
}
function getNext(){
	counter = counter + 1;
	if (counter < Appartments.length){
		var func = SL.calcDistVars(Appartments[counter].lon, Appartments[counter].lat, 'apts', saveSLData)
	}
	else{
		console.log("--------------------------------------------------")
		console.log("Step 4: SL Data Complete ...");
		console.log("--------------------------------------------------")
		console.log("--------------------------------------------------")
		console.log(" Step 5: Send SL and Booli Data to DB ...");
		console.log("--------------------------------------------------")
		Postgres.insertMulti(Appartments, function(){console.log(" ------ Everything is finished ------")})
	}	
}

function getNextDelay(){
	setTimeout(getNext, 2000);
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
// booli.getAppartments(process.argv[3],process.argv[3], SendBooliDataToSLAPI);
booli.getAppartments(process.argv[2], process.argv[3], SendBooliDataToSLAPI);

