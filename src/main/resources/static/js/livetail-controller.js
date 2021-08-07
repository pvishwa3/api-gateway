app.controller("liveTrail", ['$scope', 'liveTrailFactory','$rootScope','$timeout','$location','$uibModal','$sce','$window','$stomp', function ($scope, liveTrailFactory,$rootScope, $timeout,$location,$uibModal,$sce,$window,$stomp) {
	//$rootScope.isDashboadPage = false;

	$rootScope.$broadcast('changeThemeToNormal');
	
	var self = this;

	$scope.liveThreats = [];

	$scope.filter = "";

	$scope.searchText  = "";

	var cache = [];

	var stomp ;


	$scope.loglines = [];
	var MAX_LINES = 50;

	$scope.disableRunButton = false;


	var paused = false;

	var lineIdCounter =0;

	var lastTimespan ;

	$scope.leave =  function(e){
		console.log(e);
	}

	$scope.unloadMessage = function() {
		return "You have unsaved changes";
	}



	$scope.pauseNewsTicker = function(){
		
	}


	$scope.checkForConnection = function(){

		liveTrailFactory.checkForConnection().then(function (response) {
			if(response.data){
				//$scope.setConfirmUnload(true);
				$scope.disableRunButton = true;
				
				connectToStomp();
			}
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});

	}
	$scope.checkForConnection();

	$scope.runLiveTrail = function(){

		$scope.messageData = {"filter":$scope.searchFilter}
		liveTrailFactory.connetToKafka($scope.messageData).then(function (response) {
			if(response.data.status=="true"){
				//$scope.setConfirmUnload(true);
				$scope.disableRunButton = true;

				connectToStomp();

			}
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});

	}



	$scope.highlight = function(text) {
		if ($scope.searchText==="") {
			return $sce.trustAsHtml(text);
		}
		return $sce.trustAsHtml(text.replace(new RegExp($scope.searchText, 'gi'), '<span class="text-danger">$&</span>'));
	};


	//$scope.initTicker();

	$scope.stopLiveTrail = function(){
		$scope.disableRunButton = false;
		liveTrailFactory.disconnectFromkafka().then(function (response) {
			if(response.data.status=="true"){

			}
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});

		$stomp.disconnect().then(function () {
			$log.info('disconnected')
		})
	}
	
	$scope.clearLog = function(){
		
		$scope.loglines =[];
	}


	function connectToStomp(){
		$stomp.connect('/secured/kafka', {})
		.then(function (frame) {

			var subscription = $stomp.subscribe('/secured/user/queue/specific-user', 
					function (payload, headers, res) {
				if(Object.keys(payload).length!=0){
					payload.Timestamp = Date.now()
					payload.fomratedTime = moment(payload.Timestamp).format("YYYY-MM-DD HH:mm:ss");
					saveEntry(payload)
				}
				
			});

			//$stomp.send('/ti_client_rest/app/score', '');
		});
	}


	$scope.pause = function(){
		if(paused){

			for(var i=0;i<cache.length;i++){
				pushEntryIntoScope(cache[i]);
			}
			cache = [];
			updateLogBoard();
			paused = false;
		}else{
			paused = true;
		}

	}

	function saveEntry(entry){
		if(paused){
			while(cache.length> MAX_LINES){
				cache.shift()
				
				cache.push(entry);
			}
		}else{
			pushEntryIntoScope(entry);

		}
	}

	function pushEntryIntoScope(entry){
		entry.id = lineIdCounter++;
		if (lineIdCounter === Number.MAX_VALUE) {
			lineIdCounter = 0;
		}
		//var currentTimeStamp =  moment(entry.Timestamp).format("YYYY-MM-DD HH:mm:ss:sss");
	
		
		$scope.loglines.push(entry);
		lastTimespan = entry.Timestamp;
		updateLogBoard();
	}
	function  updateLogBoard(){
		$scope.loglines.sort(logsorter);
		while ($scope.loglines.length > MAX_LINES)
			$scope.loglines.shift()
			$scope.$$phase || $scope.$apply();
		var scroller = document.getElementById("autoscroll");
		scroller.scrollTop = scroller.scrollHeight;
	}

	function showMessage(line, color) {
		lastTimespan = lastTimespan + 1;
		pushEntryIntoScope({
			Timestamp: lastTimespan,
			Line: line,
			color: color
		});
	};

	function logsorter(a,b){
		if (a.Timestamp < b.Timestamp)
			return -1;
		else if (a.Timestamp > b.Timestamp)
			return 1;
		else
			return 0;
	}

	function sleep(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds){
				break;
			}
		}
	}




self.historyBack = function(){
	window.history.back();
}
}]);


