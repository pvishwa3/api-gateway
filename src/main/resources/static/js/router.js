app.config([ '$routeProvider', '$stateProvider',
		function($routeProvider, $stateProvider) {

			$routeProvider.when("/search", {
				templateUrl : "templates/kibana.html",
				// controller : "incidentController"
				requiresAuthentication : true,
				permissions : [ "ROLE_COMPANY_ADMIN", "ROLE_COMPANY_USER" ]
			}).when("/incidents-details", {

			}).when("/settings", {
				templateUrl : "templates/settings.html",
				requiresAuthentication : true,
				permissions : [ "ROLE_COMPANY_ADMIN", "ROLE_COMPANY_USER" ]

			}).when("/livetrail", {
				templateUrl : "templates/livetail.html",
				requiresAuthentication : true,
				permissions : [ "ROLE_COMPANY_ADMIN", "ROLE_COMPANY_USER" ]

			}).when("/upgrade", {
				templateUrl : "templates/upgrade.html",
				requiresAuthentication : true,
				permissions : [ "ROLE_COMPANY_ADMIN", "ROLE_COMPANY_USER" ]

			}).when("/logshipper", {
				templateUrl : "templates/logshipper.html"
			}).when("/alerts", {
				templateUrl : "templates/alerts.html",
			}).when("/dashboard", {
				templateUrl : "templates/main-dashboard.html"

			}).when("/shipper", {
				templateUrl : "templates/logshipper.html"

			}).when("/viewdashboards", {
				templateUrl : "templates/kibana.html"

			}).when("/source_management", {
				templateUrl : "templates/sourceManagement.html"
			}).when("/viewvisualizations", {
				templateUrl : "templates/kibana.html"

			}).when("/management", {
				templateUrl : "templates/kibana.html"

			}).when("/rules", {
				templateUrl : "templates/rule-details.html"
			}).when("/condition", {
				templateUrl : "templates/condition_new.html",
			}).when("/condition-subcategory", {
				templateUrl : "templates/eventsubcategory.html",
			}).when("/condition-category", {
				templateUrl : "templates/condition-category.html",
			}).when("/condition-type", {
				templateUrl : "templates/condition-type.html",
			}).when("/grokdebugger", {
				templateUrl : "templates/grok-debugger.html",
			}).when("/colors", {
				templateUrl : "templates/colorChooser.html",
				controller : "colorController"
			}).when("/incidents", {
				templateUrl : "templates/incidents.html"
			}).when("/logCollection", {
				templateUrl : "templates/collection.html"
			}).when("/users", {
				templateUrl : "templates/manageusers.html"
			}).when("/extract-fields", {
				templateUrl : "templates/FiledExtractor.html"
			}).when("/widgets", {
				templateUrl : "templates/Create-Widget.html"

			}).when("/dashboards", {
				templateUrl : "templates/CreateDashboard.html",
				controller : "dashboardController"

			}).when("/organisations", {
				templateUrl : "templates/company-details.html"
			})

			.when("/dataset", {
				templateUrl : "templates/dataset/data-set.html",
				controller : "dataSetController"

			}).when("/AlertProfile", {
				templateUrl : "templates/alerts.html"

			}).when("/reports", {
				templateUrl : "templates/Reports.html"

			}).when("/activity", {
				templateUrl : "templates/Activity.html",

			}).when("/index", {
				templateUrl : "index.html",
				controller : "bodyController"
			}).when("/cases", {
				templateUrl : "templates/case.html"
			}).when("/cases-history", {
				templateUrl : "templates/CaseHistory.html"
			}).when("/cortex/analysis", {
				templateUrl : "templates/cortex-jobs.html",
				controller : "cortexJobsController"
			}).when("/logsimulator", {
				templateUrl : "templates/logsimulator.html",
				controller : "logsimulationController"
			}).when("/caseTemplate", {
				templateUrl : "templates/CaseTemplate.html",
				controller : "caseTemplateController"
			}).when("/simulation", {
				templateUrl : "templates/logsimulator_simulation.html"
			}).when("/event_details", {
				templateUrl : "templates/logsimulator_eventdetails.html"
			}).when("/attacks_details", {
				templateUrl : "templates/logsimulator_attackdetails.html"
			}).when("/field_details", {
				templateUrl : "templates/logsimulator_fielddetails.html"
			}).when("/generate-report", {
				templateUrl : "templates/Reports.html"
			}).when("/load-report", {
				templateUrl : "templates/generate-report.html"
			}).when("/analyzers", {
				templateUrl : "templates/analyzers.html"
			}).when("/intelligences", {
				templateUrl : "templates/core-intelligence.html"
			}).when("/feeds", {
				templateUrl : "templates/feeds.html"
			}).when("/metrics", {
				templateUrl : "templates/metrics.html"
			}).when("/investigation", {
				templateUrl : "templates/investigation.html"
			}).when("/manageFeed", {
				templateUrl : "templates/manageFeed.html"
			}).when("/threatIntel", {
				templateUrl : "templates/ThreatIntel.html"
			}).when("/threatStats", {
				templateUrl : "templates/threatStats.html"
			}).when("/notification", {
				templateUrl : "templates/notification.html"
			}).when("/ti-whitelist", {
				templateUrl : "templates/threatintel-whitelist.html"
			}).when("/panel", {
				templateUrl : "templates/ContentManagement/investgation.html"
			}).when("/workbenchtab", {
				templateUrl : "templates/ContentManagement/workbench-tab.html"
			}).when("/investigations", {
				templateUrl : "templates/workbench/workbench.html"
			}).when("/ondemand", {
				templateUrl : "templates/logsimulationOnDemandGen.html"
			}).when("/dashboard-new", {
				templateUrl : "templates/Dashboard_new.html"
			}).when("/irp", {
				templateUrl : "templates/irp.html"
			}).when("/adminsettings", {
				templateUrl : "templates/adminSettings.html"
			}).when("/securityoverview", {
				templateUrl : "templates/securityoverview.html"
			}).when("/menusettings", {
				templateUrl : "templates/menusettings.html"
			}).when("/mitre", {
				templateUrl : "templates/Miter.html"
			}).when("/home", {
				templateUrl : "templates/home.html"
			}).when("/events", {
				templateUrl : "templates/events.html"
			}).when("/extractFields", {
				templateUrl : "templates/FiledExtractor.html"
			}).when("/ManageDashboards", {
				templateUrl : "templates/CreateDashboard.html"
			}).when("/tags", {
				templateUrl : "templates/tags.html"
			}).when("/devices", {
				templateUrl : "templates/log_device_new.html"
			}).when("/caseGroups", {
				templateUrl : "templates/CaseAgeGroupConfig.html"
			}).when("/logSources", {
				templateUrl : "templates/collection.html"
			}).when("/reportHistory", {
				templateUrl : "templates/ReportHistory.html"
			}).when("/slaPolicies", {
				templateUrl : "templates/SlaConfiguration.html"
			}).when("/reference-set", {
				templateUrl : "templates/ReferenceSet.html"
			}).when("/active-directory", {
				templateUrl : "templates/ActiveDirectory.html"
			}).when("/device-manager", {
				templateUrl : "templates/DeviceManager.html"
			}).when("/indicator", {
				templateUrl : "templates/threatIntel-whitelist.html"
			}).when("/assets", {
				templateUrl : "templates/assetManagement.html"
			}).when("/colorSettings", {
				templateUrl : "templates/color-configuration.html"
			}).when("/collector-manager", {
				templateUrl : "templates/Device-Collector.html"
			}).when("/logfields",{
				templateUrl : "templates/Log_fields.html"
			}).when("/stmp",{
				templateUrl : "templates/SMTPConfig.html"
			}).when("/ueba-config",{
				templateUrl : "templates/UEBA_Configuration.html"
			}).when("/ueba-coalescing",{
				templateUrl : "templates/UEBACoalescing.html"
			}).when("/integrations",{
				templateUrl : "templates/Integrations.html"
			})
			.when("/jira",{
				templateUrl : "templates/JiraConnection.html"
			})
			.when("/misp",{
				templateUrl : "templates/misp/misp.html"
			}).when("/explore",{
               templateUrl : "templates/explore/explore.html"
            }).when("/threat-map",{
                templateUrl : "templates/threatintel/threatintel.html"
             }).when("/historical",{
                templateUrl : "templates/historical/Historical.html"
             }).when("/ilm",{
                 templateUrl : "templates/ilm/ilm.html"
             }).when("/risk",{
                templateUrl : "templates/risk/riskconfiguration.html"
             }).when("/acl",{
                  templateUrl : "templates/acl/acl.html"
             });
			
			//integrations
		} ]);

