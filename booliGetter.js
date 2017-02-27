var http = require('http');
var querystring = require('querystring');
var fs = require('fs');


// console.log(getQueryString(1,500,0,20170219, 20170219))


// var handleData = function(data){
// 	console.log("------------ heeeeeeeeej ------------ ")
// 	console.log(data)
// }
// getBooliAppartments(20170219,20170219, handleData);


function getAppartments(minDate, maxDate, callback){
	url = getQueryString(1,500,0,minDate, maxDate);
	http.get(url, function (res) {
		var body = "";
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			var aptList = [];
			var apts = JSON.parse(body); 
			//console.log(apts)
			// ---- Add every apt in list to bigList ---- // 
			for (var i = 0; i < apts.count; i++) {
				apt = setupAptObject(apts.sold[i]);
				aptList.push(apt);
			};
			callback(aptList);
		});
	});
}

function getQueryString(areaCode, limit, offset, minDate, maxDate){
  console.log("getQueryString - areaCode: " + areaCode + ", limit: " + limit + ", offset: " + offset);
  var crypto = require('crypto');
  var shasum = crypto.createHash('sha1');
  var auth2 = {};
  auth2.callerId = "kopbostad";
  auth2.time = Math.round(Date.now() / 1000);
  auth2.unique = crypto.randomBytes(Math.ceil(16/2)).toString("hex").slice(0, 16);
  auth2.hash = shasum.update(auth2.callerId + auth2.time + "PhdlcpnsSbNId0qHmWIyYNivCB6JfgTRwq0vQqU1" + auth2.unique).digest("hex");
  var limitString = "limit=" + limit + "&";
  var areaString = areaCode + "&";
  var offsetString = "offset=" + offset + "&";
  var minDateString = "minSoldDate=" + minDate + "&";
  var maxDateString = "maxSoldDate=" + maxDate + "&";
  var url = "http://api.booli.se/sold?q="+ areaString + minDateString + maxDateString +  limitString + offsetString + querystring.stringify(auth2);
  return url;
}

function setupAptObject(aptIn){
	var apt = {
		booliId: aptIn.booliId,
		address: removeComma(aptIn.location.address['streetAddress']),
		distanceToOcean: distanceToOcean(aptIn.location.distance),
		// distanceToOcean: aptIn.location.distance['ocean'],
		areas: (aptIn.location.namedAreas).toString(),
		lon: aptIn.location.position.longitude,
		lat: aptIn.location.position.latitude,  	
	    room: checkNumber(aptIn.rooms),
	    floor: checkNumber(aptIn.floor),
	    sqm: checkNumber(aptIn.livingArea),
	    listPrice: checkNumber(aptIn.listPrice),
	    priceUp: checkNumber(aptIn.soldPrice - aptIn.listPrice),
	    soldPrice: checkNumber(aptIn.soldPrice),
	    rent: checkNumber(aptIn.rent),
	    constructionYear: checkNumber(aptIn.constructionYear),
	    objectType: aptIn.objectType,
	    broker: aptIn.source.name,
	    brokerId: aptIn.source.id,
		brokerType: aptIn.source.type,
	}
	return apt;
}

function removeComma(text){
  return text.replace(/,/g , "newchar");
}

function checkNumber(data){
  if (typeof data != "number"){ 
    return undefined
  }else{
    return data
  }
}

function distanceToOcean(distance){
	if (distance == undefined){
		return undefined;
	}else{
		return distance['ocean']
	}
}


module.exports = {
  getAppartments: getAppartments
}

