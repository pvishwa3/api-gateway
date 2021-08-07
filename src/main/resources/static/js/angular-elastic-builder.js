/**
 * # angular-elastic-builder-tienvx
 * ## Angular Module for building an Elasticsearch Query
 *
 * @version v1.17.4
 * @link git@github.com:tienvx/angular-elastic-builder.git
 * @license MIT
 * @author Dan Crews <crewsd@gmail.com>
 */

/**
 * angular-elastic-builder
 *
 * /src/module.js
 *
 * Angular Module for building an Elasticsearch query
 */

(function(angular) {
	'use strict';

	angular.module('angular-elastic-builder', [
		'RecursionHelper',
		'ui.bootstrap.datetimepicker',
		'ui.dateTimeInput',
		'angularjs-dropdown-multiselect'
		]);

})(window.angular);

/**
 * angular-elastic-builder
 *
 * /src/directives/BuilderDirective.js
 *
 * Angular Directive for injecting a query builder form.
 */

(function(angular) {
	'use strict';

	angular.module('angular-elastic-builder')
	.directive('elasticBuilder', [
		'elasticQueryService',

		function EB(elasticQueryService) {

			return {
				scope: {
					data: '=elasticBuilder',
				},

				templateUrl: 'angular-elastic-builder/BuilderDirective.html',

				link: function(scope) {
					scope.filters = [];
					scope.filters.push({
						type: 'group',
						subType: 'must',
						rules: [],
					});

					/**
					 * Removes either Group or Rule
					 */
					scope.removeChild = function(idx) {
						scope.filters.splice(idx, 1);
					};

					/**
					 * Adds a Single Rule
					 */
					scope.addRule = function() {
						scope.filters.push({});
					};

					/**
					 * Adds a Group of Rules
					 */
					scope.addGroup = function() {
						scope.filters.push({
							type: 'group',
							subType: 'must',
							rules: [],
						});
					};

					scope.$on('dashboard-apply-fliter', function(event, args) {

						for(var i=0;i<scope.filters[0].rules.length;i++){
							if(scope.filters[0].rules[i].field === args.field+".keyword" ){
								scope.filters[0].rules.splice(i,1);
							}
						}
						
						if(Array.isArray(args.value)){
							scope.filters[0].rules.push({
								field:args.field+".keyword",
								value:args.value[0],
								subType:args.subType	
							})
						}else{
							scope.filters[0].rules.push({
								field:args.field+".keyword",
								value:args.value,
								subType:args.subType	
							})
						}


						scope.data.query = elasticQueryService.toQuery(scope.filters, scope.data);

					});

					scope.$on('widget-apply-filter', function(event, args) {

						for(var i=0;i<scope.filters[0].rules.length;i++){
							if(scope.filters[0].rules[i].field === args.field+".keyword" ){
								scope.filters[0].rules.splice(i,1);
							}
						}

						if(args.value!='All'){
							scope.filters[0].rules.push({
								field:args.field+".keyword",
								value:args.value,
								subType:args.subType	
							})
						}
						scope.data.query = elasticQueryService.toQuery(scope.filters, scope.data);

					});



					scope.$on('dashboard-apply-filter-out', function(event, args) {

						for(var i=0;i<scope.filters[0].rules.length;i++){
							if(scope.filters[0].rules[i].field === args.field+".keyword" ){
								scope.filters[0].rules.splice(i,1);
							}
						}

						scope.filters[0].rules.push({
							field:args.field+".keyword",
							value:args.value,
							subType:args.subType	
						})

						scope.data.query = elasticQueryService.toQuery(scope.filters, scope.data);

					});




					/**
					 * Any time "outside forces" change the query, they should tell us so via
					 * `data.needsUpdate`
					 */



					scope.$watch('data.filter', function(curr) {
						if (!curr) return;

						if(scope.group){
							scope.group.rules.push({
								field:data.filedName,
								value:data.value,
								subType:'equals'	
							})
						}




					});

					scope.$watch('data.clear', function(curr) {
						if (!curr) return;

						scope.filters = [];
						scope.filters.push({
							type: 'group',
							subType: 'must',
							rules: [],
						});

						//scope.addGroup();

					});


					scope.$watch('data.needsUpdate', function(curr) {
						if (!curr) return;

						scope.filters = elasticQueryService.toFilters(scope.data);

						scope.data.needsUpdate = false;
					});

					scope.$watch('data.updateFromDashboard', function(curr) {
						if (!curr) return;

						if(scope.data.query.length==0){
							scope.filters = [];
							scope.filters.push({
								type: 'group',
								subType: 'must',
								rules: [],
							});
						}else{
							scope.filters = elasticQueryService.toFilters(scope.data);
							scope.data.query = elasticQueryService.toQuery(scope.filters, scope.data);
						}


						scope.$root.$broadcast('updatefromdatabse', scope.filters);
						scope.data.updateFromDashboard = false;
					});



					/**
					 * Changes on the page update the Query
					 */
					
					scope.$watch('group.values', function(curr) {
						if (!curr) return;

						scope.data.query = elasticQueryService.toQuery(scope.filters, scope.data);
					}, true); 
					
					
					scope.$watch('filters', function(curr) {
						if (!curr) return;

						scope.data.query = elasticQueryService.toQuery(scope.filters, scope.data);
					}, true);
				},
			};
		},

		]);

})(window.angular);

