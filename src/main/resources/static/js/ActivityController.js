app.controller("activityController", ['$scope', 'conditionFactory','$rootScope','$timeout','$uibModal','conditionCategoryFactory','conditionCategoryFactory','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder' ,'conditionTypeFactory','$ngConfirm','$location','Acvitity',function ($scope, conditionFactory,$rootScope, $timeout,$uibModal,conditionCategoryFactory,conditionCategoryFactory,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,conditionTypeFactory,$ngConfirm,$location,Acvitity) {

	var self = this;

	var dataTable ;

	$scope.acvitity = new Acvitity();

	$rootScope.$broadcast('changeThemeToNormal');

	$scope.eventId = 0;

	$scope.filterQUery = "";

	$scope.startTime = moment(new Date()).startOf('day');

	$scope.endTime = moment(new Date());;
	var search = $location.search().startTime;


	$scope.evetName = "Events";
	$scope.eventSearch = "";


	self.loadEventsData = function(eventId){
		blockCurrentElement("datatable-activity");

		conditionFactory.loadEventsData(eventId,$scope.startTime,$scope.endTime,$scope.filterQUery).then(function (response){


			$scope.cols = [];


			self.eventsInformation = response.data;
			if(self.eventsInformation.length!=0){


				for(var key in self.eventsInformation[0]){
					$scope.cols.push(key)
				}


				setTimeout(() => {

					dataTable = $("#datatable-activity").DataTable({
						destroy: true,
						scrollY: "500px",
						paging: false,
						searching: false,
						deferRender:    true,
						
						scrollCollapse: true,
						scroller:       true,
						order: [[1, 'asc']],
						
					});

					for(var i=4;i<$scope.cols.length;i++){
						var column = dataTable.column( i );
						column.visible( ! column.visible() );
					}


				}, 1000);

			}

			unblockCurrentElement("datatable-activity");



		},function(error){
			unblockCurrentElement("datatable-activity");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}



	self.loadSingleConitions = function (eventId) {

		blockCurrentElement("events_container");

		conditionFactory.getSingleCondition(eventId,$scope.startTime,$scope.endTime,$scope.filterQUery).then(function (response){
			self.eventChartData = response.data.eventChartData;
			//self.rules = response.data.rules;
			//self.hostNames = response.data.hostDetails;
			var parentResponse = response.data;
			if(sessionStorage.getItem("themeType") && sessionStorage.getItem("themeType")==="theme-dark-full"){




				Highcharts.chart('events_container', {
					chart: {
						type: 'column'
					},
					title: {
						text: ''
					},
					subtitle: {
						text: ''
					},
					xAxis: {
						categories: response.data.catgeories,
						crosshair: true
					},
					yAxis: {
						min: 0,
						title: {
							text: 'Count'
						}
					},
					tooltip: {
						headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
					},
					plotOptions: {
						column: {
							pointPadding: 0.2,
							borderWidth: 0
						}
					},
					series: [{
						name: '',
						data: response.data.values

					}]
				});


				unblockCurrentElement("events_container");




			}else{



				Highcharts.chart('events_container', {
					chart: {
						type: 'column'
					},
					title: {
						text: ''
					},
					subtitle: {
						text: ''
					},
					xAxis: {
						categories: response.data.catgeories,
						crosshair: true
					},
					yAxis: {
						min: 0,
						title: {
							text: 'Count'
						}
					},
					tooltip: {
						headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
					},
					plotOptions: {
						column: {
							pointPadding: 0.2,
							borderWidth: 0
						}
					},
					series: [{
						name: 'Events',
						data: response.data.values

					}]
				});

				unblockCurrentElement("events_container");



			}











		},function(error){
			unblockCurrentElement("events_container");	
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});

	}
	if (typeof search != "undefined") {

		if( typeof $location.search().filterQUery != "undefined"){
			$scope.filterQUery = $location.search().filterQUery; 
		}else{
			$scope.filterQUery = "*"
		}


		$scope.startTime = $location.search().startTime; 
		$scope.endTime = $location.search().endTime; 
		$scope.eventId =  $location.search().eventId;

		$('.events-daterange-ranges span').html(moment(parseInt($scope.startTime)).format('MM/DD/YYYY HH:mm:ss') + ' - ' + moment(parseInt($scope.endTime)).format('MM/DD/YYYY HH:mm:ss'));


		self.loadSingleConitions($scope.eventId);
		self.loadEventsData($scope.eventId);
	}
	self.loadAllConditions = function(){

		conditionFactory.getAllConditions().then(function (response){
			self.conditionDetails = response.data;

			if(self.conditionDetails.length>0){

				if($scope.eventId!=0){
					for(var j=0;j<self.conditionDetails.length;j++){
						if(self.conditionDetails[j].id===parseInt($scope.eventId)){
							$scope.evetName = self.conditionDetails[j].conditionName;
						}
					}
				}else{
					$scope.eventId = self.conditionDetails[0].id;
					$scope.evetName = self.conditionDetails[0].conditionName;
					self.loadSingleConitions(self.conditionDetails[0].id);
				}
			}

		},function(error){
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}


	var dateRange = 	$('.events-daterange-ranges').daterangepicker({
		timePicker: true,
		format: 'MM/DD/YYYY',


		showWeekNumbers: true,
		opens: 'right',
		drops: 'down',

		ranges: {
			'Last 15 Min': [moment(new Date()).subtract(15, 'minutes'), moment(new Date())],
			'Last 30 Min': [moment(new Date()).subtract(30, 'minutes'), moment(new Date())],
			'Last 1 Hour': [moment(new Date()).subtract(1, 'hours'), moment(new Date())],
			'Last 4 Hour': [moment(new Date()).subtract(4, 'hours'), moment(new Date())],
			'Last 12 Hour': [moment(new Date()).subtract(12, 'hours'), moment(new Date())],
			'Today': [moment(new Date()).startOf('day'), moment(new Date()).endOf('day')],
			'Yesterday': [moment(new Date()).subtract(1, 'days').startOf('day'), moment(new Date()).subtract(1, 'days').endOf('day')],
			'Last 7 Days': [moment(new Date()).subtract(6, 'days'), moment(new Date())],
			'Last 30 Days': [moment(new Date()).subtract(29, 'days'), moment(new Date())],
			'This Month': [moment(new Date()).startOf('month'), moment(new Date()).endOf('month')],
			'Last Month': [moment(new Date()).subtract(1, 'month').startOf('month'), moment(new Date()).subtract(1, 'month').endOf('month')]
		},
		buttonClasses: ['btn', 'btn-sm'],
		applyClass: 'btn-success',
		cancelClass: 'btn-default',
		separator: ' to ',
		locale: {
			applyLabel: 'Submit',
			cancelLabel: 'Cancel',
			fromLabel: 'From',
			toLabel: 'To',
			customRangeLabel: 'Custom',
			daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			firstDay: 1
		}
	}, function (start, end, label) {

		var object = $(this);
		var timePcikerId = object[0].element[0].id

		var startDate ;
		var endDate = moment(new Date());

		if(label==="Last 15 Min"){
			startDate = moment(new Date()).subtract(15, 'minutes');


		}
		if(label==="Last 30 Min"){
			startDate = moment(new Date()).subtract(30, 'minutes');

		}
		if(label==="Last 1 Hour"){
			startDate = moment(new Date()).subtract(1, 'hours');
		}
		if(label==="Last 4 Hour"){
			startDate = moment(new Date()).subtract(4, 'hours');
		}
		if(label==="Last 12 Hour"){
			startDate = moment(new Date()).subtract(12, 'hours');
		}
		if(label==="Today"){
			startDate = moment(new Date()).startOf('day');
		}
		if(label==="Yesterday"){
			startDate = moment(new Date()).subtract(1, 'days').startOf('day');
			endDate = moment(new Date()).subtract(1, 'days').endOf('day');
		}
		if(label==="Last 7 Days"){
			startDate = moment(new Date()).subtract(6, 'days');
		}
		if(label==="Last 30 Days"){
			startDate = moment(new Date()).subtract(30, 'days')
		}
		if(label==="This Month"){
			startDate = moment(new Date()).startOf('month')
		}
		if(label==="Last Month"){
			startDate = moment(new Date()).subtract(1, 'month').startOf('month');
		}


		if(label==="Custom"){

			$('.events-daterange-ranges span').html(start.format('YYYY/MM/DD HH:mm:ss') + ' - ' + moment(end).format('YYYY/MM/DD HH:mm:ss'));
			$scope.startTime = start;
			$scope.endTime = end;

		}else{
			$('.events-daterange-ranges span').html(label);
			$scope.startTime = startDate;
			$scope.endTime = endDate;
		}


		self.loadSingleConitions($scope.eventId);
		self.loadEventsData($scope.eventId);

	});


	$scope.getEventInformation = function(eventId,eventName){
		$scope.evetName = eventName;


		self.loadSingleConitions(eventId)

		self.loadEventsData(eventId);

		$scope.eventId = eventId;

		$scope.eventSearch = "";


	}



	$scope.showInformation = function(id){

		conditionFactory.getEventsBasedOnId($scope.eventId,$scope.startTime,$scope.endTime,id).then(function (response){

			$scope.eventSingleInformation = response.data;


			$("#event_details_modal").modal();
			unBlock();

		},function(error){
			unBlock();
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}

	$scope.cols = [];





	$scope.addOrDeleteColumn= function(data){
		var column = dataTable.column( data );
		column.visible( ! column.visible() );
	}

	$scope.search = function(){


		self.loadSingleConitions($scope.eventId);
		self.loadEventsData($scope.eventId);



	}




}]);



function blockCurrentElement(container){
//	$("#"+container).block({
//		message: '<i class="icon-spinner9 spinner"></i>',
//		overlayCSS: {
//			backgroundColor: '#fff',
//			opacity: 0.8,
//			cursor: 'wait'
//		},
//		css: {
//			border: 0,
//			padding: 0,
//			backgroundColor: 'none'
//		}
//	});
}


function unblockCurrentElement(container){
//	$("#"+container).unblock();
}

app.factory('Acvitity', function($http) {
	var Acvitity = function() {
		this.items = [];
		this.busy = false;
		this.after = '';
	};

	Acvitity.prototype.nextPage = function() {
		if (this.busy) return;
		this.busy = true;

		var url = "https://api.reddit.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";

	};

	return Acvitity;
});