app.config([ '$qProvider', function($qProvider) {
	$qProvider.errorOnUnhandledRejections(false);
} ]);

angular.module('siem').factory('sessionHelper',
		[ "$rootScope", "$q", "$window", function($rootScope, $q, $window) {
			var sessionHelper = {
				responseError : function(response) {

					if (response.status == -1) {
						 $window.location = '/user-logout';

						// location.reload();
					}
					if (response.status == 401) {
						$window.location = '/user-logout';
					}
					if (response.data.status == 2) {
						if ($rootScope.alert) {
							$rootScope.alert(response.data.msg);
						}
					}
					return $q.reject(response);
				}
			};
			return sessionHelper;
		} ]);

app.factory('responseObserver', function responseObserver($q, $window) {
	return {
		'responseError' : function(errorResponse) {

			if (errorResponse.data.data === 'Invalid Licence') {
				$window.location = './error-invalid-license.html';
				delete $sessionStorage.user;
				delete $rootScope.user;
				delete $window.localStorage;
			}

			return $q.reject(errorResponse);
		}
	};
});

app.config(function($httpProvider) {

	//$httpProvider.interceptors.push('responseObserver');
	//$httpProvider.interceptors.push('sessionHelper');

});

angular.module('siem').config(
		function($translateProvider, $translatePartialLoaderProvider) {
			$translatePartialLoaderProvider.addPart('cboard');
			$translateProvider.useLoader('$translatePartialLoader', {
				urlTemplate : 'i18n/{lang}/{part}.json'
			});

			$translateProvider.preferredLanguage(settings.preferredLanguage);

		});