/**
 * angular-elastic-builder
 *
 * /src/directives/Chooser.js
 *
 * This file is to help recursively, to decide whether to show a group or rule
 */

(function(angular) {
	'use strict';

	var app = angular.module('angular-elastic-builder');

	app.directive('elasticBuilderChooser', [
		'RecursionHelper',
		'groupClassHelper',

		function elasticBuilderChooser(RH,groupClassHelper) {

			return {
				scope: {
					elasticFields: '=',
					item: '=elasticBuilderChooser',
					onRemove: '&',
				},

				templateUrl: 'angular-elastic-builder/ChooserDirective.html',

				compile: function (element) {
					return RH.compile(element, function(scope, el, attrs) {
						var depth = scope.depth = (+attrs.depth)
						, item = scope.item;

						scope.getGroupClassName = function() {
							var level = depth;
							if (item.type === 'group') level++;

							return groupClassHelper(level);
						};
					});
				},
			};
		},

		]);

})(window.angular);

/**
 * angular-elastic-builder
 *
 * /src/directives/Group.js
 */

(function(angular) {
	'use strict';

	var app = angular.module('angular-elastic-builder');

	app.directive('elasticBuilderGroup', [
		'RecursionHelper',
		'groupClassHelper',

		function elasticBuilderGroup(RH,groupClassHelper) {

			return {
				scope: {
					elasticFields: '=',
					group: '=elasticBuilderGroup',
					onRemove: '&',
				},

				templateUrl: 'angular-elastic-builder/GroupDirective.html',

				compile: function(element) {
					return RH.compile(element, function(scope, el, attrs) {
						var group = scope.group;

						scope.$on('updatefromdatabse', function(event, args) {
							if(args.length!=0){
								angular.copy(args[0],scope.group);
							}else{
								scope.group = {rules:[],type:'group',subType:'must'};
								scope.addGroup()

							}

						});

						scope.addRule = function() {
							group.rules.push({});
						};
						scope.addGroup = function() {
							group.rules.push({
								type: 'group',
								subType: 'must',
								rules: [],
							});
						};
						scope.onRemoveNew = function(){
							group.rules = [];
						}

						scope.removeChild = function(idx) {
							group.rules.splice(idx, 1);
						};
						scope.getGroupClassName = function() {
							return groupClassHelper(depth + 1);
						};


					});
				},
			};
		},

		]);

})(window.angular);

/**
 * angular-elastic-builder
 *
 * /src/directives/Rule.js
 */

(function(angular) {
	'use strict';

	var app = angular.module('angular-elastic-builder');

	app.directive('elasticBuilderRule', [

		function elasticBuilderRule() {
			return {
				scope: {
					elasticFields: '=',
					rule: '=elasticBuilderRule',
					onRemove: '&',
				},

				templateUrl: 'angular-elastic-builder/RuleDirective.html',

				link: function(scope) {
					scope.getType = function() {
						var fieldMap = scope.elasticFields,
						fieldName = scope.rule.field;

						if (!fieldMap || !fieldName) return;

						var field = fieldName in fieldMap ? fieldMap[fieldName] : fieldMap[fieldName.replace('.analyzed', '')];
						return field.type;
					};
					scope.resetRule = function(rule) {
						delete rule.subType;
						delete rule.value;
						delete rule.date;
						delete rule.values;
					};
				},
			};
		},

		]);

})(window.angular);

