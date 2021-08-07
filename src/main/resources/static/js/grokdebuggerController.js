app.controller("grokdebuggerController", ['$scope', 'grokdebuggerFactory','$rootScope', function($scope, grokdebuggerFactory,$rootScope) {
	$scope.text_orig = [];
	grokdebuggerFactory.getAllIndices().then(function(response) {
		console.log(response.data);
		$scope.indices=response.data;
	}, function(err) {
		console.log(err);
	});
	
	$scope.getMsgs = function(indName) {
		grokdebuggerFactory.getAllMsgs(indName).then(function(response) {
			console.log(response.data);
			$scope.text_orig = response.data;
			console.log($scope.text_orig);
			
		}, function(err) {
			console.log(err);
		});
	}
	
	$scope.text_arig='';
	$scope.text='';
	$scope.log;
	$scope.count = 0;
	$scope.isDataWizard = true;
	$scope.header_name = "DATA PARSING WIZARD!";
	$scope.isError = false;
	$scope.pages = [ "isDataWizard", "isParse" ];
	$scope.savedLogs = [];
	$scope.log_count = 0;
	$scope.isMaxCount = false;
	$scope.isSelected = false;
	$scope.count1=0;
	$scope.next = function() {
		
		if ($scope.shippedLogs == undefined) {
			$scope.isError = true;
		} else {
			$scope.isbackTrue=true;
			$scope.count1++;
			$scope.log = $scope.shippedLogs;
			$scope.isParse = true;
			$scope.isDataWizard = false;
			$scope.header_name = "";
			$scope.logName = $scope.shippedLogs;
			$scope.getMsgs($scope.logName);
		}
		if($scope.count1 == 2){
			$scope.isDataWizard = false;
			$scope.isParse = false;
			$scope.isSelected=false;
			$scope.isGrokPage=true;
			$scope.isNextTrue=false;
		}
	}
	$scope.back=function(){
		$scope.count1--;
		$scope.isDataWizard = true;
		$scope.isParse = false;
		$scope.isSelected=false;
		$scope.isNextTrue=true;
		if($scope.count1 == 1){
			$scope.isDataWizard = false;
			$scope.isParse = true;
			$scope.isSelected=false;
			$scope.isNextTrue=true;
			$scope.isbackTrue=true;
		}
	}

	$scope.countLog = 0;
	$scope.saveLog = function(log) {
		if ($scope.countLog >= 5) {
			$scope.isMaxCount = true;
		} else {
			var x = $scope.savedLogs.includes(log);
			if (x === false) {
				$scope.savedLogs[$scope.countLog] = log;
				$scope.countLog++;
				var index = $scope.text.indexOf(log);
				$scope.text_orig.splice(index, 1);
			} else {

			}
		}
	}

	$scope.removeLog = function(log) {
		var index = $scope.savedLogs.indexOf(log);
		$scope.savedLogs.splice(index, 1);
		$scope.countLog--;
		$scope.text_orig.splice(index, 0, log);
	};

	$scope.displayContent = function() {
		$('#closemodal').click(function() {
			$('#myModal').modal('hide');
		});
		$('#myModal').modal('hide');
		if ($scope.savedLogs.length != 0) {
			
			console.log("selected");
			$scope.isSelected = true;
			$scope.fieldType = [ 'Automatic', 'Boolean', 'Date(timestamp)',
					'Double', 'Geolp Enrichment', 'IP', 'KeyWord', 'Long',
					'Geo Point', 'Float', 'Integer', 'Text(Analysed Field)',
					'Short' ];

		}
	}
	$scope.data = {
		pattern : '',
		input : $scope.savedLogs
	};

	$scope.submitData = function() {

		console.log($scope.data);
		grokdebuggerFactory.compileGrok($scope.data).then(function(response) {
			$scope.fieldName = [];
			$scope.sample1 = [];
			$scope.sample2 = [];
			$scope.sample3 = [];
			$scope.sample4 = [];
			$scope.sample5 = [];

			var size = 0;
			for (key in response.data["sample1"]) {
				if (response.data["sample1"].hasOwnProperty(key))
					size++;
			}
			// alert(size);
			for ( var key in response.data) {

				for ( var innerkey in response.data[key]) {

					var key1 = $scope.fieldName.indexOf(innerkey.toString());
					if (key1 == -1) {
						$scope.fieldName.push(innerkey);
					}
					console.log("length=" + response.data[key].length);
					if ($scope.sample1.length < size) {
						$scope.sample1.push(response.data[key][innerkey])
					} else if ($scope.sample2.length < size) {
						$scope.sample2.push(response.data[key][innerkey])
					} else if ($scope.sample3.length < size) {
						$scope.sample3.push(response.data[key][innerkey])
					} else if ($scope.sample4.length < size) {
						$scope.sample4.push(response.data[key][innerkey])
					} else if ($scope.sample5.length < size) {
						$scope.sample5.push(response.data[key][innerkey])
					}
				}
			}
		}, function(err) {
			console.log(err);
		});
	}
}]);