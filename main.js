var booli = require('./booliGetter');
var SL = require('./SLGetter');

counter = 0;
var Appartments = ""





/* 
 * FuncationName: saveSLData - gets the SL data and saves it to an array
 * 			data: the array with distanceVariables
 */
var saveSLData = function(SLdata){
	//2 resp. response from SL api with distance variables
	console.log('--- getting SL data gor booliApts: ' + (counter+1) + ' of ' + Appartments.length + ' ---')
	Appartments[counter].distanceVariables = SLdata.variables
	//console.log(data.variables)
	getNextDelay()
}

/* 
 * FuncationName: SendBooliDataToSLAPI - takes array with appartments and sends it to 
 * 			data: the array with distanceVariables
 */
var SendBooliDataToSLAPI = function(booliAppartments){
	// 1 resp. get booli data response (store the booli data in global variable)
	console.log("Got" + booliAppartments.length + " appartments from booli");
	Appartments = booliAppartments;
	
	if (Appartments.length > 0) {
		console.log("sending booli data to SL");
		//2. call SL api and get distance variables for first element (global variable counter = 0)
		SL.calcDistVars(Appartments[counter].lon, Appartments[counter].lat, 'apts', saveSLData);
	}
}


function getNext(){
	counter = counter + 1;
	if (counter < Appartments.length){
		var func = SL.calcDistVars(Appartments[counter].lon, Appartments[counter].lat, 'apts', saveSLData)
	}
	else{
		// no more appartments -> save to postgresdb
		console.log('KLAR!!!!!')
		console.log(Appartments)
		
	}	
}

function getNextDelay(){
	setTimeout(getNext, 2000);
}



/*  ------  MAIN  ------
 * 1. get booli data between dates
 * 2. call SL api and get distance variables for first element
 * 3. s
 * 2b. Get SL data in each iteration and save to array
 * 3. Save the data to PostgresDatabase
*/

// Get Booli data between dates and execute 
// 1. get booli data between dates
booli.getAppartments(20170101,20170101, SendBooliDataToSLAPI);