/**
 * angular-elastic-builder
 *
 * /src/directives/RuleTypes.js
 *
 * Determines which Rule type should be displayed
 */

(function(angular) {
	  'use strict';

	  var app = angular.module('angular-elastic-builder');

	  app.directive('elasticType', [

	    function() {
	      return {
	        scope: {
	          type: '=elasticType',
	          rule: '=',
	          guide: '=',
	        },

	        template: '<ng-include src="getTemplateUrl()" />',

	        link: function(scope) {
	          scope.getTemplateUrl = function() {
	            var type = scope.type;
	            if (!type) return;

	            type = type.charAt(0).toUpperCase() + type.slice(1);

	            return 'angular-elastic-builder/types/' + type + '.html';
	          };

	          // This is a weird hack to make sure these are numbers
	          scope.booleans = [ 'False', 'True' ];
	          scope.booleansOrder = [ 'True', 'False' ];

	          scope.inputNeeded = function() {
	            var needs = [
	              'equals',
	              'notEquals',
	              'in',
	              'notin',
	              'gt',
	              'gte',
	              'lt',
	              'lte',
	            ];

	            return ~needs.indexOf(scope.rule.subType);
	          };

	          scope.numberNeeded = function() {
	            var needs = [
	              'last',
	              'next',
	            ];

	            return ~needs.indexOf(scope.rule.subType);
	          };

	          scope.today = function() {
	            scope.rule.date = new Date();
	          };
	          scope.today();

	          scope.clear = function() {
	            scope.rule.date = null;
	          };

	          scope.dateOptions = {
	            dateDisabled: disabled,
	            formatYear: 'yy',
	            maxDate: new Date(2018, 1, 13),
	            minDate: new Date(),
	            startingDay: 1,
	          };

	          // Disable weekend selection
	          function disabled(data) {
	            var date = data.date
	              , mode = data.mode;
	            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
	          }

	          scope.open1 = function() {
	            scope.popup1.opened = true;
	          };

	          scope.setDate = function(year, month, day) {
	            scope.rule.date = new Date(year, month - 1, day);
	          };

	          scope.formats = [
	            'yyyy-MM-ddTHH:mm:ss',
	            'yyyy-MM-ddTHH:mm:ssZ',
	            'yyyy-MM-dd',
	            'dd-MMMM-yyyy',
	            'yyyy/MM/dd',
	            'shortDate',
	          ];
	          scope.rule.dateFormat = scope.formats[0];
	          scope.format = scope.rule.dateFormat;

	          scope.altInputFormats = ['M!/d!/yyyy'];

	          scope.popup1 = { opened: false };
	        },

	      };
	    },

	  ]);

	})(window.angular);

(function(angular) {
	'use strict';

	angular.module('angular-elastic-builder')
	.factory('groupClassHelper', function groupClassHelper() {

		return function(level) {
			var levels = [
				'',
				'list-group-item-info',
				'list-group-item-success',
				'list-group-item-warning',
				'list-group-item-danger',
				];

			return levels[level % levels.length];
		};
	});

})(window.angular);

/**
 * angular-elastic-builder
 *
 * /src/services/QueryService.js
 *
 * This file is used to convert filters into queries, and vice versa
 */

