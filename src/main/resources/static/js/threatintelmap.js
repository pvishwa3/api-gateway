
app.controller("threatIntelMapController", ['$scope','threatStatsFactory','$window','$stomp',function ($scope,threatStatsFactory,$window,$stomp) {
L.mapbox.accessToken = "pk.eyJ1IjoicHZpc2h3YTMiLCJhIjoiY2pqN2o3ZmhuMjA3djNxbGtpeGlzeG0wMCJ9.VJAx4hLRQcRYHlkrmmBIXQ";


var map = L.mapbox.map("map", "mapbox.dark", {
    center: [0, 0], // lat, long
    zoom: 2,
    zoomControl: false
});

L.mapbox.styleLayer('mapbox://styles/pvishwa3/ckg14j4nz2vos19qysns4xrsb').addTo(map);

//L.control.fullscreen().addTo(map);

// hq coords


var svg = d3.select(map.getPanes().overlayPane).append("svg")
.attr("class", "leaflet-zoom-animated")
.attr("width", window.innerWidth)
.attr("height", window.innerHeight);

function translateSVG() {
    var viewBoxLeft = document.querySelector("svg.leaflet-zoom-animated").viewBox.animVal.x;
    var viewBoxTop = document.querySelector("svg.leaflet-zoom-animated").viewBox.animVal.y;

    // Resizing width and height in case of window resize
    svg.attr("width", window.innerWidth);
    svg.attr("height", window.innerHeight);

    // Adding the ViewBox attribute to our SVG to contain it
    svg.attr("viewBox", function () {
        return "" + viewBoxLeft + " " + viewBoxTop + " "  + window.innerWidth + " " + window.innerHeight;
    });

    // Adding the style attribute to our SVG to translate it
    svg.attr("style", function () {
        return "transform: translate3d(" + viewBoxLeft + "px, " + viewBoxTop + "px, 0px);";
    });
}

function update() {
    translateSVG();
    // additional stuff
}

// Re-draw on reset, this keeps the markers where they should be on reset/zoom
map.on("moveend", update);

function calcMidpoint(x1, y1, x2, y2, bend) {
    if(y2<y1 && x2<x1) {
        var tmpy = y2;
        var tmpx = x2;
        x2 = x1;
        y2 = y1;
        x1 = tmpx;
        y1 = tmpy;
    }
    else if(y2<y1) {
        y1 = y2 + (y2=y1, 0);
    }
    else if(x2<x1) {
        x1 = x2 + (x2=x1, 0);
    }

    var radian = Math.atan(-((y2-y1)/(x2-x1)));
    var r = Math.sqrt(x2-x1) + Math.sqrt(y2-y1);
    var m1 = (x1+x2)/2;
    var m2 = (y1+y2)/2;

    var min = 2.5, max = 7.5;
    //var min = 1, max = 7;
    var arcIntensity = parseFloat((Math.random() * (max - min) + min).toFixed(2));

    if (bend === true) {
        var a = Math.floor(m1 - r * arcIntensity * Math.sin(radian));
        var b = Math.floor(m2 - r * arcIntensity * Math.cos(radian));
    } else {
        var a = Math.floor(m1 + r * arcIntensity * Math.sin(radian));
        var b = Math.floor(m2 + r * arcIntensity * Math.cos(radian));
    }

    return {"x":a, "y":b};
}

function translateAlong(path) {
    var l = path.getTotalLength();
    return function(i) {
        return function(t) {
            // Put in try/catch because sometimes floating point is stupid..
            try {
            var p = path.getPointAtLength(t*l);
            return "translate(" + p.x + "," + p.y + ")";
            } catch(err){
            console.log("Caught exception.");
            return "ERROR";
            }
        }
    }
}

function handleParticle(msg, srcPoint) {
    var i = 0;
    var x = srcPoint['x'];
    var y = srcPoint['y'];

    svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 1e-6)
        .style('fill', 'none')
        //.style('stroke', d3.hsl((i = (i + 1) % 360), 1, .5))
        .style('stroke', msg.color)
        .style('stroke-opacity', 1)
        .transition()
        .duration(2000)
        .ease(Math.sqrt)
        .attr('r', 35)
        .style('stroke-opacity', 1e-6)
        .remove();

    //d3.event.preventDefault();
}

function handleTraffic(msg, srcPoint, hqPoint) {
    var fromX = srcPoint['x'];
    var fromY = srcPoint['y'];
    var toX = hqPoint['x'];
    var toY = hqPoint['y'];
    var bendArray = [true, false];
    var bend = bendArray[Math.floor(Math.random() * bendArray.length)];

    var lineData = [srcPoint, calcMidpoint(fromX, fromY, toX, toY, bend), hqPoint]
    var lineFunction = d3.svg.line()
        .interpolate("basis")
        .x(function(d) {return d.x;})
        .y(function(d) {return d.y;});

    var lineGraph = svg.append('path')
            .attr('d', lineFunction(lineData))
            .attr('opacity', 0.8)
            .attr('stroke', msg.color)
            .attr('stroke-width', 4)
            .attr('fill', 'none');

    if (translateAlong(lineGraph.node()) === 'ERROR') {
        console.log('translateAlong ERROR')
        return;
    }

    var circleRadius = 6

    // Circle follows the line
    var dot = svg.append('circle')
        .attr('r', circleRadius)
        .attr('fill', msg.color)
        .transition()
        .duration(700)
        .ease('ease-in')
        .attrTween('transform', translateAlong(lineGraph.node()))
        .each('end', function() {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('r', circleRadius * 2.5)
                .style('opacity', 0)
                .remove();
    });

    var length = lineGraph.node().getTotalLength();
    lineGraph.attr('stroke-dasharray', length + ' ' + length)
        .attr('stroke-dashoffset', length)
        .transition()
        .duration(700)
        .ease('ease-in')
        .attr('stroke-dashoffset', 0)
        .each('end', function() {
            d3.select(this)
                .transition()
                .duration(100)
                .style('opacity', 0)
                .remove();
    });
}

function handleStaticTraffic(msg, srcPoint, hqPoint) {
    var fromX = srcPoint['x'];
    var fromY = srcPoint['y'];
    var toX = hqPoint['x'];
    var toY = hqPoint['y'];
    var bendArray = [true, false];
    var bend = bendArray[Math.floor(Math.random() * bendArray.length)];

    var lineData = [srcPoint, calcMidpoint(fromX, fromY, toX, toY, bend), hqPoint]
    var lineFunction = d3.svg.line()
        .interpolate("basis")
        .x(function(d) {return d.x;})
        .y(function(d) {return d.y;});

    var lineGraph = svg.append('path')
            .attr('d', lineFunction(lineData))
            .attr('opacity', 0.8)
            .attr('stroke', msg.color)
            .attr('stroke-width', 4)
            .attr('fill', 'none');

    if (translateAlong(lineGraph.node()) === 'ERROR') {
        console.log('translateAlong ERROR')
        return;
    }

    var circleRadius = 6

    // Circle follows the line
    var dot = svg.append('circle')
        .attr('r', circleRadius)
        .attr('fill', msg.color)
        .transition()
        .duration(700)
        .ease('ease-in')
        .attrTween('transform', translateAlong(lineGraph.node()))
        .each('end', function() {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('r', circleRadius * 2.5)
                .style('opacity', 0);

    });

    var length = lineGraph.node().getTotalLength();
    lineGraph.attr('stroke-dasharray', length + ' ' + length)
        .attr('stroke-dashoffset', length)
        .transition()
        .duration(700)
        .ease('ease-in')
        .attr('stroke-dashoffset', 0)
        .each('end', function() {
            d3.select(this)
                .transition()
                .duration(100)
                .style('opacity', 0);

    });
}

var circles = new L.LayerGroup();
map.addLayer(circles);

function addCircle(msg, srcLatLng) {
    circleCount = circles.getLayers().length;
    circleArray = circles.getLayers();

    // Only allow 50 circles to be on the map at a time
    if (circleCount >= 50) {
        circles.removeLayer(circleArray[0]);
    }

    var circle =  L.circle(srcLatLng, 50000, {
        color: msg.color,
        fillColor: msg.color,
        fillOpacity: 0.2,
        }).addTo(circles);

        var str = [];
        str.push(msg.source_country_name);
        str.push(msg.destination_country_name);
        str.push(msg.source_ip);
        str.push(msg.destination_ip);
        circle.bindPopup(str.join(','));
        circle.on('click', getInfoContet );
        //circle.bindPopup(str.join(","));

    }

    function getInfoContet(e){
       var _content = e.target._popup._content;
       var popup = e.target.getPopup();
       threatStatsFactory.getThreatContext(_content.split(',')[3]).then(function(response){
                   if(response.status === 200){
                      var str = [];
                      str.push("<div>")
                      str.push("<table class = 'table table-condensed table_data'>")
                      str.push("<tr>")
                      str.push("<td style= 'width:50%'>Source Country :</td>")
                      str.push("<td>"+_content.split(',')[0]+"</td>")
                      str.push("</tr>")

                     str.push("<tr>")
                     str.push("<td>Destination Country :</td>")
                     str.push("<td>"+_content.split(',')[1]+"</td>")
                     str.push("</tr>")

                    str.push("<tr>")
                    str.push("<td>Source IP :</td>")
                    str.push("<td><a href = '/configuration#!/explore?type=IP&value="+_content.split(',')[2]+"' target='_blank'> "+_content.split(',')[2]+"</a></td>")
                    str.push("</tr>")

                    str.push("<tr>")
                    str.push("<td>Destination IP :</td>")
                     str.push("<td><a href = '/configuration#!/explore?type=IP&value="+_content.split(',')[3]+"' target='_blank'> "+_content.split(',')[3]+"</a></td>")
                    str.push("</tr>")
                    str.push("<tr>")
                    str.push("<td>ISP :</td>")
                    str.push("<td>"+response.data.ISP+"</td>")
                    str.push("</tr>")
                    str.push("<tr>")
                    str.push("<td>City :</td>")
                    str.push("<td>"+response.data.city+"</td>")
                    str.push("</tr>")
                    str.push("<tr>")
                    str.push("<td>TOR :</td>")
                    str.push("<td>"+response.data.tor+"</td>")
                    str.push("</tr>")
                    str.push("</table>")
                    str.push("</div>");

                   popup.setContent( str.join(' ') );
                   }
         });
    }

function prependAttackRow(id, args) {
    var tr = document.createElement('tr');
    count = args.length;

    for (var i = 0; i < count; i++) {
        var td = document.createElement('td');
        if (args[i] === args[2]) {
        var path = 'flags/' + args[i] + '.png';
        var img = document.createElement('img');
        img.src = path;
        td.appendChild(img);
        tr.appendChild(td);
        } else {
        var textNode = document.createTextNode(args[i]);
        td.appendChild(textNode);
        tr.appendChild(td);
        }
    }

    var element = document.getElementById(id);
    var rowCount = element.rows.length;

    // Only allow 50 rows
    if (rowCount >= 50) {
        element.deleteRow(rowCount -1);
    }

    element.insertBefore(tr, element.firstChild);
}

function prependTypeRow(id, args) {
    var tr = document.createElement('tr');
    count = args.length;

    for (var i = 0; i < count; i++) {
        var td = document.createElement('td');
        var textNode = document.createTextNode(args[i]);
        td.appendChild(textNode);
        tr.appendChild(td);
    }

    var element = document.getElementById(id);
    var rowCount = element.rows.length;

    // Only allow 50 rows
    if (rowCount >= 50) {
        element.deleteRow(rowCount -1);
    }

    element.insertBefore(tr, element.firstChild);
}

function prependCVERow(id, args) {
    var tr = document.createElement('tr');

    //count = args.length;
    count = 1;

    for (var i = 0; i < count; i++) {
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var td4 = document.createElement('td');

        // Timestamp
        var textNode2 = document.createTextNode(args[0]);
        td1.appendChild(textNode2);
        tr.appendChild(td1);

        // Exploit
        var textNode = document.createTextNode(args[1]);

        var alink = document.createElement('a');
        alink.setAttribute("href",args[1]);
        alink.setAttribute("target","_blank")
        alink.style.color = "white";
        alink.appendChild(textNode);

        td2.appendChild(alink);
        tr.appendChild(td2);

        // Flag
        var path = 'flags/' + args[2] + '.png';
        var img = document.createElement('img');
        img.src = path;
        td3.appendChild(img);
        tr.appendChild(td3);

        // IP
        var textNode3 = document.createTextNode(args[3]);
        td4.appendChild(textNode3);
        tr.appendChild(td4);
    }

    var element = document.getElementById(id);
    var rowCount = element.rows.length;

    // Only allow 50 rows
    if (rowCount >= 50) {
        element.deleteRow(rowCount -1);
    }

    element.insertBefore(tr, element.firstChild);
}


function redrawCountIP(hashID, id, countList, codeDict) {
    $(hashID).empty();
    var element = document.getElementById(id);

    // Sort ips greatest to least
    // Create items array from dict
    var items = Object.keys(countList[0]).map(function(key) {
        return [key, countList[0][key]];
    });
    // Sort the array based on the second element
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    // Create new array with only the first 50 items
    var sortedItems = items.slice(0, 50);
    var itemsLength = sortedItems.length;

    for (var i = 0; i < itemsLength; i++) {
        tr = document.createElement('tr');
        td1 = document.createElement('td');
        td2 = document.createElement('td');
        td3 = document.createElement('td');
        var key = sortedItems[i][0];
        value = sortedItems[i][1];
        var keyNode = document.createTextNode(key);
        var valueNode = document.createTextNode(value);
        var path = 'flags/' + codeDict[key] + '.png';
        var img = document.createElement('img');
        img.src = path;
        td1.appendChild(valueNode);
        td2.appendChild(img);

        var alink = document.createElement('a');
        alink.setAttribute("href","#");
        alink.setAttribute("class","showInfo");
        alink.style.color = "white";
        alink.appendChild(keyNode);

        td3.appendChild(alink);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        element.appendChild(tr);
    }
}

function redrawCountIP2(hashID, id, countList, codeDict) {
    $(hashID).empty();
    var element = document.getElementById(id);

    // Sort ips greatest to least
    // Create items array from dict
    var items = Object.keys(countList[0]).map(function(key) {
        return [key, countList[0][key]];
    });
    // Sort the array based on the second element
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    // Create new array with only the first 50 items
    var sortedItems = items.slice(0, 50);
    var itemsLength = sortedItems.length;

    for (var i = 0; i < itemsLength; i++) {
        tr = document.createElement('tr');
        td1 = document.createElement('td');
        td2 = document.createElement('td');
        td3 = document.createElement('td');
        var key = sortedItems[i][0];
        value = sortedItems[i][1];
        var keyNode = document.createTextNode(key);
        var valueNode = document.createTextNode(value);
        var path = 'flags/' + codeDict[key] + '.png';
        var img = document.createElement('img');
        img.src = path;
        td1.appendChild(valueNode);
        td2.appendChild(img);

        td3.appendChild(keyNode);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        element.appendChild(tr);
    }
}

function handleLegend(msg) {
    var ipCountList = [msg.ips_tracked,
               msg.iso_code];
    var countryCountList = [msg.countries_tracked,
                msg.iso_code];
    var attackList = [msg.event_time,
              msg.src_ip,
              msg.iso_code,
              msg.country,
              msg.city,
              msg.protocol];
    redrawCountIP('#ip-tracking','ip-tracking', ipCountList, msg.ip_to_code);
    redrawCountIP2('#country-tracking', 'country-tracking', countryCountList, msg.country_to_code);
    prependAttackRow('attack-tracking', attackList);
}

function handleLegendType(msg) {
    var attackType = [msg.type2];
    var attackCve = [msg.event_time,
             msg.type3,
             msg.iso_code,
             msg.src_ip,
             //msg.country,
             //msg.city,
             //msg.protocol
             ];

    if (attackType != "___") {
        prependTypeRow('attack-type', attackType);
    }

    if (attackCve[1] != "___"){
        prependCVERow('attack-cveresp', attackCve);
    }
}
self.loadSingleMessage = function(msg){
//var msg = {src_lat:32.7767,src_long:96.7970,color:'red'}
            var srcLatLng = new L.LatLng(msg.source_latitude, msg.source_longitude);
            var hqPoint = new L.LatLng(msg.destination_latitude, msg.destination_longitude);
            var srcPoint = map.latLngToLayerPoint(srcLatLng);
            var hqPoint1 = map.latLngToLayerPoint(hqPoint);
            console.log('');
            addCircle(msg, srcLatLng);
            handleParticle(msg, srcPoint);
            handleTraffic(msg, srcPoint, hqPoint1, srcLatLng);
            //handleLegend(msg);
            //handleLegendType(msg)

}

self.loadStaticMessages = function(msg){

    var srcLatLng = new L.LatLng(msg.source_latitude, msg.source_longitude);
                var hqPoint = new L.LatLng(msg.destination_latitude, msg.destination_longitude);
                var srcPoint = map.latLngToLayerPoint(srcLatLng);
                var hqPoint1 = map.latLngToLayerPoint(hqPoint);
                console.log('');
                addCircle(msg, srcLatLng);
                handleParticle(msg, srcPoint);
                handleStaticTraffic(msg, srcPoint, hqPoint1, srcLatLng);

}

$scope.threatData = [];

$scope.getHistoricalData = function(){
 threatStatsFactory.getData($scope.dateRangeFilter).then(function(response){
            if(response.status === 200){
               for(var i=0;i<response.data.length;i++){
               var body = response.data[i];
                self.loadStaticMessages(response.data[i]);

                 if($scope.threatData.length>50){
                				    $scope.threatData.pop();
                				}
                				if($scope.tors.length>50){
                				    $scope.tors.pop();
                				}
                				if($scope.attacks.length>50){
                                	$scope.attacks.pop();
                                }
                				if(body.ISP){
                                     $scope.tors.unshift({torIp:body.destination_ip,isp:body.ISP,score:body.fraud_score})
                				}
                				if(body.attack){
                				    $scope.attacks.unshift({attack:body.attack})
                				}
                				let serviceCount = $scope.services.find(e=> e.app === body.app )

                                if(serviceCount != undefined){
                                    serviceCount.count+=1;
                                }else{
                                    $scope.services.unshift({count:1,color:body.color,app:body.app,port:body.source_port});
                                }
                                let sourceCountry  = $scope.sourceCountries.find(e=> e.country_name === body.source_country_name )
                                let destCountry  = $scope.countries.find(e=> e.country_name === body.destination_country_name )
                                if(sourceCountry!=undefined){
                                    sourceCountry.count+=1;
                                }else{
                                    $scope.sourceCountries.unshift({path:"/assets/images/flags/"+body.source_country_code+".png",country_name:body.source_country_name,count:1})
                                }
                                if(destCountry!=undefined){
                                      destCountry.count+=1;
                                 }else{
                                     $scope.countries.unshift({path:"/assets/images/flags/"+body.destination_country_code+".png",country_name:body.destination_country_name,count:1})
                                }




                				$scope.threatData.unshift(body);


               }
               $scope.$apply();
            }
     });


}


self.connectToSession = function(){
    threatStatsFactory.connectToSession().then(function(response){
            if(response.status === 200){
                self.connectToStomp();
            }
     });
}
self.connectToSession();
self.tempCountries = [];
$scope.countries = [];
$scope.sourceCountries = [];
$scope.services = [];
$scope.tors = [];
$scope.attacks = [];
self.connectToStomp = function(){
		$stomp.connect('/siem-core/secured/threat-intel', {})
		.then(function (frame) {

			var subscription = $stomp.subscribe('/secured/user/queue/specific-user',function (payload, headers, res) {
			    var body = JSON.parse(res.body)
				console.log(body);
				self.loadSingleMessage(body);
				if($scope.threatData.length>50){
				    $scope.threatData.pop();
				}
				if($scope.tors.length>50){
				    $scope.tors.pop();
				}
				if($scope.attacks.length>50){
                	$scope.attacks.pop();
                }
				if(body.ISP){
                     $scope.tors.unshift({torIp:body.destination_ip,isp:body.ISP,score:body.fraud_score})
				}
				if(body.attack){
				    $scope.attacks.unshift({attack:body.attack})
				}
				let serviceCount = $scope.services.find(e=> e.app === body.app )

                if(serviceCount != undefined){
                    serviceCount.count+=1;
                }else{
                    $scope.services.unshift({count:1,color:body.color,app:body.app,port:body.source_port});
                }
                let sourceCountry  = $scope.sourceCountries.find(e=> e.country_name === body.source_country_name )
                let destCountry  = $scope.countries.find(e=> e.country_name === body.destination_country_name )
                if(sourceCountry!=undefined){
                    sourceCountry.count+=1;
                }else{
                    $scope.sourceCountries.unshift({path:"/assets/images/flags/"+body.source_country_code+".png",country_name:body.source_country_name,count:1})
                }
                if(destCountry!=undefined){
                      destCountry.count+=1;
                 }else{
                     $scope.countries.unshift({path:"/assets/images/flags/"+body.destination_country_code+".png",country_name:body.destination_country_name,count:1})
                }




				$scope.threatData.unshift(body);
				$scope.$apply();
			});

			//$stomp.send('/ti_client_rest/app/score', '');
		});
}

//self.connectToStomp();








}]);