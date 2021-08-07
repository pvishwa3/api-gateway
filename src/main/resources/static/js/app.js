var app = angular.module("siem", ['ngResource','ngRoute','ui.bootstrap','ngSanitize','ngCookies','ngStorage','queryBuilder','ngStomp','datatables', 'chart.js','adf','adf.structures.base','LocalStorageModule','colorpicker.module','hc.downloader','ui.select','ui.ace','dndLists','pascalprecht.translate','ui.router','FBAngular','cp.ngConfirm','selectize','angular-jsoneditor','angular-cron-gen','bootstrap-duallistbox','angularUtils.directives.dirPagination','angular-cron-gen','minicolors','summernote','ngTagsInput','gridster','angularMoment','angular-elastic-builder','ngJsTree','fa.directive.borderLayout','angularMoment','shagstrom.angular-split-pane','checklist-model','xeditable','gridstack-angular','slickCarousel','ngclipboard','NgSwitchery','moment-picker','mj.scrollingTabs']);



var queryBuilder = angular.module('queryBuilder', []);

app.config(function (minicolorsProvider) {
	angular.extend(minicolorsProvider.defaults, {
		control: 'hue',
		position: 'bottom left',
		theme: 'bootstrap'
	});
});



app.directive('resizable', function() {
	var toCall;
	function throttle(fun) {
		if (toCall === undefined) {
			toCall = fun;
			setTimeout(function() {
				toCall();
				toCall = undefined;
			}, 100);
		} else {
			toCall = fun;
		}
	}
	return {
		restrict: 'AE',
		scope: {
			rDirections: '=',
			rCenteredX: '=',
			rCenteredY: '=',
			rWidth: '=',
			rHeight: '=',
			rFlex: '=',
			rGrabber: '@',
			rDisabled: '@'
		},
		link: function(scope, element, attr) {
			var flexBasis = 'flexBasis' in document.documentElement.style ? 'flexBasis' :
				'webkitFlexBasis' in document.documentElement.style ? 'webkitFlexBasis' :
					'msFlexPreferredSize' in document.documentElement.style ? 'msFlexPreferredSize' : 'flexBasis';

			// register watchers on width and height attributes if they are set
			scope.$watch('rWidth', function(value){
				element[0].style.width = scope.rWidth + 'px';
			});
			scope.$watch('rHeight', function(value){
				element[0].style.height = scope.rHeight + 'px';
			});

			element.addClass('resizable');

			var style = window.getComputedStyle(element[0], null),
			w,
			h,
			dir = scope.rDirections,
			vx = scope.rCenteredX ? 2 : 1, // if centered double velocity
					vy = scope.rCenteredY ? 2 : 1, // if centered double velocity
							inner = scope.rGrabber ? scope.rGrabber : '<span></span>',
									start,
									dragDir,
									axis,
									info = {};

			var updateInfo = function(e) {
				info.width = false; info.height = false;
				if(axis === 'x')
					info.width = parseInt(element[0].style[scope.rFlex ? flexBasis : 'width']);
				else
					info.height = parseInt(element[0].style[scope.rFlex ? flexBasis : 'height']);
				info.id = element[0].id;
				info.evt = e;
			};

			var dragging = function(e) {
				var prop, offset = axis === 'x' ? start - e.clientX : start - e.clientY;
				switch(dragDir) {
				case 'top':
					prop = scope.rFlex ? flexBasis : 'height';
					element[0].style[prop] = h + (offset * vy) + 'px';
					break;
				case 'bottom':
					prop = scope.rFlex ? flexBasis : 'height';
					element[0].style[prop] = h - (offset * vy) + 'px';
					break;
				case 'right':
					prop = scope.rFlex ? flexBasis : 'width';
					element[0].style[prop] = w - (offset * vx) + 'px';
					break;
				case 'left':
					prop = scope.rFlex ? flexBasis : 'width';
					element[0].style[prop] = w + (offset * vx) + 'px';
					break;
				}
				updateInfo(e);
				throttle(function() { scope.$emit('angular-resizable.resizing', info);});
			};
			var dragEnd = function(e) {
				updateInfo();
				scope.$emit('angular-resizable.resizeEnd', info);
				scope.$apply();
				document.removeEventListener('mouseup', dragEnd, false);
				document.removeEventListener('mousemove', dragging, false);
				element.removeClass('no-transition');
			};
			var dragStart = function(e, direction) {
				dragDir = direction;
				axis = dragDir === 'left' || dragDir === 'right' ? 'x' : 'y';
				start = axis === 'x' ? e.clientX : e.clientY;
				w = parseInt(style.getPropertyValue('width'));
				h = parseInt(style.getPropertyValue('height'));

				//prevent transition while dragging
				element.addClass('no-transition');

				document.addEventListener('mouseup', dragEnd, false);
				document.addEventListener('mousemove', dragging, false);

				// Disable highlighting while dragging
				if(e.stopPropagation) e.stopPropagation();
				if(e.preventDefault) e.preventDefault();
				e.cancelBubble = true;
				e.returnValue = false;

				updateInfo(e);
				scope.$emit('angular-resizable.resizeStart', info);
				scope.$apply();
			};

			dir.forEach(function (direction) {
				var grabber = document.createElement('div');

				// add class for styling purposes
				grabber.setAttribute('class', 'rg-' + direction);
				grabber.innerHTML = inner;
				element[0].appendChild(grabber);
				grabber.ondragstart = function() { return false; };
				grabber.addEventListener('mousedown', function(e) {
					var disabled = (scope.rDisabled === 'true');
					if (!disabled && e.which === 1) {
						// left mouse click
						dragStart(e, direction);
					}
				}, false);
			});
		}
	};
});




