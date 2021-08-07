app.controller("dashboardController", ['$scope','widgetService','$rootScope','$timeout','$routeParams','$ngConfirm','$route','Fullscreen','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','$templateRequest','$sce', '$compile', 
	function ($scope, widgetService,$rootScope,$timeout,$routeParams,$ngConfirm,$route,Fullscreen,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,$templateRequest,$sce,$compile){


	var self = this;

	$scope.alertMessagaes = [];

	$scope.search = function (val){
		var to = false;
		if(to) {
			clearTimeout(to);
		}
		to = setTimeout(function () {
			if(self.treeInstance) {
				self.treeInstance.jstree(true).search(val);
			}
		}, 250);
	};
	
	

	$scope.canEditDashboards = false;

	$rootScope.$broadcast('changeThemeToNormal');

	$scope.canCreateDashboards = false;

	$scope.canDeleteDashboards = false;

	$scope.canUpdateDashboards = false;


	self.treeConfig = {
			core : {
				multiple : false,
				animation: true,
				error : function(error) {
					$log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
				},
				check_callback : true,
				worker : true
			},
			contextmenu : {
				'items' : customMenu
			},
			types : {
			default : {
				icon : '/assets/images/folder.png'
			},
			'Dashboard' : {
				icon : 'fa fa-dashboard',

			},
			'Report' :{
				icon: 'fa fa-file-pdf-o'
			}


			},
			version : 1,
			plugins : ['types',"contextmenu","search","sort"]
	};

	self.treeData = [];

	self.categories = [];
	self.allCategories = [];

	self.loadAllCategories = function(){
		widgetService.loadDashboardCategories().then(function (response) {
			self.treeInstance.jstree(true)
			self.categories = response.data;

			for(var i=0;i<self.categories.length;i++){

				if(self.categories[i].parent==='#'){
					self.categories[i]['state'] = {"opened":true}
				}
				if(self.categories[i].type != 'Dashboard'){
					self.allCategories.push(self.categories[i]	);
				}


			}

			angular.copy(self.categories,self.treeData);

		}, function (error) {
			if(error.status== 403){
				$scope.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					$scope.alertMessagaes = [];
				}, 2000);
			}
		});
	}

	self.init = function (){

		self.loadAllCategories();
	}
	self.init();

	self.nodeData= {};

	self.renameCB = function(e,item) {
		$timeout(function() {

			if(item.node.text==="New node"){
				return false;
			}

			if(item.node.id.indexOf("_")!=-1 && item.node.parent.indexOf("_")!=-1){
				self.nodeData = {id:parseInt(item.node.id.split("_")[1]),parentId:parseInt(item.node.parent.split("_")[1]),categoryName:item.node.text}
			}else if(item.node.id.indexOf("_")!=-1) {
				self.nodeData = {id:parseInt(item.node.id.split("_")[1]),parentId:parseInt(item.node.parent),categoryName:item.node.text}
			}else{
				self.nodeData = {id:item.node.id,parentId:parseInt(item.node.parent),categoryName:item.node.text}
			}



			widgetService.saveCategory(self.nodeData).then(function(response){
				if(response.status===201){
					self.treeInstance.jstree(true).redraw();

					$timeout(function(){						
						self.loadAllCategories();
					},150);


					$timeout(function () {
						self.conditionMessages.splice(0, 1);
						$("#createCategory").modal('hide');
					},3000);

					self.init();
				}else{
					if(response.data.errors){
						for(var i=0;i<response.data.errors.length;i++){

							self.conditionMessages.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
						}
					}else{
						self.conditionMessages.push({ type: 'danger', msg: response.data.data });
					}
					$timeout(function () {
						self.conditionMessagesModal.splice(0, 1);
					}, 2000);
				}
			}, function (error) {
				unloader("body");
				if(error.status== 403){
					s$scope.alertMessagaes.push({ type: 'danger', msg: error.data.data });
					$timeout(function () {
						$scope.alertMessagaes = [];
					}, 2000);
				}else if(error.status== 500){
					self.treeInstance.jstree(true).redraw();

					$timeout(function(){		
						$scope.openTreeStructure($scope.tabName);
					},150);
					$scope.alertMessagaes.push({ type: 'danger', msg: 'Unable to create Category. Category Name should be unique.' });
					$timeout(function () {
						$scope.alertMessagaes.splice(0, 1);
					}, 2000);
				}
			});
		});


	};

	self.loadSubCategories = function(id,parent){

		if(parent==="#"){
			parent = "";
		}

		var eventType = "";



		widgetService.getChildCategories(id,parent).then(function(response){
			$scope.subCategories = response.data;

		}, function (error) {
			unloader("body");
			if(error.status== 403){
				$scope.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					$scope.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				$scope.alertMessagaes.push({ type: 'danger', msg: 'Unable to create Category. Category Name should be unique.' });
				$timeout(function () {
					$scope.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});

	}

	this.getNodeInfo = function(e,item){
		$timeout(function() {

			if(item.node.type==="default"){
				for(var i=0;i<self.treeData.length;i++){
					if(item.node.id === self.treeData[i].id){
						self.loadSubCategories(parseInt(item.node.id),self.treeData[i].categoryName);


						var templateUrl = $sce.getTrustedResourceUrl('viewNodeInfo.html');
						$templateRequest(templateUrl).then(function(template) {


							$compile($("#my-element").html(template).contents())($scope);


						}, function() {

						});

					}


				}




			}else{

				self.displayForEdit(parseInt(item.node.id));

			}





		});
	}
	
	$scope.accessList = [];

	$scope.existingAccess = [];

	$scope.accessModel = {name:''};

	$scope.accessData = {id:0,name:'',type:'',access:''}
	self.accessAlerts = [];

	$scope.addToList = function(){

		if($scope.accessModel.name.name=== ''){
			self.accessAlerts.push({ type: 'danger', msg: 'Please Select Role Or User to share ' });
			$timeout(function () {
				self.accessAlerts = [];
			}, 2000);

			return false;
		}
		if($scope.accessData.access === ''){
			self.accessAlerts.push({ type: 'danger', msg: 'Please Select Access ' });
			$timeout(function () {
				self.accessAlerts = [];
			}, 2000);
			return false;
		}

		$scope.accessData.name = $scope.accessModel.name.name
		$scope.accessData.type = $scope.accessModel.name.type;
		$scope.accessData.id = 	$scope.model.id;


		widgetService.shareDashboard($scope.accessData).then(function (response) {

			if(response.status === 201){
				self.accessAlerts.push({ type: 'success', msg: "Successfully share the dashboard" });
				widgetService.loadSingleDashboard($scope.model.id).then(function (response) {
					$scope.model['existingRoles'] = response.data.existingRoles;
				}, function (error) {

				});
			}
			$timeout(function () {
				self.accessAlerts = [];
			}, 2000);


		}, function (error) {

			if(error.status== 403){
				self.accessAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.accessAlerts = [];
				}, 2000);
			}
			if(error.status== 500){
				self.accessAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.accessAlerts = [];
				}, 2000);
			}


		});
	}

	self.getAccessList = function(){
		widgetService.getAccessList().then(function (response) {

			$scope.accessList = response.data;



		}, function (error) {

			if(error.status== 403){
				self.alertMessagaesModal.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaesModal = [];
				}, 2000);
			}


		});
	}
	
	self.getAccessList();
	

	self.displayForEdit = function(id){
loader("body")
		var isFound = false;
		
		$("#my-element").empty();
		
		for(var i = 0; i < $scope.dashboardDetails.length; i++){
			if($scope.dashboardDetails[i].id === id) {
				// self.widget = angular.copy($scope.widgets[i]);
				isFound = true;
				widgetService.loadSingleDashboard(id).then(function (response) {
					
					$scope.name = response.data.name;
					$scope.model = response.data.config;
					$scope.adfModel = response.data.config;

					$scope.model["id"] = id;
					$scope.model['createdBy'] = response.data.createdBy;
					

					$scope.name = response.data.name;
					$scope.model = response.data.config;
					$scope.model["id"] = id;
					$scope.model["tableDataHeaders"] = [];
					$scope.model["tableData"] = [];
					$scope.model['createdBy'] = response.data.createdBy;
					$scope.model['isAdmin'] = response.data.isAdmin;
					$scope.model['isOwner'] = response.data.isOwner;
					$scope.model['isEditor'] = response.data.access;
					$scope.model['existingRoles'] = response.data.existingRoles;
					$scope.model['categoryId'] = response.data.category.toString();$scope.name = response.data.name;
					$scope.model = response.data.config;
					$scope.model["id"] = id;
					$scope.model["tableDataHeaders"] = [];
					$scope.model["tableData"] = [];
					
					$scope.model['isAdmin'] = response.data.isAdmin;
					$scope.model['isOwner'] = response.data.isOwner;
					$scope.model['isEditor'] = response.data.access;
					$scope.model['existingRoles'] = response.data.existingRoles;
					$scope.model['categoryId'] = response.data.category.toString();
					
					if(response.data.report === 'no'){
						$scope.model['reports'] = false;
					}else{
						$scope.model['reports'] = true;
					}
					unloader("body")
					if($scope.model.isAdmin || $scope.model.isOwner || $scope.model.isEditor === 'editor'){
						$scope.canEditDashboards = true;
					}



					if(response.data.reportingDetials){

						$scope.reports = angular.copy(response.data.reportingDetials);
						if($scope.reports.id !=0 ){
							$scope.isRepotsEditable = true;

						}
					}

					for(var i=0;i<response.data.config.widgets.length;i++){
						response.data.config.widgets[i]['col'] = response.data.config.widgets[i]['col'];
						response.data.config.widgets[i]['row'] = response.data.config.widgets[i]['row'];
						response.data.config.widgets[i]['sizeY'] = response.data.config.widgets[i]['sizeY'];
						response.data.config.widgets[i]['sizeX'] = response.data.config.widgets[i]['sizeX'];
						if(typeof response.data.config.widgets[i]['options'] == "string"){
							response.data.config.widgets[i]['options'] = JSON.parse(response.data.config.widgets[i]['options']); 
						}
					}


					self.widgets = response.data.config.widgets;

					$scope.options = {
							startDate: moment(new Date()).subtract(24, 'hours').valueOf(), 
							endDate: moment(new Date()).valueOf(),
							renderAllWidgets:true,
							dateLabel:$scope.dateLable,
							companyName:"All",
							query: "\"{\"bool\":{\"must\":[]}}\""
					}
					var templateUrl = $sce.getTrustedResourceUrl('dashboardInformation.html');
					$templateRequest(templateUrl).then(function(template) {

						$compile($("#my-element").html(template).contents())($scope);
					});




				}, function (error) {

				});

			}
		}
		if(!isFound){
			$scope.alertMessagaes.push({ type: 'danger', msg: "Don't Have Permissions to View Dashbaord " })
		
			$timeout(function () {
				$scope.alertMessagaes = [];
			}, 2000);
		}
	}

	$scope.deleteCategory = function(obj){


		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+obj.text+'</b> Category. Deletion Category Will Delete Dashboards as well. ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						loader("body");
						widgetService.deleteCategory(parseInt(obj.id)).then(function (response) {
							if(response.status===200){
								$scope.alertMessagaes.push({ type: 'success', msg: 'Category was deleted successfully' });
								// toastr.success("Condition was deleted
								// successfully")
								self.treeInstance.jstree(true).redraw();


								$timeout(function(){									
									self.loadAllCategories();
								},150);

								$timeout(function () {
									$scope.alertMessagaes = [];
								}, 2000);
							}

							unloader("body");

						}, function (error) {
							self.treeInstance.jstree(true).redraw();


							$timeout(function(){									
								self.loadCategories();
							},150);

							unloader("body");
							if(error.status== 403){
								$scope.alertMessagaes.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									$scope.alertMessagaes = [];
								}, 2000);
							}

							$timeout(function () {
								$scope.alertMessagaes.splice(0, 1);
							}, 2000);
						});
						return true; 
					}
				},
				close: function(scope, button){
				}
			}
		});


	}


	function customMenu(node){
		var items = {

				"newcategory" : {
					"separator_before"	: false,
					"separator_after"	: false,
					"_disabled"			: false,
					"label"				: "New Category",
					"action"			: function (data) {

						var inst = self.treeInstance.jstree(true);
						var obj = inst.get_node(data.reference);

						if(obj.type!="Dashboard"){	

							inst.create_node(obj, {}, "last", function (new_node) {
								setTimeout(function () { inst.edit(new_node); },0);
							});
						}




					}
				},
				"rename" : {
					"separator_before"	: false,
					"separator_after"	: false,
					"_disabled"			: false, // (this.check("rename_node",
													// data.reference,
													// this.get_parent(data.reference),
													// "")),
					"label"				: "Rename",
					/*
					 * "shortcut" : 113, "shortcut_label" : 'F2', "icon" :
					 * "glyphicon glyphicon-leaf",
					 */
					"action"			: function (data) {
						var inst = self.treeInstance.jstree(true);
						var obj = inst.get_node(data.reference);
						if(obj.type!="Dashboard"){
							inst.edit(obj);
						}
					}
				},

				"newdashboard" : {
					"separator_before"	: false,
					"separator_after"	: false,
					"_disabled"			: false, // (this.check("rename_node",
													// data.reference,
													// this.get_parent(data.reference),
													// "")),
					"label"				: "New Dashboard",

					"action"			: function (data) {
						var inst = self.treeInstance.jstree(true);
						var obj = inst.get_node(data.reference);
						$timeout(function() {
							$scope.displayNewItem();
						});

					}
				},



				"delete" : {
					"separator_before"	: false,
					"separator_after"	: false,
					"_disabled"			: false, // (this.check("rename_node",
													// data.reference,
													// this.get_parent(data.reference),
													// "")),
					"label"				: "Delete Category",

					"action"			: function (data) {
						var inst = self.treeInstance.jstree(true);
						var obj = inst.get_node(data.reference);
						$timeout(function() {
							$scope.deleteCategory(obj);
						});

					}
				},


		}



		return items;
	}

	$scope.displayNewItem = function(){
		var templateUrl = $sce.getTrustedResourceUrl('dashboardInformation.html');
		
		$scope.model.title = "";
		$scope.model.id = 0;
		$scope.model.existingRoles = false;
		delete $scope.model.reports;
		delete $scope.model.isReport;
		delete $scope.model.widgets;
		$scope.model['isAdmin'] = true;
		self.widgets = [];
		$templateRequest(templateUrl).then(function(template) {

			$compile($("#my-element").html(template).contents())($scope);
		});

	}




	$scope.editMode = false;
	self.modalMessagaes = [];

	$scope.gridsterOptions = {
			columns: 6, // the width of the grid, in columns
			pushing: true, // whether to push other items out of the way on
							// move or resize
			floating: true, // whether to automatically float items up so they
							// stack (you can temporarily disable if you are
							// adding unsorted items with ng-repeat)
			swapping: false, // whether or not to have items of the same size
								// switch places instead of pushing down if they
								// are the same size
			colWidth: 'auto', // can be an integer or 'auto'. 'auto' uses the
								// pixel width of the element divided by
								// 'columns'

			margins: [20, 20], // the pixel distance between each widget
			outerMargin: true, // whether margins apply to outer edges of the
								// grid
			sparse: true, // "true" can increase performance of dragging and
							// resizing for big grid (e.g. 20x50)
			isMobile: false, // stacks the grid items if true
			fixRows: false,
			// can be an integer or 'auto'. 'auto' uses the pixel width of the
			// element divided by 'columns'
			rowHeight: '50',

			resizable: {
				enabled: true,
				handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
				start: function(event, $element, widget) {}, // optional
																// callback
																// fired when
																// resize is
																// started,
				resize: function(event, $element, widget) {}, // optional
																// callback
																// fired when
																// item is
																// resized,
				stop: function(event, $element, widget) {
					var id = widget.id;




					Highcharts.charts.forEach(function(chart) {

						console.log("cadid>>>"+$(chart.container).parent().attr("id"))
						if(parseInt($(chart.container).parent().attr("id")) === id){
							var height = $element.height();
							var width = $element.width();

							chart.reflow();
							chart.setSize(width,height);





						}


					});

				} // optional callback fired when item is finished resizing
			},
			draggable: {
				enabled: true, // whether dragging items is supported
				handle: 'h3', // optional selector for drag handle
				start: function(event, $element, widget) {}, // optional
																// callback
																// fired when
																// drag is
																// started,
				drag: function(event, $element, widget) {}, // optional callback
															// fired when item
															// is moved,
				stop: function(event, $element, widget) {

					console.log("stopped");

				} // optional callback fired when item is finished dragging
			}
	};

	$scope.editDashboard = function(){
		$("#edit_dashboard_dialog").modal();
		$("input.ui-select-search.input-xs.ng-pristine.ng-untouched.ng-valid.ng-empty").css("width","864px")
		$scope.reportsForm.$setPristine(); 
		$scope.reportsForm.$setUntouched(); 
	}

	$scope.toggleEditMode = function(){
		if($scope.editMode){
			self.saveDashboard();
			$scope.editMode = false;
		}else{
			$scope.editMode = true;
		}
	}
	self.dashboards = {id:0,title:"",widgets:[]}

	$scope.existingWidgets = [];

	self.widgets = [];

	$scope.addWidget = function(widget){
		var flag = true;
		for(let j=0;j<self.widgets.length;j++){
			if(self.widgets[j].id == widget.id){
				flag = false;
				break;
			}
		}

		if(flag){
			try{			
				widget['col'] = 0;
				widget['row'] = 120;
				widget['sizeX'] = 8; 
				widget['sizeY'] = 6;
				widget.options = JSON.parse(widget.options);
				self.widgets.push(widget);
				self.modalMessagaes.push({type:"success",msg:"Widget added successfully"});	
				$timeout(function(){
					self.modalMessagaes = [];
				},2000);
			}catch(err){
				self.widgets.push(widget);
				self.modalMessagaes.push({type:"success",msg:"Widget added successfully"});
				$timeout(function(){
					self.modalMessagaes = [];
				},2000);
			}
		}else{
			self.modalMessagaes.push({type:"danger",msg:"Widget is already present"});
			$timeout(function(){
				self.modalMessagaes = [];
			},2000);

		}

		$scope.options = { 
				startDate: $scope.startDate, 
				endDate: $scope.endDate,
				renderAllWidgets:false,
				dateLabel:$scope.dateLable,
				companyName:"All",
				query: "\"{\"bool\":{\"must\":[]}}\"",
				singleWidget:widget.id
		}

	}


	$scope.openAddWidgetDialog = function(){
		$("#add_widget_dialog").modal();
	}
	$scope.alertMessagaes =[];
	self.saveDashboard = function(){



		$scope.model['widgets'] = self.widgets;
		if($scope.model.title == undefined || $scope.model.title == '' || $scope.model.categoryId == undefined || $scope.model.categoryId === ''){
			$timeout(function(){
				$scope.alertMessagaes= [];
				$("#edit_dashboard_dialog").modal();
				$("input.ui-select-search.input-xs.ng-pristine.ng-untouched.ng-valid.ng-empty").css("width","864px")
			},2000);
			$scope.alertMessagaes.push({type:"danger",msg:"Please fill all the details in dashboard"});
			return false;
		}

		widgetService.saveDashboard($scope.model).then(function (response) {						
			if(response.data.status){
				$scope.model["id"] = response.data.id;
				self.loadDashboards();
				self.loadAllCategories();
				self.treeInstance.jstree(true).redraw();
				$scope.alertMessagaes.push({type:"success",msg:"Dashboard saved successfully"});		
				
				$("#edit_dashboard_dialog").modal('hide');
			}else{
				if(response.data.errors){
				for(var i=0;i<response.data.errors.length;i++){

					self.alertMessagaes.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
				}
				}else{
					self.alertMessagaes.push({ type: 'danger', msg: response.data.data });
				}
			}
			$timeout(function () {
				self.conditionMessagesModal.splice(0, 1);
			}, 2000);
			self.loadDashboards();
			if(!response.data.status){
				$scope.alertMessagaes.push({type:"danger",msg:response.data.data});						
			}
			$timeout(function(){
				$scope.alertMessagaes= [];
			},2500);

		}, function (error) {
			
			$scope.alertMessagaes.push({type:"danger",msg:error.data.data });
			$timeout(function(){
				$scope.alertMessagaes= [];
			},2500);
		});
	}


	$scope.remove = function(index){

		self.widgets.splice(index,1);
	}

	$scope.startDate =  moment(new Date()).subtract(24, 'hours').valueOf();
	$scope.endDate = moment(new Date()).valueOf();

	$scope.labelName = "Last 24 hours"
		$scope.dateLable = "last24Hours";
	self.dashboards.id;

	$scope.setRelativeTime = function(option,labelName){

		var startDate =moment(new Date());
		var endDate = moment(new Date());

		$scope.labelName = labelName;

		if(option==='last2Days'){
			startDate = moment(new Date()).subtract(2, 'days');
		}
		if(option==='last7Days'){
			startDate = moment(new Date()).subtract(7, 'days');
		}
		if(option==='last30Days'){
			startDate = moment(new Date()).subtract(30, 'days');
		}
		if(option==='last90Days'){
			startDate = moment(new Date()).subtract(90, 'days');
		}
		if(option==='last6months'){
			startDate = moment(new Date()).subtract(6, 'months');
		}
		if(option==='last1year'){
			startDate = moment(new Date()).subtract(1, 'years');
		}
		if(option==='last2years'){
			startDate = moment(new Date()).subtract(2, 'years');
		}
		if(option==='last5years'){
			startDate = moment(new Date()).subtract(2, 'years');
		}
		if(option==='yesterday'){
			startDate = moment(new Date()).subtract(1, 'days').startOf('day');
			endDate = moment(new Date()).subtract(1, 'days').endOf('day');
		}
		if(option==='dayBeforeYesterday'){
			startDate = moment(new Date()).subtract(2, 'days').startOf('day');
			endDate = moment(new Date()).subtract(2, 'days').endOf('day');
		}
		if(option==='thisLastWeek'){
			startDate = moment(new Date()).subtract(7, 'days').startOf('week');
			endDate = moment(new Date()).subtract(7, 'days').endOf('week');
		}
		if(option==='perviousWeek'){
			startDate = moment(new Date()).subtract(1, 'weeks').startOf('week');
			endDate = moment(new Date()).subtract(1, 'weeks').endOf('week');
		}
		if(option==='today'){
			startDate = moment(new Date()).startOf('day');
			endDate = moment(new Date()).endOf('day');
		}
		if(option==='todaySoFar'){
			startDate = moment(new Date()).startOf('day');
		}
		if(option==='thisWeek'){
			startDate = moment(new Date()).startOf('week');
			endDate = moment(new Date()).endOf('week');
		}
		if(option==='thisWeekSoFar'){
			startDate = moment(new Date()).startOf('week');

		}
		if(option==='thisMonth'){
			startDate = moment(new Date()).startOf('month');
			endDate = moment(new Date()).endOf('month');
		}
		if(option==='thisMonthSoFar'){
			startDate = moment(new Date()).startOf('month');

		}
		if(option==='thisYear'){
			startDate = moment(new Date()).startOf('year');
			endDate = moment(new Date()).endOf('year');
		}
		if(option==='thisYearSoFar'){
			startDate = moment(new Date()).startOf('year');
		}

		if(option==='last15Minutes'){
			startDate = moment(new Date()).subtract(15, 'minutes');;

		}

		if(option==='last30Minutes'){
			startDate = moment(new Date()).subtract(30, 'minutes');;

		}

		if(option==='last1Hour'){
			startDate = moment(new Date()).subtract(1, 'hours');;
		}


		if(option==='last3Hours'){
			startDate = moment(new Date()).subtract(3, 'hours');;
		}

		if(option==='last6Hours'){
			startDate = moment(new Date()).subtract(6, 'hours');
		}

		if(option==='last12Hours'){
			startDate = moment(new Date()).subtract(12, 'hours');;
		}

		if(option==='last24Hours'){
			startDate = moment(new Date()).subtract(24, 'hours');;
		}
		$scope.startDate = startDate.valueOf();
		$scope.endDate = endDate.valueOf();
		$scope.dateLable = option;
		$scope.apply();
	}






	$scope.apply = function(){



loader("body")
		widgetService.loadSingleDashboard($scope.model.id).then(function (response) {
			$scope.name = response.data.name;
			$scope.adfModel = response.data.config;
unloader("body");
			for(var i=0;i<response.data.config.widgets.length;i++){
				response.data.config.widgets[i]['col'] = response.data.config.widgets[i]['col'];
				response.data.config.widgets[i]['row'] = response.data.config.widgets[i]['row'];
				response.data.config.widgets[i]['sizeY'] = response.data.config.widgets[i]['sizeY'];
				response.data.config.widgets[i]['sizeX'] = response.data.config.widgets[i]['sizeX'];
				if(typeof response.data.config.widgets[i]['options'] == "string"){
					response.data.config.widgets[i]['options'] = JSON.parse(response.data.config.widgets[i]['options']); 
				}
			}

			self.widgets = response.data.config.widgets;

			$scope.options = { 
					startDate: $scope.startDate, 
					endDate: $scope.endDate,
					renderAllWidgets:true,
					dateLabel:$scope.dateLable,
					companyName:"All",
					query: "\"{\"bool\":{\"must\":[]}}\""
			}





		}, function (error) {

		});
	}


	self.loadDashboards = function(){
		$scope.templateUrl = "viewDashboards.html";
		widgetService.loadAllDashboards().then(function (response) {
			$scope.dashboardDetails = response.data;

		}, function (error) {

		});
	}

	self.loadPermissions = function(){
		widgetService.loadPermissions().then(function (response) {

			if(response.data.indexOf("add dashboards")!=-1){
				$scope.canCreateDashboards = true;
			}
			if(response.data.indexOf("update dashboards")!=-1){
				$scope.canUpdateDashboards = true;
			}
			if(response.data.indexOf("delete dashboards")!=-1){
				$scope.canDeleteDashboards = true;
			}



		}, function (error) {

		});
	}

	self.loadDashboards();
	self.loadPermissions();

	$scope.createDashboards = function(){

		$scope.templateUrl = "viewDashboards.html";
		$scope.name = "New Dashboard";
		$scope.model = {};
		self.widgets = [];
		$scope.templateUrl = "ceateDashboards.html";


	}

	$scope.reloadWidget= function(id,widgetOptions){
		$scope.options = { 
				startDate: $scope.startDate, 
				endDate: $scope.endDate,
				renderAllWidgets:false,
				dateLabel:$scope.dateLable,
				companyName:"All",
				query: "\"{\"bool\":{\"must\":[]}}\"",
				singleWidget:id
		}
		for(var i=0;i<self.widgets.length;i++){
			if(self.widgets[i].id == id){
				self.widgets[i] = angular.copy(self.widgets[i]);
				break;
			}
		}
	}
	
	$scope.deleteRoles = function(id){
		widgetService.deleteRoles(id).then(function (response) {
			if(response.status === 200){
				$scope.model['existingRoles'] = [];


			}
			// $scope.model['existingRoles'] = response.data.existingRoles;
		}, function (error) {
			if(error.status== 403){
				self.accessAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.accessAlerts = [];
				}, 2000);
			}
			if(error.status== 500){
				self.accessAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.accessAlerts = [];
				}, 2000);
			}

		});
	}

	self.reportAlerts = [];

	$scope.deleteReport = function(id){
		widgetService.deleteReports(id).then(function (response) {

			if(response.status){
				self.reportAlerts.push({ type: 'success', msg: "Successfully Deleted the Report." });
				$scope.reports = {id:0,scheduleName:'',emailAddress:'',frequency:'',dashboardId:'',timeRange:'',hourOfDay:'',frequencyType:'',dashboardId:0}
				$scope.isRepotsEditable = false;


			}else{
				self.reportAlerts.push({ type: 'danager', msg: "Unable to Schedule Report " });
			}
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);


		}, function (error) {

			if(error.status== 403){
				self.reportAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.reportAlerts = [];
				}, 2000);
			}
			if(error.status== 500){
				self.reportAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.reportAlerts = [];
				}, 2000);
			}


		});
	}
	
	$scope.isRepotsEditable = false;

	$scope.enableReport = function(){
		$scope.isRepotsEditable = false;
	}
	
	$scope.reports = {id:0,scheduleName:'',emailAddress:'',frequency:'',dashboardId:'',timeRange:'',hourOfDay:'',frequencyType:'',dashboardId:0}


	$scope.saveReports = function(){
		if($scope.reports.scheduleName===''){
			self.reportAlerts.push({ type: 'danger', msg: "Please Enter Title " });
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);
			return false;
		}

		if($scope.reports.frequency===''){
			self.reportAlerts.push({ type: 'danger', msg: "Please Select  Frequency" });
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);
			return false;
		}

		if($scope.reports.hourOfDay===''){
			self.reportAlerts.push({ type: 'danger', msg: "Please Select Hour of Day" });
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);
			return false;
		}

		if($scope.reports.emailAddress===''){
			self.reportAlerts.push({ type: 'danger', msg: "Please Email Address " });
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);
			return false;
		}

		if($scope.reports.hourOfDay===''){
			self.reportAlerts.push({ type: 'danger', msg: "Please Select Hour of Day" });
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);
			return false;
		}
		if($scope.reports.timeRange===''){
			self.reportAlerts.push({ type: 'danger', msg: "Please Select Export Time Range " });
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);
			return false;
		}
		if($scope.reports.frequency!= 'daily'  && $scope.reports.frequencyType===''){
			self.reportAlerts.push({ type: 'danger', msg: "Please Select Ferquency Type" });
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);
			return false;
		}

		$scope.reports.dashboardId = $scope.model.id

		widgetService.saveReprts($scope.reports).then(function (response) {

			if(response.status){
				self.reportAlerts.push({ type: 'success', msg: "Successfully Scheduled the Report." });

				$scope.reports.id = response.data.id;
				$scope.isRepotsEditable = true;


			}else{
				self.reportAlerts.push({ type: 'danager', msg: "Unable to Schedule Report " });
			}
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);


		}, function (error) {

			if(error.status== 403){
				self.reportAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.reportAlerts = [];
				}, 2000);
			}
			if(error.status== 500){
				self.reportAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.reportAlerts = [];
				}, 2000);
			}


		});
	}

	
	
	$scope.edit = function(id){
		
		
		
		for(var i = 0; i < $scope.dashboardDetails.length; i++){
			if($scope.dashboardDetails[i].id === id) {
				// self.widget = angular.copy($scope.widgets[i]);

				widgetService.loadSingleDashboard(id).then(function (response) {
					$scope.name = response.data.name;
					$scope.model = response.data.config;
					$scope.adfModel = response.data.config;

				
					
					$scope.name = response.data.name;
					$scope.model = response.data.config;
					$scope.model["id"] = id;
					$scope.model["tableDataHeaders"] = [];
					$scope.model["tableData"] = [];
					$scope.model['createdBy'] = response.data.createdBy;
					$scope.model['isAdmin'] = response.data.isAdmin;
					$scope.model['isOwner'] = response.data.isOwner;
					$scope.model['isEditor'] = response.data.access;
					$scope.model['existingRoles'] = response.data.existingRoles;
					$scope.model['categoryId'] = response.data.category.toString();$scope.name = response.data.name;
					$scope.model = response.data.config;
					$scope.model["id"] = $scope.model.id;
					$scope.model["tableDataHeaders"] = [];
					$scope.model["tableData"] = [];
					$scope.model['createdBy'] = response.data.createdBy;
					$scope.model['isAdmin'] = response.data.isAdmin;
					$scope.model['isOwner'] = response.data.isOwner;
					$scope.model['isEditor'] = response.data.access;
					$scope.model['existingRoles'] = response.data.existingRoles;
					$scope.model['categoryId'] = response.data.category.toString();
					
					if(response.data.report === 'no'){
						$scope.model['reports'] = false;
					}else{
						$scope.model['reports'] = true;
					}



					if(response.data.reportingDetials){

						$scope.reports = angular.copy(response.data.reportingDetials);
						if($scope.reports.id !=0 ){
							$scope.isRepotsEditable = true;

						}

					for(var i=0;i<response.data.config.widgets.length;i++){
						response.data.config.widgets[i]['col'] = response.data.config.widgets[i]['col'];
						response.data.config.widgets[i]['row'] = response.data.config.widgets[i]['row'];
						response.data.config.widgets[i]['sizeY'] = response.data.config.widgets[i]['sizeY'];
						response.data.config.widgets[i]['sizeX'] = response.data.config.widgets[i]['sizeX'];
						if(typeof response.data.config.widgets[i]['options'] == "string"){
							response.data.config.widgets[i]['options'] = JSON.parse(response.data.config.widgets[i]['options']); 
						}
					}



					$scope.options = {
							startDate: moment(new Date()).subtract(24, 'hours').valueOf(), 
							endDate: moment(new Date()).valueOf(),
							renderAllWidgets:true,
							dateLabel:$scope.dateLable,
							companyName:"All",
							query: "\"{\"bool\":{\"must\":[]}}\""
					}
					self.widgets = response.data.config.widgets;
					$scope.templateUrl = "ceateDashboards.html";

					}


				}, function (error) {

				});

			}
		}
	}

	self.backtoAllDashboards = function(){
		$scope.templateUrl = "viewDashboards.html";
	}

	self.showParentCategory = function(id){


		for(var i=0;i<self.treeData.length;i++){

			if(id === self.treeData[i].id){
				self.loadSubCategories(parseInt(id),self.treeData[i].categoryName);


				var templateUrl = $sce.getTrustedResourceUrl('viewNodeInfo.html');
				$templateRequest(templateUrl).then(function(template) {


					$compile($("#my-element").html(template).contents())($scope);


				}, function() {

				});
			}

		}



	}

	$scope.delete = function(){

		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+$scope.model.title+'</b> Dashboard ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){

						widgetService.deleteDashboard($scope.model.id).then(function (response) {
							if(response.data.status){
								$scope.alertMessagaes.push({ type: 'success', msg: 'Successfully Deleted  Dashboard' });

								self.showParentCategory($scope.model.categoryId);

								$timeout(function () {
									$scope.alertMessagaes.splice(0, 1);
								}, 2000);
								self.treeInstance.jstree(true).redraw();
								self.init();

								self.loadDashboards();
							}

						}, function (error) {

							if(error.status== 403){
								$scope.alertMessagaes.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									$scope.alertMessagaes = [];
								}, 2000);
							}

							$timeout(function () {
								$scope.alertMessagaes.splice(0, 1);
							}, 2000);
						});
						return true;
					}
				},
				close: function(scope, button){
				}
			}
		});
	}


	var self = this;

	$scope.options ;

	$scope.model = {id:0,title:"",permission:"",categoryId:0}


	$scope.rolesArray = [];

	widgetService.loadAllThemes().then(function (response) {

		var themes = response.data.themes;

		var widgets = response.data.widgets;

		var roles =  response.data.roles;
		var rolesArray = [];
		for(let i=0;i<roles.length;i++){
			rolesArray.push(roles[i].rolename);
		}

		$scope.model['themes'] = themes;
		$scope.existingWidgets = widgets;
		$scope.model['roles'] = roles;
		$scope.rolesArray = angular.copy(rolesArray);

	}, function (error) {

	});




	if(window.location.href.indexOf("id")!=-1){


		self.dashboards.id = parseInt($routeParams.id);

		widgetService.loadSingleDashboard($routeParams.id).then(function (response) {
			$scope.name = response.data.name;
			$scope.model = response.data.config;
			$scope.model["id"] = parseInt($routeParams.id);
			$scope.model["tableDataHeaders"] = [];
			$scope.model["tableData"] = [];

			for(var i=0;i<response.data.config.widgets.length;i++){
				response.data.config.widgets[i]['col'] = response.data.config.widgets[i]['col'];
				response.data.config.widgets[i]['row'] = response.data.config.widgets[i]['row'];
				response.data.config.widgets[i]['sizeY'] = response.data.config.widgets[i]['sizeY'];
				response.data.config.widgets[i]['sizeX'] = response.data.config.widgets[i]['sizeX'];

				if(typeof response.data.config.widgets[i]['options'] == "string"){
					response.data.config.widgets[i]['options'] = JSON.parse(response.data.config.widgets[i]['options']); 
				}					
			}


			self.widgets = response.data.config.widgets;

			$scope.options = { 
					startDate: moment(new Date()).subtract(24, 'hours').valueOf() , 
					endDate:moment(new Date()).valueOf(),
					renderAllWidgets:true,
					dateLabel:'teest',
					companyName:"All",
					query: "\"{\"bool\":{\"must\":[]}}\""
			}





		}, function (error) {

		});


	}

	self.historyBack = function(){
		window.history.back();
	}


	$scope.toggleFullScreen = function(id) {
		Fullscreen.enable(document.getElementById(id));
		var width = window.innerWidth;
		var height = window.innerHeight;
		$(".dataTables_scrollBody").css("height","");
		Highcharts.charts.forEach(function(chart) {
			if($(chart).length!=0){
				if(parseInt($(chart.container).parent().attr("id")) === id){
					$scope.fullscreenId = id;
					$scope.fullscreenHeight = $("#"+id).height();
					$scope.fullscreenWidth = $("#"+id).width();
					chart.reflow();
					chart.setSize(width,height);
				}
			}
		});
	}

	document.addEventListener('webkitfullscreenchange', exitHandler, false);
	document.addEventListener('mozfullscreenchange', exitHandler, false);
	document.addEventListener('fullscreenchange', exitHandler, false);
	document.addEventListener('MSFullscreenChange', exitHandler, false);

	function exitHandler() {
		if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
			$(".dataTables_scrollBody").css("height","200px");
			Highcharts.charts.forEach(function(chart) {
				if($(chart).length!=0){
					if(parseInt($(chart.container).parent().attr("id")) === $scope.fullscreenId){
						chart.reflow();
						chart.setSize($scope.fullscreenWidth,$scope.fullscreenHeight);
					}
				}
			});
		}
	}

	$(".navbar-toggler" ).on('click', function(){
		setTimeout(function(){
			window.dispatchEvent(new Event('resize'));
		}, 400);
	});



}]);

app.directive('search', function () {
	return function ($scope, element) {
		element.bind("keyup", function (event) {
			var val = element.val();
			if(val.length > 2) {
				$scope.search(val);
			}
		});
	};
});