(function(angular) {
	'use strict';

	var count;

	angular.module('angular-elastic-builder')
	.factory('elasticQueryService', [
		'$filter',

		function($filter) {

			return {
				toFilters: toFilters,
				toQuery: function(filters, fieldMap) {
					return toQuery(filters, fieldMap, $filter);
				},
			};
		},
		]);

	function toFilters(data){
		var query = data.query;
		var fieldMap = data.fields;
		var filters = query.map(parseQueryGroup.bind(null, fieldMap, true, undefined, undefined));
		return filters;
	}

	function toQuery(filters, data, $filter){
		var fieldMap = data.fields;
		count = 0;
		var query = filters.map(parseFilterGroup.bind(filters, fieldMap, $filter)).filter(function(item) {
			return !!item;
		});
		data.count = count;
		return query;
	}

	function parseQueryGroup(fieldMap, truthy, parent, nested, group) {
		if (truthy !== false) truthy = true;

		var key = Object.keys(group)[0];
		var obj = getFilterItem();

		switch (key) {
		case 'bool':
			// Support ES 5.0 http://stackoverflow.com/a/40755927
			var subKey = Object.keys(group[key])[0];
			switch (subKey) {
			case 'must':
				obj = getFilterGroup();
				obj.rules = group[key][subKey].map(parseQueryGroup.bind(null, fieldMap, truthy, parent, nested));
				obj.subType = 'must';
				break;
			case 'should':
				obj = getFilterGroup();
				obj.rules = group[key][subKey].map(parseQueryGroup.bind(null, fieldMap, truthy, parent, nested));
				obj.subType = 'should';
				break;
			case 'must_not':
				obj = parseQueryGroup(fieldMap, false, parent, nested, group[key][subKey]);
				break;
			}
			break;

		case 'has_parent':
			obj = parseQueryGroup(fieldMap, truthy, group[key].parent_type, nested, group[key].query);
			break;

		case 'nested':
			obj = parseQueryGroup(fieldMap, truthy, parent, group[key].path, group[key].query);
			break;

		case 'exists':
			obj.field = searchField(fieldMap, group[key].field, parent, nested);
			obj.subType = truthy ? 'exists' : 'notExists';
			delete obj.value;
			break;
		case 'term':
		case 'terms':
			var subKey = Object.keys(group[key])[0];
			obj.field = searchField(fieldMap, subKey, parent, nested);
			var fieldData = fieldMap[obj.field];

			switch (fieldData.type) {
			case 'multi':
				var vals = group[key][subKey];
				if (typeof vals === 'string') vals = [ vals ];
				obj.values = [];
				fieldData.choices.forEach(function (choice) {
					if (vals.indexOf(choice.id) !== -1) {
						obj.values.push({id: choice.id});
					}
				});
				break;
			case 'date':
				obj.subType = truthy ? 'equals' : 'notEquals';
				obj.date = new Date(group[key][subKey]);
				break;
			case 'term':
			case 'number':
				obj.subType = truthy ? 'equals' : 'notEquals';
				obj.value = group[key][subKey];
				break;
			case 'boolean':
				obj.value = group[key][subKey];
				break;
			case 'select':
				fieldData.choices.forEach(function (choice) {
					if (group[key][subKey] === choice.id) {
						obj.value = choice;
					}
				});
				break;
			case 'contains':
				obj.subType = truthy ? 'equals' : 'notEquals';
				obj.value = group[key][subKey];
				break;
			default:
				throw new Error('unexpected type ' + fieldData.type);
			}
			break;
		case 'range':
			var subKey = Object.keys(group[key])[0];
			obj.field = searchField(fieldMap, subKey, parent, nested);
			var fieldData = fieldMap[obj.field];

			switch (fieldData.type) {
			case 'date':
				var date;

				if (Object.keys(group[key][subKey]).length === 2) {
					date = group[key][subKey].gte;

					if (~date.indexOf('now-')) {
						obj.subType = 'last';
						obj.value = parseInt(date.split('now-')[1].split('d')[0]);
						break;
					}

					if (~date.indexOf('now')) {
						obj.subType = 'next';
						date = group[key][subKey].lte;
						obj.value = parseInt(date.split('now+')[1].split('d')[0]);
						break;
					}
				}
				else {
					obj.subType = Object.keys(group[key][subKey])[0];
					obj.date = group[key][subKey][obj.subType];
				}
				break;
			case 'number':
				obj.subType = Object.keys(group[key][subKey])[0];
				obj.value = group[key][subKey][obj.subType];
				break;
			}
			break;
		case 'match':
			var subKey = Object.keys(group[key])[0];
			obj.field = searchField(fieldMap, subKey, parent, nested);
			if (typeof group[key][subKey] === 'string') {
				obj.subType = 'matchAny';
				obj.value = group[key][subKey];
			}
			else if ('operator' in group[key][subKey]) {
				obj.subType = group[key][subKey].operator === 'and' ? 'matchAll' : 'matchAny';
				obj.value = group[key][subKey].query;
			}
			else if ('type' in group[key][subKey] && group[key][subKey].type === 'phrase') {
				obj.subType = 'matchPhrase';
				obj.value = group[key][subKey].query;
			}
			break;
		case 'match_phrase':
			var subKey = Object.keys(group[key])[0];
			if (subKey.endsWith('.analyzed')) {
				obj.field = searchField(fieldMap, subKey.replace('.analyzed', ''), parent, nested);
			}
			else {
				obj.field = searchField(fieldMap, subKey, parent, nested);
			}
			var fieldData = fieldMap[obj.field];
			switch (fieldData.type) {
			case 'match':
				obj.subType = 'matchPhrase';
				obj.value = group[key][subKey];
				break;
			case 'contains':
				obj.subType = truthy ? 'contains' : 'notContains';
				obj.value = group[key][subKey];
				break;
			}
			break;
		default:
			var subKey = Object.keys(group[key])[0];
		obj.field = subKey;
		break;
		}

		return obj;
	}

	function parseFilterGroup(fieldMap, $filter, group) {
		var obj = {};
		if (group.type === 'group') {
			obj.bool = {};
			obj.bool[group.subType] = group.rules.map(parseFilterGroup.bind(group, fieldMap, $filter)).filter(function(item) {
				return !!item;
			});
			return obj;
		}

		var fieldKey = group.field;
		if (!fieldKey) return;

		var fieldData = fieldMap[fieldKey];
		var fieldName = fieldData.field;

		switch (fieldData.type) {
		case 'term':
			if (!group.subType) return;

			switch (group.subType) {
			case 'equals':
				if (group.value === undefined) return;
				obj.term = {};
				obj.term[fieldName] = group.value;
				break;
			case 'notEquals':
				if (group.value === undefined) return;
				obj.bool = { must_not: { term: {}}};
				obj.bool.must_not.term[fieldName] = group.value;
				break;
	
			case 'in':
				if (group.value === undefined) return;
				obj.bool = { must: { terms: {}}};
				obj.bool.must.terms[fieldName] = group.value.split(",");
				break;
			case 'notin':
				if (group.value === undefined) return;
				obj.bool = { must_not: { terms: {}}};
				obj.bool.must_not.terms[fieldName] = group.value.split(",");
				break;
			
			case 'exists':
				obj.exists = { field: fieldName };
				break;
			case 'notExists':
				obj.bool = { must_not: { exists: { field: fieldName }}};
				break;
			default:
				throw new Error('unexpected subtype ' + group.subType);
			}
			break;
		case 'contains':
			if (!group.subType) return;

			switch (group.subType) {
			case 'equals':
				if (group.value === undefined) return;
				obj.term = {};
				obj.term[fieldName] = group.value;
				break;
			case 'notEquals':
				if (group.value === undefined) return;
				obj.bool = { must_not: { term: {}}};
				obj.bool.must_not.term[fieldName] = group.value;
				break;
			case 'contains':
				if (group.value === undefined) return;
				obj.match_phrase = {};
				obj.match_phrase[fieldName + '.analyzed'] = group.value;
				break;
			case 'notContains':
				if (group.value === undefined) return;
				obj.bool = { must_not: { match_phrase: {}}};
				obj.bool.must_not.match_phrase[fieldName + '.analyzed'] = group.value;
				break;
			case 'exists':
				obj.exists = { field: fieldName };
				break;
			case 'notExists':
				obj.bool = { must_not: { exists: { field: fieldName }}};
				break;
			default:
				throw new Error('unexpected subtype ' + group.subType);
			}
			break;

		case 'boolean':
			if (group.value === undefined) return;
			obj.term = {};
			obj.term[fieldName] = group.value;
			break;

		case 'number':
			if (!group.subType) return;

			switch (group.subType) {
			case 'equals':
				if (group.value === undefined) return;
				obj.term = {};
				obj.term[fieldName] = group.value;
				break;
			case 'notEquals':
				if (group.value === undefined) return;
				obj.bool = { must_not: { term: {}}};
				obj.bool.must_not.term[fieldName] = group.value;
				break;
			case 'lt':
			case 'lte':
			case 'gt':
			case 'gte':
				if (group.value === undefined) return;
				obj.range = {};
				obj.range[fieldName] = {};
				obj.range[fieldName][group.subType] = group.value;
				break;
			case 'exists':
				obj.exists = { field: fieldName };
				break;
			case 'notExists':
				obj.bool = { must_not: { exists: { field: fieldName }}};
				break;
			default:
				throw new Error('unexpected subtype ' + group.subType);
			}
			break;

		case 'date':
			if (!group.subType) return;

			switch (group.subType) {
			case 'equals':
				if (!angular.isDate(group.date)) return;
				obj.term = {};
				obj.term[fieldName] = formatDate($filter, group.date);
				break;
			case 'notEquals':
				if (!angular.isDate(group.date)) return;
				obj.bool = { must_not: { term: {}}};
				obj.bool.must_not.term[fieldName] = formatDate($filter, group.date);
				break;
			case 'lt':
			case 'lte':
			case 'gt':
			case 'gte':
				if (!angular.isDate(group.date)) return;
				obj.range = {};
				obj.range[fieldName] = {};
				obj.range[fieldName][group.subType] = formatDate($filter, group.date);
				break;
			case 'last':
				if (!angular.isNumber(group.value)) return;
				obj.range = {};
				obj.range[fieldName] = {};
				obj.range[fieldName].gte = 'now-' + group.value + 'd';
				obj.range[fieldName].lte = 'now';
				break;
			case 'next':
				if (!angular.isNumber(group.value)) return;
				obj.range = {};
				obj.range[fieldName] = {};
				obj.range[fieldName].gte = 'now';
				obj.range[fieldName].lte = 'now+' + group.value + 'd';
				break;
			case 'exists':
				obj.exists = { field: fieldName };
				break;
			case 'notExists':
				obj.bool = { must_not: { exists: { field: fieldName }}};
				break;
			default:
				throw new Error('unexpected subtype ' + group.subType);
			}
			break;

		case 'multi':
			if (group.values === undefined) return;
			obj.terms = {};
			obj.terms[fieldName] = [];
			
			
			Object.keys(group.values).forEach(function(key) {
				if(group.values[key]){
					obj.terms[fieldName].push(key);
				}
				
			});
			
			
			break;

		case 'select':
			if (group.value === undefined) return;
			obj.term = {};
			obj.term[fieldName] = group.value.id;
			break;

		case 'match':
			if (!group.subType) return;

			switch (group.subType) {
			case 'matchAny':
				if (group.value === undefined) return;
				obj.match = {};
				obj.match[fieldName] = group.value;
				break;
			case 'matchAll':
				if (group.value === undefined) return;
				obj.match = {};
				obj.match[fieldName] = {};
				obj.match[fieldName].query = group.value;
				obj.match[fieldName].operator = 'and';
				break;
			case 'matchPhrase':
				if (group.value === undefined) return;
				obj.match_phrase = {};
				obj.match_phrase[fieldName] = group.value;
				break;
			case 'exists':
				obj.exists = { field: fieldName };
				break;
			case 'notExists':
				obj.bool = { must_not: { exists: { field: fieldName }}};
				break;
			default:
				throw new Error('unexpected subtype ' + group.subType);
			}
			break;

		default:
			throw new Error('unexpected type ' + fieldData.type);
		}

		if (fieldData.parent) {
			obj = {
					has_parent: {
						parent_type: fieldData.parent,
						query: obj
					}
			}
		}

		if (fieldData.nested) {
			obj = {
					nested: {
						path: fieldData.nested,
						query: obj
					}
			};
		}

		count += 1;
		return obj;
	}

	function getFilterItem() {
		var item = {
				field: '',
				subType: '',
				value: '',
		};

		return angular.copy(item);
	}

	function getFilterGroup() {
		var group = {
				type: 'group',
				subType: '',
				rules: [],
		};

		return angular.copy(group);
	}

	function formatDate($filter, date) {
		if (!angular.isDate(date)) return false;
		var dateFormat = 'yyyy-MM-ddTHH:mm:ssZ';
		var fDate = $filter('date')(date, dateFormat);
		return fDate;
	}

	function searchField(fields, fieldName, parent, nested) {
		var keys = Object.keys(fields);
		var values = Object.values(fields);
		var index = values.indexOf(values.filter(function(item) {
			return (item.field === fieldName && item.parent === parent) || ([nested , item.field].join('.') === fieldName && item.nested === nested);
		})[0]);
		return keys[index];
	}

})(window.angular);