app.directive('showtab',
		function () {
	return {
		link: function (scope, element, attrs) {
			element.click(function(e) {
				e.preventDefault();
				$(element).tab('show');
			});
		}
	};
});

app.directive("customSort", function () {
	return {
		restrict: 'A',
		transclude: true,
		scope: {
			order: '=',
			sort: '='
		},
		template:
			' <a ng-click="sort_by(order)" style="color: #555555;">' +
			'    <span ng-transclude></span>' +
			'    <i ng-class="selectedCls(order)"></i>' +
			'</a>',
			link: function (scope) {

				// change sorting order
				scope.sort_by = function (newSortingOrder) {
					var sort = scope.sort;

					if (sort.sortingOrder == newSortingOrder) {
						sort.reverse = !sort.reverse;
					}

					sort.sortingOrder = newSortingOrder;
				};


				scope.selectedCls = function (column) {
					if (column == scope.sort.sortingOrder) {
						return ('icon-chevron-' + ((scope.sort.reverse) ? 'down' : 'up'));
					} else {
						return 'icon-sort'
					}
				};
			} // end link
	}
});

app.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function() {
				scope.$apply(function() {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);
app.service('fileUpload', ['$http', function ($http) {
	this.uploadFileToUrl = function(file, uploadUrl) {
		var fd = new FormData();
		fd.append('file', file);

		$http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		})
		.success(function() {
		})
		.error(function() {
		});
	}
}]);



app.directive('tagManager', function() {
	return {
		restrict: 'E',
		scope: {
			tags: '=',
			autocomplete: '=autocomplete'
		},
		template:
			'<div class="tags">' +
			'<div ng-repeat="(idx, tag) in tags" class="tag label label-success">{{tag}} <a class="close" href ng-click="remove(idx)">×</a></div>' +
			'</div>' +
			'<div class="input-group"><input type="text" class="form-control" placeholder="add a tag..." ng-model="newValue" /> ' +
			'<span class="input-group-btn"><a class="btn btn-default" ng-click="add()">Add</a></span></div>',
			link: function ( $scope, $element ) {

				var input = angular.element($element).find('input');

				// setup autocomplete
				if ($scope.autocomplete) {
					$scope.autocompleteFocus = function(event, ui) {
						input.val(ui.item.value);
						return false;
					};
					$scope.autocompleteSelect = function(event, ui) {
						$scope.newValue = ui.item.value;
						$scope.$apply( $scope.add );

						return false;
					};
					$($element).find('input').autocomplete({
						minLength: 0,
						source: function(request, response) {
							var item;
							return response((function() {
								var _i, _len, _ref, _results;
								_ref = $scope.autocomplete;
								_results = [];
								for (_i = 0, _len = _ref.length; _i < _len; _i++) {
									item = _ref[_i];
									if (item.toLowerCase().indexOf(request.term.toLowerCase()) !== -1) {
										_results.push(item);
									}
								}
								return _results;
							})());
						},
						focus: (function(_this) {
							return function(event, ui) {
								return $scope.autocompleteFocus(event, ui);
							};
						})(this),
						select: (function(_this) {
							return function(event, ui) {
								return $scope.autocompleteSelect(event, ui);
							};
						})(this)
					});
				}	


				// adds the new tag to the array
				$scope.add = function() {
					// if not dupe, add it
					if ($scope.tags.indexOf($scope.newValue)==-1){
						$scope.tags.push( $scope.newValue );
					}
					$scope.newValue = "";
				};

				// remove an item
				$scope.remove = function ( idx ) {
					$scope.tags.splice( idx, 1 );
				};

				// capture keypresses
				input.bind( 'keypress', function ( event ) {
					// enter was pressed
					if ( event.keyCode == 13 ) {
						$scope.$apply( $scope.add );
					}
				});
			}
	};
});

app.filter('spaceless',function() {
	return function(input) {
		if (input) {
			return input.replace(/\s+/g, '-');    
		}
	}
});

