var booli = require('./booliGetter');
var SL = require('./SLGetter');


var SendDataToSLAPI = function(data){
	console.log("Got" + data.length + " appartments from booli")
	if (data.length > 0) {
		SL.calcDistVarscalcDistVars(positions[counter].lon, positions[counter].lat, positions[counter].name, handleResponse);
	}
	

}

booli.getAppartments(20170219,20170219, SendDataToSLAPI);



SL.calcDistVarscalcDistVars(positions[counter].lon, positions[counter].lat, positions[counter].name, handleResponse);


function getNext(){
	counter = counter + 1;
	if (counter < positions.length){
		var func = distance_to_central_caller.calcDistVars(positions[counter].lon, positions[counter].lat, positions[counter].name, handleResponse)
	}
	else{
		var func = function(){console.log("KLAR!!!")}
	}	
}

function getNextDelay(){
	setTimeout(getNext, 3000);
}
distance_to_central_caller.calcDistVars(positions[counter].lon, positions[counter].lat, positions[counter].name, handleResponse);
