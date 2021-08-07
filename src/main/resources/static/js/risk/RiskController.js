app.controller("riskConfiguration", ['$scope', 'riskFactory','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','referenceSetFactory','eventService', function ($scope, riskFactory , $rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,referenceSetFactory,eventService) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
    $scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';

	$scope.riskLevels = []

	$scope.addRiskLevel = function(){
	    var currentIndex =  $scope.riskLevels.length+1;

        var temparry = [];

	    for(var i=0;i<$scope.riskLevels.length;i++){
	        temparry.push($scope.riskLevels[i].score);
	    }
	     var maxValue
	    if(temparry.length!=0){
	       maxValue =  Math.max(...temparry);
	    }else{
	        maxValue = 10;
	    }


	    $scope.riskLevels.push({"level" :"Level "+currentIndex,score:maxValue+10 })
	}

    $scope.ruleCategories = [];
	self.getAllCategories = function(){
	    eventService.getRuleGroups().then(function(response){
        	self.ruleCategories = angular.copy(response.data);
       });
	}

	self.getAllCategories();

    self.referenceSetDetails = [];
	self.loadReferenceSets = function(){
    		referenceSetFactory.loadReferenceSets().then(function(response){

    			if(response.data.length>0){
    				self.referenceSetDetails = angular.copy(response.data);
    			}



    			//self.activeDirectoryDetails = angular.copy (response.data);
    			//self.tagDetails.forEach(e => e.checked = false);
    		});
    }



    $scope.deleteRiskAssignment = function(index){
        $scope.assignmentDetails.splice(index,1);
    }


    $scope.getValuesBasedOnType = function(data){
        var tempData = [];
        data['currentRiskFactors'] = [];

        if(data.type === 'group'){
         for(var i=0;i<self.referenceSetDetails.length;i++){
                    if(self.referenceSetDetails[i].riskType === parseInt(data.riskFactor)){
                        tempData.push(self.referenceSetDetails[i]);
                    }
          }
           for( var i=0;i<$scope.riskFactors.length;i++){
            if($scope.riskFactors[i].id === parseInt(data.riskFactor) && $scope.riskFactors[i].riskFactor === 'Policy'){
                for(var j=0;j< self.aclDetails.length;j++){
                      tempData.push({id:self.aclDetails[j].id,referenceSetName: self.aclDetails[j].policyName});
                }
             }
           if($scope.riskFactors[i].id === parseInt(data.riskFactor) && $scope.riskFactors[i].riskFactor === 'Alert'){
                  for(var j=0;j< self.ruleCategories.length;j++){
                    tempData.push({id:self.ruleCategories[j].id,referenceSetName: self.ruleCategories[j].groupName});
                 }
              }
           }


         data['currentRiskFactors'] = tempData;
        }
    }

    $scope.getRiskConfig = function(){
        riskFactory.getRiskConfig().then(function(response){
            if(response.data.riskConfig){
                var data = JSON.parse(response.data.riskConfig);
                if(response.data.riskAssingment){
                    var data1 = JSON.parse(response.data.riskAssingment);
                    $scope.assignmentDetails = data1;
                }

                $scope.riskLevels = data.riskLevel
                $scope.riskConfigLevels = data.riskConfig
                $scope.riskConfiguration = data.riskCalculation
                $scope.rowData = data.riskBaseLine;

            }
        });
    }

    $scope.getRiskConfig();

    $scope.deleteRiskConfiguration = function(index){
        $scope.riskConfiguration.splice(index,1);
        $scope.calculateTotalScore();
    }

    self.aclDetails = [];

        self.loadACLS = function(){
            riskFactory.loadACLS().then(function(response){
                    self.aclDetails = angular.copy(response.data);

             });
        }

     self.loadACLS();

    $scope.validateRiskAssigment = function(){
        var tempArray = [];
        for(var i=0;i<$scope.assignmentDetails.length;i++){
            tempArray.push($scope.assignmentDetails[i].value);
        }

       if(new Set(tempArray).size != tempArray.length){
            self.conditionMessagesModal.push({ type: 'danger', msg: "Duplicate Values are not allowed" });
            return false;
       }

        $timeout(function () {
             self.conditionMessagesModal = [];
         }, 2000);
         return true;

    }

    $scope.saveRiskAssigment = function(){

        var isValid = $scope.validateRiskAssigment();
        if(isValid){
             var data = {riskLevel:$scope.riskLevels,riskConfig:$scope.riskConfigLevels,riskCalculation:$scope.riskConfiguration,riskBaseLine:$scope.rowData};

                    var jsonString = JSON.stringify(data);
                    var actualData = {id:0,riskConfig:jsonString,riskAssingment:JSON.stringify($scope.assignmentDetails)};

                       riskFactory.save(actualData).then(function(response){

                            console.log(response);

                       }, function (error) {

                        console.log(error.data)

                     });

        }

    }

    self.loadReferenceSets();

	$scope.deleteRiskLevel = function(index){
	    $scope.riskLevels.splice(index, 1);
	}

    $scope.addRiskAssignment = function(){
        $scope.assignmentDetails.push({riskFactor:'',type:'',value:'',score:0})
    }

    $scope.deleteAssignmentDetails = function(index){
         $scope.assignmentDetails.splice(index, 1);

    }

	$scope.riskConfigLevels = [
    	    {level:"Low",from:0,to:20},
    	    {level:"Medium",from:20,to:50},
    	    {level:"High",from:50,to:70},
    	    {level:"Critical",from:70,to:100}
    ]

    $scope.rowData = [

        {riskBucket:"Warning",level:''},
        {riskBucket:"Low",level:''},
        {riskBucket:"Medium",level:''},
        {riskBucket:"High",level:''},
        {riskBucket:"Critical",level:''},


    ];

    function NumericCellEditor() {
    }

function isCharNumeric(charStr) {
  return !!/\d/.test(charStr);
}
    // gets called once before the renderer is used
    NumericCellEditor.prototype.init = function (params) {
        // create the cell
        this.eInput = document.createElement('input');

        if (isCharNumeric(params.data.riskScore)) {
            this.eInput.value = params.data.riskScore;
        } else {
            if (params.value !== undefined && params.value !== null) {
                this.eInput.value = params.value;
            }
        }

        var that = this;
        this.eInput.addEventListener('keypress', function (event) {
            if (!isKeyPressedNumeric(event)) {
                that.eInput.focus();
                if (event.preventDefault) event.preventDefault();
            } else if (that.isKeyPressedNavigation(event)){
                event.stopPropagation();
            }
        });

        // only start edit if key pressed is a number, not a letter
        var charPressIsNotANumber = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
        this.cancelBeforeStart = charPressIsNotANumber;
    };

    NumericCellEditor.prototype.isKeyPressedNavigation = function (event){
        return event.keyCode===39
            || event.keyCode===37;
    };


    // gets called once when grid ready to insert the element
    NumericCellEditor.prototype.getGui = function () {
        return this.eInput;
    };

    // focus and select can be done after the gui is attached
    NumericCellEditor.prototype.afterGuiAttached = function () {
        this.eInput.focus();
    };

    // returns the new value after editing
    NumericCellEditor.prototype.isCancelBeforeStart = function () {
        return this.cancelBeforeStart;
    };

    // example - will reject the number if it contains the value 007
    // - not very practical, but demonstrates the method.
    NumericCellEditor.prototype.isCancelAfterEnd = function () {
        var value = this.getValue();
        return value.indexOf('007') >= 0;
    };

    // returns the new value after editing
    NumericCellEditor.prototype.getValue = function () {
        return this.eInput.value;
    };

    // any cleanup we need to be done here
    NumericCellEditor.prototype.destroy = function () {
        // but this example is simple, no cleanup, we could  even leave this method out as it's optional
    };

    // if true, then this editor will appear in a popup
    NumericCellEditor.prototype.isPopup = function () {
        // and we could leave this method out also, false is the default
        return false;
    };




    $scope.riskCategories = ["User","Assets","Location","Alert","Event","Threat","Process"];

    $scope.riskConfiguration = [ ];

    $scope.addRiskFactor = function(){
        $scope.riskConfiguration.push({riskFactor:'User',score:0});
    }

    $scope.assignmentDetails = [];

    $scope.totalWeightAge = 0;

    self.conditionMessagesModal =[];

    $scope.saveConfiguraton = function(){
       var result = $scope.validRisklevel();
       var result1 = $scope.validRiskConfiguration();
       var result3 = $scope.validRiskWeightage();

       if($scope.totalWeightAge!=100){
           self.conditionMessagesModal.push({ type: 'danger', msg: "Weight Should be 100" });
           return false;
       }
       $timeout(function () {
       	  self.conditionMessagesModal = [];
       }, 2000);

       var data = {riskLevel:$scope.riskLevels,riskConfig:$scope.riskConfigLevels,riskCalculation:$scope.riskConfiguration,riskBaseLine:$scope.rowData};

        var jsonString = JSON.stringify(data);
        var actualData = {id:0,riskConfig:jsonString,riskAssingment:""};
        if(result && result1 && result3){
           riskFactory.save(actualData).then(function(response){

                console.log(response);

           }, function (error) {

            console.log(error.data)

         });
        }

    }

    $scope.validRisklevel = function(){
        for(var i=0;i<$scope.riskLevels.length;i++){
            if($scope.riskLevels[i+1]){
                if($scope.riskLevels[i+1].score < $scope.riskLevels[i].score){
                  self.conditionMessagesModal.push({ type: 'danger', msg: "Please Enter Valid Risk Score" });
                  return false;
                }
            }

        }
         $timeout(function () {
               	  self.conditionMessagesModal.splice(0, 1);
         }, 2000);

        return true;
    }

    $scope.validRiskWeightage = function(){

     var tempArray = [];
      for(var i=0;i<$scope.riskConfiguration.length;i++){
            tempArray.push($scope.riskConfiguration[i].riskFactor);
      }

      if(new Set(tempArray).size !== $scope.riskConfiguration.length ){
        self.conditionMessagesModal.push({ type: 'danger', msg: "Duplicate Values found Risk Calculation" });
         return false;
      }

     return true;

    }

    $scope.riskFactors = [];

    $scope.getRiskFactors = function(){
         riskFactory.getRiskFactors().then(function(response){
               $scope.riskFactors = angular.copy(response.data);
      }, function (error) {
       console.log(error.data)
        });
   }

    $scope.getRiskFactors();



    $scope.validRiskConfiguration = function(){



        if(parseInt($scope.rowData[0].level.split("-")[0]) >= parseInt($scope.rowData[1].level.split("-")[0])){
           self.conditionMessagesModal.push({ type: 'danger', msg: "Low To Value and Medium From Should be the same" });
            return false;
        }
         if(parseInt($scope.rowData[1].level.split("-")[0]) >= parseInt($scope.rowData[2].level.split("-")[0])){
            self.conditionMessagesModal.push({ type: 'danger', msg: "Low To Value and Medium From Should be the same" });
            return false;
         }

         if(parseInt($scope.rowData[2].level.split("-")[0]) >= parseInt($scope.rowData[3].level.split("-")[0])){
             self.conditionMessagesModal.push({ type: 'danger', msg: "Low To Value and Medium From Should be the same" });
             return false;
         }
          if(parseInt($scope.rowData[3].level.split("-")[0]) >= parseInt($scope.rowData[4].level.split("-")[0])){
            self.conditionMessagesModal.push({ type: 'danger', msg: "Low To Value and Medium From Should be the same" });
            return false;
       }




            $timeout(function () {
              self.conditionMessagesModal = [];
            }, 2000);
            return true;
    }

    $scope.calculateTotalScore = function(){
        $scope.totalWeightAge = 0;
        for(var i=0;i<$scope.riskConfiguration.length;i++){
           $scope.totalWeightAge+= $scope.riskConfiguration[i].score;
         }
    }

    $scope.removeRiskFactor = function(index){
         $scope.riskConfiguration.splice(index,1);
    }




}]);