(function(angular) {"use strict"; angular.module("angular-elastic-builder").run(["$templateCache", function($templateCache) {
	$templateCache.put("angular-elastic-builder/types/Boolean.html","<span class=\"boolean-rule\">\n  Equals\n\n  <!-- This is a weird hack to make sure these are numbers -->\n  <select\n    data-ng-model=\"rule.value\"\n    class=\"form-control\"\n    data-ng-options=\"booleans.indexOf(choice) as choice for choice in booleansOrder\">\n  </select>\n</span>\n");
	$templateCache.put("angular-elastic-builder/types/Date.html","<span class=\"date-rule form-inline\">\n  <select data-ng-model=\"rule.subType\" class=\"form-control\">\n    <optgroup label=\"Exact\">\n      <option value=\"equals\">=</option>\n    </optgroup>\n    <optgroup label=\"Unbounded-range\">\n      <option value=\"lt\">&lt;</option>\n      <option value=\"lte\">&le;</option>\n      <option value=\"gt\">&gt;</option>\n      <option value=\"gte\">&ge;</option>\n    </optgroup>\n    <optgroup label=\"Bounded-range\">\n      <option value=\"last\">In the last</option>\n      <option value=\"next\">In the next</option>\n    </optgroup>\n    <optgroup label=\"Generic\">\n      <option value=\"exists\">Exists</option>\n      <option value=\"notExists\">! Exists</option>\n    </optgroup>\n  </select>\n\n  <div class=\"form-group\">\n    <div class=\"input-group\">\n      <input data-ng-if=\"inputNeeded()\"\n        type=\"text\"\n        class=\"form-control\"\n        data-uib-datepicker-popup=\"{{ rule.dateFormat }}\"\n        data-ng-model=\"rule.date\"\n        data-is-open=\"popup1.opened\"\n        data-datepicker-options=\"dateOptions\"\n        data-ng-required=\"true\"\n        data-close-text=\"Close\" />\n      <div class=\"input-group-btn\">\n        <button type=\"button\" class=\"btn btn-default\" ng-click=\"open1()\" data-ng-if=\"inputNeeded()\">\n          <i class=\"fa fa-calendar\"></i>\n        </button>\n      </div>\n    </div>\n  </div>\n\n  <span class=\"form-inline\">\n    <div class=\"form-group\">\n      <label data-ng-if=\"inputNeeded()\">Format</label>\n      <select\n        class=\"form-control\"\n        data-ng-model=\"rule.dateFormat\"\n        data-ng-if=\"inputNeeded()\"\n        ng-options=\"f for f in formats\"></select>\n    </div>\n  </span>\n\n  <span data-ng-if=\"numberNeeded()\">\n    <input type=\"number\" class=\"form-control\" data-ng-model=\"rule.value\" min=0> days\n  </span>\n\n</span>\n");
	$templateCache.put("angular-elastic-builder/types/Multi.html","<span class=\"multi-rule\">\n  <span data-ng-repeat=\"choice in guide.choices\">\n    <label class=\"checkbox\">\n      <input type=\"checkbox\" data-ng-model=\"rule.values[choice]\">\n      {{ choice }}\n    </label>\n  </span>\n</span>\n");
	$templateCache.put("angular-elastic-builder/types/Number.html","<span class=\"number-rule\">\n  <select data-ng-model=\"rule.subType\" class=\"form-control\">\n    <optgroup label=\"Numeral\">\n      <option value=\"equals\">=</option>\n      <option value=\"gt\">&gt;</option>\n      <option value=\"gte\">&ge;</option>\n      <option value=\"lt\">&lt;</option>\n      <option value=\"lte\">&le;</option>\n    </optgroup>\n\n    <optgroup label=\"Generic\">\n      <option value=\"exists\">Exists</option>\n      <option value=\"notExists\">! Exists</option>\n    </optgroup>\n  </select>\n\n  <!-- Range Fields -->\n  <input data-ng-if=\"inputNeeded()\"\n    class=\"form-control\"\n    data-ng-model=\"rule.value\"\n    type=\"number\"\n    min=\"{{ guide.minimum }}\"\n    max=\"{{ guide.maximum }}\">\n</span>\n");
	$templateCache.put("angular-elastic-builder/types/Term.html","<div class=\"col-lg-12 row\"><div class=\"col-lg-6\"><select data-ng-model=\"rule.subType\" class=\"form-control\"><optgroup label=\"Text\"><option value=\"equals\">Equals</option><option value=\"in\">is one of</option><option value=\"notin\">is not one of</option><option value=\"notEquals\">! Equals</option></optgroup><optgroup label=\"Generic\"><option value=\"exists\">Exists</option><option value=\"notExists\">! Exists</option></optgroup></select></div><div class=\"col-lg-6\"><input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"text\"></div></div");}]);})(window.angular);