app.directive('resize',['$window', function ($window) {
	return function (scope, element, attr) {

		var w = angular.element($window);
		scope.$watch(function () {
			return {
				'h': window.innerHeight,
				'w': window.innerWidth
			};
		}, function (newValue, oldValue) {
			scope.windowHeight = newValue.h;
			scope.windowWidth = newValue.w;

			scope.resizeWithOffset = function (offsetH) {
				scope.$eval(attr.notifier);
				return {
					'height': (newValue.h - offsetH) + 'px'
				};
			};

		}, true);

		w.bind('resize', function () {
			scope.$apply();
		});
	}
}]);

app.filter('CamelCase', function() {
	return function(input){
		var inputPieces,i;
		if(!input){
			return;
		}
		input = input.toLowerCase();
		inputPieces = input.split(' ');

		for(i = 0; i < inputPieces.length; i++){
			inputPieces[i] = capitalizeString(inputPieces[i]);
		}
		return inputPieces.toString().replace(/,/g, ' ');
		function capitalizeString(inputString){
			return inputString.substring(0,1).toUpperCase() + inputString.substring(1);
		}
	};
});
app.filter('cut', function () {
	return function (value, wordwise, max, tail) {
		if (!value) return '';

		max = parseInt(max, 10);
		if (!max) return value;
		if (value.length <= max) return value;

		value = value.substr(0, max);
		if (wordwise) {
			var lastspace = value.lastIndexOf(' ');
			if (lastspace !== -1) {
				//Also remove . and , so its gives a cleaner result.
				if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
					lastspace = lastspace - 1;
				}
				value = value.substr(0, lastspace);
			}
		}

		return value + (tail || ' …');
	};
});




angular.module('NgSwitchery', [])
.directive('uiSwitch', ['$window', '$timeout','$log', '$parse', function($window, $timeout, $log, $parse) {

	/**
	 * Initializes the HTML element as a Switchery switch.
	 *
	 * $timeout is in place as a workaround to work within angular-ui tabs.
	 *
	 * @param scope
	 * @param elem
	 * @param attrs
	 * @param ngModel
	 */
	function linkSwitchery(scope, elem, attrs, ngModel) {
		if(!ngModel) return false;
		var options = {};
		try {
			options = $parse(attrs.uiSwitch)(scope);
		} catch (e) {}

		var switcher;

		attrs.$observe('disabled', function(value) {
			if (!switcher) {
				return;
			}

			if (value) {
				switcher.disable();
			} else {
				switcher.enable();
			}
		});

		// Watch changes
		scope.$watch(function () {
			return ngModel.$modelValue;
		}, function(newValue,oldValue) {
			initializeSwitch()
		});

		function initializeSwitch() {
			$timeout(function() {
				// Remove any old switcher
				if (switcher) {
					angular.element(switcher.switcher).remove();
				}
				// (re)create switcher to reflect latest state of the checkbox element
				switcher = new $window.Switchery(elem[0], options);
				var element = switcher.element;
				element.checked = scope.initValue;
				if (attrs.disabled) {
					switcher.disable();
				}

				switcher.setPosition(false);
				element.addEventListener('change',function(evt) {
					scope.$apply(function() {
						ngModel.$setViewValue(element.checked);
					})
				});
				scope.$watch('initValue', function(newValue, oldValue) {
					switcher.setPosition(false);
				});
			}, 0);
		}
		initializeSwitch();
	}

	return {
		require: 'ngModel',
		restrict: 'AE',
		scope : {
			initValue : '=ngModel'
		},
		link: linkSwitchery
	}
}]);

app.filter('urlencode', function() {
	return function(input) {
		return window.encodeURIComponent(input);
	}
});

function formatBytes(bytes,decimals) {
	if(bytes == 0) return '0 Bytes';
	var k = 1024,
	dm = decimals <= 0 ? 0 : decimals || 2,
			sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
			i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


var loader = function(document){
//	$(document).loading();

	
	 var body = $(document);
	    var w = body.css("width");
	    var h = body.css("height");
	    var trb = $('#throbber');
	    var position = body.offset();

	    trb.css({
	        width: w,
	        height: h,
	        opacity: 0.8,
	        position: 'absolute',
	        top:position.top,
	        left:position.left,
	    });
	    trb.show();
	    $("#throbber").css("padding-top",$(document).height()/2+"px")

	setTimeout(function(){
		unloader(document);
	},10000)
}

var unloader = function(document){
	var trb = $('#throbber');
    trb.hide();
}

function dateComparator(date1, date2) {
	  var date1Number = moment(date1).valueOf();
	  var date2Number = moment(date2).valueOf();

	  if (date1Number === null && date2Number === null) {
	    return 0;
	  }
	  if (date1Number === null) {
	    return -1;
	  }
	  if (date2Number === null) {
	    return 1;
	  }

	  return date1Number - date2Number;
	}



