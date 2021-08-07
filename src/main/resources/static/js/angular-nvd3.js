! function() {
    "use strict";
    angular.module("nvd3", []).directive("nvd3", ["nvd3Utils", function(nvd3Utils) {
        return {
            restrict: "AE",
            scope: {
                data: "=",
                options: "=",
                api: "=?",
                events: "=?",
                config: "=?",
                onReady: "&?"
            },
            link: function(scope, element) {
                function configure(chart, options, chartType) {
                    chart && options && angular.forEach(chart, function(value, key) {
                        "_" === key[0] || ("dispatch" === key ? ((void 0 === options[key] || null === options[key]) && scope._config.extended && (options[key] = {}), configureEvents(value, options[key])) : "tooltip" === key ? ((void 0 === options[key] || null === options[key]) && scope._config.extended && (options[key] = {}), configure(chart[key], options[key], chartType)) : "contentGenerator" === key ? options[key] && chart[key](options[key]) : -1 === ["axis", "clearHighlights", "defined", "highlightPoint", "nvPointerEventsClass", "options", "rangeBand", "rangeBands", "scatter", "open", "close"].indexOf(key) && (void 0 === options[key] || null === options[key] ? scope._config.extended && (options[key] = value()) : chart[key](options[key])))
                    })
                }

                function configureEvents(dispatch, options) {
                    dispatch && options && angular.forEach(dispatch, function(value, key) {
                        void 0 === options[key] || null === options[key] ? scope._config.extended && (options[key] = value.on) : dispatch.on(key + "._", options[key])
                    })
                }

                function configureWrapper(name) {
                    var _ = nvd3Utils.deepExtend(defaultWrapper(name), scope.options[name] || {});
                    scope._config.extended && (scope.options[name] = _);
                    var wrapElement = angular.element("<div></div>").html(_.html || "").addClass(name).addClass(_.className).removeAttr("style").css(_.css);
                    _.html || wrapElement.text(_.text), _.enable && ("title" === name ? element.prepend(wrapElement) : "subtitle" === name ? angular.element(element[0].querySelector(".title")).after(wrapElement) : "caption" === name && element.append(wrapElement))
                }

                function configureStyles() {
                    var _ = nvd3Utils.deepExtend(defaultStyles(), scope.options.styles || {});
                    scope._config.extended && (scope.options.styles = _), angular.forEach(_.classes, function(value, key) {
                        value ? element.addClass(key) : element.removeClass(key)
                    }), element.removeAttr("style").css(_.css)
                }

                function defaultWrapper(_) {
                    switch (_) {
                        case "title":
                            return {
                                enable: !1,
                                text: "Write Your Title",
                                className: "h4",
                                css: {
                                    width: scope.options.chart.width + "px",
                                    textAlign: "center"
                                }
                            };
                        case "subtitle":
                            return {
                                enable: !1,
                                text: "Write Your Subtitle",
                                css: {
                                    width: scope.options.chart.width + "px",
                                    textAlign: "center"
                                }
                            };
                        case "caption":
                            return {
                                enable: !1,
                                text: "Figure 1. Write Your Caption text.",
                                css: {
                                    width: scope.options.chart.width + "px",
                                    textAlign: "center"
                                }
                            }
                    }
                }

                function defaultStyles() {
                    return {
                        classes: {
                            "with-3d-shadow": !0,
                            "with-transitions": !0,
                            gallery: !1
                        },
                        css: {}
                    }
                }

                function dataWatchFn(newData, oldData) {
                    newData !== oldData && (scope._config.disabled || (scope._config.refreshDataOnly ? scope.api.update() : scope.api.refresh()))
                }
                var defaultConfig = {
                    extended: !1,
                    visible: !0,
                    disabled: !1,
                    refreshDataOnly: !0,
                    deepWatchOptions: !0,
                    deepWatchData: !0,
                    deepWatchDataDepth: 2,
                    debounce: 10
                };
                scope.isReady = !1, scope._config = angular.extend(defaultConfig, scope.config), scope.api = {
                    refresh: function() {
                        scope.api.updateWithOptions(scope.options), scope.isReady = !0
                    },
                    refreshWithTimeout: function(t) {
                        setTimeout(function() {
                            scope.api.refresh()
                        }, t)
                    },
                    update: function() {
                        scope.chart && scope.svg ? scope.svg.datum(scope.data).call(scope.chart) : scope.api.refresh()
                    },
                    updateWithTimeout: function(t) {
                        setTimeout(function() {
                            scope.api.update()
                        }, t)
                    },
                    updateWithOptions: function(options) {
                        scope.api.clearElement(), angular.isDefined(options) !== !1 && scope._config.visible && (scope.chart = nv.models[options.chart.type](), scope.chart.id = Math.random().toString(36).substr(2, 15), angular.forEach(scope.chart, function(value, key) {
                            "_" === key[0] || ["clearHighlights", "highlightPoint", "id", "options", "resizeHandler", "state", "open", "close", "tooltipContent"].indexOf(key) >= 0 || ("dispatch" === key ? ((void 0 === options.chart[key] || null === options.chart[key]) && scope._config.extended && (options.chart[key] = {}), configureEvents(scope.chart[key], options.chart[key])) : ["bars", "bars1", "bars2", "boxplot", "bullet", "controls", "discretebar", "distX", "distY", "interactiveLayer", "legend", "lines", "lines1", "lines2", "multibar", "pie", "scatter", "sparkline", "stack1", "stack2", "sunburst", "tooltip", "x2Axis", "xAxis", "y1Axis", "y2Axis", "y3Axis", "y4Axis", "yAxis", "yAxis1", "yAxis2"].indexOf(key) >= 0 || "stacked" === key && "stackedAreaChart" === options.chart.type ? ((void 0 === options.chart[key] || null === options.chart[key]) && scope._config.extended && (options.chart[key] = {}), configure(scope.chart[key], options.chart[key], options.chart.type)) : ("xTickFormat" !== key && "yTickFormat" !== key || "lineWithFocusChart" !== options.chart.type) && ("tooltips" === key && "boxPlotChart" === options.chart.type || ("tooltipXContent" !== key && "tooltipYContent" !== key || "scatterChart" !== options.chart.type) && (void 0 === options.chart[key] || null === options.chart[key] ? scope._config.extended && (options.chart[key] = "barColor" === key ? value()() : value()) : scope.chart[key](options.chart[key]))))
                        }), scope.api.updateWithData("sunburstChart" === options.chart.type ? angular.copy(scope.data) : scope.data), (options.title || scope._config.extended) && configureWrapper("title"), (options.subtitle || scope._config.extended) && configureWrapper("subtitle"), (options.caption || scope._config.extended) && configureWrapper("caption"), (options.styles || scope._config.extended) && configureStyles(), nv.addGraph(function() {
                            return scope.chart ? (scope.chart.resizeHandler && scope.chart.resizeHandler.clear(), scope.chart.resizeHandler = nv.utils.windowResize(function() {
                                scope.chart && scope.chart.update && scope.chart.update()
                            }), void 0 !== options.chart.zoom && ["scatterChart", "lineChart", "candlestickBarChart", "cumulativeLineChart", "historicalBarChart", "ohlcBarChart", "stackedAreaChart"].indexOf(options.chart.type) > -1 && nvd3Utils.zoom(scope, options), scope.chart) : void 0
                        }, options.chart.callback))
                    },
                    updateWithData: function(data) {
                        if (data) {
                            d3.select(element[0]).select("svg").remove();
                            var h, w;
                            scope.svg = d3.select(element[0]).append("svg"), (h = scope.options.chart.height) && (isNaN(+h) || (h += "px"), scope.svg.attr("height", h).style({
                                height: h
                            })), (w = scope.options.chart.width) ? (isNaN(+w) || (w += "px"), scope.svg.attr("width", w).style({
                                width: w
                            })) : scope.svg.attr("width", "100%").style({
                                width: "100%"
                            }), scope.svg.datum(data).call(scope.chart)
                        }
                    },
                    clearElement: function() {
                        if (element.find(".title").remove(), element.find(".subtitle").remove(), element.find(".caption").remove(), element.empty(), scope.chart && scope.chart.tooltip && scope.chart.tooltip.id && d3.select("#" + scope.chart.tooltip.id()).remove(), nv.graphs && scope.chart)
                            for (var i = nv.graphs.length - 1; i >= 0; i--) nv.graphs[i] && nv.graphs[i].id === scope.chart.id && nv.graphs.splice(i, 1);
                        nv.tooltip && nv.tooltip.cleanup && nv.tooltip.cleanup(), scope.chart && scope.chart.resizeHandler && scope.chart.resizeHandler.clear(), scope.chart = null
                    },
                    getScope: function() {
                        return scope
                    },
                    getElement: function() {
                        return element
                    }
                }, scope._config.deepWatchOptions && scope.$watch("options", nvd3Utils.debounce(function() {
                    scope._config.disabled || scope.api.refresh()
                }, scope._config.debounce, !0), !0), scope._config.deepWatchData && (1 === scope._config.deepWatchDataDepth ? scope.$watchCollection("data", dataWatchFn) : scope.$watch("data", dataWatchFn, 2 === scope._config.deepWatchDataDepth)), scope.$watch("config", function(newConfig, oldConfig) {
                    newConfig !== oldConfig && (scope._config = angular.extend(defaultConfig, newConfig), scope.api.refresh())
                }, !0), scope._config.deepWatchOptions || scope._config.deepWatchData || scope.api.refresh(), angular.forEach(scope.events, function(eventHandler, event) {
                    scope.$on(event, function(e, args) {
                        return eventHandler(e, scope, args)
                    })
                }), element.on("$destroy", function() {
                    scope.api.clearElement()
                }), scope.$watch("isReady", function(isReady) {
                    isReady && scope.onReady && "function" == typeof scope.onReady() && scope.onReady()(scope, element)
                })
            }
        }
    }]).factory("nvd3Utils", function() {
        return {
            debounce: function(func, wait, immediate) {
                var timeout;
                return function() {
                    var context = this,
                        args = arguments,
                        later = function() {
                            timeout = null, immediate || func.apply(context, args)
                        },
                        callNow = immediate && !timeout;
                    clearTimeout(timeout), timeout = setTimeout(later, wait), callNow && func.apply(context, args)
                }
            },
            deepExtend: function(dst) {
                var me = this;
                return angular.forEach(arguments, function(obj) {
                    obj !== dst && angular.forEach(obj, function(value, key) {
                        dst[key] && dst[key].constructor && dst[key].constructor === Object ? me.deepExtend(dst[key], value) : dst[key] = value
                    })
                }), dst
            },
            zoom: function(scope, options) {
                var zoom = options.chart.zoom,
                    enabled = "undefined" == typeof zoom.enabled || null === zoom.enabled ? !0 : zoom.enabled;
                if (enabled) {
                    var fixDomain, d3zoom, zoomed, unzoomed, xScale = scope.chart.xAxis.scale(),
                        yScale = scope.chart.yAxis.scale(),
                        xDomain = scope.chart.xDomain || xScale.domain,
                        yDomain = scope.chart.yDomain || yScale.domain,
                        x_boundary = xScale.domain().slice(),
                        y_boundary = yScale.domain().slice(),
                        scale = zoom.scale || 1,
                        translate = zoom.translate || [0, 0],
                        scaleExtent = zoom.scaleExtent || [1, 10],
                        useFixedDomain = zoom.useFixedDomain || !1,
                        useNiceScale = zoom.useNiceScale || !1,
                        horizontalOff = zoom.horizontalOff || !1,
                        verticalOff = zoom.verticalOff || !1,
                        unzoomEventType = zoom.unzoomEventType || "dblclick.zoom";
                    useNiceScale && (xScale.nice(), yScale.nice()), fixDomain = function(domain, boundary) {
                        return domain[0] = Math.min(Math.max(domain[0], boundary[0]), boundary[1] - boundary[1] / scaleExtent[1]), domain[1] = Math.max(boundary[0] + boundary[1] / scaleExtent[1], Math.min(domain[1], boundary[1])), domain
                    }, zoomed = function() {
                        if (void 0 !== zoom.zoomed) {
                            var domains = zoom.zoomed(xScale.domain(), yScale.domain());
                            horizontalOff || xDomain([domains.x1, domains.x2]), verticalOff || yDomain([domains.y1, domains.y2])
                        } else horizontalOff || xDomain(useFixedDomain ? fixDomain(xScale.domain(), x_boundary) : xScale.domain()), verticalOff || yDomain(useFixedDomain ? fixDomain(yScale.domain(), y_boundary) : yScale.domain());
                        scope.chart.update()
                    }, unzoomed = function() {
                        if (void 0 !== zoom.unzoomed) {
                            var domains = zoom.unzoomed(xScale.domain(), yScale.domain());
                            horizontalOff || xDomain([domains.x1, domains.x2]), verticalOff || yDomain([domains.y1, domains.y2])
                        } else horizontalOff || xDomain(x_boundary), verticalOff || yDomain(y_boundary);
                        d3zoom.scale(scale).translate(translate), scope.chart.update()
                    }, d3zoom = d3.behavior.zoom().x(xScale).y(yScale).scaleExtent(scaleExtent).on("zoom", zoomed), scope.svg.call(d3zoom), d3zoom.scale(scale).translate(translate).event(scope.svg), "none" !== unzoomEventType && scope.svg.on(unzoomEventType, unzoomed)
                }
            }
        }
    })
}();