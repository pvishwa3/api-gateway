app.controller("menuSettingsController", [ '$scope', '$timeout','$routeParams','$location',function($scope,$timeout,$routeParams,$location) {

	$scope.theme = window.localStorage.getItem("themeType")
	
	if(angular.equals($routeParams.action,"editWidget")){
		$scope.fileName = 'templates/Create-Widget.html';
	}else {
		$scope.fileName = 'templates/CreateDashboard.html';
	}

	$("#mainnav-container.mainnav-container-class").css({"width":"250px"});
	$('.mainnav-toggle').click(function(){
		if($(".addClass").hasClass("mainnav-lg")){			
			$(".addClass").removeClass("mainnav-lg");
			$(".addClass").addClass("mainnav-sm");
			$("#mainnav-container.mainnav-container-class").css({"width":""});
		}else{
			$("#mainnav-container.mainnav-container-class").css({"width":"250px"});
			$(".addClass").addClass("mainnav-lg");
			$(".addClass").removeClass("mainnav-sm");
		}
	});

	$("#mainnav-menu > li > a").click(function(){
		if($(this).parent('li').find("ul").hasClass("in")){
			$(this).parent('li').find("ul").removeClass("in")
			$(this).parent("li").removeClass("active-sub active")
		}else{
			if($(this).parent('li').has("ul")){
				$("li > ul").removeClass("in");
				$("ul#mainnav-menu > li").removeClass("active")
				$("ul#mainnav-menu > li").removeClass("active-sub");
				$("ul#mainnav-menu > li").removeClass("active-sub active")
				if($(this).parent("li").find("ul").hasClass("in")){
					$(this).parent("li").find("ul").removeClass("in");
					console.log($(this).prop('id'));
				}else{				
					$(this).parent("li").find("ul").addClass("in");	
					$(this).parent("li").addClass("active-sub active")
				}
			}
		}
	});

	var count = 0;
	$scope.$watch('fileName', function(newValue, oldValue) {
		if(!angular.equals(newValue, oldValue)){			
			if(oldValue == "templates/Create-Widget.html"){
				delete $location.$$search.action;
				delete $location.$$search.widgetId;
				$location.$$compose();
				$timeout(function(){		        	
					$scope.fileName = newValue;
				},500);
			}
		}
	});




	$("li#mainnav-submenu > a").click(function(){
		console.log($(this).find("ul").attr('class'));

		if($(this).next().hasClass("in")){
			$(this).next().removeClass("in")
			$(this).parent("li").removeClass("active-sub active")
		}else{
			$(this).next().addClass("in");
			$(this).parent("li").addClass("active-sub active")
		}
	});



	if($routeParams.page){
		$scope.url = $routeParams.page;
		switch($routeParams.page){
		case "dashboard":
			$scope.fileName="templates/CreateDashboard.html";
			break;
		case "widgets":
			$scope.fileName="templates/Create-Widget.html";
			break;
		case "alerts":
			$scope.fileName="templates/alerts.html";
			break;
		case "rules":
			$scope.fileName="templates/rule-details.html";
			break;
		case "events":
			$scope.fileName="templates/events.html";
			break;
		case "spaces":
			$scope.fileName="templates/spaces/spaces.html";
			break;
		case "mitre":
			$scope.fileName ="templates/Miter.html";
			break;
		case 'eventCategory':
			$scope.fileName = 'templates/condition-category.html';
			break;
		case 'extractFields':
			$scope.fileName="templates/FiledExtractor.html";
			break;
		case "investigation":
			$scope.fileName = "templates/ContentManagement/investgation.html";
			break;
		case "workbenchTab":
			$scope.fileName ="templates/ContentManagement/workbench-tab.html";
			break
		case "irp":
			$scope.fileName="templates/irp.html";
			break;
		case "threatConfig":
			$scope.fileName = "templates/notification.html";
			break;
		case "fieldMapping":
			$scope.fileName = "templates/ti-field-mappings.html";
			break;
		case "users":
			$scope.fileName = "templates/manageusers.html";
			break;
		case "simulation":
			$scope.fileName="templates/logsimulator_simulation.html";
			break;
		case "simulationEvents":
			$scope.fileName = "templates/logsimulator_eventdetails.html";
			break;
		case "attacks":
			$scope.fileName ="templates/logsimulator_attackdetails.html";
			break;
		case "fields":
			$scope.fileName = "templates/logsimulator_fielddetails.html";
			break;
		case "ondemand":
			$scope.fileName ="templates/logsimulationOnDemandGen.html";
			break;
		case "manageFeed":
			$scope.fileName = "templates/manageFeed.html";
			break;
		case "indicator":
			$scope.fileName = "templates/threatIntel-whitelist.html";
			break;
		case "asset":
			$scope.fileName = "templates/assetManagement.html";
			break;
		case "userSettings":
			$scope.fileName = "templates/userSettings.html";
			break;
		case "tags":
			$scope.fileName = "templates/tags.html";
			break;

		case "devices":
			$scope.fileName = "templates/logDevices.html";
			break;

		case "caseGroups":
			$scope.fileName = "templates/CaseAgeGroupConfig.html";
			break;
		case "colorSettings":
			$scope.fileName = "templates/color-configuration.html"
				break;

		case "lookup-config":
			$scope.fileName = "templates/lookup-config.html"
				break;

		case "confiureAttributes":
			$scope.fileName = "templates/DomainTypeAttributes.html"
				break;

		case "logSources":
			$scope.fileName = "templates/collection.html"
				break;

		case "reportHistory":
			$scope.fileName = "templates/ReportHistory.html"
				break;
		case "slaPolicies" :
			$scope.fileName = "templates/SlaConfiguration.html"
				break;
			
		case "active-directory" :
			$scope.fileName = "templates/ActiveDirectory.html"
				break;
		case "reference-set" :
			$scope.fileName = "templates/ReferenceSet.html"
				break;
		
		case "retention" :
			$scope.fileName = "templates/RetentionPolicy.html"
				break;
			
		case "device-manager" :
			$scope.fileName = "templates/DeviceManager.html"
				break;
		
		case  "collector-manager" :
			$scope.fileName = "templates/Device-Collector.html"
				break;
		}

	}

}]);