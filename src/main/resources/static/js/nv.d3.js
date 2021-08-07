/* nvd3 version 1.8.1 (https://github.com/novus/nvd3) 2015-06-15 */ ! function() {
    var a = {};
    a.dev = !1, a.tooltip = a.tooltip || {}, a.utils = a.utils || {}, a.models = a.models || {}, a.charts = {}, a.logs = {}, a.dom = {}, a.dispatch = d3.dispatch("render_start", "render_end"), Function.prototype.bind || (Function.prototype.bind = function(a) {
            if ("function" != typeof this) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            var b = Array.prototype.slice.call(arguments, 1),
                c = this,
                d = function() {},
                e = function() {
                    return c.apply(this instanceof d && a ? this : a, b.concat(Array.prototype.slice.call(arguments)))
                };
            return d.prototype = this.prototype, e.prototype = new d, e
        }), a.dev && (a.dispatch.on("render_start", function() {
            a.logs.startTime = +new Date
        }), a.dispatch.on("render_end", function() {
            a.logs.endTime = +new Date, a.logs.totalTime = a.logs.endTime - a.logs.startTime, a.log("total", a.logs.totalTime)
        })), a.log = function() {
            if (a.dev && window.console && console.log && console.log.apply) console.log.apply(console, arguments);
            else if (a.dev && window.console && "function" == typeof console.log && Function.prototype.bind) {
                var b = Function.prototype.bind.call(console.log, console);
                b.apply(console, arguments)
            }
            return arguments[arguments.length - 1]
        }, a.deprecated = function(a, b) {
            console && console.warn && console.warn("nvd3 warning: `" + a + "` has been deprecated. ", b || "")
        }, a.render = function(b) {
            b = b || 1, a.render.active = !0, a.dispatch.render_start();
            var c = function() {
                for (var d, e, f = 0; b > f && (e = a.render.queue[f]); f++) d = e.generate(), typeof e.callback == typeof Function && e.callback(d);
                a.render.queue.splice(0, f), a.render.queue.length ? setTimeout(c) : (a.dispatch.render_end(), a.render.active = !1)
            };
            setTimeout(c)
        }, a.render.active = !1, a.render.queue = [], a.addGraph = function(b) {
            typeof arguments[0] == typeof Function && (b = {
                generate: arguments[0],
                callback: arguments[1]
            }), a.render.queue.push(b), a.render.active || a.render()
        }, "undefined" != typeof module && "undefined" != typeof exports && (module.exports = a), "undefined" != typeof window && (window.nv = a), a.dom.write = function(a) {
            return void 0 !== window.fastdom ? fastdom.write(a) : a()
        }, a.dom.read = function(a) {
            return void 0 !== window.fastdom ? fastdom.read(a) : a()
        }, a.interactiveGuideline = function() {
            "use strict";

            function b(l) {
                l.each(function(l) {
                    function m() {
                        var a = d3.mouse(this),
                            d = a[0],
                            e = a[1],
                            i = !0,
                            j = !1;
                        if (k && (d = d3.event.offsetX, e = d3.event.offsetY, "svg" !== d3.event.target.tagName && (i = !1), d3.event.target.className.baseVal.match("nv-legend") && (j = !0)), i && (d -= f.left, e -= f.top), 0 > d || 0 > e || d > o || e > p || d3.event.relatedTarget && void 0 === d3.event.relatedTarget.ownerSVGElement || j) {
                            if (k && d3.event.relatedTarget && void 0 === d3.event.relatedTarget.ownerSVGElement && (void 0 === d3.event.relatedTarget.className || d3.event.relatedTarget.className.match(c.nvPointerEventsClass))) return;
                            return h.elementMouseout({
                                mouseX: d,
                                mouseY: e
                            }), b.renderGuideLine(null), void c.hidden(!0)
                        }
                        c.hidden(!1);
                        var l = g.invert(d);
                        h.elementMousemove({
                            mouseX: d,
                            mouseY: e,
                            pointXValue: l
                        }), "dblclick" === d3.event.type && h.elementDblclick({
                            mouseX: d,
                            mouseY: e,
                            pointXValue: l
                        }), "click" === d3.event.type && h.elementClick({
                            mouseX: d,
                            mouseY: e,
                            pointXValue: l
                        })
                    }
                    var n = d3.select(this),
                        o = d || 960,
                        p = e || 400,
                        q = n.selectAll("g.nv-wrap.nv-interactiveLineLayer").data([l]),
                        r = q.enter().append("g").attr("class", " nv-wrap nv-interactiveLineLayer");
                    r.append("g").attr("class", "nv-interactiveGuideLine"), j && (j.on("touchmove", m).on("mousemove", m, !0).on("mouseout", m, !0).on("dblclick", m).on("click", m), b.guideLine = null, b.renderGuideLine = function(c) {
                        i && (b.guideLine && b.guideLine.attr("x1") === c || a.dom.write(function() {
                            var b = q.select(".nv-interactiveGuideLine").selectAll("line").data(null != c ? [a.utils.NaNtoZero(c)] : [], String);
                            b.enter().append("line").attr("class", "nv-guideline").attr("x1", function(a) {
                                return a
                            }).attr("x2", function(a) {
                                return a
                            }).attr("y1", p).attr("y2", 0), b.exit().remove()
                        }))
                    })
                })
            }
            var c = a.models.tooltip();
            c.duration(0).hideDelay(0)._isInteractiveLayer(!0).hidden(!1);
            var d = null,
                e = null,
                f = {
                    left: 0,
                    top: 0
                },
                g = d3.scale.linear(),
                h = d3.dispatch("elementMousemove", "elementMouseout", "elementClick", "elementDblclick"),
                i = !0,
                j = null,
                k = "ActiveXObject" in window;
            return b.dispatch = h, b.tooltip = c, b.margin = function(a) {
                return arguments.length ? (f.top = "undefined" != typeof a.top ? a.top : f.top, f.left = "undefined" != typeof a.left ? a.left : f.left, b) : f
            }, b.width = function(a) {
                return arguments.length ? (d = a, b) : d
            }, b.height = function(a) {
                return arguments.length ? (e = a, b) : e
            }, b.xScale = function(a) {
                return arguments.length ? (g = a, b) : g
            }, b.showGuideLine = function(a) {
                return arguments.length ? (i = a, b) : i
            }, b.svgContainer = function(a) {
                return arguments.length ? (j = a, b) : j
            }, b
        }, a.interactiveBisect = function(a, b, c) {
            "use strict";
            if (!(a instanceof Array)) return null;
            var d;
            d = "function" != typeof c ? function(a) {
                return a.x
            } : c;
            var e = function(a, b) {
                    return d(a) - b
                },
                f = d3.bisector(e).left,
                g = d3.max([0, f(a, b) - 1]),
                h = d(a[g]);
            if ("undefined" == typeof h && (h = g), h === b) return g;
            var i = d3.min([g + 1, a.length - 1]),
                j = d(a[i]);
            return "undefined" == typeof j && (j = i), Math.abs(j - b) >= Math.abs(h - b) ? g : i
        }, a.nearestValueIndex = function(a, b, c) {
            "use strict";
            var d = 1 / 0,
                e = null;
            return a.forEach(function(a, f) {
                var g = Math.abs(b - a);
                null != a && d >= g && c > g && (d = g, e = f)
            }), e
        },
        function() {
            "use strict";
            a.models.tooltip = function() {
                function b() {
                    if (k) {
                        var a = d3.select(k);
                        "svg" !== a.node().tagName && (a = a.select("svg"));
                        var b = a.node() ? a.attr("viewBox") : null;
                        if (b) {
                            b = b.split(" ");
                            var c = parseInt(a.style("width"), 10) / b[2];
                            p.left = p.left * c, p.top = p.top * c
                        }
                    }
                }

                function c() {
                    if (!n) {
                        var a;
                        a = k ? k : document.body, n = d3.select(a).append("div").attr("class", "nvtooltip " + (j ? j : "xy-tooltip")).attr("id", v), n.style("top", 0).style("left", 0), n.style("opacity", 0), n.selectAll("div, table, td, tr").classed(w, !0), n.classed(w, !0), o = n.node()
                    }
                }

                function d() {
                    if (r && B(e)) {
                        b();
                        var f = p.left,
                            g = null !== i ? i : p.top;
                        return a.dom.write(function() {
                            c();
                            var b = A(e);
                            b && (o.innerHTML = b), k && u ? a.dom.read(function() {
                                var a = k.getElementsByTagName("svg")[0],
                                    b = {
                                        left: 0,
                                        top: 0
                                    };
                                if (a) {
                                    var c = a.getBoundingClientRect(),
                                        d = k.getBoundingClientRect(),
                                        e = c.top;
                                    if (0 > e) {
                                        var i = k.getBoundingClientRect();
                                        e = Math.abs(e) > i.height ? 0 : e
                                    }
                                    b.top = Math.abs(e - d.top), b.left = Math.abs(c.left - d.left)
                                }
                                f += k.offsetLeft + b.left - 2 * k.scrollLeft, g += k.offsetTop + b.top - 2 * k.scrollTop, h && h > 0 && (g = Math.floor(g / h) * h), C([f, g])
                            }) : C([f, g])
                        }), d
                    }
                }
                var e = null,
                    f = "w",
                    g = 25,
                    h = 0,
                    i = null,
                    j = null,
                    k = null,
                    l = !0,
                    m = 400,
                    n = null,
                    o = null,
                    p = {
                        left: null,
                        top: null
                    },
                    q = {
                        left: 0,
                        top: 0
                    },
                    r = !0,
                    s = 100,
                    t = !0,
                    u = !1,
                    v = "nvtooltip-" + Math.floor(1e5 * Math.random()),
                    w = "nv-pointer-events-none",
                    x = function(a) {
                        return a
                    },
                    y = function(a) {
                        return a
                    },
                    z = function(a) {
                        return a
                    },
                    A = function(a) {
                        if (null === a) return "";
                        var b = d3.select(document.createElement("table"));
                        if (t) {
                            var c = b.selectAll("thead").data([a]).enter().append("thead");
                            c.append("tr").append("td").attr("colspan", 3).append("strong").classed("x-value", !0).html(y(a.value))
                        }
                        var d = b.selectAll("tbody").data([a]).enter().append("tbody"),
                            e = d.selectAll("tr").data(function(a) {
                                return a.series
                            }).enter().append("tr").classed("highlight", function(a) {
                                return a.highlight
                            });
                        e.append("td").classed("legend-color-guide", !0).append("div").style("background-color", function(a) {
                            return a.color
                        }), e.append("td").classed("key", !0).html(function(a, b) {
                            return z(a.key, b)
                        }), e.append("td").classed("value", !0).html(function(a, b) {
                            return x(a.value, b)
                        }), e.selectAll("td").each(function(a) {
                            if (a.highlight) {
                                var b = d3.scale.linear().domain([0, 1]).range(["#fff", a.color]),
                                    c = .6;
                                d3.select(this).style("border-bottom-color", b(c)).style("border-top-color", b(c))
                            }
                        });
                        var f = b.node().outerHTML;
                        return void 0 !== a.footer && (f += "<div class='footer'>" + a.footer + "</div>"), f
                    },
                    B = function(a) {
                        if (a && a.series) {
                            if (a.series instanceof Array) return !!a.series.length;
                            if (a.series instanceof Object) return a.series = [a.series], !0
                        }
                        return !1
                    },
                    C = function(b) {
                        o && a.dom.read(function() {
                            var c, d, e = parseInt(o.offsetHeight, 10),
                                h = parseInt(o.offsetWidth, 10),
                                i = a.utils.windowSize().width,
                                j = a.utils.windowSize().height,
                                k = window.pageYOffset,
                                p = window.pageXOffset;
                            j = window.innerWidth >= document.body.scrollWidth ? j : j - 16, i = window.innerHeight >= document.body.scrollHeight ? i : i - 16;
                            var r, t, u = function(a) {
                                    var b = d;
                                    do isNaN(a.offsetTop) || (b += a.offsetTop), a = a.offsetParent; while (a);
                                    return b
                                },
                                v = function(a) {
                                    var b = c;
                                    do isNaN(a.offsetLeft) || (b += a.offsetLeft), a = a.offsetParent; while (a);
                                    return b
                                };
                            switch (f) {
                                case "e":
                                    c = b[0] - h - g, d = b[1] - e / 2, r = v(o), t = u(o), p > r && (c = b[0] + g > p ? b[0] + g : p - r + c), k > t && (d = k - t + d), t + e > k + j && (d = k + j - t + d - e);
                                    break;
                                case "w":
                                    c = b[0] + g, d = b[1] - e / 2, r = v(o), t = u(o), r + h > i && (c = b[0] - h - g), k > t && (d = k + 5), t + e > k + j && (d = k + j - t + d - e);
                                    break;
                                case "n":
                                    c = b[0] - h / 2 - 5, d = b[1] + g, r = v(o), t = u(o), p > r && (c = p + 5), r + h > i && (c = c - h / 2 + 5), t + e > k + j && (d = k + j - t + d - e);
                                    break;
                                case "s":
                                    c = b[0] - h / 2, d = b[1] - e - g, r = v(o), t = u(o), p > r && (c = p + 5), r + h > i && (c = c - h / 2 + 5), k > t && (d = k);
                                    break;
                                case "none":
                                    c = b[0], d = b[1] - g, r = v(o), t = u(o)
                            }
                            c -= q.left, d -= q.top;
                            var w = o.getBoundingClientRect(),
                                k = window.pageYOffset || document.documentElement.scrollTop,
                                p = window.pageXOffset || document.documentElement.scrollLeft,
                                x = "translate(" + (w.left + p) + "px, " + (w.top + k) + "px)",
                                y = "translate(" + c + "px, " + d + "px)",
                                z = d3.interpolateString(x, y),
                                A = n.style("opacity") < .1;
                            l ? n.transition().delay(m).duration(0).style("opacity", 0) : n.interrupt().transition().duration(A ? 0 : s).styleTween("transform", function() {
                                return z
                            }, "important").style("-webkit-transform", y).style("opacity", 1)
                        })
                    };
                return d.nvPointerEventsClass = w, d.options = a.utils.optionsFunc.bind(d), d._options = Object.create({}, {
                    duration: {
                        get: function() {
                            return s
                        },
                        set: function(a) {
                            s = a
                        }
                    },
                    gravity: {
                        get: function() {
                            return f
                        },
                        set: function(a) {
                            f = a
                        }
                    },
                    distance: {
                        get: function() {
                            return g
                        },
                        set: function(a) {
                            g = a
                        }
                    },
                    snapDistance: {
                        get: function() {
                            return h
                        },
                        set: function(a) {
                            h = a
                        }
                    },
                    classes: {
                        get: function() {
                            return j
                        },
                        set: function(a) {
                            j = a
                        }
                    },
                    chartContainer: {
                        get: function() {
                            return k
                        },
                        set: function(a) {
                            k = a
                        }
                    },
                    fixedTop: {
                        get: function() {
                            return i
                        },
                        set: function(a) {
                            i = a
                        }
                    },
                    enabled: {
                        get: function() {
                            return r
                        },
                        set: function(a) {
                            r = a
                        }
                    },
                    hideDelay: {
                        get: function() {
                            return m
                        },
                        set: function(a) {
                            m = a
                        }
                    },
                    contentGenerator: {
                        get: function() {
                            return A
                        },
                        set: function(a) {
                            A = a
                        }
                    },
                    valueFormatter: {
                        get: function() {
                            return x
                        },
                        set: function(a) {
                            x = a
                        }
                    },
                    headerFormatter: {
                        get: function() {
                            return y
                        },
                        set: function(a) {
                            y = a
                        }
                    },
                    keyFormatter: {
                        get: function() {
                            return z
                        },
                        set: function(a) {
                            z = a
                        }
                    },
                    headerEnabled: {
                        get: function() {
                            return t
                        },
                        set: function(a) {
                            t = a
                        }
                    },
                    _isInteractiveLayer: {
                        get: function() {
                            return u
                        },
                        set: function(a) {
                            u = !!a
                        }
                    },
                    position: {
                        get: function() {
                            return p
                        },
                        set: function(a) {
                            p.left = void 0 !== a.left ? a.left : p.left, p.top = void 0 !== a.top ? a.top : p.top
                        }
                    },
                    offset: {
                        get: function() {
                            return q
                        },
                        set: function(a) {
                            q.left = void 0 !== a.left ? a.left : q.left, q.top = void 0 !== a.top ? a.top : q.top
                        }
                    },
                    hidden: {
                        get: function() {
                            return l
                        },
                        set: function(a) {
                            l != a && (l = !!a, d())
                        }
                    },
                    data: {
                        get: function() {
                            return e
                        },
                        set: function(a) {
                            a.point && (a.value = a.point.x, a.series = a.series || {}, a.series.value = a.point.y, a.series.color = a.point.color || a.series.color), e = a
                        }
                    },
                    tooltipElem: {
                        get: function() {
                            return o
                        },
                        set: function() {}
                    },
                    id: {
                        get: function() {
                            return v
                        },
                        set: function() {}
                    }
                }), a.utils.initOptions(d), d
            }
        }(), a.utils.windowSize = function() {
            var a = {
                width: 640,
                height: 480
            };
            return window.innerWidth && window.innerHeight ? (a.width = window.innerWidth, a.height = window.innerHeight, a) : "CSS1Compat" == document.compatMode && document.documentElement && document.documentElement.offsetWidth ? (a.width = document.documentElement.offsetWidth, a.height = document.documentElement.offsetHeight, a) : document.body && document.body.offsetWidth ? (a.width = document.body.offsetWidth, a.height = document.body.offsetHeight, a) : a
        }, a.utils.windowResize = function(b) {
            return window.addEventListener ? window.addEventListener("resize", b) : a.log("ERROR: Failed to bind to window.resize with: ", b), {
                callback: b,
                clear: function() {
                    window.removeEventListener("resize", b)
                }
            }
        }, a.utils.getColor = function(b) {
            if (void 0 === b) return a.utils.defaultColor();
            if (Array.isArray(b)) {
                var c = d3.scale.ordinal().range(b);
                return function(a, b) {
                    var d = void 0 === b ? a : b;
                    return a.color || c(d)
                }
            }
            return b
        }, a.utils.defaultColor = function() {
            return a.utils.getColor(d3.scale.category20().range())
        }, a.utils.customTheme = function(a, b, c) {
            b = b || function(a) {
                return a.key
            }, c = c || d3.scale.category20().range();
            var d = c.length;
            return function(e) {
                var f = b(e);
                return "function" == typeof a[f] ? a[f]() : void 0 !== a[f] ? a[f] : (d || (d = c.length), d -= 1, c[d])
            }
        }, a.utils.pjax = function(b, c) {
            var d = function(d) {
                d3.html(d, function(d) {
                    var e = d3.select(c).node();
                    e.parentNode.replaceChild(d3.select(d).select(c).node(), e), a.utils.pjax(b, c)
                })
            };
            d3.selectAll(b).on("click", function() {
                history.pushState(this.href, this.textContent, this.href), d(this.href), d3.event.preventDefault()
            }), d3.select(window).on("popstate", function() {
                d3.event.state && d(d3.event.state)
            })
        }, a.utils.calcApproxTextWidth = function(a) {
            if ("function" == typeof a.style && "function" == typeof a.text) {
                var b = parseInt(a.style("font-size").replace("px", ""), 10),
                    c = a.text().length;
                return c * b * .5
            }
            return 0
        }, a.utils.NaNtoZero = function(a) {
            return "number" != typeof a || isNaN(a) || null === a || 1 / 0 === a || a === -1 / 0 ? 0 : a
        }, d3.selection.prototype.watchTransition = function(a) {
            var b = [this].concat([].slice.call(arguments, 1));
            return a.transition.apply(a, b)
        }, a.utils.renderWatch = function(b, c) {
            if (!(this instanceof a.utils.renderWatch)) return new a.utils.renderWatch(b, c);
            var d = void 0 !== c ? c : 250,
                e = [],
                f = this;
            this.models = function(a) {
                return a = [].slice.call(arguments, 0), a.forEach(function(a) {
                    a.__rendered = !1,
                        function(a) {
                            a.dispatch.on("renderEnd", function() {
                                a.__rendered = !0, f.renderEnd("model")
                            })
                        }(a), e.indexOf(a) < 0 && e.push(a)
                }), this
            }, this.reset = function(a) {
                void 0 !== a && (d = a), e = []
            }, this.transition = function(a, b, c) {
                if (b = arguments.length > 1 ? [].slice.call(arguments, 1) : [], c = b.length > 1 ? b.pop() : void 0 !== d ? d : 250, a.__rendered = !1, e.indexOf(a) < 0 && e.push(a), 0 === c) return a.__rendered = !0, a.delay = function() {
                    return this
                }, a.duration = function() {
                    return this
                }, a;
                a.__rendered = 0 === a.length ? !0 : a.every(function(a) {
                    return !a.length
                }) ? !0 : !1;
                var g = 0;
                return a.transition().duration(c).each(function() {
                    ++g
                }).each("end", function() {
                    0 === --g && (a.__rendered = !0, f.renderEnd.apply(this, b))
                })
            }, this.renderEnd = function() {
                e.every(function(a) {
                    return a.__rendered
                }) && (e.forEach(function(a) {
                    a.__rendered = !1
                }), b.renderEnd.apply(this, arguments))
            }
        }, a.utils.deepExtend = function(b) {
            var c = arguments.length > 1 ? [].slice.call(arguments, 1) : [];
            c.forEach(function(c) {
                for (var d in c) {
                    var e = b[d] instanceof Array,
                        f = "object" == typeof b[d],
                        g = "object" == typeof c[d];
                    f && !e && g ? a.utils.deepExtend(b[d], c[d]) : b[d] = c[d]
                }
            })
        }, a.utils.state = function() {
            if (!(this instanceof a.utils.state)) return new a.utils.state;
            var b = {},
                c = function() {},
                d = function() {
                    return {}
                },
                e = null,
                f = null;
            this.dispatch = d3.dispatch("change", "set"), this.dispatch.on("set", function(a) {
                c(a, !0)
            }), this.getter = function(a) {
                return d = a, this
            }, this.setter = function(a, b) {
                return b || (b = function() {}), c = function(c, d) {
                    a(c), d && b()
                }, this
            }, this.init = function(b) {
                e = e || {}, a.utils.deepExtend(e, b)
            };
            var g = function() {
                var a = d();
                if (JSON.stringify(a) === JSON.stringify(b)) return !1;
                for (var c in a) void 0 === b[c] && (b[c] = {}), b[c] = a[c], f = !0;
                return !0
            };
            this.update = function() {
                e && (c(e, !1), e = null), g.call(this) && this.dispatch.change(b)
            }
        }, a.utils.optionsFunc = function(a) {
            return a && d3.map(a).forEach(function(a, b) {
                "function" == typeof this[a] && this[a](b)
            }.bind(this)), this
        }, a.utils.calcTicksX = function(b, c) {
            var d = 1,
                e = 0;
            for (e; e < c.length; e += 1) {
                var f = c[e] && c[e].values ? c[e].values.length : 0;
                d = f > d ? f : d
            }
            return a.log("Requested number of ticks: ", b), a.log("Calculated max values to be: ", d), b = b > d ? b = d - 1 : b, b = 1 > b ? 1 : b, b = Math.floor(b), a.log("Calculating tick count as: ", b), b
        }, a.utils.calcTicksY = function(b, c) {
            return a.utils.calcTicksX(b, c)
        }, a.utils.initOption = function(a, b) {
            a._calls && a._calls[b] ? a[b] = a._calls[b] : (a[b] = function(c) {
                return arguments.length ? (a._overrides[b] = !0, a._options[b] = c, a) : a._options[b]
            }, a["_" + b] = function(c) {
                return arguments.length ? (a._overrides[b] || (a._options[b] = c), a) : a._options[b]
            })
        }, a.utils.initOptions = function(b) {
            b._overrides = b._overrides || {};
            var c = Object.getOwnPropertyNames(b._options || {}),
                d = Object.getOwnPropertyNames(b._calls || {});
            c = c.concat(d);
            for (var e in c) a.utils.initOption(b, c[e])
        }, a.utils.inheritOptionsD3 = function(a, b, c) {
            a._d3options = c.concat(a._d3options || []), c.unshift(b), c.unshift(a), d3.rebind.apply(this, c)
        }, a.utils.arrayUnique = function(a) {
            return a.sort().filter(function(b, c) {
                return !c || b != a[c - 1]
            })
        }, a.utils.symbolMap = d3.map(), a.utils.symbol = function() {
            function b(b, e) {
                var f = c.call(this, b, e),
                    g = d.call(this, b, e);
                return -1 !== d3.svg.symbolTypes.indexOf(f) ? d3.svg.symbol().type(f).size(g)() : a.utils.symbolMap.get(f)(g)
            }
            var c, d = 64;
            return b.type = function(a) {
                return arguments.length ? (c = d3.functor(a), b) : c
            }, b.size = function(a) {
                return arguments.length ? (d = d3.functor(a), b) : d
            }, b
        }, a.utils.inheritOptions = function(b, c) {
            var d = Object.getOwnPropertyNames(c._options || {}),
                e = Object.getOwnPropertyNames(c._calls || {}),
                f = c._inherited || [],
                g = c._d3options || [],
                h = d.concat(e).concat(f).concat(g);
            h.unshift(c), h.unshift(b), d3.rebind.apply(this, h), b._inherited = a.utils.arrayUnique(d.concat(e).concat(f).concat(d).concat(b._inherited || [])), b._d3options = a.utils.arrayUnique(g.concat(b._d3options || []))
        }, a.utils.initSVG = function(a) {
            a.classed({
                "nvd3-svg": !0
            })
        }, a.utils.sanitizeHeight = function(a, b) {
            return a || parseInt(b.style("height"), 10) || 400
        }, a.utils.sanitizeWidth = function(a, b) {
            return a || parseInt(b.style("width"), 10) || 960
        }, a.utils.availableHeight = function(b, c, d) {
            return a.utils.sanitizeHeight(b, c) - d.top - d.bottom
        }, a.utils.availableWidth = function(b, c, d) {
            return a.utils.sanitizeWidth(b, c) - d.left - d.right
        }, a.utils.noData = function(b, c) {
            var d = b.options(),
                e = d.margin(),
                f = d.noData(),
                g = null == f ? ["No Data Available."] : [f],
                h = a.utils.availableHeight(d.height(), c, e),
                i = a.utils.availableWidth(d.width(), c, e),
                j = e.left + i / 2,
                k = e.top + h / 2;
            c.selectAll("g").remove();
            var l = c.selectAll(".nv-noData").data(g);
            l.enter().append("text").attr("class", "nvd3 nv-noData").attr("dy", "-.7em").style("text-anchor", "middle"), l.attr("x", j).attr("y", k).text(function(a) {
                return a
            })
        }, a.models.axis = function() {
            "use strict";

            function b(g) {
                return s.reset(), g.each(function(b) {
                    var g = d3.select(this);
                    a.utils.initSVG(g);
                    var p = g.selectAll("g.nv-wrap.nv-axis").data([b]),
                        q = p.enter().append("g").attr("class", "nvd3 nv-wrap nv-axis"),
                        t = (q.append("g"), p.select("g"));
                    null !== n ? c.ticks(n) : ("top" == c.orient() || "bottom" == c.orient()) && c.ticks(Math.abs(d.range()[1] - d.range()[0]) / 100), t.watchTransition(s, "axis").call(c), r = r || c.scale();
                    var u = c.tickFormat();
                    null == u && (u = r.tickFormat());
                    var v = t.selectAll("text.nv-axislabel").data([h || null]);
                    v.exit().remove();
                    var w, x, y;
                    switch (c.orient()) {
                        case "top":
                            v.enter().append("text").attr("class", "nv-axislabel"), y = d.range().length < 2 ? 0 : 2 === d.range().length ? d.range()[1] : d.range()[d.range().length - 1] + (d.range()[1] - d.range()[0]), v.attr("text-anchor", "middle").attr("y", 0).attr("x", y / 2), i && (x = p.selectAll("g.nv-axisMaxMin").data(d.domain()), x.enter().append("g").attr("class", function(a, b) {
                                return ["nv-axisMaxMin", "nv-axisMaxMin-x", 0 == b ? "nv-axisMin-x" : "nv-axisMax-x"].join(" ")
                            }).append("text"), x.exit().remove(), x.attr("transform", function(b) {
                                return "translate(" + a.utils.NaNtoZero(d(b)) + ",0)"
                            }).select("text").attr("dy", "-0.5em").attr("y", -c.tickPadding()).attr("text-anchor", "middle").text(function(a) {
                                var b = u(a);
                                return ("" + b).match("NaN") ? "" : b
                            }), x.watchTransition(s, "min-max top").attr("transform", function(b, c) {
                                return "translate(" + a.utils.NaNtoZero(d.range()[c]) + ",0)"
                            }));
                            break;
                        case "bottom":
                            w = o + 36;
                            var z = 30,
                                A = 0,
                                B = t.selectAll("g").select("text"),
                                C = "";
                            if (j % 360) {
                                B.each(function() {
                                    var a = this.getBoundingClientRect(),
                                        b = a.width;
                                    A = a.height, b > z && (z = b)
                                }), C = "rotate(" + j + " 0," + (A / 2 + c.tickPadding()) + ")";
                                var D = Math.abs(Math.sin(j * Math.PI / 180));
                                w = (D ? D * z : z) + 30, B.attr("transform", C).style("text-anchor", j % 360 > 0 ? "start" : "end")
                            }
                            v.enter().append("text").attr("class", "nv-axislabel"), y = d.range().length < 2 ? 0 : 2 === d.range().length ? d.range()[1] : d.range()[d.range().length - 1] + (d.range()[1] - d.range()[0]), v.attr("text-anchor", "middle").attr("y", w).attr("x", y / 2), i && (x = p.selectAll("g.nv-axisMaxMin").data([d.domain()[0], d.domain()[d.domain().length - 1]]), x.enter().append("g").attr("class", function(a, b) {
                                return ["nv-axisMaxMin", "nv-axisMaxMin-x", 0 == b ? "nv-axisMin-x" : "nv-axisMax-x"].join(" ")
                            }).append("text"), x.exit().remove(), x.attr("transform", function(b) {
                                return "translate(" + a.utils.NaNtoZero(d(b) + (m ? d.rangeBand() / 2 : 0)) + ",0)"
                            }).select("text").attr("dy", ".71em").attr("y", c.tickPadding()).attr("transform", C).style("text-anchor", j ? j % 360 > 0 ? "start" : "end" : "middle").text(function(a) {
                                var b = u(a);
                                return ("" + b).match("NaN") ? "" : b
                            }), x.watchTransition(s, "min-max bottom").attr("transform", function(b) {
                                return "translate(" + a.utils.NaNtoZero(d(b) + (m ? d.rangeBand() / 2 : 0)) + ",0)"
                            })), l && B.attr("transform", function(a, b) {
                                return "translate(0," + (b % 2 == 0 ? "0" : "12") + ")"
                            });
                            break;
                        case "right":
                            v.enter().append("text").attr("class", "nv-axislabel"), v.style("text-anchor", k ? "middle" : "begin").attr("transform", k ? "rotate(90)" : "").attr("y", k ? -Math.max(e.right, f) + 12 : -10).attr("x", k ? d3.max(d.range()) / 2 : c.tickPadding()), i && (x = p.selectAll("g.nv-axisMaxMin").data(d.domain()), x.enter().append("g").attr("class", function(a, b) {
                                return ["nv-axisMaxMin", "nv-axisMaxMin-y", 0 == b ? "nv-axisMin-y" : "nv-axisMax-y"].join(" ")
                            }).append("text").style("opacity", 0), x.exit().remove(), x.attr("transform", function(b) {
                                return "translate(0," + a.utils.NaNtoZero(d(b)) + ")"
                            }).select("text").attr("dy", ".32em").attr("y", 0).attr("x", c.tickPadding()).style("text-anchor", "start").text(function(a) {
                                var b = u(a);
                                return ("" + b).match("NaN") ? "" : b
                            }), x.watchTransition(s, "min-max right").attr("transform", function(b, c) {
                                return "translate(0," + a.utils.NaNtoZero(d.range()[c]) + ")"
                            }).select("text").style("opacity", 1));
                            break;
                        case "left":
                            v.enter().append("text").attr("class", "nv-axislabel"), v.style("text-anchor", k ? "middle" : "end").attr("transform", k ? "rotate(-90)" : "").attr("y", k ? -Math.max(e.left, f) + 25 - (o || 0) : -10).attr("x", k ? -d3.max(d.range()) / 2 : -c.tickPadding()), i && (x = p.selectAll("g.nv-axisMaxMin").data(d.domain()), x.enter().append("g").attr("class", function(a, b) {
                                return ["nv-axisMaxMin", "nv-axisMaxMin-y", 0 == b ? "nv-axisMin-y" : "nv-axisMax-y"].join(" ")
                            }).append("text").style("opacity", 0), x.exit().remove(), x.attr("transform", function(b) {
                                return "translate(0," + a.utils.NaNtoZero(r(b)) + ")"
                            }).select("text").attr("dy", ".32em").attr("y", 0).attr("x", -c.tickPadding()).attr("text-anchor", "end").text(function(a) {
                                var b = u(a);
                                return ("" + b).match("NaN") ? "" : b
                            }), x.watchTransition(s, "min-max right").attr("transform", function(b, c) {
                                return "translate(0," + a.utils.NaNtoZero(d.range()[c]) + ")"
                            }).select("text").style("opacity", 1))
                    }
                    if (v.text(function(a) {
                            return a
                        }), !i || "left" !== c.orient() && "right" !== c.orient() || (t.selectAll("g").each(function(a) {
                            d3.select(this).select("text").attr("opacity", 1), (d(a) < d.range()[1] + 10 || d(a) > d.range()[0] - 10) && ((a > 1e-10 || -1e-10 > a) && d3.select(this).attr("opacity", 0), d3.select(this).select("text").attr("opacity", 0))
                        }), d.domain()[0] == d.domain()[1] && 0 == d.domain()[0] && p.selectAll("g.nv-axisMaxMin").style("opacity", function(a, b) {
                            return b ? 0 : 1
                        })), i && ("top" === c.orient() || "bottom" === c.orient())) {
                        var E = [];
                        p.selectAll("g.nv-axisMaxMin").each(function(a, b) {
                            try {
                                E.push(b ? d(a) - this.getBoundingClientRect().width - 4 : d(a) + this.getBoundingClientRect().width + 4)
                            } catch (c) {
                                E.push(b ? d(a) - 4 : d(a) + 4)
                            }
                        }), t.selectAll("g").each(function(a) {
                            (d(a) < E[0] || d(a) > E[1]) && (a > 1e-10 || -1e-10 > a ? d3.select(this).remove() : d3.select(this).select("text").remove())
                        })
                    }
                    t.selectAll(".tick").filter(function(a) {
                        return !parseFloat(Math.round(1e5 * a) / 1e6) && void 0 !== a
                    }).classed("zero", !0), r = d.copy()
                }), s.renderEnd("axis immediate"), b
            }
            var c = d3.svg.axis(),
                d = d3.scale.linear(),
                e = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                f = 75,
                g = 60,
                h = null,
                i = !0,
                j = 0,
                k = !0,
                l = !1,
                m = !1,
                n = null,
                o = 0,
                p = 250,
                q = d3.dispatch("renderEnd");
            c.scale(d).orient("bottom").tickFormat(function(a) {
                return a
            });
            var r, s = a.utils.renderWatch(q, p);
            return b.axis = c, b.dispatch = q, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                axisLabelDistance: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                staggerLabels: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                rotateLabels: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j = a
                    }
                },
                rotateYLabel: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                showMaxMin: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                axisLabel: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                height: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g = a
                    }
                },
                ticks: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                width: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f = a
                    }
                },
                margin: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e.top = void 0 !== a.top ? a.top : e.top, e.right = void 0 !== a.right ? a.right : e.right, e.bottom = void 0 !== a.bottom ? a.bottom : e.bottom, e.left = void 0 !== a.left ? a.left : e.left
                    }
                },
                duration: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a, s.reset(p)
                    }
                },
                scale: {
                    get: function() {
                        return d
                    },
                    set: function(e) {
                        d = e, c.scale(d), m = "function" == typeof d.rangeBands, a.utils.inheritOptionsD3(b, d, ["domain", "range", "rangeBand", "rangeBands"])
                    }
                }
            }), a.utils.initOptions(b), a.utils.inheritOptionsD3(b, c, ["orient", "tickValues", "tickSubdivide", "tickSize", "tickPadding", "tickFormat"]), a.utils.inheritOptionsD3(b, d, ["domain", "range", "rangeBand", "rangeBands"]), b
        }, a.models.boxPlot = function() {
            "use strict";

            function b(l) {
                return v.reset(), l.each(function(b) {
                    var l = j - i.left - i.right,
                        p = k - i.top - i.bottom;
                    r = d3.select(this), a.utils.initSVG(r), m.domain(c || b.map(function(a, b) {
                        return o(a, b)
                    })).rangeBands(e || [0, l], .1);
                    var w = [];
                    if (!d) {
                        var x = d3.min(b.map(function(a) {
                                var b = [];
                                return b.push(a.values.Q1), a.values.hasOwnProperty("whisker_low") && null !== a.values.whisker_low && b.push(a.values.whisker_low), a.values.hasOwnProperty("outliers") && null !== a.values.outliers && (b = b.concat(a.values.outliers)), d3.min(b)
                            })),
                            y = d3.max(b.map(function(a) {
                                var b = [];
                                return b.push(a.values.Q3), a.values.hasOwnProperty("whisker_high") && null !== a.values.whisker_high && b.push(a.values.whisker_high), a.values.hasOwnProperty("outliers") && null !== a.values.outliers && (b = b.concat(a.values.outliers)), d3.max(b)
                            }));
                        w = [x, y]
                    }
                    n.domain(d || w), n.range(f || [p, 0]), g = g || m, h = h || n.copy().range([n(0), n(0)]); {
                        var z = r.selectAll("g.nv-wrap").data([b]);
                        z.enter().append("g").attr("class", "nvd3 nv-wrap")
                    }
                    z.attr("transform", "translate(" + i.left + "," + i.top + ")");
                    var A = z.selectAll(".nv-boxplot").data(function(a) {
                            return a
                        }),
                        B = A.enter().append("g").style("stroke-opacity", 1e-6).style("fill-opacity", 1e-6);
                    A.attr("class", "nv-boxplot").attr("transform", function(a, b) {
                        return "translate(" + (m(o(a, b)) + .05 * m.rangeBand()) + ", 0)"
                    }).classed("hover", function(a) {
                        return a.hover
                    }), A.watchTransition(v, "nv-boxplot: boxplots").style("stroke-opacity", 1).style("fill-opacity", .75).delay(function(a, c) {
                        return c * t / b.length
                    }).attr("transform", function(a, b) {
                        return "translate(" + (m(o(a, b)) + .05 * m.rangeBand()) + ", 0)"
                    }), A.exit().remove(), B.each(function(a, b) {
                        var c = d3.select(this);
                        ["low", "high"].forEach(function(d) {
                            a.values.hasOwnProperty("whisker_" + d) && null !== a.values["whisker_" + d] && (c.append("line").style("stroke", a.color ? a.color : q(a, b)).attr("class", "nv-boxplot-whisker nv-boxplot-" + d), c.append("line").style("stroke", a.color ? a.color : q(a, b)).attr("class", "nv-boxplot-tick nv-boxplot-" + d))
                        })
                    });
                    var C = A.selectAll(".nv-boxplot-outlier").data(function(a) {
                        return a.values.hasOwnProperty("outliers") && null !== a.values.outliers ? a.values.outliers : []
                    });
                    C.enter().append("circle").style("fill", function(a, b, c) {
                        return q(a, c)
                    }).style("stroke", function(a, b, c) {
                        return q(a, c)
                    }).on("mouseover", function(a, b, c) {
                        d3.select(this).classed("hover", !0), s.elementMouseover({
                            series: {
                                key: a,
                                color: q(a, c)
                            },
                            e: d3.event
                        })
                    }).on("mouseout", function(a, b, c) {
                        d3.select(this).classed("hover", !1), s.elementMouseout({
                            series: {
                                key: a,
                                color: q(a, c)
                            },
                            e: d3.event
                        })
                    }).on("mousemove", function() {
                        s.elementMousemove({
                            e: d3.event
                        })
                    }), C.attr("class", "nv-boxplot-outlier"), C.watchTransition(v, "nv-boxplot: nv-boxplot-outlier").attr("cx", .45 * m.rangeBand()).attr("cy", function(a) {
                        return n(a)
                    }).attr("r", "3"), C.exit().remove();
                    var D = function() {
                            return null === u ? .9 * m.rangeBand() : Math.min(75, .9 * m.rangeBand())
                        },
                        E = function() {
                            return .45 * m.rangeBand() - D() / 2
                        },
                        F = function() {
                            return .45 * m.rangeBand() + D() / 2
                        };
                    ["low", "high"].forEach(function(a) {
                        var b = "low" === a ? "Q1" : "Q3";
                        A.select("line.nv-boxplot-whisker.nv-boxplot-" + a).watchTransition(v, "nv-boxplot: boxplots").attr("x1", .45 * m.rangeBand()).attr("y1", function(b) {
                            return n(b.values["whisker_" + a])
                        }).attr("x2", .45 * m.rangeBand()).attr("y2", function(a) {
                            return n(a.values[b])
                        }), A.select("line.nv-boxplot-tick.nv-boxplot-" + a).watchTransition(v, "nv-boxplot: boxplots").attr("x1", E).attr("y1", function(b) {
                            return n(b.values["whisker_" + a])
                        }).attr("x2", F).attr("y2", function(b) {
                            return n(b.values["whisker_" + a])
                        })
                    }), ["low", "high"].forEach(function(a) {
                        B.selectAll(".nv-boxplot-" + a).on("mouseover", function(b, c, d) {
                            d3.select(this).classed("hover", !0), s.elementMouseover({
                                series: {
                                    key: b.values["whisker_" + a],
                                    color: q(b, d)
                                },
                                e: d3.event
                            })
                        }).on("mouseout", function(b, c, d) {
                            d3.select(this).classed("hover", !1), s.elementMouseout({
                                series: {
                                    key: b.values["whisker_" + a],
                                    color: q(b, d)
                                },
                                e: d3.event
                            })
                        }).on("mousemove", function() {
                            s.elementMousemove({
                                e: d3.event
                            })
                        })
                    }), B.append("rect").attr("class", "nv-boxplot-box").on("mouseover", function(a, b) {
                        d3.select(this).classed("hover", !0), s.elementMouseover({
                            key: a.label,
                            value: a.label,
                            series: [{
                                key: "Q3",
                                value: a.values.Q3,
                                color: a.color || q(a, b)
                            }, {
                                key: "Q2",
                                value: a.values.Q2,
                                color: a.color || q(a, b)
                            }, {
                                key: "Q1",
                                value: a.values.Q1,
                                color: a.color || q(a, b)
                            }],
                            data: a,
                            index: b,
                            e: d3.event
                        })
                    }).on("mouseout", function(a, b) {
                        d3.select(this).classed("hover", !1), s.elementMouseout({
                            key: a.label,
                            value: a.label,
                            series: [{
                                key: "Q3",
                                value: a.values.Q3,
                                color: a.color || q(a, b)
                            }, {
                                key: "Q2",
                                value: a.values.Q2,
                                color: a.color || q(a, b)
                            }, {
                                key: "Q1",
                                value: a.values.Q1,
                                color: a.color || q(a, b)
                            }],
                            data: a,
                            index: b,
                            e: d3.event
                        })
                    }).on("mousemove", function() {
                        s.elementMousemove({
                            e: d3.event
                        })
                    }), A.select("rect.nv-boxplot-box").watchTransition(v, "nv-boxplot: boxes").attr("y", function(a) {
                        return n(a.values.Q3)
                    }).attr("width", D).attr("x", E).attr("height", function(a) {
                        return Math.abs(n(a.values.Q3) - n(a.values.Q1)) || 1
                    }).style("fill", function(a, b) {
                        return a.color || q(a, b)
                    }).style("stroke", function(a, b) {
                        return a.color || q(a, b)
                    }), B.append("line").attr("class", "nv-boxplot-median"), A.select("line.nv-boxplot-median").watchTransition(v, "nv-boxplot: boxplots line").attr("x1", E).attr("y1", function(a) {
                        return n(a.values.Q2)
                    }).attr("x2", F).attr("y2", function(a) {
                        return n(a.values.Q2)
                    }), g = m.copy(), h = n.copy()
                }), v.renderEnd("nv-boxplot immediate"), b
            }
            var c, d, e, f, g, h, i = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                j = 960,
                k = 500,
                l = Math.floor(1e4 * Math.random()),
                m = d3.scale.ordinal(),
                n = d3.scale.linear(),
                o = function(a) {
                    return a.x
                },
                p = function(a) {
                    return a.y
                },
                q = a.utils.defaultColor(),
                r = null,
                s = d3.dispatch("elementMouseover", "elementMouseout", "elementMousemove", "renderEnd"),
                t = 250,
                u = null,
                v = a.utils.renderWatch(s, t);
            return b.dispatch = s, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j = a
                    }
                },
                height: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                maxBoxWidth: {
                    get: function() {
                        return u
                    },
                    set: function(a) {
                        u = a
                    }
                },
                x: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                y: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                xScale: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                yScale: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                xDomain: {
                    get: function() {
                        return c
                    },
                    set: function(a) {
                        c = a
                    }
                },
                yDomain: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a
                    }
                },
                xRange: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e = a
                    }
                },
                yRange: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f = a
                    }
                },
                id: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                margin: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i.top = void 0 !== a.top ? a.top : i.top, i.right = void 0 !== a.right ? a.right : i.right, i.bottom = void 0 !== a.bottom ? a.bottom : i.bottom, i.left = void 0 !== a.left ? a.left : i.left
                    }
                },
                color: {
                    get: function() {
                        return q
                    },
                    set: function(b) {
                        q = a.utils.getColor(b)
                    }
                },
                duration: {
                    get: function() {
                        return t
                    },
                    set: function(a) {
                        t = a, v.reset(t)
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.boxPlotChart = function() {
            "use strict";

            function b(k) {
                return t.reset(), t.models(e), l && t.models(f), m && t.models(g), k.each(function(k) {
                    var p = d3.select(this);
                    a.utils.initSVG(p);
                    var t = (i || parseInt(p.style("width")) || 960) - h.left - h.right,
                        u = (j || parseInt(p.style("height")) || 400) - h.top - h.bottom;
                    if (b.update = function() {
                            r.beforeUpdate(), p.transition().duration(s).call(b)
                        }, b.container = this, !(k && k.length && k.filter(function(a) {
                            return a.values.hasOwnProperty("Q1") && a.values.hasOwnProperty("Q2") && a.values.hasOwnProperty("Q3")
                        }).length)) {
                        var v = p.selectAll(".nv-noData").data([q]);
                        return v.enter().append("text").attr("class", "nvd3 nv-noData").attr("dy", "-.7em").style("text-anchor", "middle"), v.attr("x", h.left + t / 2).attr("y", h.top + u / 2).text(function(a) {
                            return a
                        }), b
                    }
                    p.selectAll(".nv-noData").remove(), c = e.xScale(), d = e.yScale().clamp(!0);
                    var w = p.selectAll("g.nv-wrap.nv-boxPlotWithAxes").data([k]),
                        x = w.enter().append("g").attr("class", "nvd3 nv-wrap nv-boxPlotWithAxes").append("g"),
                        y = x.append("defs"),
                        z = w.select("g");
                    x.append("g").attr("class", "nv-x nv-axis"), x.append("g").attr("class", "nv-y nv-axis").append("g").attr("class", "nv-zeroLine").append("line"), x.append("g").attr("class", "nv-barsWrap"), z.attr("transform", "translate(" + h.left + "," + h.top + ")"), n && z.select(".nv-y.nv-axis").attr("transform", "translate(" + t + ",0)"), e.width(t).height(u);
                    var A = z.select(".nv-barsWrap").datum(k.filter(function(a) {
                        return !a.disabled
                    }));
                    if (A.transition().call(e), y.append("clipPath").attr("id", "nv-x-label-clip-" + e.id()).append("rect"), z.select("#nv-x-label-clip-" + e.id() + " rect").attr("width", c.rangeBand() * (o ? 2 : 1)).attr("height", 16).attr("x", -c.rangeBand() / (o ? 1 : 2)), l) {
                        f.scale(c).ticks(a.utils.calcTicksX(t / 100, k)).tickSize(-u, 0), z.select(".nv-x.nv-axis").attr("transform", "translate(0," + d.range()[0] + ")"), z.select(".nv-x.nv-axis").call(f);
                        var B = z.select(".nv-x.nv-axis").selectAll("g");
                        o && B.selectAll("text").attr("transform", function(a, b, c) {
                            return "translate(0," + (c % 2 == 0 ? "5" : "17") + ")"
                        })
                    }
                    m && (g.scale(d).ticks(Math.floor(u / 36)).tickSize(-t, 0), z.select(".nv-y.nv-axis").call(g)), z.select(".nv-zeroLine line").attr("x1", 0).attr("x2", t).attr("y1", d(0)).attr("y2", d(0))
                }), t.renderEnd("nv-boxplot chart immediate"), b
            }
            var c, d, e = a.models.boxPlot(),
                f = a.models.axis(),
                g = a.models.axis(),
                h = {
                    top: 15,
                    right: 10,
                    bottom: 50,
                    left: 60
                },
                i = null,
                j = null,
                k = a.utils.getColor(),
                l = !0,
                m = !0,
                n = !1,
                o = !1,
                p = a.models.tooltip(),
                q = "No Data Available.",
                r = d3.dispatch("tooltipShow", "tooltipHide", "beforeUpdate", "renderEnd"),
                s = 250;
            f.orient("bottom").showMaxMin(!1).tickFormat(function(a) {
                return a
            }), g.orient(n ? "right" : "left").tickFormat(d3.format(",.1f")), p.duration(0);
            var t = a.utils.renderWatch(r, s);
            return e.dispatch.on("elementMouseover.tooltip", function(a) {
                p.data(a).hidden(!1)
            }), e.dispatch.on("elementMouseout.tooltip", function(a) {
                p.data(a).hidden(!0)
            }), e.dispatch.on("elementMousemove.tooltip", function() {
                p.position({
                    top: d3.event.pageY,
                    left: d3.event.pageX
                })()
            }), b.dispatch = r, b.boxplot = e, b.xAxis = f, b.yAxis = g, b.tooltip = p, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                height: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j = a
                    }
                },
                staggerLabels: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                showXAxis: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                showYAxis: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                tooltips: {
                    get: function() {
                        return tooltips
                    },
                    set: function(a) {
                        tooltips = a
                    }
                },
                tooltipContent: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                noData: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                margin: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h.top = void 0 !== a.top ? a.top : h.top, h.right = void 0 !== a.right ? a.right : h.right, h.bottom = void 0 !== a.bottom ? a.bottom : h.bottom, h.left = void 0 !== a.left ? a.left : h.left
                    }
                },
                duration: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a, t.reset(s), e.duration(s), f.duration(s), g.duration(s)
                    }
                },
                color: {
                    get: function() {
                        return k
                    },
                    set: function(b) {
                        k = a.utils.getColor(b), e.color(k)
                    }
                },
                rightAlignYAxis: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a, g.orient(a ? "right" : "left")
                    }
                }
            }), a.utils.inheritOptions(b, e), a.utils.initOptions(b), b
        }, a.models.bullet = function() {
            "use strict";

            function b(d) {
                return d.each(function(b, d) {
                    var p = m - c.left - c.right,
                        s = n - c.top - c.bottom;
                    o = d3.select(this), a.utils.initSVG(o); {
                        var t = f.call(this, b, d).slice().sort(d3.descending),
                            u = g.call(this, b, d).slice().sort(d3.descending),
                            v = h.call(this, b, d).slice().sort(d3.descending),
                            w = i.call(this, b, d).slice(),
                            x = j.call(this, b, d).slice(),
                            y = k.call(this, b, d).slice(),
                            z = d3.scale.linear().domain(d3.extent(d3.merge([l, t]))).range(e ? [p, 0] : [0, p]);
                        this.__chart__ || d3.scale.linear().domain([0, 1 / 0]).range(z.range())
                    }
                    this.__chart__ = z;
                    var A = d3.min(t),
                        B = d3.max(t),
                        C = t[1],
                        D = o.selectAll("g.nv-wrap.nv-bullet").data([b]),
                        E = D.enter().append("g").attr("class", "nvd3 nv-wrap nv-bullet"),
                        F = E.append("g"),
                        G = D.select("g");
                    F.append("rect").attr("class", "nv-range nv-rangeMax"), F.append("rect").attr("class", "nv-range nv-rangeAvg"), F.append("rect").attr("class", "nv-range nv-rangeMin"), F.append("rect").attr("class", "nv-measure"), D.attr("transform", "translate(" + c.left + "," + c.top + ")");
                    var H = function(a) {
                            return Math.abs(z(a) - z(0))
                        },
                        I = function(a) {
                            return z(0 > a ? a : 0)
                        };
                    G.select("rect.nv-rangeMax").attr("height", s).attr("width", H(B > 0 ? B : A)).attr("x", I(B > 0 ? B : A)).datum(B > 0 ? B : A), G.select("rect.nv-rangeAvg").attr("height", s).attr("width", H(C)).attr("x", I(C)).datum(C), G.select("rect.nv-rangeMin").attr("height", s).attr("width", H(B)).attr("x", I(B)).attr("width", H(B > 0 ? A : B)).attr("x", I(B > 0 ? A : B)).datum(B > 0 ? A : B), G.select("rect.nv-measure").style("fill", q).attr("height", s / 3).attr("y", s / 3).attr("width", 0 > v ? z(0) - z(v[0]) : z(v[0]) - z(0)).attr("x", I(v)).on("mouseover", function() {
                        r.elementMouseover({
                            value: v[0],
                            label: y[0] || "Current",
                            color: d3.select(this).style("fill")
                        })
                    }).on("mousemove", function() {
                        r.elementMousemove({
                            value: v[0],
                            label: y[0] || "Current",
                            color: d3.select(this).style("fill")
                        })
                    }).on("mouseout", function() {
                        r.elementMouseout({
                            value: v[0],
                            label: y[0] || "Current",
                            color: d3.select(this).style("fill")
                        })
                    });
                    var J = s / 6,
                        K = u.map(function(a, b) {
                            return {
                                value: a,
                                label: x[b]
                            }
                        });
                    F.selectAll("path.nv-markerTriangle").data(K).enter().append("path").attr("class", "nv-markerTriangle").attr("transform", function(a) {
                        return "translate(" + z(a.value) + "," + s / 2 + ")"
                    }).attr("d", "M0," + J + "L" + J + "," + -J + " " + -J + "," + -J + "Z").on("mouseover", function(a) {
                        r.elementMouseover({
                            value: a.value,
                            label: a.label || "Previous",
                            color: d3.select(this).style("fill"),
                            pos: [z(a.value), s / 2]
                        })
                    }).on("mousemove", function(a) {
                        r.elementMousemove({
                            value: a.value,
                            label: a.label || "Previous",
                            color: d3.select(this).style("fill")
                        })
                    }).on("mouseout", function(a) {
                        r.elementMouseout({
                            value: a.value,
                            label: a.label || "Previous",
                            color: d3.select(this).style("fill")
                        })
                    }), D.selectAll(".nv-range").on("mouseover", function(a, b) {
                        var c = w[b] || (b ? 1 == b ? "Mean" : "Minimum" : "Maximum");
                        r.elementMouseover({
                            value: a,
                            label: c,
                            color: d3.select(this).style("fill")
                        })
                    }).on("mousemove", function() {
                        r.elementMousemove({
                            value: v[0],
                            label: y[0] || "Previous",
                            color: d3.select(this).style("fill")
                        })
                    }).on("mouseout", function(a, b) {
                        var c = w[b] || (b ? 1 == b ? "Mean" : "Minimum" : "Maximum");
                        r.elementMouseout({
                            value: a,
                            label: c,
                            color: d3.select(this).style("fill")
                        })
                    })
                }), b
            }
            var c = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                d = "left",
                e = !1,
                f = function(a) {
                    return a.ranges
                },
                g = function(a) {
                    return a.markers ? a.markers : [0]
                },
                h = function(a) {
                    return a.measures
                },
                i = function(a) {
                    return a.rangeLabels ? a.rangeLabels : []
                },
                j = function(a) {
                    return a.markerLabels ? a.markerLabels : []
                },
                k = function(a) {
                    return a.measureLabels ? a.measureLabels : []
                },
                l = [0],
                m = 380,
                n = 30,
                o = null,
                p = null,
                q = a.utils.getColor(["#1f77b4"]),
                r = d3.dispatch("elementMouseover", "elementMouseout", "elementMousemove");
            return b.dispatch = r, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                ranges: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f = a
                    }
                },
                markers: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g = a
                    }
                },
                measures: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                forceX: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                width: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                height: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                tickFormat: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                margin: {
                    get: function() {
                        return c
                    },
                    set: function(a) {
                        c.top = void 0 !== a.top ? a.top : c.top, c.right = void 0 !== a.right ? a.right : c.right, c.bottom = void 0 !== a.bottom ? a.bottom : c.bottom, c.left = void 0 !== a.left ? a.left : c.left
                    }
                },
                orient: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a, e = "right" == d || "bottom" == d
                    }
                },
                color: {
                    get: function() {
                        return q
                    },
                    set: function(b) {
                        q = a.utils.getColor(b)
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.bulletChart = function() {
            "use strict";

            function b(d) {
                return d.each(function(e, o) {
                    var p = d3.select(this);
                    a.utils.initSVG(p);
                    var q = a.utils.availableWidth(k, p, g),
                        r = l - g.top - g.bottom;
                    if (b.update = function() {
                            b(d)
                        }, b.container = this, !e || !h.call(this, e, o)) return a.utils.noData(b, p), b;
                    p.selectAll(".nv-noData").remove();
                    var s = h.call(this, e, o).slice().sort(d3.descending),
                        t = i.call(this, e, o).slice().sort(d3.descending),
                        u = j.call(this, e, o).slice().sort(d3.descending),
                        v = p.selectAll("g.nv-wrap.nv-bulletChart").data([e]),
                        w = v.enter().append("g").attr("class", "nvd3 nv-wrap nv-bulletChart"),
                        x = w.append("g"),
                        y = v.select("g");
                    x.append("g").attr("class", "nv-bulletWrap"), x.append("g").attr("class", "nv-titles"), v.attr("transform", "translate(" + g.left + "," + g.top + ")");
                    var z = d3.scale.linear().domain([0, Math.max(s[0], t[0], u[0])]).range(f ? [q, 0] : [0, q]),
                        A = this.__chart__ || d3.scale.linear().domain([0, 1 / 0]).range(z.range());
                    this.__chart__ = z;
                    var B = x.select(".nv-titles").append("g").attr("text-anchor", "end").attr("transform", "translate(-6," + (l - g.top - g.bottom) / 2 + ")");
                    B.append("text").attr("class", "nv-title").text(function(a) {
                        return a.title
                    }), B.append("text").attr("class", "nv-subtitle").attr("dy", "1em").text(function(a) {
                        return a.subtitle
                    }), c.width(q).height(r);
                    var C = y.select(".nv-bulletWrap");
                    d3.transition(C).call(c);
                    var D = m || z.tickFormat(q / 100),
                        E = y.selectAll("g.nv-tick").data(z.ticks(n ? n : q / 50), function(a) {
                            return this.textContent || D(a)
                        }),
                        F = E.enter().append("g").attr("class", "nv-tick").attr("transform", function(a) {
                            return "translate(" + A(a) + ",0)"
                        }).style("opacity", 1e-6);
                    F.append("line").attr("y1", r).attr("y2", 7 * r / 6), F.append("text").attr("text-anchor", "middle").attr("dy", "1em").attr("y", 7 * r / 6).text(D);
                    var G = d3.transition(E).attr("transform", function(a) {
                        return "translate(" + z(a) + ",0)"
                    }).style("opacity", 1);
                    G.select("line").attr("y1", r).attr("y2", 7 * r / 6), G.select("text").attr("y", 7 * r / 6), d3.transition(E.exit()).attr("transform", function(a) {
                        return "translate(" + z(a) + ",0)"
                    }).style("opacity", 1e-6).remove()
                }), d3.timer.flush(), b
            }
            var c = a.models.bullet(),
                d = a.models.tooltip(),
                e = "left",
                f = !1,
                g = {
                    top: 5,
                    right: 40,
                    bottom: 20,
                    left: 120
                },
                h = function(a) {
                    return a.ranges
                },
                i = function(a) {
                    return a.markers ? a.markers : [0]
                },
                j = function(a) {
                    return a.measures
                },
                k = null,
                l = 55,
                m = null,
                n = null,
                o = null,
                p = d3.dispatch("tooltipShow", "tooltipHide");
            return d.duration(0).headerEnabled(!1), c.dispatch.on("elementMouseover.tooltip", function(a) {
                a.series = {
                    key: a.label,
                    value: a.value,
                    color: a.color
                }, d.data(a).hidden(!1)
            }), c.dispatch.on("elementMouseout.tooltip", function() {
                d.hidden(!0)
            }), c.dispatch.on("elementMousemove.tooltip", function() {
                d.position({
                    top: d3.event.pageY,
                    left: d3.event.pageX
                })()
            }), b.bullet = c, b.dispatch = p, b.tooltip = d, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                ranges: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                markers: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                measures: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j = a
                    }
                },
                width: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                height: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                tickFormat: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                ticks: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                noData: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                tooltips: {
                    get: function() {
                        return d.enabled()
                    },
                    set: function(b) {
                        a.deprecated("tooltips", "use chart.tooltip.enabled() instead"), d.enabled(!!b)
                    }
                },
                tooltipContent: {
                    get: function() {
                        return d.contentGenerator()
                    },
                    set: function(b) {
                        a.deprecated("tooltipContent", "use chart.tooltip.contentGenerator() instead"), d.contentGenerator(b)
                    }
                },
                margin: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g.top = void 0 !== a.top ? a.top : g.top, g.right = void 0 !== a.right ? a.right : g.right, g.bottom = void 0 !== a.bottom ? a.bottom : g.bottom, g.left = void 0 !== a.left ? a.left : g.left
                    }
                },
                orient: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e = a, f = "right" == e || "bottom" == e
                    }
                }
            }), a.utils.inheritOptions(b, c), a.utils.initOptions(b), b
        }, a.models.candlestickBar = function() {
            "use strict";

            function b(x) {
                return x.each(function(b) {
                    c = d3.select(this);
                    var x = a.utils.availableWidth(i, c, h),
                        y = a.utils.availableHeight(j, c, h);
                    a.utils.initSVG(c);
                    var A = x / b[0].values.length * .45;
                    l.domain(d || d3.extent(b[0].values.map(n).concat(t))), l.range(v ? f || [.5 * x / b[0].values.length, x * (b[0].values.length - .5) / b[0].values.length] : f || [5 + A / 2, x - A / 2 - 5]), m.domain(e || [d3.min(b[0].values.map(s).concat(u)), d3.max(b[0].values.map(r).concat(u))]).range(g || [y, 0]), l.domain()[0] === l.domain()[1] && l.domain(l.domain()[0] ? [l.domain()[0] - .01 * l.domain()[0], l.domain()[1] + .01 * l.domain()[1]] : [-1, 1]), m.domain()[0] === m.domain()[1] && m.domain(m.domain()[0] ? [m.domain()[0] + .01 * m.domain()[0], m.domain()[1] - .01 * m.domain()[1]] : [-1, 1]);
                    var B = d3.select(this).selectAll("g.nv-wrap.nv-candlestickBar").data([b[0].values]),
                        C = B.enter().append("g").attr("class", "nvd3 nv-wrap nv-candlestickBar"),
                        D = C.append("defs"),
                        E = C.append("g"),
                        F = B.select("g");
                    E.append("g").attr("class", "nv-ticks"), B.attr("transform", "translate(" + h.left + "," + h.top + ")"), c.on("click", function(a, b) {
                        z.chartClick({
                            data: a,
                            index: b,
                            pos: d3.event,
                            id: k
                        })
                    }), D.append("clipPath").attr("id", "nv-chart-clip-path-" + k).append("rect"), B.select("#nv-chart-clip-path-" + k + " rect").attr("width", x).attr("height", y), F.attr("clip-path", w ? "url(#nv-chart-clip-path-" + k + ")" : "");
                    var G = B.select(".nv-ticks").selectAll(".nv-tick").data(function(a) {
                        return a
                    });
                    G.exit().remove(); {
                        var H = G.enter().append("g").attr("class", function(a, b, c) {
                            return (p(a, b) > q(a, b) ? "nv-tick negative" : "nv-tick positive") + " nv-tick-" + c + "-" + b
                        });
                        H.append("line").attr("class", "nv-candlestick-lines").attr("transform", function(a, b) {
                            return "translate(" + l(n(a, b)) + ",0)"
                        }).attr("x1", 0).attr("y1", function(a, b) {
                            return m(r(a, b))
                        }).attr("x2", 0).attr("y2", function(a, b) {
                            return m(s(a, b))
                        }), H.append("rect").attr("class", "nv-candlestick-rects nv-bars").attr("transform", function(a, b) {
                            return "translate(" + (l(n(a, b)) - A / 2) + "," + (m(o(a, b)) - (p(a, b) > q(a, b) ? m(q(a, b)) - m(p(a, b)) : 0)) + ")"
                        }).attr("x", 0).attr("y", 0).attr("width", A).attr("height", function(a, b) {
                            var c = p(a, b),
                                d = q(a, b);
                            return c > d ? m(d) - m(c) : m(c) - m(d)
                        })
                    }
                    c.selectAll(".nv-candlestick-lines").transition().attr("transform", function(a, b) {
                        return "translate(" + l(n(a, b)) + ",0)"
                    }).attr("x1", 0).attr("y1", function(a, b) {
                        return m(r(a, b))
                    }).attr("x2", 0).attr("y2", function(a, b) {
                        return m(s(a, b))
                    }), c.selectAll(".nv-candlestick-rects").transition().attr("transform", function(a, b) {
                        return "translate(" + (l(n(a, b)) - A / 2) + "," + (m(o(a, b)) - (p(a, b) > q(a, b) ? m(q(a, b)) - m(p(a, b)) : 0)) + ")"
                    }).attr("x", 0).attr("y", 0).attr("width", A).attr("height", function(a, b) {
                        var c = p(a, b),
                            d = q(a, b);
                        return c > d ? m(d) - m(c) : m(c) - m(d)
                    })
                }), b
            }
            var c, d, e, f, g, h = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                i = null,
                j = null,
                k = Math.floor(1e4 * Math.random()),
                l = d3.scale.linear(),
                m = d3.scale.linear(),
                n = function(a) {
                    return a.x
                },
                o = function(a) {
                    return a.y
                },
                p = function(a) {
                    return a.open
                },
                q = function(a) {
                    return a.close
                },
                r = function(a) {
                    return a.high
                },
                s = function(a) {
                    return a.low
                },
                t = [],
                u = [],
                v = !1,
                w = !0,
                x = a.utils.defaultColor(),
                y = !1,
                z = d3.dispatch("tooltipShow", "tooltipHide", "stateChange", "changeState", "renderEnd", "chartClick", "elementClick", "elementDblClick", "elementMouseover", "elementMouseout", "elementMousemove");
            return b.highlightPoint = function(a, d) {
                b.clearHighlights(), c.select(".nv-candlestickBar .nv-tick-0-" + a).classed("hover", d)
            }, b.clearHighlights = function() {
                c.select(".nv-candlestickBar .nv-tick.hover").classed("hover", !1)
            }, b.dispatch = z, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                height: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j = a
                    }
                },
                xScale: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                yScale: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                xDomain: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a
                    }
                },
                yDomain: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e = a
                    }
                },
                xRange: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f = a
                    }
                },
                yRange: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g = a
                    }
                },
                forceX: {
                    get: function() {
                        return t
                    },
                    set: function(a) {
                        t = a
                    }
                },
                forceY: {
                    get: function() {
                        return u
                    },
                    set: function(a) {
                        u = a
                    }
                },
                padData: {
                    get: function() {
                        return v
                    },
                    set: function(a) {
                        v = a
                    }
                },
                clipEdge: {
                    get: function() {
                        return w
                    },
                    set: function(a) {
                        w = a
                    }
                },
                id: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                interactive: {
                    get: function() {
                        return y
                    },
                    set: function(a) {
                        y = a
                    }
                },
                x: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                y: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                open: {
                    get: function() {
                        return p()
                    },
                    set: function(a) {
                        p = a
                    }
                },
                close: {
                    get: function() {
                        return q()
                    },
                    set: function(a) {
                        q = a
                    }
                },
                high: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a
                    }
                },
                low: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a
                    }
                },
                margin: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h.top = void 0 != a.top ? a.top : h.top, h.right = void 0 != a.right ? a.right : h.right, h.bottom = void 0 != a.bottom ? a.bottom : h.bottom, h.left = void 0 != a.left ? a.left : h.left
                    }
                },
                color: {
                    get: function() {
                        return x
                    },
                    set: function(b) {
                        x = a.utils.getColor(b)
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.cumulativeLineChart = function() {
            "use strict";

            function b(l) {
                return H.reset(), H.models(f), r && H.models(g), s && H.models(h), l.each(function(l) {
                    function A() {
                        d3.select(b.container).style("cursor", "ew-resize")
                    }

                    function E() {
                        G.x = d3.event.x, G.i = Math.round(F.invert(G.x)), K()
                    }

                    function H() {
                        d3.select(b.container).style("cursor", "auto"), y.index = G.i, C.stateChange(y)
                    }

                    function K() {
                        bb.data([G]);
                        var a = b.duration();
                        b.duration(0), b.update(), b.duration(a)
                    }
                    var L = d3.select(this);
                    a.utils.initSVG(L), L.classed("nv-chart-" + x, !0);
                    var M = this,
                        N = a.utils.availableWidth(o, L, m),
                        O = a.utils.availableHeight(p, L, m);
                    if (b.update = function() {
                            0 === D ? L.call(b) : L.transition().duration(D).call(b)
                        }, b.container = this, y.setter(J(l), b.update).getter(I(l)).update(), y.disabled = l.map(function(a) {
                            return !!a.disabled
                        }), !z) {
                        var P;
                        z = {};
                        for (P in y) z[P] = y[P] instanceof Array ? y[P].slice(0) : y[P]
                    }
                    var Q = d3.behavior.drag().on("dragstart", A).on("drag", E).on("dragend", H);
                    if (!(l && l.length && l.filter(function(a) {
                            return a.values.length
                        }).length)) return a.utils.noData(b, L), b;
                    if (L.selectAll(".nv-noData").remove(), d = f.xScale(), e = f.yScale(), w) f.yDomain(null);
                    else {
                        var R = l.filter(function(a) {
                                return !a.disabled
                            }).map(function(a) {
                                var b = d3.extent(a.values, f.y());
                                return b[0] < -.95 && (b[0] = -.95), [(b[0] - b[1]) / (1 + b[1]), (b[1] - b[0]) / (1 + b[0])]
                            }),
                            S = [d3.min(R, function(a) {
                                return a[0]
                            }), d3.max(R, function(a) {
                                return a[1]
                            })];
                        f.yDomain(S)
                    }
                    F.domain([0, l[0].values.length - 1]).range([0, N]).clamp(!0);
                    var l = c(G.i, l),
                        T = v ? "none" : "all",
                        U = L.selectAll("g.nv-wrap.nv-cumulativeLine").data([l]),
                        V = U.enter().append("g").attr("class", "nvd3 nv-wrap nv-cumulativeLine").append("g"),
                        W = U.select("g");
                    if (V.append("g").attr("class", "nv-interactive"), V.append("g").attr("class", "nv-x nv-axis").style("pointer-events", "none"), V.append("g").attr("class", "nv-y nv-axis"), V.append("g").attr("class", "nv-background"), V.append("g").attr("class", "nv-linesWrap").style("pointer-events", T), V.append("g").attr("class", "nv-avgLinesWrap").style("pointer-events", "none"), V.append("g").attr("class", "nv-legendWrap"), V.append("g").attr("class", "nv-controlsWrap"), q && (i.width(N), W.select(".nv-legendWrap").datum(l).call(i), m.top != i.height() && (m.top = i.height(), O = a.utils.availableHeight(p, L, m)), W.select(".nv-legendWrap").attr("transform", "translate(0," + -m.top + ")")), u) {
                        var X = [{
                            key: "Re-scale y-axis",
                            disabled: !w
                        }];
                        j.width(140).color(["#444", "#444", "#444"]).rightAlign(!1).margin({
                            top: 5,
                            right: 0,
                            bottom: 5,
                            left: 20
                        }), W.select(".nv-controlsWrap").datum(X).attr("transform", "translate(0," + -m.top + ")").call(j)
                    }
                    U.attr("transform", "translate(" + m.left + "," + m.top + ")"), t && W.select(".nv-y.nv-axis").attr("transform", "translate(" + N + ",0)");
                    var Y = l.filter(function(a) {
                        return a.tempDisabled
                    });
                    U.select(".tempDisabled").remove(), Y.length && U.append("text").attr("class", "tempDisabled").attr("x", N / 2).attr("y", "-.71em").style("text-anchor", "end").text(Y.map(function(a) {
                        return a.key
                    }).join(", ") + " values cannot be calculated for this time period."), v && (k.width(N).height(O).margin({
                        left: m.left,
                        top: m.top
                    }).svgContainer(L).xScale(d), U.select(".nv-interactive").call(k)), V.select(".nv-background").append("rect"), W.select(".nv-background rect").attr("width", N).attr("height", O), f.y(function(a) {
                        return a.display.y
                    }).width(N).height(O).color(l.map(function(a, b) {
                        return a.color || n(a, b)
                    }).filter(function(a, b) {
                        return !l[b].disabled && !l[b].tempDisabled
                    }));
                    var Z = W.select(".nv-linesWrap").datum(l.filter(function(a) {
                        return !a.disabled && !a.tempDisabled
                    }));
                    Z.call(f), l.forEach(function(a, b) {
                        a.seriesIndex = b
                    });
                    var $ = l.filter(function(a) {
                            return !a.disabled && !!B(a)
                        }),
                        _ = W.select(".nv-avgLinesWrap").selectAll("line").data($, function(a) {
                            return a.key
                        }),
                        ab = function(a) {
                            var b = e(B(a));
                            return 0 > b ? 0 : b > O ? O : b
                        };
                    _.enter().append("line").style("stroke-width", 2).style("stroke-dasharray", "10,10").style("stroke", function(a) {
                        return f.color()(a, a.seriesIndex)
                    }).attr("x1", 0).attr("x2", N).attr("y1", ab).attr("y2", ab), _.style("stroke-opacity", function(a) {
                        var b = e(B(a));
                        return 0 > b || b > O ? 0 : 1
                    }).attr("x1", 0).attr("x2", N).attr("y1", ab).attr("y2", ab), _.exit().remove();
                    var bb = Z.selectAll(".nv-indexLine").data([G]);
                    bb.enter().append("rect").attr("class", "nv-indexLine").attr("width", 3).attr("x", -2).attr("fill", "red").attr("fill-opacity", .5).style("pointer-events", "all").call(Q), bb.attr("transform", function(a) {
                        return "translate(" + F(a.i) + ",0)"
                    }).attr("height", O), r && (g.scale(d)._ticks(a.utils.calcTicksX(N / 70, l)).tickSize(-O, 0), W.select(".nv-x.nv-axis").attr("transform", "translate(0," + e.range()[0] + ")"), W.select(".nv-x.nv-axis").call(g)), s && (h.scale(e)._ticks(a.utils.calcTicksY(O / 36, l)).tickSize(-N, 0), W.select(".nv-y.nv-axis").call(h)), W.select(".nv-background rect").on("click", function() {
                        G.x = d3.mouse(this)[0], G.i = Math.round(F.invert(G.x)), y.index = G.i, C.stateChange(y), K()
                    }), f.dispatch.on("elementClick", function(a) {
                        G.i = a.pointIndex, G.x = F(G.i), y.index = G.i, C.stateChange(y), K()
                    }), j.dispatch.on("legendClick", function(a) {
                        a.disabled = !a.disabled, w = !a.disabled, y.rescaleY = w, C.stateChange(y), b.update()
                    }), i.dispatch.on("stateChange", function(a) {
                        for (var c in a) y[c] = a[c];
                        C.stateChange(y), b.update()
                    }), k.dispatch.on("elementMousemove", function(c) {
                        f.clearHighlights();
                        var d, e, i, j = [];
                        if (l.filter(function(a, b) {
                                return a.seriesIndex = b, !a.disabled
                            }).forEach(function(g, h) {
                                e = a.interactiveBisect(g.values, c.pointXValue, b.x()), f.highlightPoint(h, e, !0);
                                var k = g.values[e];
                                "undefined" != typeof k && ("undefined" == typeof d && (d = k), "undefined" == typeof i && (i = b.xScale()(b.x()(k, e))), j.push({
                                    key: g.key,
                                    value: b.y()(k, e),
                                    color: n(g, g.seriesIndex)
                                }))
                            }), j.length > 2) {
                            var o = b.yScale().invert(c.mouseY),
                                p = Math.abs(b.yScale().domain()[0] - b.yScale().domain()[1]),
                                q = .03 * p,
                                r = a.nearestValueIndex(j.map(function(a) {
                                    return a.value
                                }), o, q);
                            null !== r && (j[r].highlight = !0)
                        }
                        var s = g.tickFormat()(b.x()(d, e), e);
                        k.tooltip.position({
                            left: i + m.left,
                            top: c.mouseY + m.top
                        }).chartContainer(M.parentNode).valueFormatter(function(a) {
                            return h.tickFormat()(a)
                        }).data({
                            value: s,
                            series: j
                        })(), k.renderGuideLine(i)
                    }), k.dispatch.on("elementMouseout", function() {
                        f.clearHighlights()
                    }), C.on("changeState", function(a) {
                        "undefined" != typeof a.disabled && (l.forEach(function(b, c) {
                            b.disabled = a.disabled[c]
                        }), y.disabled = a.disabled), "undefined" != typeof a.index && (G.i = a.index, G.x = F(G.i), y.index = a.index, bb.data([G])), "undefined" != typeof a.rescaleY && (w = a.rescaleY), b.update()
                    })
                }), H.renderEnd("cumulativeLineChart immediate"), b
            }

            function c(a, b) {
                return K || (K = f.y()), b.map(function(b) {
                    if (!b.values) return b;
                    var c = b.values[a];
                    if (null == c) return b;
                    var d = K(c, a);
                    return -.95 > d && !E ? (b.tempDisabled = !0, b) : (b.tempDisabled = !1, b.values = b.values.map(function(a, b) {
                        return a.display = {
                            y: (K(a, b) - d) / (1 + d)
                        }, a
                    }), b)
                })
            }
            var d, e, f = a.models.line(),
                g = a.models.axis(),
                h = a.models.axis(),
                i = a.models.legend(),
                j = a.models.legend(),
                k = a.interactiveGuideline(),
                l = a.models.tooltip(),
                m = {
                    top: 30,
                    right: 30,
                    bottom: 50,
                    left: 60
                },
                n = a.utils.defaultColor(),
                o = null,
                p = null,
                q = !0,
                r = !0,
                s = !0,
                t = !1,
                u = !0,
                v = !1,
                w = !0,
                x = f.id(),
                y = a.utils.state(),
                z = null,
                A = null,
                B = function(a) {
                    return a.average
                },
                C = d3.dispatch("stateChange", "changeState", "renderEnd"),
                D = 250,
                E = !1;
            y.index = 0, y.rescaleY = w, g.orient("bottom").tickPadding(7), h.orient(t ? "right" : "left"), l.valueFormatter(function(a, b) {
                return h.tickFormat()(a, b)
            }).headerFormatter(function(a, b) {
                return g.tickFormat()(a, b)
            }), j.updateState(!1);
            var F = d3.scale.linear(),
                G = {
                    i: 0,
                    x: 0
                },
                H = a.utils.renderWatch(C, D),
                I = function(a) {
                    return function() {
                        return {
                            active: a.map(function(a) {
                                return !a.disabled
                            }),
                            index: G.i,
                            rescaleY: w
                        }
                    }
                },
                J = function(a) {
                    return function(b) {
                        void 0 !== b.index && (G.i = b.index), void 0 !== b.rescaleY && (w = b.rescaleY), void 0 !== b.active && a.forEach(function(a, c) {
                            a.disabled = !b.active[c]
                        })
                    }
                };
            f.dispatch.on("elementMouseover.tooltip", function(a) {
                var c = {
                    x: b.x()(a.point),
                    y: b.y()(a.point),
                    color: a.point.color
                };
                a.point = c, l.data(a).position(a.pos).hidden(!1)
            }), f.dispatch.on("elementMouseout.tooltip", function() {
                l.hidden(!0)
            });
            var K = null;
            return b.dispatch = C, b.lines = f, b.legend = i, b.controls = j, b.xAxis = g, b.yAxis = h, b.interactiveLayer = k, b.state = y, b.tooltip = l, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                height: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                rescaleY: {
                    get: function() {
                        return w
                    },
                    set: function(a) {
                        w = a
                    }
                },
                showControls: {
                    get: function() {
                        return u
                    },
                    set: function(a) {
                        u = a
                    }
                },
                showLegend: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                average: {
                    get: function() {
                        return B
                    },
                    set: function(a) {
                        B = a
                    }
                },
                defaultState: {
                    get: function() {
                        return z
                    },
                    set: function(a) {
                        z = a
                    }
                },
                noData: {
                    get: function() {
                        return A
                    },
                    set: function(a) {
                        A = a
                    }
                },
                showXAxis: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a
                    }
                },
                showYAxis: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a
                    }
                },
                noErrorCheck: {
                    get: function() {
                        return E
                    },
                    set: function(a) {
                        E = a
                    }
                },
                tooltips: {
                    get: function() {
                        return l.enabled()
                    },
                    set: function(b) {
                        a.deprecated("tooltips", "use chart.tooltip.enabled() instead"), l.enabled(!!b)
                    }
                },
                tooltipContent: {
                    get: function() {
                        return l.contentGenerator()
                    },
                    set: function(b) {
                        a.deprecated("tooltipContent", "use chart.tooltip.contentGenerator() instead"), l.contentGenerator(b)
                    }
                },
                margin: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m.top = void 0 !== a.top ? a.top : m.top, m.right = void 0 !== a.right ? a.right : m.right, m.bottom = void 0 !== a.bottom ? a.bottom : m.bottom, m.left = void 0 !== a.left ? a.left : m.left
                    }
                },
                color: {
                    get: function() {
                        return n
                    },
                    set: function(b) {
                        n = a.utils.getColor(b), i.color(n)
                    }
                },
                useInteractiveGuideline: {
                    get: function() {
                        return v
                    },
                    set: function(a) {
                        v = a, a === !0 && (b.interactive(!1), b.useVoronoi(!1))
                    }
                },
                rightAlignYAxis: {
                    get: function() {
                        return t
                    },
                    set: function(a) {
                        t = a, h.orient(a ? "right" : "left")
                    }
                },
                duration: {
                    get: function() {
                        return D
                    },
                    set: function(a) {
                        D = a, f.duration(D), g.duration(D), h.duration(D), H.reset(D)
                    }
                }
            }), a.utils.inheritOptions(b, f), a.utils.initOptions(b), b
        }, a.models.discreteBar = function() {
            "use strict";

            function b(m) {
                return y.reset(), m.each(function(b) {
                    var m = k - j.left - j.right,
                        x = l - j.top - j.bottom;
                    c = d3.select(this), a.utils.initSVG(c), b.forEach(function(a, b) {
                        a.values.forEach(function(a) {
                            a.series = b
                        })
                    });
                    var z = d && e ? [] : b.map(function(a) {
                        return a.values.map(function(a, b) {
                            return {
                                x: p(a, b),
                                y: q(a, b),
                                y0: a.y0
                            }
                        })
                    });
                    n.domain(d || d3.merge(z).map(function(a) {
                        return a.x
                    })).rangeBands(f || [0, m], .1), o.domain(e || d3.extent(d3.merge(z).map(function(a) {
                        return a.y
                    }).concat(r))), o.range(t ? g || [x - (o.domain()[0] < 0 ? 12 : 0), o.domain()[1] > 0 ? 12 : 0] : g || [x, 0]), h = h || n, i = i || o.copy().range([o(0), o(0)]); {
                        var A = c.selectAll("g.nv-wrap.nv-discretebar").data([b]),
                            B = A.enter().append("g").attr("class", "nvd3 nv-wrap nv-discretebar"),
                            C = B.append("g");
                        A.select("g")
                    }
                    C.append("g").attr("class", "nv-groups"), A.attr("transform", "translate(" + j.left + "," + j.top + ")");
                    var D = A.select(".nv-groups").selectAll(".nv-group").data(function(a) {
                        return a
                    }, function(a) {
                        return a.key
                    });
                    D.enter().append("g").style("stroke-opacity", 1e-6).style("fill-opacity", 1e-6), D.exit().watchTransition(y, "discreteBar: exit groups").style("stroke-opacity", 1e-6).style("fill-opacity", 1e-6).remove(), D.attr("class", function(a, b) {
                        return "nv-group nv-series-" + b
                    }).classed("hover", function(a) {
                        return a.hover
                    }), D.watchTransition(y, "discreteBar: groups").style("stroke-opacity", 1).style("fill-opacity", .75);
                    var E = D.selectAll("g.nv-bar").data(function(a) {
                        return a.values
                    });
                    E.exit().remove();
                    var F = E.enter().append("g").attr("transform", function(a, b) {
                        return "translate(" + (n(p(a, b)) + .05 * n.rangeBand()) + ", " + o(0) + ")"
                    }).on("mouseover", function(a, b) {
                        d3.select(this).classed("hover", !0), v.elementMouseover({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        })
                    }).on("mouseout", function(a, b) {
                        d3.select(this).classed("hover", !1), v.elementMouseout({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        })
                    }).on("mousemove", function(a, b) {
                        v.elementMousemove({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        })
                    }).on("click", function(a, b) {
                        v.elementClick({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        }), d3.event.stopPropagation()
                    }).on("dblclick", function(a, b) {
                        v.elementDblClick({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        }), d3.event.stopPropagation()
                    });
                    F.append("rect").attr("height", 0).attr("width", .9 * n.rangeBand() / b.length), t ? (F.append("text").attr("text-anchor", "middle"), E.select("text").text(function(a, b) {
                        return u(q(a, b))
                    }).watchTransition(y, "discreteBar: bars text").attr("x", .9 * n.rangeBand() / 2).attr("y", function(a, b) {
                        return q(a, b) < 0 ? o(q(a, b)) - o(0) + 12 : -4
                    })) : E.selectAll("text").remove(), E.attr("class", function(a, b) {
                        return q(a, b) < 0 ? "nv-bar negative" : "nv-bar positive"
                    }).style("fill", function(a, b) {
                        return a.color || s(a, b)
                    }).style("stroke", function(a, b) {
                        return a.color || s(a, b)
                    }).select("rect").attr("class", w).watchTransition(y, "discreteBar: bars rect").attr("width", .9 * n.rangeBand() / b.length), E.watchTransition(y, "discreteBar: bars").attr("transform", function(a, b) {
                        var c = n(p(a, b)) + .05 * n.rangeBand(),
                            d = q(a, b) < 0 ? o(0) : o(0) - o(q(a, b)) < 1 ? o(0) - 1 : o(q(a, b));
                        return "translate(" + c + ", " + d + ")"
                    }).select("rect").attr("height", function(a, b) {
                        return Math.max(Math.abs(o(q(a, b)) - o(e && e[0] || 0)) || 1)
                    }), h = n.copy(), i = o.copy()
                }), y.renderEnd("discreteBar immediate"), b
            }
            var c, d, e, f, g, h, i, j = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                k = 960,
                l = 500,
                m = Math.floor(1e4 * Math.random()),
                n = d3.scale.ordinal(),
                o = d3.scale.linear(),
                p = function(a) {
                    return a.x
                },
                q = function(a) {
                    return a.y
                },
                r = [0],
                s = a.utils.defaultColor(),
                t = !1,
                u = d3.format(",.2f"),
                v = d3.dispatch("chartClick", "elementClick", "elementDblClick", "elementMouseover", "elementMouseout", "elementMousemove", "renderEnd"),
                w = "discreteBar",
                x = 250,
                y = a.utils.renderWatch(v, x);
            return b.dispatch = v, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                height: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                forceY: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a
                    }
                },
                showValues: {
                    get: function() {
                        return t
                    },
                    set: function(a) {
                        t = a
                    }
                },
                x: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                y: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                xScale: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                yScale: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                xDomain: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a
                    }
                },
                yDomain: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e = a
                    }
                },
                xRange: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f = a
                    }
                },
                yRange: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g = a
                    }
                },
                valueFormat: {
                    get: function() {
                        return u
                    },
                    set: function(a) {
                        u = a
                    }
                },
                id: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                rectClass: {
                    get: function() {
                        return w
                    },
                    set: function(a) {
                        w = a
                    }
                },
                margin: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j.top = void 0 !== a.top ? a.top : j.top, j.right = void 0 !== a.right ? a.right : j.right, j.bottom = void 0 !== a.bottom ? a.bottom : j.bottom, j.left = void 0 !== a.left ? a.left : j.left
                    }
                },
                color: {
                    get: function() {
                        return s
                    },
                    set: function(b) {
                        s = a.utils.getColor(b)
                    }
                },
                duration: {
                    get: function() {
                        return x
                    },
                    set: function(a) {
                        x = a, y.reset(x)
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.discreteBarChart = function() {
            "use strict";

            function b(h) {
                return t.reset(), t.models(e), m && t.models(f), n && t.models(g), h.each(function(h) {
                    var l = d3.select(this);
                    a.utils.initSVG(l);
                    var q = a.utils.availableWidth(j, l, i),
                        t = a.utils.availableHeight(k, l, i);
                    if (b.update = function() {
                            r.beforeUpdate(), l.transition().duration(s).call(b)
                        }, b.container = this, !(h && h.length && h.filter(function(a) {
                            return a.values.length
                        }).length)) return a.utils.noData(b, l), b;
                    l.selectAll(".nv-noData").remove(), c = e.xScale(), d = e.yScale().clamp(!0);
                    var u = l.selectAll("g.nv-wrap.nv-discreteBarWithAxes").data([h]),
                        v = u.enter().append("g").attr("class", "nvd3 nv-wrap nv-discreteBarWithAxes").append("g"),
                        w = v.append("defs"),
                        x = u.select("g");
                    v.append("g").attr("class", "nv-x nv-axis"), v.append("g").attr("class", "nv-y nv-axis").append("g").attr("class", "nv-zeroLine").append("line"), v.append("g").attr("class", "nv-barsWrap"), x.attr("transform", "translate(" + i.left + "," + i.top + ")"), o && x.select(".nv-y.nv-axis").attr("transform", "translate(" + q + ",0)"), e.width(q).height(t);
                    var y = x.select(".nv-barsWrap").datum(h.filter(function(a) {
                        return !a.disabled
                    }));
                    if (y.transition().call(e), w.append("clipPath").attr("id", "nv-x-label-clip-" + e.id()).append("rect"), x.select("#nv-x-label-clip-" + e.id() + " rect").attr("width", c.rangeBand() * (p ? 2 : 1)).attr("height", 16).attr("x", -c.rangeBand() / (p ? 1 : 2)), m) {
                        f.scale(c)._ticks(a.utils.calcTicksX(q / 100, h)).tickSize(-t, 0), x.select(".nv-x.nv-axis").attr("transform", "translate(0," + (d.range()[0] + (e.showValues() && d.domain()[0] < 0 ? 16 : 0)) + ")"), x.select(".nv-x.nv-axis").call(f);
                        var z = x.select(".nv-x.nv-axis").selectAll("g");
                        p && z.selectAll("text").attr("transform", function(a, b, c) {
                            return "translate(0," + (c % 2 == 0 ? "5" : "17") + ")"
                        })
                    }
                    n && (g.scale(d)._ticks(a.utils.calcTicksY(t / 36, h)).tickSize(-q, 0), x.select(".nv-y.nv-axis").call(g)), x.select(".nv-zeroLine line").attr("x1", 0).attr("x2", q).attr("y1", d(0)).attr("y2", d(0))
                }), t.renderEnd("discreteBar chart immediate"), b
            }
            var c, d, e = a.models.discreteBar(),
                f = a.models.axis(),
                g = a.models.axis(),
                h = a.models.tooltip(),
                i = {
                    top: 15,
                    right: 10,
                    bottom: 50,
                    left: 60
                },
                j = null,
                k = null,
                l = a.utils.getColor(),
                m = !0,
                n = !0,
                o = !1,
                p = !1,
                q = null,
                r = d3.dispatch("beforeUpdate", "renderEnd"),
                s = 250;
            f.orient("bottom").showMaxMin(!1).tickFormat(function(a) {
                return a
            }), g.orient(o ? "right" : "left").tickFormat(d3.format(",.1f")), h.duration(0).headerEnabled(!1).valueFormatter(function(a, b) {
                return g.tickFormat()(a, b)
            }).keyFormatter(function(a, b) {
                return f.tickFormat()(a, b)
            });
            var t = a.utils.renderWatch(r, s);
            return e.dispatch.on("elementMouseover.tooltip", function(a) {
                a.series = {
                    key: b.x()(a.data),
                    value: b.y()(a.data),
                    color: a.color
                }, h.data(a).hidden(!1)
            }), e.dispatch.on("elementMouseout.tooltip", function() {
                h.hidden(!0)
            }), e.dispatch.on("elementMousemove.tooltip", function() {
                h.position({
                    top: d3.event.pageY,
                    left: d3.event.pageX
                })()
            }), b.dispatch = r, b.discretebar = e, b.xAxis = f, b.yAxis = g, b.tooltip = h, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j = a
                    }
                },
                height: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                staggerLabels: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                showXAxis: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                showYAxis: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                noData: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                tooltips: {
                    get: function() {
                        return h.enabled()
                    },
                    set: function(b) {
                        a.deprecated("tooltips", "use chart.tooltip.enabled() instead"), h.enabled(!!b)
                    }
                },
                tooltipContent: {
                    get: function() {
                        return h.contentGenerator()
                    },
                    set: function(b) {
                        a.deprecated("tooltipContent", "use chart.tooltip.contentGenerator() instead"), h.contentGenerator(b)
                    }
                },
                margin: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i.top = void 0 !== a.top ? a.top : i.top, i.right = void 0 !== a.right ? a.right : i.right, i.bottom = void 0 !== a.bottom ? a.bottom : i.bottom, i.left = void 0 !== a.left ? a.left : i.left
                    }
                },
                duration: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a, t.reset(s), e.duration(s), f.duration(s), g.duration(s)
                    }
                },
                color: {
                    get: function() {
                        return l
                    },
                    set: function(b) {
                        l = a.utils.getColor(b), e.color(l)
                    }
                },
                rightAlignYAxis: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a, g.orient(a ? "right" : "left")
                    }
                }
            }), a.utils.inheritOptions(b, e), a.utils.initOptions(b), b
        }, a.models.distribution = function() {
            "use strict";

            function b(k) {
                return m.reset(), k.each(function(b) {
                    var k = (e - ("x" === g ? d.left + d.right : d.top + d.bottom), "x" == g ? "y" : "x"),
                        l = d3.select(this);
                    a.utils.initSVG(l), c = c || j;
                    var n = l.selectAll("g.nv-distribution").data([b]),
                        o = n.enter().append("g").attr("class", "nvd3 nv-distribution"),
                        p = (o.append("g"), n.select("g"));
                    n.attr("transform", "translate(" + d.left + "," + d.top + ")");
                    var q = p.selectAll("g.nv-dist").data(function(a) {
                        return a
                    }, function(a) {
                        return a.key
                    });
                    q.enter().append("g"), q.attr("class", function(a, b) {
                        return "nv-dist nv-series-" + b
                    }).style("stroke", function(a, b) {
                        return i(a, b)
                    });
                    var r = q.selectAll("line.nv-dist" + g).data(function(a) {
                        return a.values
                    });
                    r.enter().append("line").attr(g + "1", function(a, b) {
                        return c(h(a, b))
                    }).attr(g + "2", function(a, b) {
                        return c(h(a, b))
                    }), m.transition(q.exit().selectAll("line.nv-dist" + g), "dist exit").attr(g + "1", function(a, b) {
                        return j(h(a, b))
                    }).attr(g + "2", function(a, b) {
                        return j(h(a, b))
                    }).style("stroke-opacity", 0).remove(), r.attr("class", function(a, b) {
                        return "nv-dist" + g + " nv-dist" + g + "-" + b
                    }).attr(k + "1", 0).attr(k + "2", f), m.transition(r, "dist").attr(g + "1", function(a, b) {
                        return j(h(a, b))
                    }).attr(g + "2", function(a, b) {
                        return j(h(a, b))
                    }), c = j.copy()
                }), m.renderEnd("distribution immediate"), b
            }
            var c, d = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                e = 400,
                f = 8,
                g = "x",
                h = function(a) {
                    return a[g]
                },
                i = a.utils.defaultColor(),
                j = d3.scale.linear(),
                k = 250,
                l = d3.dispatch("renderEnd"),
                m = a.utils.renderWatch(l, k);
            return b.options = a.utils.optionsFunc.bind(b), b.dispatch = l, b.margin = function(a) {
                return arguments.length ? (d.top = "undefined" != typeof a.top ? a.top : d.top, d.right = "undefined" != typeof a.right ? a.right : d.right, d.bottom = "undefined" != typeof a.bottom ? a.bottom : d.bottom, d.left = "undefined" != typeof a.left ? a.left : d.left, b) : d
            }, b.width = function(a) {
                return arguments.length ? (e = a, b) : e
            }, b.axis = function(a) {
                return arguments.length ? (g = a, b) : g
            }, b.size = function(a) {
                return arguments.length ? (f = a, b) : f
            }, b.getData = function(a) {
                return arguments.length ? (h = d3.functor(a), b) : h
            }, b.scale = function(a) {
                return arguments.length ? (j = a, b) : j
            }, b.color = function(c) {
                return arguments.length ? (i = a.utils.getColor(c), b) : i
            }, b.duration = function(a) {
                return arguments.length ? (k = a, m.reset(k), b) : k
            }, b
        }, a.models.furiousLegend = function() {
            "use strict";

            function b(p) {
                function q(a, b) {
                    return "furious" != o ? "#000" : m ? a.disengaged ? g(a, b) : "#fff" : m ? void 0 : a.disabled ? g(a, b) : "#fff"
                }

                function r(a, b) {
                    return m && "furious" == o ? a.disengaged ? "#fff" : g(a, b) : a.disabled ? "#fff" : g(a, b)
                }
                return p.each(function(b) {
                    var p = d - c.left - c.right,
                        s = d3.select(this);
                    a.utils.initSVG(s);
                    var t = s.selectAll("g.nv-legend").data([b]),
                        u = (t.enter().append("g").attr("class", "nvd3 nv-legend").append("g"), t.select("g"));
                    t.attr("transform", "translate(" + c.left + "," + c.top + ")");
                    var v, w = u.selectAll(".nv-series").data(function(a) {
                            return "furious" != o ? a : a.filter(function(a) {
                                return m ? !0 : !a.disengaged
                            })
                        }),
                        x = w.enter().append("g").attr("class", "nv-series");
                    if ("classic" == o) x.append("circle").style("stroke-width", 2).attr("class", "nv-legend-symbol").attr("r", 5), v = w.select("circle");
                    else if ("furious" == o) {
                        x.append("rect").style("stroke-width", 2).attr("class", "nv-legend-symbol").attr("rx", 3).attr("ry", 3), v = w.select("rect"), x.append("g").attr("class", "nv-check-box").property("innerHTML", '<path d="M0.5,5 L22.5,5 L22.5,26.5 L0.5,26.5 L0.5,5 Z" class="nv-box"></path><path d="M5.5,12.8618467 L11.9185089,19.2803556 L31,0.198864511" class="nv-check"></path>').attr("transform", "translate(-10,-8)scale(0.5)");
                        var y = w.select(".nv-check-box");
                        y.each(function(a, b) {
                            d3.select(this).selectAll("path").attr("stroke", q(a, b))
                        })
                    }
                    x.append("text").attr("text-anchor", "start").attr("class", "nv-legend-text").attr("dy", ".32em").attr("dx", "8");
                    var z = w.select("text.nv-legend-text");
                    w.on("mouseover", function(a, b) {
                        n.legendMouseover(a, b)
                    }).on("mouseout", function(a, b) {
                        n.legendMouseout(a, b)
                    }).on("click", function(a, b) {
                        n.legendClick(a, b);
                        var c = w.data();
                        if (k) {
                            if ("classic" == o) l ? (c.forEach(function(a) {
                                a.disabled = !0
                            }), a.disabled = !1) : (a.disabled = !a.disabled, c.every(function(a) {
                                return a.disabled
                            }) && c.forEach(function(a) {
                                a.disabled = !1
                            }));
                            else if ("furious" == o)
                                if (m) a.disengaged = !a.disengaged, a.userDisabled = void 0 == a.userDisabled ? !!a.disabled : a.userDisabled, a.disabled = a.disengaged || a.userDisabled;
                                else if (!m) {
                                a.disabled = !a.disabled, a.userDisabled = a.disabled;
                                var d = c.filter(function(a) {
                                    return !a.disengaged
                                });
                                d.every(function(a) {
                                    return a.userDisabled
                                }) && c.forEach(function(a) {
                                    a.disabled = a.userDisabled = !1
                                })
                            }
                            n.stateChange({
                                disabled: c.map(function(a) {
                                    return !!a.disabled
                                }),
                                disengaged: c.map(function(a) {
                                    return !!a.disengaged
                                })
                            })
                        }
                    }).on("dblclick", function(a, b) {
                        if (("furious" != o || !m) && (n.legendDblclick(a, b), k)) {
                            var c = w.data();
                            c.forEach(function(a) {
                                a.disabled = !0, "furious" == o && (a.userDisabled = a.disabled)
                            }), a.disabled = !1, "furious" == o && (a.userDisabled = a.disabled), n.stateChange({
                                disabled: c.map(function(a) {
                                    return !!a.disabled
                                })
                            })
                        }
                    }), w.classed("nv-disabled", function(a) {
                        return a.userDisabled
                    }), w.exit().remove(), z.attr("fill", q).text(f);
                    var A;
                    switch (o) {
                        case "furious":
                            A = 23;
                            break;
                        case "classic":
                            A = 20
                    }
                    if (h) {
                        var B = [];
                        w.each(function() {
                            var b, c = d3.select(this).select("text");
                            try {
                                if (b = c.node().getComputedTextLength(), 0 >= b) throw Error()
                            } catch (d) {
                                b = a.utils.calcApproxTextWidth(c)
                            }
                            B.push(b + i)
                        });
                        for (var C = 0, D = 0, E = []; p > D && C < B.length;) E[C] = B[C], D += B[C++];
                        for (0 === C && (C = 1); D > p && C > 1;) {
                            E = [], C--;
                            for (var F = 0; F < B.length; F++) B[F] > (E[F % C] || 0) && (E[F % C] = B[F]);
                            D = E.reduce(function(a, b) {
                                return a + b
                            })
                        }
                        for (var G = [], H = 0, I = 0; C > H; H++) G[H] = I, I += E[H];
                        w.attr("transform", function(a, b) {
                            return "translate(" + G[b % C] + "," + (5 + Math.floor(b / C) * A) + ")"
                        }), j ? u.attr("transform", "translate(" + (d - c.right - D) + "," + c.top + ")") : u.attr("transform", "translate(0," + c.top + ")"), e = c.top + c.bottom + Math.ceil(B.length / C) * A
                    } else {
                        var J, K = 5,
                            L = 5,
                            M = 0;
                        w.attr("transform", function() {
                            var a = d3.select(this).select("text").node().getComputedTextLength() + i;
                            return J = L, d < c.left + c.right + J + a && (L = J = 5, K += A), L += a, L > M && (M = L), "translate(" + J + "," + K + ")"
                        }), u.attr("transform", "translate(" + (d - c.right - M) + "," + c.top + ")"), e = c.top + c.bottom + K + 15
                    }
                    "furious" == o && v.attr("width", function(a, b) {
                        return z[0][b].getComputedTextLength() + 27
                    }).attr("height", 18).attr("y", -9).attr("x", -15), v.style("fill", r).style("stroke", function(a, b) {
                        return a.color || g(a, b)
                    })
                }), b
            }
            var c = {
                    top: 5,
                    right: 0,
                    bottom: 5,
                    left: 0
                },
                d = 400,
                e = 20,
                f = function(a) {
                    return a.key
                },
                g = a.utils.getColor(),
                h = !0,
                i = 28,
                j = !0,
                k = !0,
                l = !1,
                m = !1,
                n = d3.dispatch("legendClick", "legendDblclick", "legendMouseover", "legendMouseout", "stateChange"),
                o = "classic";
            return b.dispatch = n, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a
                    }
                },
                height: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e = a
                    }
                },
                key: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f = a
                    }
                },
                align: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                rightAlign: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j = a
                    }
                },
                padding: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                updateState: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                radioButtonMode: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                expanded: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                vers: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                margin: {
                    get: function() {
                        return c
                    },
                    set: function(a) {
                        c.top = void 0 !== a.top ? a.top : c.top, c.right = void 0 !== a.right ? a.right : c.right, c.bottom = void 0 !== a.bottom ? a.bottom : c.bottom, c.left = void 0 !== a.left ? a.left : c.left
                    }
                },
                color: {
                    get: function() {
                        return g
                    },
                    set: function(b) {
                        g = a.utils.getColor(b)
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.historicalBar = function() {
            "use strict";

            function b(x) {
                return x.each(function(b) {
                    w.reset(), k = d3.select(this);
                    var x = a.utils.availableWidth(h, k, g),
                        y = a.utils.availableHeight(i, k, g);
                    a.utils.initSVG(k), l.domain(c || d3.extent(b[0].values.map(n).concat(p))), l.range(r ? e || [.5 * x / b[0].values.length, x * (b[0].values.length - .5) / b[0].values.length] : e || [0, x]), m.domain(d || d3.extent(b[0].values.map(o).concat(q))).range(f || [y, 0]), l.domain()[0] === l.domain()[1] && l.domain(l.domain()[0] ? [l.domain()[0] - .01 * l.domain()[0], l.domain()[1] + .01 * l.domain()[1]] : [-1, 1]), m.domain()[0] === m.domain()[1] && m.domain(m.domain()[0] ? [m.domain()[0] + .01 * m.domain()[0], m.domain()[1] - .01 * m.domain()[1]] : [-1, 1]);
                    var z = k.selectAll("g.nv-wrap.nv-historicalBar-" + j).data([b[0].values]),
                        A = z.enter().append("g").attr("class", "nvd3 nv-wrap nv-historicalBar-" + j),
                        B = A.append("defs"),
                        C = A.append("g"),
                        D = z.select("g");
                    C.append("g").attr("class", "nv-bars"), z.attr("transform", "translate(" + g.left + "," + g.top + ")"), k.on("click", function(a, b) {
                        u.chartClick({
                            data: a,
                            index: b,
                            pos: d3.event,
                            id: j
                        })
                    }), B.append("clipPath").attr("id", "nv-chart-clip-path-" + j).append("rect"), z.select("#nv-chart-clip-path-" + j + " rect").attr("width", x).attr("height", y), D.attr("clip-path", s ? "url(#nv-chart-clip-path-" + j + ")" : "");
                    var E = z.select(".nv-bars").selectAll(".nv-bar").data(function(a) {
                        return a
                    }, function(a, b) {
                        return n(a, b)
                    });
                    E.exit().remove(), E.enter().append("rect").attr("x", 0).attr("y", function(b, c) {
                        return a.utils.NaNtoZero(m(Math.max(0, o(b, c))))
                    }).attr("height", function(b, c) {
                        return a.utils.NaNtoZero(Math.abs(m(o(b, c)) - m(0)))
                    }).attr("transform", function(a, c) {
                        return "translate(" + (l(n(a, c)) - x / b[0].values.length * .45) + ",0)"
                    }).on("mouseover", function(a, b) {
                        v && (d3.select(this).classed("hover", !0), u.elementMouseover({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        }))
                    }).on("mouseout", function(a, b) {
                        v && (d3.select(this).classed("hover", !1), u.elementMouseout({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        }))
                    }).on("mousemove", function(a, b) {
                        v && u.elementMousemove({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        })
                    }).on("click", function(a, b) {
                        v && (u.elementClick({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        }), d3.event.stopPropagation())
                    }).on("dblclick", function(a, b) {
                        v && (u.elementDblClick({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        }), d3.event.stopPropagation())
                    }), E.attr("fill", function(a, b) {
                        return t(a, b)
                    }).attr("class", function(a, b, c) {
                        return (o(a, b) < 0 ? "nv-bar negative" : "nv-bar positive") + " nv-bar-" + c + "-" + b
                    }).watchTransition(w, "bars").attr("transform", function(a, c) {
                        return "translate(" + (l(n(a, c)) - x / b[0].values.length * .45) + ",0)"
                    }).attr("width", x / b[0].values.length * .9), E.watchTransition(w, "bars").attr("y", function(b, c) {
                        var d = o(b, c) < 0 ? m(0) : m(0) - m(o(b, c)) < 1 ? m(0) - 1 : m(o(b, c));
                        return a.utils.NaNtoZero(d)
                    }).attr("height", function(b, c) {
                        return a.utils.NaNtoZero(Math.max(Math.abs(m(o(b, c)) - m(0)), 1))
                    })
                }), w.renderEnd("historicalBar immediate"), b
            }
            var c, d, e, f, g = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                h = null,
                i = null,
                j = Math.floor(1e4 * Math.random()),
                k = null,
                l = d3.scale.linear(),
                m = d3.scale.linear(),
                n = function(a) {
                    return a.x
                },
                o = function(a) {
                    return a.y
                },
                p = [],
                q = [0],
                r = !1,
                s = !0,
                t = a.utils.defaultColor(),
                u = d3.dispatch("chartClick", "elementClick", "elementDblClick", "elementMouseover", "elementMouseout", "elementMousemove", "renderEnd"),
                v = !0,
                w = a.utils.renderWatch(u, 0);
            return b.highlightPoint = function(a, b) {
                k.select(".nv-bars .nv-bar-0-" + a).classed("hover", b)
            }, b.clearHighlights = function() {
                k.select(".nv-bars .nv-bar.hover").classed("hover", !1)
            }, b.dispatch = u, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                height: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                forceX: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                forceY: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                padData: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a
                    }
                },
                x: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                y: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                xScale: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                yScale: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                xDomain: {
                    get: function() {
                        return c
                    },
                    set: function(a) {
                        c = a
                    }
                },
                yDomain: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a
                    }
                },
                xRange: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e = a
                    }
                },
                yRange: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f = a
                    }
                },
                clipEdge: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a
                    }
                },
                id: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j = a
                    }
                },
                interactive: {
                    get: function() {
                        return v
                    },
                    set: function(a) {
                        v = a
                    }
                },
                margin: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g.top = void 0 !== a.top ? a.top : g.top, g.right = void 0 !== a.right ? a.right : g.right, g.bottom = void 0 !== a.bottom ? a.bottom : g.bottom, g.left = void 0 !== a.left ? a.left : g.left
                    }
                },
                color: {
                    get: function() {
                        return t
                    },
                    set: function(b) {
                        t = a.utils.getColor(b)
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.historicalBarChart = function(b) {
            "use strict";

            function c(b) {
                return b.each(function(k) {
                    z.reset(), z.models(f), q && z.models(g), r && z.models(h);
                    var w = d3.select(this),
                        A = this;
                    a.utils.initSVG(w);
                    var B = a.utils.availableWidth(n, w, l),
                        C = a.utils.availableHeight(o, w, l);
                    if (c.update = function() {
                            w.transition().duration(y).call(c)
                        }, c.container = this, u.disabled = k.map(function(a) {
                            return !!a.disabled
                        }), !v) {
                        var D;
                        v = {};
                        for (D in u) v[D] = u[D] instanceof Array ? u[D].slice(0) : u[D]
                    }
                    if (!(k && k.length && k.filter(function(a) {
                            return a.values.length
                        }).length)) return a.utils.noData(c, w), c;
                    w.selectAll(".nv-noData").remove(), d = f.xScale(), e = f.yScale();
                    var E = w.selectAll("g.nv-wrap.nv-historicalBarChart").data([k]),
                        F = E.enter().append("g").attr("class", "nvd3 nv-wrap nv-historicalBarChart").append("g"),
                        G = E.select("g");
                    F.append("g").attr("class", "nv-x nv-axis"), F.append("g").attr("class", "nv-y nv-axis"), F.append("g").attr("class", "nv-barsWrap"), F.append("g").attr("class", "nv-legendWrap"), F.append("g").attr("class", "nv-interactive"), p && (i.width(B), G.select(".nv-legendWrap").datum(k).call(i), l.top != i.height() && (l.top = i.height(), C = a.utils.availableHeight(o, w, l)), E.select(".nv-legendWrap").attr("transform", "translate(0," + -l.top + ")")), E.attr("transform", "translate(" + l.left + "," + l.top + ")"), s && G.select(".nv-y.nv-axis").attr("transform", "translate(" + B + ",0)"), t && (j.width(B).height(C).margin({
                        left: l.left,
                        top: l.top
                    }).svgContainer(w).xScale(d), E.select(".nv-interactive").call(j)), f.width(B).height(C).color(k.map(function(a, b) {
                        return a.color || m(a, b)
                    }).filter(function(a, b) {
                        return !k[b].disabled
                    }));
                    var H = G.select(".nv-barsWrap").datum(k.filter(function(a) {
                        return !a.disabled
                    }));
                    H.transition().call(f), q && (g.scale(d)._ticks(a.utils.calcTicksX(B / 100, k)).tickSize(-C, 0), G.select(".nv-x.nv-axis").attr("transform", "translate(0," + e.range()[0] + ")"), G.select(".nv-x.nv-axis").transition().call(g)), r && (h.scale(e)._ticks(a.utils.calcTicksY(C / 36, k)).tickSize(-B, 0), G.select(".nv-y.nv-axis").transition().call(h)), j.dispatch.on("elementMousemove", function(b) {
                        f.clearHighlights();
                        var d, e, i, n = [];
                        k.filter(function(a, b) {
                            return a.seriesIndex = b, !a.disabled
                        }).forEach(function(g) {
                            e = a.interactiveBisect(g.values, b.pointXValue, c.x()), f.highlightPoint(e, !0);
                            var h = g.values[e];
                            void 0 !== h && (void 0 === d && (d = h), void 0 === i && (i = c.xScale()(c.x()(h, e))), n.push({
                                key: g.key,
                                value: c.y()(h, e),
                                color: m(g, g.seriesIndex),
                                data: g.values[e]
                            }))
                        });
                        var o = g.tickFormat()(c.x()(d, e));
                        j.tooltip.position({
                            left: i + l.left,
                            top: b.mouseY + l.top
                        }).chartContainer(A.parentNode).valueFormatter(function(a) {
                            return h.tickFormat()(a)
                        }).data({
                            value: o,
                            index: e,
                            series: n
                        })(), j.renderGuideLine(i)
                    }), j.dispatch.on("elementMouseout", function() {
                        x.tooltipHide(), f.clearHighlights()
                    }), i.dispatch.on("legendClick", function(a) {
                        a.disabled = !a.disabled, k.filter(function(a) {
                            return !a.disabled
                        }).length || k.map(function(a) {
                            return a.disabled = !1, E.selectAll(".nv-series").classed("disabled", !1), a
                        }), u.disabled = k.map(function(a) {
                            return !!a.disabled
                        }), x.stateChange(u), b.transition().call(c)
                    }), i.dispatch.on("legendDblclick", function(a) {
                        k.forEach(function(a) {
                            a.disabled = !0
                        }), a.disabled = !1, u.disabled = k.map(function(a) {
                            return !!a.disabled
                        }), x.stateChange(u), c.update()
                    }), x.on("changeState", function(a) {
                        "undefined" != typeof a.disabled && (k.forEach(function(b, c) {
                            b.disabled = a.disabled[c]
                        }), u.disabled = a.disabled), c.update()
                    })
                }), z.renderEnd("historicalBarChart immediate"), c
            }
            var d, e, f = b || a.models.historicalBar(),
                g = a.models.axis(),
                h = a.models.axis(),
                i = a.models.legend(),
                j = a.interactiveGuideline(),
                k = a.models.tooltip(),
                l = {
                    top: 30,
                    right: 90,
                    bottom: 50,
                    left: 90
                },
                m = a.utils.defaultColor(),
                n = null,
                o = null,
                p = !1,
                q = !0,
                r = !0,
                s = !1,
                t = !1,
                u = {},
                v = null,
                w = null,
                x = d3.dispatch("tooltipHide", "stateChange", "changeState", "renderEnd"),
                y = 250;
            g.orient("bottom").tickPadding(7), h.orient(s ? "right" : "left"), k.duration(0).headerEnabled(!1).valueFormatter(function(a, b) {
                return h.tickFormat()(a, b)
            }).headerFormatter(function(a, b) {
                return g.tickFormat()(a, b)
            });
            var z = a.utils.renderWatch(x, 0);
            return f.dispatch.on("elementMouseover.tooltip", function(a) {
                a.series = {
                    key: c.x()(a.data),
                    value: c.y()(a.data),
                    color: a.color
                }, k.data(a).hidden(!1)
            }), f.dispatch.on("elementMouseout.tooltip", function() {
                k.hidden(!0)
            }), f.dispatch.on("elementMousemove.tooltip", function() {
                k.position({
                    top: d3.event.pageY,
                    left: d3.event.pageX
                })()
            }), c.dispatch = x, c.bars = f, c.legend = i, c.xAxis = g, c.yAxis = h, c.interactiveLayer = j, c.tooltip = k, c.options = a.utils.optionsFunc.bind(c), c._options = Object.create({}, {
                width: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                height: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                showLegend: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                showXAxis: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                showYAxis: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a
                    }
                },
                defaultState: {
                    get: function() {
                        return v
                    },
                    set: function(a) {
                        v = a
                    }
                },
                noData: {
                    get: function() {
                        return w
                    },
                    set: function(a) {
                        w = a
                    }
                },
                tooltips: {
                    get: function() {
                        return k.enabled()
                    },
                    set: function(b) {
                        a.deprecated("tooltips", "use chart.tooltip.enabled() instead"), k.enabled(!!b)
                    }
                },
                tooltipContent: {
                    get: function() {
                        return k.contentGenerator()
                    },
                    set: function(b) {
                        a.deprecated("tooltipContent", "use chart.tooltip.contentGenerator() instead"), k.contentGenerator(b)
                    }
                },
                margin: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l.top = void 0 !== a.top ? a.top : l.top, l.right = void 0 !== a.right ? a.right : l.right, l.bottom = void 0 !== a.bottom ? a.bottom : l.bottom, l.left = void 0 !== a.left ? a.left : l.left
                    }
                },
                color: {
                    get: function() {
                        return m
                    },
                    set: function(b) {
                        m = a.utils.getColor(b), i.color(m), f.color(m)
                    }
                },
                duration: {
                    get: function() {
                        return y
                    },
                    set: function(a) {
                        y = a, z.reset(y), h.duration(y), g.duration(y)
                    }
                },
                rightAlignYAxis: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a, h.orient(a ? "right" : "left")
                    }
                },
                useInteractiveGuideline: {
                    get: function() {
                        return t
                    },
                    set: function(a) {
                        t = a, a === !0 && c.interactive(!1)
                    }
                }
            }), a.utils.inheritOptions(c, f), a.utils.initOptions(c), c
        }, a.models.ohlcBarChart = function() {
            var b = a.models.historicalBarChart(a.models.ohlcBar());
            return b.useInteractiveGuideline(!0), b.interactiveLayer.tooltip.contentGenerator(function(a) {
                var c = a.series[0].data,
                    d = c.open < c.close ? "2ca02c" : "d62728";
                return '<h3 style="color: #' + d + '">' + a.value + "</h3><table><tr><td>open:</td><td>" + b.yAxis.tickFormat()(c.open) + "</td></tr><tr><td>close:</td><td>" + b.yAxis.tickFormat()(c.close) + "</td></tr><tr><td>high</td><td>" + b.yAxis.tickFormat()(c.high) + "</td></tr><tr><td>low:</td><td>" + b.yAxis.tickFormat()(c.low) + "</td></tr></table>"
            }), b
        }, a.models.candlestickBarChart = function() {
            var b = a.models.historicalBarChart(a.models.candlestickBar());
            return b.useInteractiveGuideline(!0), b.interactiveLayer.tooltip.contentGenerator(function(a) {
                var c = a.series[0].data,
                    d = c.open < c.close ? "2ca02c" : "d62728";
                return '<h3 style="color: #' + d + '">' + a.value + "</h3><table><tr><td>open:</td><td>" + b.yAxis.tickFormat()(c.open) + "</td></tr><tr><td>close:</td><td>" + b.yAxis.tickFormat()(c.close) + "</td></tr><tr><td>high</td><td>" + b.yAxis.tickFormat()(c.high) + "</td></tr><tr><td>low:</td><td>" + b.yAxis.tickFormat()(c.low) + "</td></tr></table>"
            }), b
        }, a.models.legend = function() {
            "use strict";

            function b(p) {
                function q(a, b) {
                    return "furious" != o ? "#000" : m ? a.disengaged ? "#000" : "#fff" : m ? void 0 : (a.color || (a.color = g(a, b)), a.disabled ? a.color : "#fff")
                }

                function r(a, b) {
                    return m && "furious" == o && a.disengaged ? "#eee" : a.color || g(a, b)
                }

                function s(a) {
                    return m && "furious" == o ? 1 : a.disabled ? 0 : 1
                }
                return p.each(function(b) {
                    var g = d - c.left - c.right,
                        p = d3.select(this);
                    a.utils.initSVG(p);
                    var t = p.selectAll("g.nv-legend").data([b]),
                        u = t.enter().append("g").attr("class", "nvd3 nv-legend").append("g"),
                        v = t.select("g");
                    t.attr("transform", "translate(" + c.left + "," + c.top + ")");
                    var w, x, y = v.selectAll(".nv-series").data(function(a) {
                            return "furious" != o ? a : a.filter(function(a) {
                                return m ? !0 : !a.disengaged
                            })
                        }),
                        z = y.enter().append("g").attr("class", "nv-series");
                    switch (o) {
                        case "furious":
                            x = 23;
                            break;
                        case "classic":
                            x = 20
                    }
                    if ("classic" == o) z.append("circle").style("stroke-width", 2).attr("class", "nv-legend-symbol").attr("r", 5), w = y.select("circle");
                    else if ("furious" == o) {
                        z.append("rect").style("stroke-width", 2).attr("class", "nv-legend-symbol").attr("rx", 3).attr("ry", 3), w = y.select(".nv-legend-symbol"), z.append("g").attr("class", "nv-check-box").property("innerHTML", '<path d="M0.5,5 L22.5,5 L22.5,26.5 L0.5,26.5 L0.5,5 Z" class="nv-box"></path><path d="M5.5,12.8618467 L11.9185089,19.2803556 L31,0.198864511" class="nv-check"></path>').attr("transform", "translate(-10,-8)scale(0.5)");
                        var A = y.select(".nv-check-box");
                        A.each(function(a, b) {
                            d3.select(this).selectAll("path").attr("stroke", q(a, b))
                        })
                    }
                    z.append("text").attr("text-anchor", "start").attr("class", "nv-legend-text").attr("dy", ".32em").attr("dx", "8");
                    var B = y.select("text.nv-legend-text");
                    y.on("mouseover", function(a, b) {
                        n.legendMouseover(a, b)
                    }).on("mouseout", function(a, b) {
                        n.legendMouseout(a, b)
                    }).on("click", function(a, b) {
                        n.legendClick(a, b);
                        var c = y.data();
                        if (k) {
                            if ("classic" == o) l ? (c.forEach(function(a) {
                                a.disabled = !0
                            }), a.disabled = !1) : (a.disabled = !a.disabled, c.every(function(a) {
                                return a.disabled
                            }) && c.forEach(function(a) {
                                a.disabled = !1
                            }));
                            else if ("furious" == o)
                                if (m) a.disengaged = !a.disengaged, a.userDisabled = void 0 == a.userDisabled ? !!a.disabled : a.userDisabled, a.disabled = a.disengaged || a.userDisabled;
                                else if (!m) {
                                a.disabled = !a.disabled, a.userDisabled = a.disabled;
                                var d = c.filter(function(a) {
                                    return !a.disengaged
                                });
                                d.every(function(a) {
                                    return a.userDisabled
                                }) && c.forEach(function(a) {
                                    a.disabled = a.userDisabled = !1
                                })
                            }
                            n.stateChange({
                                disabled: c.map(function(a) {
                                    return !!a.disabled
                                }),
                                disengaged: c.map(function(a) {
                                    return !!a.disengaged
                                })
                            })
                        }
                    }).on("dblclick", function(a, b) {
                        if (("furious" != o || !m) && (n.legendDblclick(a, b), k)) {
                            var c = y.data();
                            c.forEach(function(a) {
                                a.disabled = !0, "furious" == o && (a.userDisabled = a.disabled)
                            }), a.disabled = !1, "furious" == o && (a.userDisabled = a.disabled), n.stateChange({
                                disabled: c.map(function(a) {
                                    return !!a.disabled
                                })
                            })
                        }
                    }), y.classed("nv-disabled", function(a) {
                        return a.userDisabled
                    }), y.exit().remove(), B.attr("fill", q).text(f);
                    var C = 0;
                    if (h) {
                        var D = [];
                        y.each(function() {
                            var b, c = d3.select(this).select("text");
                            try {
                                if (b = c.node().getComputedTextLength(), 0 >= b) throw Error()
                            } catch (d) {
                                b = a.utils.calcApproxTextWidth(c)
                            }
                            D.push(b + i)
                        });
                        var E = 0,
                            F = [];
                        for (C = 0; g > C && E < D.length;) F[E] = D[E], C += D[E++];
                        for (0 === E && (E = 1); C > g && E > 1;) {
                            F = [], E--;
                            for (var G = 0; G < D.length; G++) D[G] > (F[G % E] || 0) && (F[G % E] = D[G]);
                            C = F.reduce(function(a, b) {
                                return a + b
                            })
                        }
                        for (var H = [], I = 0, J = 0; E > I; I++) H[I] = J, J += F[I];
                        y.attr("transform", function(a, b) {
                            return "translate(" + H[b % E] + "," + (5 + Math.floor(b / E) * x) + ")"
                        }), j ? v.attr("transform", "translate(" + (d - c.right - C) + "," + c.top + ")") : v.attr("transform", "translate(0," + c.top + ")"), e = c.top + c.bottom + Math.ceil(D.length / E) * x
                    } else {
                        var K, L = 5,
                            M = 5,
                            N = 0;
                        y.attr("transform", function() {
                            var a = d3.select(this).select("text").node().getComputedTextLength() + i;
                            return K = M, d < c.left + c.right + K + a && (M = K = 5, L += x), M += a, M > N && (N = M), K + N > C && (C = K + N), "translate(" + K + "," + L + ")"
                        }), v.attr("transform", "translate(" + (d - c.right - N) + "," + c.top + ")"), e = c.top + c.bottom + L + 15
                    }
                    if ("furious" == o) {
                        w.attr("width", function(a, b) {
                            return B[0][b].getComputedTextLength() + 27
                        }).attr("height", 18).attr("y", -9).attr("x", -15), u.insert("rect", ":first-child").attr("class", "nv-legend-bg").attr("fill", "#eee").attr("opacity", 0);
                        var O = v.select(".nv-legend-bg");
                        O.transition().duration(300).attr("x", -x).attr("width", C + x - 12).attr("height", e + 10).attr("y", -c.top - 10).attr("opacity", m ? 1 : 0)
                    }
                    w.style("fill", r).style("fill-opacity", s).style("stroke", r)
                }), b
            }
            var c = {
                    top: 5,
                    right: 0,
                    bottom: 5,
                    left: 0
                },
                d = 400,
                e = 20,
                f = function(a) {
                    return a.key
                },
                g = a.utils.getColor(),
                h = !0,
                i = 32,
                j = !0,
                k = !0,
                l = !1,
                m = !1,
                n = d3.dispatch("legendClick", "legendDblclick", "legendMouseover", "legendMouseout", "stateChange"),
                o = "classic";
            return b.dispatch = n, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a
                    }
                },
                height: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e = a
                    }
                },
                key: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f = a
                    }
                },
                align: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                rightAlign: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j = a
                    }
                },
                padding: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                updateState: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                radioButtonMode: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                expanded: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                vers: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                margin: {
                    get: function() {
                        return c
                    },
                    set: function(a) {
                        c.top = void 0 !== a.top ? a.top : c.top, c.right = void 0 !== a.right ? a.right : c.right, c.bottom = void 0 !== a.bottom ? a.bottom : c.bottom, c.left = void 0 !== a.left ? a.left : c.left
                    }
                },
                color: {
                    get: function() {
                        return g
                    },
                    set: function(b) {
                        g = a.utils.getColor(b)
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.line = function() {
            "use strict";

            function b(r) {
                return v.reset(), v.models(e), r.each(function(b) {
                    i = d3.select(this);
                    var r = a.utils.availableWidth(g, i, f),
                        s = a.utils.availableHeight(h, i, f);
                    a.utils.initSVG(i), c = e.xScale(), d = e.yScale(), t = t || c, u = u || d;
                    var w = i.selectAll("g.nv-wrap.nv-line").data([b]),
                        x = w.enter().append("g").attr("class", "nvd3 nv-wrap nv-line"),
                        y = x.append("defs"),
                        z = x.append("g"),
                        A = w.select("g");
                    z.append("g").attr("class", "nv-groups"), z.append("g").attr("class", "nv-scatterWrap"), w.attr("transform", "translate(" + f.left + "," + f.top + ")"), e.width(r).height(s);
                    var B = w.select(".nv-scatterWrap");
                    B.call(e), y.append("clipPath").attr("id", "nv-edge-clip-" + e.id()).append("rect"), w.select("#nv-edge-clip-" + e.id() + " rect").attr("width", r).attr("height", s > 0 ? s : 0), A.attr("clip-path", p ? "url(#nv-edge-clip-" + e.id() + ")" : ""), B.attr("clip-path", p ? "url(#nv-edge-clip-" + e.id() + ")" : "");
                    var C = w.select(".nv-groups").selectAll(".nv-group").data(function(a) {
                        return a
                    }, function(a) {
                        return a.key
                    });
                    C.enter().append("g").style("stroke-opacity", 1e-6).style("stroke-width", function(a) {
                        return a.strokeWidth || j
                    }).style("fill-opacity", 1e-6), C.exit().remove(), C.attr("class", function(a, b) {
                        return (a.classed || "") + " nv-group nv-series-" + b
                    }).classed("hover", function(a) {
                        return a.hover
                    }).style("fill", function(a, b) {
                        return k(a, b)
                    }).style("stroke", function(a, b) {
                        return k(a, b)
                    }), C.watchTransition(v, "line: groups").style("stroke-opacity", 1).style("fill-opacity", function(a) {
                        return a.fillOpacity || .5
                    });
                    var D = C.selectAll("path.nv-area").data(function(a) {
                        return o(a) ? [a] : []
                    });
                    D.enter().append("path").attr("class", "nv-area").attr("d", function(b) {
                        return d3.svg.area().interpolate(q).defined(n).x(function(b, c) {
                            return a.utils.NaNtoZero(t(l(b, c)))
                        }).y0(function(b, c) {
                            return a.utils.NaNtoZero(u(m(b, c)))
                        }).y1(function() {
                            return u(d.domain()[0] <= 0 ? d.domain()[1] >= 0 ? 0 : d.domain()[1] : d.domain()[0])
                        }).apply(this, [b.values])
                    }), C.exit().selectAll("path.nv-area").remove(), D.watchTransition(v, "line: areaPaths").attr("d", function(b) {
                        return d3.svg.area().interpolate(q).defined(n).x(function(b, d) {
                            return a.utils.NaNtoZero(c(l(b, d)))
                        }).y0(function(b, c) {
                            return a.utils.NaNtoZero(d(m(b, c)))
                        }).y1(function() {
                            return d(d.domain()[0] <= 0 ? d.domain()[1] >= 0 ? 0 : d.domain()[1] : d.domain()[0])
                        }).apply(this, [b.values])
                    });
                    var E = C.selectAll("path.nv-line").data(function(a) {
                        return [a.values]
                    });
                    E.enter().append("path").attr("class", "nv-line").attr("d", d3.svg.line().interpolate(q).defined(n).x(function(b, c) {
                        return a.utils.NaNtoZero(t(l(b, c)))
                    }).y(function(b, c) {
                        return a.utils.NaNtoZero(u(m(b, c)))
                    })), E.watchTransition(v, "line: linePaths").attr("d", d3.svg.line().interpolate(q).defined(n).x(function(b, d) {
                        return a.utils.NaNtoZero(c(l(b, d)))
                    }).y(function(b, c) {
                        return a.utils.NaNtoZero(d(m(b, c)))
                    })), t = c.copy(), u = d.copy()
                }), v.renderEnd("line immediate"), b
            }
            var c, d, e = a.models.scatter(),
                f = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                g = 960,
                h = 500,
                i = null,
                j = 1.5,
                k = a.utils.defaultColor(),
                l = function(a) {
                    return a.x
                },
                m = function(a) {
                    return a.y
                },
                n = function(a, b) {
                    return !isNaN(m(a, b)) && null !== m(a, b)
                },
                o = function(a) {
                    return a.area
                },
                p = !1,
                q = "linear",
                r = 250,
                s = d3.dispatch("elementClick", "elementMouseover", "elementMouseout", "renderEnd");
            e.pointSize(16).pointDomain([16, 256]);
            var t, u, v = a.utils.renderWatch(s, r);
            return b.dispatch = s, b.scatter = e, e.dispatch.on("elementClick", function() {
                s.elementClick.apply(this, arguments)
            }), e.dispatch.on("elementMouseover", function() {
                s.elementMouseover.apply(this, arguments)
            }), e.dispatch.on("elementMouseout", function() {
                s.elementMouseout.apply(this, arguments)
            }), b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g = a
                    }
                },
                height: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                defined: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                interpolate: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                clipEdge: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                margin: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f.top = void 0 !== a.top ? a.top : f.top, f.right = void 0 !== a.right ? a.right : f.right, f.bottom = void 0 !== a.bottom ? a.bottom : f.bottom, f.left = void 0 !== a.left ? a.left : f.left
                    }
                },
                duration: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a, v.reset(r), e.duration(r)
                    }
                },
                isArea: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = d3.functor(a)
                    }
                },
                x: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a, e.x(a)
                    }
                },
                y: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a, e.y(a)
                    }
                },
                color: {
                    get: function() {
                        return k
                    },
                    set: function(b) {
                        k = a.utils.getColor(b), e.color(k)
                    }
                }
            }), a.utils.inheritOptions(b, e), a.utils.initOptions(b), b
        }, a.models.lineChart = function() {
            "use strict";

            function b(j) {
                return y.reset(), y.models(e), p && y.models(f), q && y.models(g), j.each(function(j) {
                    var v = d3.select(this),
                        y = this;
                    a.utils.initSVG(v);
                    var B = a.utils.availableWidth(m, v, k),
                        C = a.utils.availableHeight(n, v, k);
                    if (b.update = function() {
                            0 === x ? v.call(b) : v.transition().duration(x).call(b)
                        }, b.container = this, t.setter(A(j), b.update).getter(z(j)).update(), t.disabled = j.map(function(a) {
                            return !!a.disabled
                        }), !u) {
                        var D;
                        u = {};
                        for (D in t) u[D] = t[D] instanceof Array ? t[D].slice(0) : t[D]
                    }
                    if (!(j && j.length && j.filter(function(a) {
                            return a.values.length
                        }).length)) return a.utils.noData(b, v), b;
                    v.selectAll(".nv-noData").remove(), c = e.xScale(), d = e.yScale();
                    var E = v.selectAll("g.nv-wrap.nv-lineChart").data([j]),
                        F = E.enter().append("g").attr("class", "nvd3 nv-wrap nv-lineChart").append("g"),
                        G = E.select("g");
                    F.append("rect").style("opacity", 0), F.append("g").attr("class", "nv-x nv-axis"), F.append("g").attr("class", "nv-y nv-axis"), F.append("g").attr("class", "nv-linesWrap"), F.append("g").attr("class", "nv-legendWrap"), F.append("g").attr("class", "nv-interactive"), G.select("rect").attr("width", B).attr("height", C > 0 ? C : 0), o && (h.width(B), G.select(".nv-legendWrap").datum(j).call(h), k.top != h.height() && (k.top = h.height(), C = a.utils.availableHeight(n, v, k)), E.select(".nv-legendWrap").attr("transform", "translate(0," + -k.top + ")")), E.attr("transform", "translate(" + k.left + "," + k.top + ")"), r && G.select(".nv-y.nv-axis").attr("transform", "translate(" + B + ",0)"), s && (i.width(B).height(C).margin({
                        left: k.left,
                        top: k.top
                    }).svgContainer(v).xScale(c), E.select(".nv-interactive").call(i)), e.width(B).height(C).color(j.map(function(a, b) {
                        return a.color || l(a, b)
                    }).filter(function(a, b) {
                        return !j[b].disabled
                    }));
                    var H = G.select(".nv-linesWrap").datum(j.filter(function(a) {
                        return !a.disabled
                    }));
                    H.call(e), p && (f.scale(c)._ticks(a.utils.calcTicksX(B / 100, j)).tickSize(-C, 0), G.select(".nv-x.nv-axis").attr("transform", "translate(0," + d.range()[0] + ")"), G.select(".nv-x.nv-axis").call(f)), q && (g.scale(d)._ticks(a.utils.calcTicksY(C / 36, j)).tickSize(-B, 0), G.select(".nv-y.nv-axis").call(g)), h.dispatch.on("stateChange", function(a) {
                        for (var c in a) t[c] = a[c];
                        w.stateChange(t), b.update()
                    }), i.dispatch.on("elementMousemove", function(c) {
                        e.clearHighlights();
                        var d, h, m, n = [];
                        if (j.filter(function(a, b) {
                                return a.seriesIndex = b, !a.disabled
                            }).forEach(function(f, g) {
                                h = a.interactiveBisect(f.values, c.pointXValue, b.x());
                                var i = f.values[h],
                                    j = b.y()(i, h);
                                null != j && e.highlightPoint(g, h, !0), void 0 !== i && (void 0 === d && (d = i), void 0 === m && (m = b.xScale()(b.x()(i, h))), n.push({
                                    key: f.key,
                                    value: j,
                                    color: l(f, f.seriesIndex)
                                }))
                            }), n.length > 2) {
                            var o = b.yScale().invert(c.mouseY),
                                p = Math.abs(b.yScale().domain()[0] - b.yScale().domain()[1]),
                                q = .03 * p,
                                r = a.nearestValueIndex(n.map(function(a) {
                                    return a.value
                                }), o, q);
                            null !== r && (n[r].highlight = !0)
                        }
                        var s = f.tickFormat()(b.x()(d, h));
                        i.tooltip.position({
                            left: c.mouseX + k.left,
                            top: c.mouseY + k.top
                        }).chartContainer(y.parentNode).valueFormatter(function(a) {
                            return null == a ? "N/A" : g.tickFormat()(a)
                        }).data({
                            value: s,
                            index: h,
                            series: n
                        })(), i.renderGuideLine(m)
                    }), i.dispatch.on("elementClick", function(c) {
                        var d, f = [];
                        j.filter(function(a, b) {
                            return a.seriesIndex = b, !a.disabled
                        }).forEach(function(e) {
                            var g = a.interactiveBisect(e.values, c.pointXValue, b.x()),
                                h = e.values[g];
                            if ("undefined" != typeof h) {
                                "undefined" == typeof d && (d = b.xScale()(b.x()(h, g)));
                                var i = b.yScale()(b.y()(h, g));
                                f.push({
                                    point: h,
                                    pointIndex: g,
                                    pos: [d, i],
                                    seriesIndex: e.seriesIndex,
                                    series: e
                                })
                            }
                        }), e.dispatch.elementClick(f)
                    }), i.dispatch.on("elementMouseout", function() {
                        e.clearHighlights()
                    }), w.on("changeState", function(a) {
                        "undefined" != typeof a.disabled && j.length === a.disabled.length && (j.forEach(function(b, c) {
                            b.disabled = a.disabled[c]
                        }), t.disabled = a.disabled), b.update()
                    })
                }), y.renderEnd("lineChart immediate"), b
            }
            var c, d, e = a.models.line(),
                f = a.models.axis(),
                g = a.models.axis(),
                h = a.models.legend(),
                i = a.interactiveGuideline(),
                j = a.models.tooltip(),
                k = {
                    top: 30,
                    right: 20,
                    bottom: 50,
                    left: 60
                },
                l = a.utils.defaultColor(),
                m = null,
                n = null,
                o = !0,
                p = !0,
                q = !0,
                r = !1,
                s = !1,
                t = a.utils.state(),
                u = null,
                v = null,
                w = d3.dispatch("tooltipShow", "tooltipHide", "stateChange", "changeState", "renderEnd"),
                x = 250;
            f.orient("bottom").tickPadding(7), g.orient(r ? "right" : "left"), j.valueFormatter(function(a, b) {
                return g.tickFormat()(a, b)
            }).headerFormatter(function(a, b) {
                return f.tickFormat()(a, b)
            });
            var y = a.utils.renderWatch(w, x),
                z = function(a) {
                    return function() {
                        return {
                            active: a.map(function(a) {
                                return !a.disabled
                            })
                        }
                    }
                },
                A = function(a) {
                    return function(b) {
                        void 0 !== b.active && a.forEach(function(a, c) {
                            a.disabled = !b.active[c]
                        })
                    }
                };
            return e.dispatch.on("elementMouseover.tooltip", function(a) {
                j.data(a).position(a.pos).hidden(!1)
            }), e.dispatch.on("elementMouseout.tooltip", function() {
                j.hidden(!0)
            }), b.dispatch = w, b.lines = e, b.legend = h, b.xAxis = f, b.yAxis = g, b.interactiveLayer = i, b.tooltip = j, b.dispatch = w, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                height: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                showLegend: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                showXAxis: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                showYAxis: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                defaultState: {
                    get: function() {
                        return u
                    },
                    set: function(a) {
                        u = a
                    }
                },
                noData: {
                    get: function() {
                        return v
                    },
                    set: function(a) {
                        v = a
                    }
                },
                tooltips: {
                    get: function() {
                        return j.enabled()
                    },
                    set: function(b) {
                        a.deprecated("tooltips", "use chart.tooltip.enabled() instead"), j.enabled(!!b)
                    }
                },
                tooltipContent: {
                    get: function() {
                        return j.contentGenerator()
                    },
                    set: function(b) {
                        a.deprecated("tooltipContent", "use chart.tooltip.contentGenerator() instead"), j.contentGenerator(b)
                    }
                },
                margin: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k.top = void 0 !== a.top ? a.top : k.top, k.right = void 0 !== a.right ? a.right : k.right, k.bottom = void 0 !== a.bottom ? a.bottom : k.bottom, k.left = void 0 !== a.left ? a.left : k.left
                    }
                },
                duration: {
                    get: function() {
                        return x
                    },
                    set: function(a) {
                        x = a, y.reset(x), e.duration(x), f.duration(x), g.duration(x)
                    }
                },
                color: {
                    get: function() {
                        return l
                    },
                    set: function(b) {
                        l = a.utils.getColor(b), h.color(l), e.color(l)
                    }
                },
                rightAlignYAxis: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a, g.orient(r ? "right" : "left")
                    }
                },
                useInteractiveGuideline: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a, s && (e.interactive(!1), e.useVoronoi(!1))
                    }
                }
            }), a.utils.inheritOptions(b, e), a.utils.initOptions(b), b
        }, a.models.linePlusBarChart = function() {
            "use strict";

            function b(v) {
                return v.each(function(v) {
                    function J(a) {
                        var b = +("e" == a),
                            c = b ? 1 : -1,
                            d = X / 3;
                        return "M" + .5 * c + "," + d + "A6,6 0 0 " + b + " " + 6.5 * c + "," + (d + 6) + "V" + (2 * d - 6) + "A6,6 0 0 " + b + " " + .5 * c + "," + 2 * d + "ZM" + 2.5 * c + "," + (d + 8) + "V" + (2 * d - 8) + "M" + 4.5 * c + "," + (d + 8) + "V" + (2 * d - 8)
                    }

                    function S() {
                        u.empty() || u.extent(I), kb.data([u.empty() ? e.domain() : I]).each(function(a) {
                            var b = e(a[0]) - e.range()[0],
                                c = e.range()[1] - e(a[1]);
                            d3.select(this).select(".left").attr("width", 0 > b ? 0 : b), d3.select(this).select(".right").attr("x", e(a[1])).attr("width", 0 > c ? 0 : c)
                        })
                    }

                    function T() {
                        I = u.empty() ? null : u.extent(), c = u.empty() ? e.domain() : u.extent(), K.brush({
                            extent: c,
                            brush: u
                        }), S(), l.width(V).height(W).color(v.map(function(a, b) {
                            return a.color || C(a, b)
                        }).filter(function(a, b) {
                            return !v[b].disabled && v[b].bar
                        })), j.width(V).height(W).color(v.map(function(a, b) {
                            return a.color || C(a, b)
                        }).filter(function(a, b) {
                            return !v[b].disabled && !v[b].bar
                        }));
                        var b = db.select(".nv-focus .nv-barsWrap").datum(Z.length ? Z.map(function(a) {
                                return {
                                    key: a.key,
                                    values: a.values.filter(function(a, b) {
                                        return l.x()(a, b) >= c[0] && l.x()(a, b) <= c[1]
                                    })
                                }
                            }) : [{
                                values: []
                            }]),
                            h = db.select(".nv-focus .nv-linesWrap").datum($[0].disabled ? [{
                                values: []
                            }] : $.map(function(a) {
                                return {
                                    area: a.area,
                                    fillOpacity: a.fillOpacity,
                                    key: a.key,
                                    values: a.values.filter(function(a, b) {
                                        return j.x()(a, b) >= c[0] && j.x()(a, b) <= c[1]
                                    })
                                }
                            }));
                        d = Z.length ? l.xScale() : j.xScale(), n.scale(d)._ticks(a.utils.calcTicksX(V / 100, v)).tickSize(-W, 0), n.domain([Math.ceil(c[0]), Math.floor(c[1])]), db.select(".nv-x.nv-axis").transition().duration(L).call(n), b.transition().duration(L).call(l), h.transition().duration(L).call(j), db.select(".nv-focus .nv-x.nv-axis").attr("transform", "translate(0," + f.range()[0] + ")"), p.scale(f)._ticks(a.utils.calcTicksY(W / 36, v)).tickSize(-V, 0), q.scale(g)._ticks(a.utils.calcTicksY(W / 36, v)).tickSize(Z.length ? 0 : -V, 0), db.select(".nv-focus .nv-y1.nv-axis").style("opacity", Z.length ? 1 : 0), db.select(".nv-focus .nv-y2.nv-axis").style("opacity", $.length && !$[0].disabled ? 1 : 0).attr("transform", "translate(" + d.range()[1] + ",0)"), db.select(".nv-focus .nv-y1.nv-axis").transition().duration(L).call(p), db.select(".nv-focus .nv-y2.nv-axis").transition().duration(L).call(q)
                    }
                    var U = d3.select(this);
                    a.utils.initSVG(U);
                    var V = a.utils.availableWidth(y, U, w),
                        W = a.utils.availableHeight(z, U, w) - (E ? H : 0),
                        X = H - x.top - x.bottom;
                    if (b.update = function() {
                            U.transition().duration(L).call(b)
                        }, b.container = this, M.setter(R(v), b.update).getter(Q(v)).update(), M.disabled = v.map(function(a) {
                            return !!a.disabled
                        }), !N) {
                        var Y;
                        N = {};
                        for (Y in M) N[Y] = M[Y] instanceof Array ? M[Y].slice(0) : M[Y]
                    }
                    if (!(v && v.length && v.filter(function(a) {
                            return a.values.length
                        }).length)) return a.utils.noData(b, U), b;
                    U.selectAll(".nv-noData").remove();
                    var Z = v.filter(function(a) {
                            return !a.disabled && a.bar
                        }),
                        $ = v.filter(function(a) {
                            return !a.bar
                        });
                    d = l.xScale(), e = o.scale(), f = l.yScale(), g = j.yScale(), h = m.yScale(), i = k.yScale();
                    var _ = v.filter(function(a) {
                            return !a.disabled && a.bar
                        }).map(function(a) {
                            return a.values.map(function(a, b) {
                                return {
                                    x: A(a, b),
                                    y: B(a, b)
                                }
                            })
                        }),
                        ab = v.filter(function(a) {
                            return !a.disabled && !a.bar
                        }).map(function(a) {
                            return a.values.map(function(a, b) {
                                return {
                                    x: A(a, b),
                                    y: B(a, b)
                                }
                            })
                        });
                    d.range([0, V]), e.domain(d3.extent(d3.merge(_.concat(ab)), function(a) {
                        return a.x
                    })).range([0, V]);
                    var bb = U.selectAll("g.nv-wrap.nv-linePlusBar").data([v]),
                        cb = bb.enter().append("g").attr("class", "nvd3 nv-wrap nv-linePlusBar").append("g"),
                        db = bb.select("g");
                    cb.append("g").attr("class", "nv-legendWrap");
                    var eb = cb.append("g").attr("class", "nv-focus");
                    eb.append("g").attr("class", "nv-x nv-axis"), eb.append("g").attr("class", "nv-y1 nv-axis"), eb.append("g").attr("class", "nv-y2 nv-axis"), eb.append("g").attr("class", "nv-barsWrap"), eb.append("g").attr("class", "nv-linesWrap");
                    var fb = cb.append("g").attr("class", "nv-context");
                    if (fb.append("g").attr("class", "nv-x nv-axis"), fb.append("g").attr("class", "nv-y1 nv-axis"), fb.append("g").attr("class", "nv-y2 nv-axis"), fb.append("g").attr("class", "nv-barsWrap"), fb.append("g").attr("class", "nv-linesWrap"), fb.append("g").attr("class", "nv-brushBackground"), fb.append("g").attr("class", "nv-x nv-brush"), D) {
                        var gb = t.align() ? V / 2 : V,
                            hb = t.align() ? gb : 0;
                        t.width(gb), db.select(".nv-legendWrap").datum(v.map(function(a) {
                            return a.originalKey = void 0 === a.originalKey ? a.key : a.originalKey, a.key = a.originalKey + (a.bar ? O : P), a
                        })).call(t), w.top != t.height() && (w.top = t.height(), W = a.utils.availableHeight(z, U, w) - H), db.select(".nv-legendWrap").attr("transform", "translate(" + hb + "," + -w.top + ")")
                    }
                    bb.attr("transform", "translate(" + w.left + "," + w.top + ")"), db.select(".nv-context").style("display", E ? "initial" : "none"), m.width(V).height(X).color(v.map(function(a, b) {
                        return a.color || C(a, b)
                    }).filter(function(a, b) {
                        return !v[b].disabled && v[b].bar
                    })), k.width(V).height(X).color(v.map(function(a, b) {
                        return a.color || C(a, b)
                    }).filter(function(a, b) {
                        return !v[b].disabled && !v[b].bar
                    }));
                    var ib = db.select(".nv-context .nv-barsWrap").datum(Z.length ? Z : [{
                            values: []
                        }]),
                        jb = db.select(".nv-context .nv-linesWrap").datum($[0].disabled ? [{
                            values: []
                        }] : $);
                    db.select(".nv-context").attr("transform", "translate(0," + (W + w.bottom + x.top) + ")"), ib.transition().call(m), jb.transition().call(k), G && (o._ticks(a.utils.calcTicksX(V / 100, v)).tickSize(-X, 0), db.select(".nv-context .nv-x.nv-axis").attr("transform", "translate(0," + h.range()[0] + ")"), db.select(".nv-context .nv-x.nv-axis").transition().call(o)), F && (r.scale(h)._ticks(X / 36).tickSize(-V, 0), s.scale(i)._ticks(X / 36).tickSize(Z.length ? 0 : -V, 0), db.select(".nv-context .nv-y3.nv-axis").style("opacity", Z.length ? 1 : 0).attr("transform", "translate(0," + e.range()[0] + ")"), db.select(".nv-context .nv-y2.nv-axis").style("opacity", $.length ? 1 : 0).attr("transform", "translate(" + e.range()[1] + ",0)"), db.select(".nv-context .nv-y1.nv-axis").transition().call(r), db.select(".nv-context .nv-y2.nv-axis").transition().call(s)), u.x(e).on("brush", T), I && u.extent(I);
                    var kb = db.select(".nv-brushBackground").selectAll("g").data([I || u.extent()]),
                        lb = kb.enter().append("g");
                    lb.append("rect").attr("class", "left").attr("x", 0).attr("y", 0).attr("height", X), lb.append("rect").attr("class", "right").attr("x", 0).attr("y", 0).attr("height", X);
                    var mb = db.select(".nv-x.nv-brush").call(u);
                    mb.selectAll("rect").attr("height", X), mb.selectAll(".resize").append("path").attr("d", J), t.dispatch.on("stateChange", function(a) {
                        for (var c in a) M[c] = a[c];
                        K.stateChange(M), b.update()
                    }), K.on("changeState", function(a) {
                        "undefined" != typeof a.disabled && (v.forEach(function(b, c) {
                            b.disabled = a.disabled[c]
                        }), M.disabled = a.disabled), b.update()
                    }), T()
                }), b
            }
            var c, d, e, f, g, h, i, j = a.models.line(),
                k = a.models.line(),
                l = a.models.historicalBar(),
                m = a.models.historicalBar(),
                n = a.models.axis(),
                o = a.models.axis(),
                p = a.models.axis(),
                q = a.models.axis(),
                r = a.models.axis(),
                s = a.models.axis(),
                t = a.models.legend(),
                u = d3.svg.brush(),
                v = a.models.tooltip(),
                w = {
                    top: 30,
                    right: 30,
                    bottom: 30,
                    left: 60
                },
                x = {
                    top: 0,
                    right: 30,
                    bottom: 20,
                    left: 60
                },
                y = null,
                z = null,
                A = function(a) {
                    return a.x
                },
                B = function(a) {
                    return a.y
                },
                C = a.utils.defaultColor(),
                D = !0,
                E = !0,
                F = !1,
                G = !0,
                H = 50,
                I = null,
                J = null,
                K = d3.dispatch("brush", "stateChange", "changeState"),
                L = 0,
                M = a.utils.state(),
                N = null,
                O = " (left axis)",
                P = " (right axis)";
            j.clipEdge(!0), k.interactive(!1), n.orient("bottom").tickPadding(5), p.orient("left"), q.orient("right"), o.orient("bottom").tickPadding(5), r.orient("left"), s.orient("right"), v.headerEnabled(!0).headerFormatter(function(a, b) {
                return n.tickFormat()(a, b)
            });
            var Q = function(a) {
                    return function() {
                        return {
                            active: a.map(function(a) {
                                return !a.disabled
                            })
                        }
                    }
                },
                R = function(a) {
                    return function(b) {
                        void 0 !== b.active && a.forEach(function(a, c) {
                            a.disabled = !b.active[c]
                        })
                    }
                };
            return j.dispatch.on("elementMouseover.tooltip", function(a) {
                v.duration(100).valueFormatter(function(a, b) {
                    return q.tickFormat()(a, b)
                }).data(a).position(a.pos).hidden(!1)
            }), j.dispatch.on("elementMouseout.tooltip", function() {
                v.hidden(!0)
            }), l.dispatch.on("elementMouseover.tooltip", function(a) {
                a.value = b.x()(a.data), a.series = {
                    value: b.y()(a.data),
                    color: a.color
                }, v.duration(0).valueFormatter(function(a, b) {
                    return p.tickFormat()(a, b)
                }).data(a).hidden(!1)
            }), l.dispatch.on("elementMouseout.tooltip", function() {
                v.hidden(!0)
            }), l.dispatch.on("elementMousemove.tooltip", function() {
                v.position({
                    top: d3.event.pageY,
                    left: d3.event.pageX
                })()
            }), b.dispatch = K, b.legend = t, b.lines = j, b.lines2 = k, b.bars = l, b.bars2 = m, b.xAxis = n, b.x2Axis = o, b.y1Axis = p, b.y2Axis = q, b.y3Axis = r, b.y4Axis = s, b.tooltip = v, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return y
                    },
                    set: function(a) {
                        y = a
                    }
                },
                height: {
                    get: function() {
                        return z
                    },
                    set: function(a) {
                        z = a
                    }
                },
                showLegend: {
                    get: function() {
                        return D
                    },
                    set: function(a) {
                        D = a
                    }
                },
                brushExtent: {
                    get: function() {
                        return I
                    },
                    set: function(a) {
                        I = a
                    }
                },
                noData: {
                    get: function() {
                        return J
                    },
                    set: function(a) {
                        J = a
                    }
                },
                focusEnable: {
                    get: function() {
                        return E
                    },
                    set: function(a) {
                        E = a
                    }
                },
                focusHeight: {
                    get: function() {
                        return H
                    },
                    set: function(a) {
                        H = a
                    }
                },
                focusShowAxisX: {
                    get: function() {
                        return G
                    },
                    set: function(a) {
                        G = a
                    }
                },
                focusShowAxisY: {
                    get: function() {
                        return F
                    },
                    set: function(a) {
                        F = a
                    }
                },
                legendLeftAxisHint: {
                    get: function() {
                        return O
                    },
                    set: function(a) {
                        O = a
                    }
                },
                legendRightAxisHint: {
                    get: function() {
                        return P
                    },
                    set: function(a) {
                        P = a
                    }
                },
                tooltips: {
                    get: function() {
                        return v.enabled()
                    },
                    set: function(b) {
                        a.deprecated("tooltips", "use chart.tooltip.enabled() instead"), v.enabled(!!b)
                    }
                },
                tooltipContent: {
                    get: function() {
                        return v.contentGenerator()
                    },
                    set: function(b) {
                        a.deprecated("tooltipContent", "use chart.tooltip.contentGenerator() instead"), v.contentGenerator(b)
                    }
                },
                margin: {
                    get: function() {
                        return w
                    },
                    set: function(a) {
                        w.top = void 0 !== a.top ? a.top : w.top, w.right = void 0 !== a.right ? a.right : w.right, w.bottom = void 0 !== a.bottom ? a.bottom : w.bottom, w.left = void 0 !== a.left ? a.left : w.left
                    }
                },
                duration: {
                    get: function() {
                        return L
                    },
                    set: function(a) {
                        L = a
                    }
                },
                color: {
                    get: function() {
                        return C
                    },
                    set: function(b) {
                        C = a.utils.getColor(b), t.color(C)
                    }
                },
                x: {
                    get: function() {
                        return A
                    },
                    set: function(a) {
                        A = a, j.x(a), k.x(a), l.x(a), m.x(a)
                    }
                },
                y: {
                    get: function() {
                        return B
                    },
                    set: function(a) {
                        B = a, j.y(a), k.y(a), l.y(a), m.y(a)
                    }
                }
            }), a.utils.inheritOptions(b, j), a.utils.initOptions(b), b
        }, a.models.lineWithFocusChart = function() {
            "use strict";

            function b(o) {
                return o.each(function(o) {
                    function z(a) {
                        var b = +("e" == a),
                            c = b ? 1 : -1,
                            d = M / 3;
                        return "M" + .5 * c + "," + d + "A6,6 0 0 " + b + " " + 6.5 * c + "," + (d + 6) + "V" + (2 * d - 6) + "A6,6 0 0 " + b + " " + .5 * c + "," + 2 * d + "ZM" + 2.5 * c + "," + (d + 8) + "V" + (2 * d - 8) + "M" + 4.5 * c + "," + (d + 8) + "V" + (2 * d - 8)
                    }

                    function G() {
                        n.empty() || n.extent(y), U.data([n.empty() ? e.domain() : y]).each(function(a) {
                            var b = e(a[0]) - c.range()[0],
                                d = K - e(a[1]);
                            d3.select(this).select(".left").attr("width", 0 > b ? 0 : b), d3.select(this).select(".right").attr("x", e(a[1])).attr("width", 0 > d ? 0 : d)
                        })
                    }

                    function H() {
                        y = n.empty() ? null : n.extent();
                        var a = n.empty() ? e.domain() : n.extent();
                        if (!(Math.abs(a[0] - a[1]) <= 1)) {
                            A.brush({
                                extent: a,
                                brush: n
                            }), G();
                            var b = Q.select(".nv-focus .nv-linesWrap").datum(o.filter(function(a) {
                                return !a.disabled
                            }).map(function(b) {
                                return {
                                    key: b.key,
                                    area: b.area,
                                    values: b.values.filter(function(b, c) {
                                        return g.x()(b, c) >= a[0] && g.x()(b, c) <= a[1]
                                    })
                                }
                            }));
                            b.transition().duration(B).call(g), Q.select(".nv-focus .nv-x.nv-axis").transition().duration(B).call(i), Q.select(".nv-focus .nv-y.nv-axis").transition().duration(B).call(j)
                        }
                    }
                    var I = d3.select(this),
                        J = this;
                    a.utils.initSVG(I);
                    var K = a.utils.availableWidth(t, I, q),
                        L = a.utils.availableHeight(u, I, q) - v,
                        M = v - r.top - r.bottom;
                    if (b.update = function() {
                            I.transition().duration(B).call(b)
                        }, b.container = this, C.setter(F(o), b.update).getter(E(o)).update(), C.disabled = o.map(function(a) {
                            return !!a.disabled
                        }), !D) {
                        var N;
                        D = {};
                        for (N in C) D[N] = C[N] instanceof Array ? C[N].slice(0) : C[N]
                    }
                    if (!(o && o.length && o.filter(function(a) {
                            return a.values.length
                        }).length)) return a.utils.noData(b, I), b;
                    I.selectAll(".nv-noData").remove(), c = g.xScale(), d = g.yScale(), e = h.xScale(), f = h.yScale();
                    var O = I.selectAll("g.nv-wrap.nv-lineWithFocusChart").data([o]),
                        P = O.enter().append("g").attr("class", "nvd3 nv-wrap nv-lineWithFocusChart").append("g"),
                        Q = O.select("g");
                    P.append("g").attr("class", "nv-legendWrap");
                    var R = P.append("g").attr("class", "nv-focus");
                    R.append("g").attr("class", "nv-x nv-axis"), R.append("g").attr("class", "nv-y nv-axis"), R.append("g").attr("class", "nv-linesWrap"), R.append("g").attr("class", "nv-interactive");
                    var S = P.append("g").attr("class", "nv-context");
                    S.append("g").attr("class", "nv-x nv-axis"), S.append("g").attr("class", "nv-y nv-axis"), S.append("g").attr("class", "nv-linesWrap"), S.append("g").attr("class", "nv-brushBackground"), S.append("g").attr("class", "nv-x nv-brush"), x && (m.width(K), Q.select(".nv-legendWrap").datum(o).call(m), q.top != m.height() && (q.top = m.height(), L = a.utils.availableHeight(u, I, q) - v), Q.select(".nv-legendWrap").attr("transform", "translate(0," + -q.top + ")")), O.attr("transform", "translate(" + q.left + "," + q.top + ")"), w && (p.width(K).height(L).margin({
                        left: q.left,
                        top: q.top
                    }).svgContainer(I).xScale(c), O.select(".nv-interactive").call(p)), g.width(K).height(L).color(o.map(function(a, b) {
                        return a.color || s(a, b)
                    }).filter(function(a, b) {
                        return !o[b].disabled
                    })), h.defined(g.defined()).width(K).height(M).color(o.map(function(a, b) {
                        return a.color || s(a, b)
                    }).filter(function(a, b) {
                        return !o[b].disabled
                    })), Q.select(".nv-context").attr("transform", "translate(0," + (L + q.bottom + r.top) + ")");
                    var T = Q.select(".nv-context .nv-linesWrap").datum(o.filter(function(a) {
                        return !a.disabled
                    }));
                    d3.transition(T).call(h), i.scale(c)._ticks(a.utils.calcTicksX(K / 100, o)).tickSize(-L, 0), j.scale(d)._ticks(a.utils.calcTicksY(L / 36, o)).tickSize(-K, 0), Q.select(".nv-focus .nv-x.nv-axis").attr("transform", "translate(0," + L + ")"), n.x(e).on("brush", function() {
                        H()
                    }), y && n.extent(y);
                    var U = Q.select(".nv-brushBackground").selectAll("g").data([y || n.extent()]),
                        V = U.enter().append("g");
                    V.append("rect").attr("class", "left").attr("x", 0).attr("y", 0).attr("height", M), V.append("rect").attr("class", "right").attr("x", 0).attr("y", 0).attr("height", M);
                    var W = Q.select(".nv-x.nv-brush").call(n);
                    W.selectAll("rect").attr("height", M), W.selectAll(".resize").append("path").attr("d", z), H(), k.scale(e)._ticks(a.utils.calcTicksX(K / 100, o)).tickSize(-M, 0), Q.select(".nv-context .nv-x.nv-axis").attr("transform", "translate(0," + f.range()[0] + ")"), d3.transition(Q.select(".nv-context .nv-x.nv-axis")).call(k), l.scale(f)._ticks(a.utils.calcTicksY(M / 36, o)).tickSize(-K, 0), d3.transition(Q.select(".nv-context .nv-y.nv-axis")).call(l), Q.select(".nv-context .nv-x.nv-axis").attr("transform", "translate(0," + f.range()[0] + ")"), m.dispatch.on("stateChange", function(a) {
                        for (var c in a) C[c] = a[c];
                        A.stateChange(C), b.update()
                    }), p.dispatch.on("elementMousemove", function(c) {
                        g.clearHighlights();
                        var d, f, h, k = [];
                        if (o.filter(function(a, b) {
                                return a.seriesIndex = b, !a.disabled
                            }).forEach(function(i, j) {
                                var l = n.empty() ? e.domain() : n.extent(),
                                    m = i.values.filter(function(a, b) {
                                        return g.x()(a, b) >= l[0] && g.x()(a, b) <= l[1]
                                    });
                                f = a.interactiveBisect(m, c.pointXValue, g.x());
                                var o = m[f],
                                    p = b.y()(o, f);
                                null != p && g.highlightPoint(j, f, !0), void 0 !== o && (void 0 === d && (d = o), void 0 === h && (h = b.xScale()(b.x()(o, f))), k.push({
                                    key: i.key,
                                    value: b.y()(o, f),
                                    color: s(i, i.seriesIndex)
                                }))
                            }), k.length > 2) {
                            var l = b.yScale().invert(c.mouseY),
                                m = Math.abs(b.yScale().domain()[0] - b.yScale().domain()[1]),
                                r = .03 * m,
                                t = a.nearestValueIndex(k.map(function(a) {
                                    return a.value
                                }), l, r);
                            null !== t && (k[t].highlight = !0)
                        }
                        var u = i.tickFormat()(b.x()(d, f));
                        p.tooltip.position({
                            left: c.mouseX + q.left,
                            top: c.mouseY + q.top
                        }).chartContainer(J.parentNode).valueFormatter(function(a) {
                            return null == a ? "N/A" : j.tickFormat()(a)
                        }).data({
                            value: u,
                            index: f,
                            series: k
                        })(), p.renderGuideLine(h)
                    }), p.dispatch.on("elementMouseout", function() {
                        g.clearHighlights()
                    }), A.on("changeState", function(a) {
                        "undefined" != typeof a.disabled && o.forEach(function(b, c) {
                            b.disabled = a.disabled[c]
                        }), b.update()
                    })
                }), b
            }
            var c, d, e, f, g = a.models.line(),
                h = a.models.line(),
                i = a.models.axis(),
                j = a.models.axis(),
                k = a.models.axis(),
                l = a.models.axis(),
                m = a.models.legend(),
                n = d3.svg.brush(),
                o = a.models.tooltip(),
                p = a.interactiveGuideline(),
                q = {
                    top: 30,
                    right: 30,
                    bottom: 30,
                    left: 60
                },
                r = {
                    top: 0,
                    right: 30,
                    bottom: 20,
                    left: 60
                },
                s = a.utils.defaultColor(),
                t = null,
                u = null,
                v = 50,
                w = !1,
                x = !0,
                y = null,
                z = null,
                A = d3.dispatch("brush", "stateChange", "changeState"),
                B = 250,
                C = a.utils.state(),
                D = null;
            g.clipEdge(!0).duration(0), h.interactive(!1), i.orient("bottom").tickPadding(5), j.orient("left"), k.orient("bottom").tickPadding(5), l.orient("left"), o.valueFormatter(function(a, b) {
                return j.tickFormat()(a, b)
            }).headerFormatter(function(a, b) {
                return i.tickFormat()(a, b)
            });
            var E = function(a) {
                    return function() {
                        return {
                            active: a.map(function(a) {
                                return !a.disabled
                            })
                        }
                    }
                },
                F = function(a) {
                    return function(b) {
                        void 0 !== b.active && a.forEach(function(a, c) {
                            a.disabled = !b.active[c]
                        })
                    }
                };
            return g.dispatch.on("elementMouseover.tooltip", function(a) {
                o.data(a).position(a.pos).hidden(!1)
            }), g.dispatch.on("elementMouseout.tooltip", function() {
                o.hidden(!0)
            }), b.dispatch = A, b.legend = m, b.lines = g, b.lines2 = h, b.xAxis = i, b.yAxis = j, b.x2Axis = k, b.y2Axis = l, b.interactiveLayer = p, b.tooltip = o, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return t
                    },
                    set: function(a) {
                        t = a
                    }
                },
                height: {
                    get: function() {
                        return u
                    },
                    set: function(a) {
                        u = a
                    }
                },
                focusHeight: {
                    get: function() {
                        return v
                    },
                    set: function(a) {
                        v = a
                    }
                },
                showLegend: {
                    get: function() {
                        return x
                    },
                    set: function(a) {
                        x = a
                    }
                },
                brushExtent: {
                    get: function() {
                        return y
                    },
                    set: function(a) {
                        y = a
                    }
                },
                defaultState: {
                    get: function() {
                        return D
                    },
                    set: function(a) {
                        D = a
                    }
                },
                noData: {
                    get: function() {
                        return z
                    },
                    set: function(a) {
                        z = a
                    }
                },
                tooltips: {
                    get: function() {
                        return o.enabled()
                    },
                    set: function(b) {
                        a.deprecated("tooltips", "use chart.tooltip.enabled() instead"), o.enabled(!!b)
                    }
                },
                tooltipContent: {
                    get: function() {
                        return o.contentGenerator()
                    },
                    set: function(b) {
                        a.deprecated("tooltipContent", "use chart.tooltip.contentGenerator() instead"), o.contentGenerator(b)
                    }
                },
                margin: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q.top = void 0 !== a.top ? a.top : q.top, q.right = void 0 !== a.right ? a.right : q.right, q.bottom = void 0 !== a.bottom ? a.bottom : q.bottom, q.left = void 0 !== a.left ? a.left : q.left
                    }
                },
                color: {
                    get: function() {
                        return s
                    },
                    set: function(b) {
                        s = a.utils.getColor(b), m.color(s)
                    }
                },
                interpolate: {
                    get: function() {
                        return g.interpolate()
                    },
                    set: function(a) {
                        g.interpolate(a), h.interpolate(a)
                    }
                },
                xTickFormat: {
                    get: function() {
                        return i.tickFormat()
                    },
                    set: function(a) {
                        i.tickFormat(a), k.tickFormat(a)
                    }
                },
                yTickFormat: {
                    get: function() {
                        return j.tickFormat()
                    },
                    set: function(a) {
                        j.tickFormat(a), l.tickFormat(a)
                    }
                },
                duration: {
                    get: function() {
                        return B
                    },
                    set: function(a) {
                        B = a, j.duration(B), l.duration(B), i.duration(B), k.duration(B)
                    }
                },
                x: {
                    get: function() {
                        return g.x()
                    },
                    set: function(a) {
                        g.x(a), h.x(a)
                    }
                },
                y: {
                    get: function() {
                        return g.y()
                    },
                    set: function(a) {
                        g.y(a), h.y(a)
                    }
                },
                useInteractiveGuideline: {
                    get: function() {
                        return w
                    },
                    set: function(a) {
                        w = a, w && (g.interactive(!1), g.useVoronoi(!1))
                    }
                }
            }), a.utils.inheritOptions(b, g), a.utils.initOptions(b), b
        }, a.models.multiBar = function() {
            "use strict";

            function b(E) {
                return C.reset(), E.each(function(b) {
                    var E = k - j.left - j.right,
                        F = l - j.top - j.bottom;
                    p = d3.select(this), a.utils.initSVG(p);
                    var G = 0;
                    if (x && b.length && (x = [{
                            values: b[0].values.map(function(a) {
                                return {
                                    x: a.x,
                                    y: 0,
                                    series: a.series,
                                    size: .01
                                }
                            })
                        }]), u) {
                        var H = d3.layout.stack().offset(v).values(function(a) {
                            return a.values
                        }).y(r)(!b.length && x ? x : b);
                        H.forEach(function(a, c) {
                            a.nonStackable ? (b[c].nonStackableSeries = G++, H[c] = b[c]) : c > 0 && H[c - 1].nonStackable && H[c].values.map(function(a, b) {
                                a.y0 -= H[c - 1].values[b].y, a.y1 = a.y0 + a.y
                            })
                        }), b = H
                    }
                    b.forEach(function(a, b) {
                        a.values.forEach(function(c) {
                            c.series = b, c.key = a.key
                        })
                    }), u && b[0].values.map(function(a, c) {
                        var d = 0,
                            e = 0;
                        b.map(function(a, f) {
                            if (!b[f].nonStackable) {
                                var g = a.values[c];
                                g.size = Math.abs(g.y), g.y < 0 ? (g.y1 = e, e -= g.size) : (g.y1 = g.size + d, d += g.size)
                            }
                        })
                    });
                    var I = d && e ? [] : b.map(function(a, b) {
                        return a.values.map(function(a, c) {
                            return {
                                x: q(a, c),
                                y: r(a, c),
                                y0: a.y0,
                                y1: a.y1,
                                idx: b
                            }
                        })
                    });
                    m.domain(d || d3.merge(I).map(function(a) {
                        return a.x
                    })).rangeBands(f || [0, E], A), n.domain(e || d3.extent(d3.merge(I).map(function(a) {
                        var c = a.y;
                        return u && !b[a.idx].nonStackable && (c = a.y > 0 ? a.y1 : a.y1 + a.y), c
                    }).concat(s))).range(g || [F, 0]), m.domain()[0] === m.domain()[1] && m.domain(m.domain()[0] ? [m.domain()[0] - .01 * m.domain()[0], m.domain()[1] + .01 * m.domain()[1]] : [-1, 1]), n.domain()[0] === n.domain()[1] && n.domain(n.domain()[0] ? [n.domain()[0] + .01 * n.domain()[0], n.domain()[1] - .01 * n.domain()[1]] : [-1, 1]), h = h || m, i = i || n;
                    var J = p.selectAll("g.nv-wrap.nv-multibar").data([b]),
                        K = J.enter().append("g").attr("class", "nvd3 nv-wrap nv-multibar"),
                        L = K.append("defs"),
                        M = K.append("g"),
                        N = J.select("g");
                    M.append("g").attr("class", "nv-groups"), J.attr("transform", "translate(" + j.left + "," + j.top + ")"), L.append("clipPath").attr("id", "nv-edge-clip-" + o).append("rect"), J.select("#nv-edge-clip-" + o + " rect").attr("width", E).attr("height", F), N.attr("clip-path", t ? "url(#nv-edge-clip-" + o + ")" : "");
                    var O = J.select(".nv-groups").selectAll(".nv-group").data(function(a) {
                        return a
                    }, function(a, b) {
                        return b
                    });
                    O.enter().append("g").style("stroke-opacity", 1e-6).style("fill-opacity", 1e-6);
                    var P = C.transition(O.exit().selectAll("rect.nv-bar"), "multibarExit", Math.min(100, z)).attr("y", function(a) {
                        var c = i(0) || 0;
                        return u && b[a.series] && !b[a.series].nonStackable && (c = i(a.y0)), c
                    }).attr("height", 0).remove();
                    P.delay && P.delay(function(a, b) {
                        var c = b * (z / (D + 1)) - b;
                        return c
                    }), O.attr("class", function(a, b) {
                        return "nv-group nv-series-" + b
                    }).classed("hover", function(a) {
                        return a.hover
                    }).style("fill", function(a, b) {
                        return w(a, b)
                    }).style("stroke", function(a, b) {
                        return w(a, b)
                    }), O.style("stroke-opacity", 1).style("fill-opacity", .75);
                    var Q = O.selectAll("rect.nv-bar").data(function(a) {
                        return x && !b.length ? x.values : a.values
                    });
                    Q.exit().remove();
                    Q.enter().append("rect").attr("class", function(a, b) {
                        return r(a, b) < 0 ? "nv-bar negative" : "nv-bar positive"
                    }).attr("x", function(a, c, d) {
                        return u && !b[d].nonStackable ? 0 : d * m.rangeBand() / b.length
                    }).attr("y", function(a, c, d) {
                        return i(u && !b[d].nonStackable ? a.y0 : 0) || 0
                    }).attr("height", 0).attr("width", function(a, c, d) {
                        return m.rangeBand() / (u && !b[d].nonStackable ? 1 : b.length)
                    }).attr("transform", function(a, b) {
                        return "translate(" + m(q(a, b)) + ",0)"
                    });
                    Q.style("fill", function(a, b, c) {
                        return w(a, c, b)
                    }).style("stroke", function(a, b, c) {
                        return w(a, c, b)
                    }).on("mouseover", function(a, b) {
                        d3.select(this).classed("hover", !0), B.elementMouseover({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        })
                    }).on("mouseout", function(a, b) {
                        d3.select(this).classed("hover", !1), B.elementMouseout({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        })
                    }).on("mousemove", function(a, b) {
                        B.elementMousemove({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        })
                    }).on("click", function(a, b) {
                        B.elementClick({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        }), d3.event.stopPropagation()
                    }).on("dblclick", function(a, b) {
                        B.elementDblClick({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        }), d3.event.stopPropagation()
                    }), Q.attr("class", function(a, b) {
                        return r(a, b) < 0 ? "nv-bar negative" : "nv-bar positive"
                    }).attr("transform", function(a, b) {
                        return "translate(" + m(q(a, b)) + ",0)"
                    }), y && (c || (c = b.map(function() {
                        return !0
                    })), Q.style("fill", function(a, b, d) {
                        return d3.rgb(y(a, b)).darker(c.map(function(a, b) {
                            return b
                        }).filter(function(a, b) {
                            return !c[b]
                        })[d]).toString()
                    }).style("stroke", function(a, b, d) {
                        return d3.rgb(y(a, b)).darker(c.map(function(a, b) {
                            return b
                        }).filter(function(a, b) {
                            return !c[b]
                        })[d]).toString()
                    }));
                    var R = Q.watchTransition(C, "multibar", Math.min(250, z)).delay(function(a, c) {
                        return c * z / b[0].values.length
                    });
                    u ? R.attr("y", function(a, c, d) {
                        var e = 0;
                        return e = b[d].nonStackable ? r(a, c) < 0 ? n(0) : n(0) - n(r(a, c)) < -1 ? n(0) - 1 : n(r(a, c)) || 0 : n(a.y1)
                    }).attr("height", function(a, c, d) {
                        return b[d].nonStackable ? Math.max(Math.abs(n(r(a, c)) - n(0)), 1) || 0 : Math.max(Math.abs(n(a.y + a.y0) - n(a.y0)), 1)
                    }).attr("x", function(a, c, d) {
                        var e = 0;
                        return b[d].nonStackable && (e = a.series * m.rangeBand() / b.length, b.length !== G && (e = b[d].nonStackableSeries * m.rangeBand() / (2 * G))), e
                    }).attr("width", function(a, c, d) {
                        if (b[d].nonStackable) {
                            var e = m.rangeBand() / G;
                            return b.length !== G && (e = m.rangeBand() / (2 * G)), e
                        }
                        return m.rangeBand()
                    }) : R.attr("x", function(a) {
                        return a.series * m.rangeBand() / b.length
                    }).attr("width", m.rangeBand() / b.length).attr("y", function(a, b) {
                        return r(a, b) < 0 ? n(0) : n(0) - n(r(a, b)) < 1 ? n(0) - 1 : n(r(a, b)) || 0
                    }).attr("height", function(a, b) {
                        return Math.max(Math.abs(n(r(a, b)) - n(0)), 1) || 0
                    }), h = m.copy(), i = n.copy(), b[0] && b[0].values && (D = b[0].values.length)
                }), C.renderEnd("multibar immediate"), b
            }
            var c, d, e, f, g, h, i, j = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                k = 960,
                l = 500,
                m = d3.scale.ordinal(),
                n = d3.scale.linear(),
                o = Math.floor(1e4 * Math.random()),
                p = null,
                q = function(a) {
                    return a.x
                },
                r = function(a) {
                    return a.y
                },
                s = [0],
                t = !0,
                u = !1,
                v = "zero",
                w = a.utils.defaultColor(),
                x = !1,
                y = null,
                z = 500,
                A = .1,
                B = d3.dispatch("chartClick", "elementClick", "elementDblClick", "elementMouseover", "elementMouseout", "elementMousemove", "renderEnd"),
                C = a.utils.renderWatch(B, z),
                D = 0;
            return b.dispatch = B, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                height: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                x: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                y: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a
                    }
                },
                xScale: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                yScale: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                xDomain: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a
                    }
                },
                yDomain: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e = a
                    }
                },
                xRange: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f = a
                    }
                },
                yRange: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g = a
                    }
                },
                forceY: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a
                    }
                },
                stacked: {
                    get: function() {
                        return u
                    },
                    set: function(a) {
                        u = a
                    }
                },
                stackOffset: {
                    get: function() {
                        return v
                    },
                    set: function(a) {
                        v = a
                    }
                },
                clipEdge: {
                    get: function() {
                        return t
                    },
                    set: function(a) {
                        t = a
                    }
                },
                disabled: {
                    get: function() {
                        return c
                    },
                    set: function(a) {
                        c = a
                    }
                },
                id: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                hideable: {
                    get: function() {
                        return x
                    },
                    set: function(a) {
                        x = a
                    }
                },
                groupSpacing: {
                    get: function() {
                        return A
                    },
                    set: function(a) {
                        A = a
                    }
                },
                margin: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j.top = void 0 !== a.top ? a.top : j.top, j.right = void 0 !== a.right ? a.right : j.right, j.bottom = void 0 !== a.bottom ? a.bottom : j.bottom, j.left = void 0 !== a.left ? a.left : j.left
                    }
                },
                duration: {
                    get: function() {
                        return z
                    },
                    set: function(a) {
                        z = a, C.reset(z)
                    }
                },
                color: {
                    get: function() {
                        return w
                    },
                    set: function(b) {
                        w = a.utils.getColor(b)
                    }
                },
                barColor: {
                    get: function() {
                        return y
                    },
                    set: function(b) {
                        y = b ? a.utils.getColor(b) : null
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.multiBarChart = function() {
            "use strict";

            function b(j) {
                return D.reset(), D.models(e), r && D.models(f), s && D.models(g), j.each(function(j) {
                    var z = d3.select(this);
                    a.utils.initSVG(z);
                    var D = a.utils.availableWidth(l, z, k),
                        H = a.utils.availableHeight(m, z, k);
                    if (b.update = function() {
                            0 === C ? z.call(b) : z.transition().duration(C).call(b)
                        }, b.container = this, x.setter(G(j), b.update).getter(F(j)).update(), x.disabled = j.map(function(a) {
                            return !!a.disabled
                        }), !y) {
                        var I;
                        y = {};
                        for (I in x) y[I] = x[I] instanceof Array ? x[I].slice(0) : x[I]
                    }
                    if (!(j && j.length && j.filter(function(a) {
                            return a.values.length
                        }).length)) return a.utils.noData(b, z), b;
                    z.selectAll(".nv-noData").remove(), c = e.xScale(), d = e.yScale();
                    var J = z.selectAll("g.nv-wrap.nv-multiBarWithLegend").data([j]),
                        K = J.enter().append("g").attr("class", "nvd3 nv-wrap nv-multiBarWithLegend").append("g"),
                        L = J.select("g");
                    if (K.append("g").attr("class", "nv-x nv-axis"), K.append("g").attr("class", "nv-y nv-axis"), K.append("g").attr("class", "nv-barsWrap"), K.append("g").attr("class", "nv-legendWrap"), K.append("g").attr("class", "nv-controlsWrap"), q && (h.width(D - B()), L.select(".nv-legendWrap").datum(j).call(h), k.top != h.height() && (k.top = h.height(), H = a.utils.availableHeight(m, z, k)), L.select(".nv-legendWrap").attr("transform", "translate(" + B() + "," + -k.top + ")")), o) {
                        var M = [{
                            key: p.grouped || "Grouped",
                            disabled: e.stacked()
                        }, {
                            key: p.stacked || "Stacked",
                            disabled: !e.stacked()
                        }];
                        i.width(B()).color(["#444", "#444", "#444"]), L.select(".nv-controlsWrap").datum(M).attr("transform", "translate(0," + -k.top + ")").call(i)
                    }
                    J.attr("transform", "translate(" + k.left + "," + k.top + ")"), t && L.select(".nv-y.nv-axis").attr("transform", "translate(" + D + ",0)"), e.disabled(j.map(function(a) {
                        return a.disabled
                    })).width(D).height(H).color(j.map(function(a, b) {
                        return a.color || n(a, b)
                    }).filter(function(a, b) {
                        return !j[b].disabled
                    }));
                    var N = L.select(".nv-barsWrap").datum(j.filter(function(a) {
                        return !a.disabled
                    }));
                    if (N.call(e), r) {
                        f.scale(c)._ticks(a.utils.calcTicksX(D / 100, j)).tickSize(-H, 0), L.select(".nv-x.nv-axis").attr("transform", "translate(0," + d.range()[0] + ")"), L.select(".nv-x.nv-axis").call(f);
                        var O = L.select(".nv-x.nv-axis > g").selectAll("g");
                        if (O.selectAll("line, text").style("opacity", 1), v) {
                            var P = function(a, b) {
                                    return "translate(" + a + "," + b + ")"
                                },
                                Q = 5,
                                R = 17;
                            O.selectAll("text").attr("transform", function(a, b, c) {
                                return P(0, c % 2 == 0 ? Q : R)
                            });
                            var S = d3.selectAll(".nv-x.nv-axis .nv-wrap g g text")[0].length;
                            L.selectAll(".nv-x.nv-axis .nv-axisMaxMin text").attr("transform", function(a, b) {
                                return P(0, 0 === b || S % 2 !== 0 ? R : Q)
                            })
                        }
                        u && O.filter(function(a, b) {
                            return b % Math.ceil(j[0].values.length / (D / 100)) !== 0
                        }).selectAll("text, line").style("opacity", 0), w && O.selectAll(".tick text").attr("transform", "rotate(" + w + " 0,0)").style("text-anchor", w > 0 ? "start" : "end"), L.select(".nv-x.nv-axis").selectAll("g.nv-axisMaxMin text").style("opacity", 1)
                    }
                    s && (g.scale(d)._ticks(a.utils.calcTicksY(H / 36, j)).tickSize(-D, 0), L.select(".nv-y.nv-axis").call(g)), h.dispatch.on("stateChange", function(a) {
                        for (var c in a) x[c] = a[c];
                        A.stateChange(x), b.update()
                    }), i.dispatch.on("legendClick", function(a) {
                        if (a.disabled) {
                            switch (M = M.map(function(a) {
                                return a.disabled = !0, a
                            }), a.disabled = !1, a.key) {
                                case "Grouped":
                                case p.grouped:
                                    e.stacked(!1);
                                    break;
                                case "Stacked":
                                case p.stacked:
                                    e.stacked(!0)
                            }
                            x.stacked = e.stacked(), A.stateChange(x), b.update()
                        }
                    }), A.on("changeState", function(a) {
                        "undefined" != typeof a.disabled && (j.forEach(function(b, c) {
                            b.disabled = a.disabled[c]
                        }), x.disabled = a.disabled), "undefined" != typeof a.stacked && (e.stacked(a.stacked), x.stacked = a.stacked, E = a.stacked), b.update()
                    })
                }), D.renderEnd("multibarchart immediate"), b
            }
            var c, d, e = a.models.multiBar(),
                f = a.models.axis(),
                g = a.models.axis(),
                h = a.models.legend(),
                i = a.models.legend(),
                j = a.models.tooltip(),
                k = {
                    top: 30,
                    right: 20,
                    bottom: 50,
                    left: 60
                },
                l = null,
                m = null,
                n = a.utils.defaultColor(),
                o = !0,
                p = {},
                q = !0,
                r = !0,
                s = !0,
                t = !1,
                u = !0,
                v = !1,
                w = 0,
                x = a.utils.state(),
                y = null,
                z = null,
                A = d3.dispatch("stateChange", "changeState", "renderEnd"),
                B = function() {
                    return o ? 180 : 0
                },
                C = 250;
            x.stacked = !1, e.stacked(!1), f.orient("bottom").tickPadding(7).showMaxMin(!1).tickFormat(function(a) {
                return a
            }), g.orient(t ? "right" : "left").tickFormat(d3.format(",.1f")), j.duration(0).valueFormatter(function(a, b) {
                return g.tickFormat()(a, b)
            }).headerFormatter(function(a, b) {
                return f.tickFormat()(a, b)
            }), i.updateState(!1);
            var D = a.utils.renderWatch(A),
                E = !1,
                F = function(a) {
                    return function() {
                        return {
                            active: a.map(function(a) {
                                return !a.disabled
                            }),
                            stacked: E
                        }
                    }
                },
                G = function(a) {
                    return function(b) {
                        void 0 !== b.stacked && (E = b.stacked), void 0 !== b.active && a.forEach(function(a, c) {
                            a.disabled = !b.active[c]
                        })
                    }
                };
            return e.dispatch.on("elementMouseover.tooltip", function(a) {
                a.value = b.x()(a.data), a.series = {
                    key: a.data.key,
                    value: b.y()(a.data),
                    color: a.color
                }, j.data(a).hidden(!1)
            }), e.dispatch.on("elementMouseout.tooltip", function() {
                j.hidden(!0)
            }), e.dispatch.on("elementMousemove.tooltip", function() {
                j.position({
                    top: d3.event.pageY,
                    left: d3.event.pageX
                })()
            }), b.dispatch = A, b.multibar = e, b.legend = h, b.controls = i, b.xAxis = f, b.yAxis = g, b.state = x, b.tooltip = j, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                height: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                showLegend: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                showControls: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                controlLabels: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                showXAxis: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a
                    }
                },
                showYAxis: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a
                    }
                },
                defaultState: {
                    get: function() {
                        return y
                    },
                    set: function(a) {
                        y = a
                    }
                },
                noData: {
                    get: function() {
                        return z
                    },
                    set: function(a) {
                        z = a
                    }
                },
                reduceXTicks: {
                    get: function() {
                        return u
                    },
                    set: function(a) {
                        u = a
                    }
                },
                rotateLabels: {
                    get: function() {
                        return w
                    },
                    set: function(a) {
                        w = a
                    }
                },
                staggerLabels: {
                    get: function() {
                        return v
                    },
                    set: function(a) {
                        v = a
                    }
                },
                tooltips: {
                    get: function() {
                        return j.enabled()
                    },
                    set: function(b) {
                        a.deprecated("tooltips", "use chart.tooltip.enabled() instead"), j.enabled(!!b)
                    }
                },
                tooltipContent: {
                    get: function() {
                        return j.contentGenerator()
                    },
                    set: function(b) {
                        a.deprecated("tooltipContent", "use chart.tooltip.contentGenerator() instead"), j.contentGenerator(b)
                    }
                },
                margin: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k.top = void 0 !== a.top ? a.top : k.top, k.right = void 0 !== a.right ? a.right : k.right, k.bottom = void 0 !== a.bottom ? a.bottom : k.bottom, k.left = void 0 !== a.left ? a.left : k.left
                    }
                },
                duration: {
                    get: function() {
                        return C
                    },
                    set: function(a) {
                        C = a, e.duration(C), f.duration(C), g.duration(C), D.reset(C)
                    }
                },
                color: {
                    get: function() {
                        return n
                    },
                    set: function(b) {
                        n = a.utils.getColor(b), h.color(n)
                    }
                },
                rightAlignYAxis: {
                    get: function() {
                        return t
                    },
                    set: function(a) {
                        t = a, g.orient(t ? "right" : "left")
                    }
                },
                barColor: {
                    get: function() {
                        return e.barColor
                    },
                    set: function(a) {
                        e.barColor(a), h.color(function(a, b) {
                            return d3.rgb("#ccc").darker(1.5 * b).toString()
                        })
                    }
                }
            }), a.utils.inheritOptions(b, e), a.utils.initOptions(b), b
        }, a.models.multiBarHorizontal = function() {
            "use strict";

            function b(m) {
                return E.reset(), m.each(function(b) {
                    var m = k - j.left - j.right,
                        C = l - j.top - j.bottom;
                    n = d3.select(this), a.utils.initSVG(n), w && (b = d3.layout.stack().offset("zero").values(function(a) {
                        return a.values
                    }).y(r)(b)), b.forEach(function(a, b) {
                        a.values.forEach(function(c) {
                            c.series = b, c.key = a.key
                        })
                    }), w && b[0].values.map(function(a, c) {
                        var d = 0,
                            e = 0;
                        b.map(function(a) {
                            var b = a.values[c];
                            b.size = Math.abs(b.y), b.y < 0 ? (b.y1 = e - b.size, e -= b.size) : (b.y1 = d, d += b.size)
                        })
                    });
                    var F = d && e ? [] : b.map(function(a) {
                        return a.values.map(function(a, b) {
                            return {
                                x: q(a, b),
                                y: r(a, b),
                                y0: a.y0,
                                y1: a.y1
                            }
                        })
                    });
                    o.domain(d || d3.merge(F).map(function(a) {
                        return a.x
                    })).rangeBands(f || [0, C], A), p.domain(e || d3.extent(d3.merge(F).map(function(a) {
                        return w ? a.y > 0 ? a.y1 + a.y : a.y1 : a.y
                    }).concat(t))), p.range(x && !w ? g || [p.domain()[0] < 0 ? z : 0, m - (p.domain()[1] > 0 ? z : 0)] : g || [0, m]), h = h || o, i = i || d3.scale.linear().domain(p.domain()).range([p(0), p(0)]); {
                        var G = d3.select(this).selectAll("g.nv-wrap.nv-multibarHorizontal").data([b]),
                            H = G.enter().append("g").attr("class", "nvd3 nv-wrap nv-multibarHorizontal"),
                            I = (H.append("defs"), H.append("g"));
                        G.select("g")
                    }
                    I.append("g").attr("class", "nv-groups"), G.attr("transform", "translate(" + j.left + "," + j.top + ")");
                    var J = G.select(".nv-groups").selectAll(".nv-group").data(function(a) {
                        return a
                    }, function(a, b) {
                        return b
                    });
                    J.enter().append("g").style("stroke-opacity", 1e-6).style("fill-opacity", 1e-6), J.exit().watchTransition(E, "multibarhorizontal: exit groups").style("stroke-opacity", 1e-6).style("fill-opacity", 1e-6).remove(), J.attr("class", function(a, b) {
                        return "nv-group nv-series-" + b
                    }).classed("hover", function(a) {
                        return a.hover
                    }).style("fill", function(a, b) {
                        return u(a, b)
                    }).style("stroke", function(a, b) {
                        return u(a, b)
                    }), J.watchTransition(E, "multibarhorizontal: groups").style("stroke-opacity", 1).style("fill-opacity", .75);
                    var K = J.selectAll("g.nv-bar").data(function(a) {
                        return a.values
                    });
                    K.exit().remove();
                    var L = K.enter().append("g").attr("transform", function(a, c, d) {
                        return "translate(" + i(w ? a.y0 : 0) + "," + (w ? 0 : d * o.rangeBand() / b.length + o(q(a, c))) + ")"
                    });
                    L.append("rect").attr("width", 0).attr("height", o.rangeBand() / (w ? 1 : b.length)), K.on("mouseover", function(a, b) {
                        d3.select(this).classed("hover", !0), D.elementMouseover({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        })
                    }).on("mouseout", function(a, b) {
                        d3.select(this).classed("hover", !1), D.elementMouseout({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        })
                    }).on("mouseout", function(a, b) {
                        D.elementMouseout({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        })
                    }).on("mousemove", function(a, b) {
                        D.elementMousemove({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        })
                    }).on("click", function(a, b) {
                        D.elementClick({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        }), d3.event.stopPropagation()
                    }).on("dblclick", function(a, b) {
                        D.elementDblClick({
                            data: a,
                            index: b,
                            color: d3.select(this).style("fill")
                        }), d3.event.stopPropagation()
                    }), s(b[0], 0) && (L.append("polyline"), K.select("polyline").attr("fill", "none").attr("points", function(a, c) {
                        var d = s(a, c),
                            e = .8 * o.rangeBand() / (2 * (w ? 1 : b.length));
                        d = d.length ? d : [-Math.abs(d), Math.abs(d)], d = d.map(function(a) {
                            return p(a) - p(0)
                        });
                        var f = [
                            [d[0], -e],
                            [d[0], e],
                            [d[0], 0],
                            [d[1], 0],
                            [d[1], -e],
                            [d[1], e]
                        ];
                        return f.map(function(a) {
                            return a.join(",")
                        }).join(" ")
                    }).attr("transform", function(a, c) {
                        var d = o.rangeBand() / (2 * (w ? 1 : b.length));
                        return "translate(" + (r(a, c) < 0 ? 0 : p(r(a, c)) - p(0)) + ", " + d + ")"
                    })), L.append("text"), x && !w ? (K.select("text").attr("text-anchor", function(a, b) {
                        return r(a, b) < 0 ? "end" : "start"
                    }).attr("y", o.rangeBand() / (2 * b.length)).attr("dy", ".32em").text(function(a, b) {
                        var c = B(r(a, b)),
                            d = s(a, b);
                        return void 0 === d ? c : d.length ? c + "+" + B(Math.abs(d[1])) + "-" + B(Math.abs(d[0])) : c + "±" + B(Math.abs(d))
                    }), K.watchTransition(E, "multibarhorizontal: bars").select("text").attr("x", function(a, b) {
                        return r(a, b) < 0 ? -4 : p(r(a, b)) - p(0) + 4
                    })) : K.selectAll("text").text(""), y && !w ? (L.append("text").classed("nv-bar-label", !0), K.select("text.nv-bar-label").attr("text-anchor", function(a, b) {
                        return r(a, b) < 0 ? "start" : "end"
                    }).attr("y", o.rangeBand() / (2 * b.length)).attr("dy", ".32em").text(function(a, b) {
                        return q(a, b)
                    }), K.watchTransition(E, "multibarhorizontal: bars").select("text.nv-bar-label").attr("x", function(a, b) {
                        return r(a, b) < 0 ? p(0) - p(r(a, b)) + 4 : -4
                    })) : K.selectAll("text.nv-bar-label").text(""), K.attr("class", function(a, b) {
                        return r(a, b) < 0 ? "nv-bar negative" : "nv-bar positive"
                    }), v && (c || (c = b.map(function() {
                        return !0
                    })), K.style("fill", function(a, b, d) {
                        return d3.rgb(v(a, b)).darker(c.map(function(a, b) {
                            return b
                        }).filter(function(a, b) {
                            return !c[b]
                        })[d]).toString()
                    }).style("stroke", function(a, b, d) {
                        return d3.rgb(v(a, b)).darker(c.map(function(a, b) {
                            return b
                        }).filter(function(a, b) {
                            return !c[b]
                        })[d]).toString()
                    })), w ? K.watchTransition(E, "multibarhorizontal: bars").attr("transform", function(a, b) {
                        return "translate(" + p(a.y1) + "," + o(q(a, b)) + ")"
                    }).select("rect").attr("width", function(a, b) {
                        return Math.abs(p(r(a, b) + a.y0) - p(a.y0))
                    }).attr("height", o.rangeBand()) : K.watchTransition(E, "multibarhorizontal: bars").attr("transform", function(a, c) {
                        return "translate(" + p(r(a, c) < 0 ? r(a, c) : 0) + "," + (a.series * o.rangeBand() / b.length + o(q(a, c))) + ")"
                    }).select("rect").attr("height", o.rangeBand() / b.length).attr("width", function(a, b) {
                        return Math.max(Math.abs(p(r(a, b)) - p(0)), 1)
                    }), h = o.copy(), i = p.copy()
                }), E.renderEnd("multibarHorizontal immediate"), b
            }
            var c, d, e, f, g, h, i, j = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                k = 960,
                l = 500,
                m = Math.floor(1e4 * Math.random()),
                n = null,
                o = d3.scale.ordinal(),
                p = d3.scale.linear(),
                q = function(a) {
                    return a.x
                },
                r = function(a) {
                    return a.y
                },
                s = function(a) {
                    return a.yErr
                },
                t = [0],
                u = a.utils.defaultColor(),
                v = null,
                w = !1,
                x = !1,
                y = !1,
                z = 60,
                A = .1,
                B = d3.format(",.2f"),
                C = 250,
                D = d3.dispatch("chartClick", "elementClick", "elementDblClick", "elementMouseover", "elementMouseout", "elementMousemove", "renderEnd"),
                E = a.utils.renderWatch(D, C);
            return b.dispatch = D, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                height: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                x: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                y: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a
                    }
                },
                yErr: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a
                    }
                },
                xScale: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                yScale: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                xDomain: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a
                    }
                },
                yDomain: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e = a
                    }
                },
                xRange: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f = a
                    }
                },
                yRange: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g = a
                    }
                },
                forceY: {
                    get: function() {
                        return t
                    },
                    set: function(a) {
                        t = a
                    }
                },
                stacked: {
                    get: function() {
                        return w
                    },
                    set: function(a) {
                        w = a
                    }
                },
                showValues: {
                    get: function() {
                        return x
                    },
                    set: function(a) {
                        x = a
                    }
                },
                disabled: {
                    get: function() {
                        return c
                    },
                    set: function(a) {
                        c = a
                    }
                },
                id: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                valueFormat: {
                    get: function() {
                        return B
                    },
                    set: function(a) {
                        B = a
                    }
                },
                valuePadding: {
                    get: function() {
                        return z
                    },
                    set: function(a) {
                        z = a
                    }
                },
                groupSpacing: {
                    get: function() {
                        return A
                    },
                    set: function(a) {
                        A = a
                    }
                },
                margin: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j.top = void 0 !== a.top ? a.top : j.top, j.right = void 0 !== a.right ? a.right : j.right, j.bottom = void 0 !== a.bottom ? a.bottom : j.bottom, j.left = void 0 !== a.left ? a.left : j.left
                    }
                },
                duration: {
                    get: function() {
                        return C
                    },
                    set: function(a) {
                        C = a, E.reset(C)
                    }
                },
                color: {
                    get: function() {
                        return u
                    },
                    set: function(b) {
                        u = a.utils.getColor(b)
                    }
                },
                barColor: {
                    get: function() {
                        return v
                    },
                    set: function(b) {
                        v = b ? a.utils.getColor(b) : null
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.multiBarHorizontalChart = function() {
            "use strict";

            function b(j) {
                return C.reset(), C.models(e), r && C.models(f), s && C.models(g), j.each(function(j) {
                    var w = d3.select(this);
                    a.utils.initSVG(w);
                    var C = a.utils.availableWidth(l, w, k),
                        D = a.utils.availableHeight(m, w, k);
                    if (b.update = function() {
                            w.transition().duration(z).call(b)
                        }, b.container = this, t = e.stacked(), u.setter(B(j), b.update).getter(A(j)).update(), u.disabled = j.map(function(a) {
                            return !!a.disabled
                        }), !v) {
                        var E;
                        v = {};
                        for (E in u) v[E] = u[E] instanceof Array ? u[E].slice(0) : u[E]
                    }
                    if (!(j && j.length && j.filter(function(a) {
                            return a.values.length
                        }).length)) return a.utils.noData(b, w), b;
                    w.selectAll(".nv-noData").remove(), c = e.xScale(), d = e.yScale();
                    var F = w.selectAll("g.nv-wrap.nv-multiBarHorizontalChart").data([j]),
                        G = F.enter().append("g").attr("class", "nvd3 nv-wrap nv-multiBarHorizontalChart").append("g"),
                        H = F.select("g");
                    if (G.append("g").attr("class", "nv-x nv-axis"), G.append("g").attr("class", "nv-y nv-axis").append("g").attr("class", "nv-zeroLine").append("line"), G.append("g").attr("class", "nv-barsWrap"), G.append("g").attr("class", "nv-legendWrap"), G.append("g").attr("class", "nv-controlsWrap"), q && (h.width(C - y()), H.select(".nv-legendWrap").datum(j).call(h), k.top != h.height() && (k.top = h.height(), D = a.utils.availableHeight(m, w, k)), H.select(".nv-legendWrap").attr("transform", "translate(" + y() + "," + -k.top + ")")), o) {
                        var I = [{
                            key: p.grouped || "Grouped",
                            disabled: e.stacked()
                        }, {
                            key: p.stacked || "Stacked",
                            disabled: !e.stacked()
                        }];
                        i.width(y()).color(["#444", "#444", "#444"]), H.select(".nv-controlsWrap").datum(I).attr("transform", "translate(0," + -k.top + ")").call(i)
                    }
                    F.attr("transform", "translate(" + k.left + "," + k.top + ")"), e.disabled(j.map(function(a) {
                        return a.disabled
                    })).width(C).height(D).color(j.map(function(a, b) {
                        return a.color || n(a, b)
                    }).filter(function(a, b) {
                        return !j[b].disabled
                    }));
                    var J = H.select(".nv-barsWrap").datum(j.filter(function(a) {
                        return !a.disabled
                    }));
                    if (J.transition().call(e), r) {
                        f.scale(c)._ticks(a.utils.calcTicksY(D / 24, j)).tickSize(-C, 0), H.select(".nv-x.nv-axis").call(f);
                        var K = H.select(".nv-x.nv-axis").selectAll("g");
                        K.selectAll("line, text")
                    }
                    s && (g.scale(d)._ticks(a.utils.calcTicksX(C / 100, j)).tickSize(-D, 0), H.select(".nv-y.nv-axis").attr("transform", "translate(0," + D + ")"), H.select(".nv-y.nv-axis").call(g)), H.select(".nv-zeroLine line").attr("x1", d(0)).attr("x2", d(0)).attr("y1", 0).attr("y2", -D), h.dispatch.on("stateChange", function(a) {
                        for (var c in a) u[c] = a[c];
                        x.stateChange(u), b.update()
                    }), i.dispatch.on("legendClick", function(a) {
                        if (a.disabled) {
                            switch (I = I.map(function(a) {
                                return a.disabled = !0, a
                            }), a.disabled = !1, a.key) {
                                case "Grouped":
                                    e.stacked(!1);
                                    break;
                                case "Stacked":
                                    e.stacked(!0)
                            }
                            u.stacked = e.stacked(), x.stateChange(u), t = e.stacked(), b.update()
                        }
                    }), x.on("changeState", function(a) {
                        "undefined" != typeof a.disabled && (j.forEach(function(b, c) {
                            b.disabled = a.disabled[c]
                        }), u.disabled = a.disabled), "undefined" != typeof a.stacked && (e.stacked(a.stacked), u.stacked = a.stacked, t = a.stacked), b.update()
                    })
                }), C.renderEnd("multibar horizontal chart immediate"), b
            }
            var c, d, e = a.models.multiBarHorizontal(),
                f = a.models.axis(),
                g = a.models.axis(),
                h = a.models.legend().height(30),
                i = a.models.legend().height(30),
                j = a.models.tooltip(),
                k = {
                    top: 30,
                    right: 20,
                    bottom: 50,
                    left: 60
                },
                l = null,
                m = null,
                n = a.utils.defaultColor(),
                o = !0,
                p = {},
                q = !0,
                r = !0,
                s = !0,
                t = !1,
                u = a.utils.state(),
                v = null,
                w = null,
                x = d3.dispatch("stateChange", "changeState", "renderEnd"),
                y = function() {
                    return o ? 180 : 0
                },
                z = 250;
            u.stacked = !1, e.stacked(t), f.orient("left").tickPadding(5).showMaxMin(!1).tickFormat(function(a) {
                return a
            }), g.orient("bottom").tickFormat(d3.format(",.1f")), j.duration(0).valueFormatter(function(a, b) {
                return g.tickFormat()(a, b)
            }).headerFormatter(function(a, b) {
                return f.tickFormat()(a, b)
            }), i.updateState(!1);
            var A = function(a) {
                    return function() {
                        return {
                            active: a.map(function(a) {
                                return !a.disabled
                            }),
                            stacked: t
                        }
                    }
                },
                B = function(a) {
                    return function(b) {
                        void 0 !== b.stacked && (t = b.stacked), void 0 !== b.active && a.forEach(function(a, c) {
                            a.disabled = !b.active[c]
                        })
                    }
                },
                C = a.utils.renderWatch(x, z);
            return e.dispatch.on("elementMouseover.tooltip", function(a) {
                a.value = b.x()(a.data), a.series = {
                    key: a.data.key,
                    value: b.y()(a.data),
                    color: a.color
                }, j.data(a).hidden(!1)
            }), e.dispatch.on("elementMouseout.tooltip", function() {
                j.hidden(!0)
            }), e.dispatch.on("elementMousemove.tooltip", function() {
                j.position({
                    top: d3.event.pageY,
                    left: d3.event.pageX
                })()
            }), b.dispatch = x, b.multibar = e, b.legend = h, b.controls = i, b.xAxis = f, b.yAxis = g, b.state = u, b.tooltip = j, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                height: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                showLegend: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                showControls: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                controlLabels: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                showXAxis: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a
                    }
                },
                showYAxis: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a
                    }
                },
                defaultState: {
                    get: function() {
                        return v
                    },
                    set: function(a) {
                        v = a
                    }
                },
                noData: {
                    get: function() {
                        return w
                    },
                    set: function(a) {
                        w = a
                    }
                },
                tooltips: {
                    get: function() {
                        return j.enabled()
                    },
                    set: function(b) {
                        a.deprecated("tooltips", "use chart.tooltip.enabled() instead"), j.enabled(!!b)
                    }
                },
                tooltipContent: {
                    get: function() {
                        return j.contentGenerator()
                    },
                    set: function(b) {
                        a.deprecated("tooltipContent", "use chart.tooltip.contentGenerator() instead"), j.contentGenerator(b)
                    }
                },
                margin: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k.top = void 0 !== a.top ? a.top : k.top, k.right = void 0 !== a.right ? a.right : k.right, k.bottom = void 0 !== a.bottom ? a.bottom : k.bottom, k.left = void 0 !== a.left ? a.left : k.left
                    }
                },
                duration: {
                    get: function() {
                        return z
                    },
                    set: function(a) {
                        z = a, C.reset(z), e.duration(z), f.duration(z), g.duration(z)
                    }
                },
                color: {
                    get: function() {
                        return n
                    },
                    set: function(b) {
                        n = a.utils.getColor(b), h.color(n)
                    }
                },
                barColor: {
                    get: function() {
                        return e.barColor
                    },
                    set: function(a) {
                        e.barColor(a), h.color(function(a, b) {
                            return d3.rgb("#ccc").darker(1.5 * b).toString()
                        })
                    }
                }
            }), a.utils.inheritOptions(b, e), a.utils.initOptions(b), b
        }, a.models.multiChart = function() {
            "use strict";

            function b(j) {
                return j.each(function(j) {
                    function k(a) {
                        var b = 2 === j[a.seriesIndex].yAxis ? z : y;
                        a.value = a.point.x, a.series = {
                            value: a.point.y,
                            color: a.point.color
                        }, B.duration(100).valueFormatter(function(a, c) {
                            return b.tickFormat()(a, c)
                        }).data(a).position(a.pos).hidden(!1)
                    }

                    function l(a) {
                        var b = 2 === j[a.seriesIndex].yAxis ? z : y;
                        a.point.x = v.x()(a.point), a.point.y = v.y()(a.point), B.duration(100).valueFormatter(function(a, c) {
                            return b.tickFormat()(a, c)
                        }).data(a).position(a.pos).hidden(!1)
                    }

                    function n(a) {
                        var b = 2 === j[a.data.series].yAxis ? z : y;
                        a.value = t.x()(a.data), a.series = {
                            value: t.y()(a.data),
                            color: a.color
                        }, B.duration(0).valueFormatter(function(a, c) {
                            return b.tickFormat()(a, c)
                        }).data(a).hidden(!1)
                    }
                    var C = d3.select(this);
                    a.utils.initSVG(C), b.update = function() {
                        C.transition().call(b)
                    }, b.container = this;
                    var D = a.utils.availableWidth(g, C, e),
                        E = a.utils.availableHeight(h, C, e),
                        F = j.filter(function(a) {
                            return "line" == a.type && 1 == a.yAxis
                        }),
                        G = j.filter(function(a) {
                            return "line" == a.type && 2 == a.yAxis
                        }),
                        H = j.filter(function(a) {
                            return "bar" == a.type && 1 == a.yAxis
                        }),
                        I = j.filter(function(a) {
                            return "bar" == a.type && 2 == a.yAxis
                        }),
                        J = j.filter(function(a) {
                            return "area" == a.type && 1 == a.yAxis
                        }),
                        K = j.filter(function(a) {
                            return "area" == a.type && 2 == a.yAxis
                        });
                    if (!(j && j.length && j.filter(function(a) {
                            return a.values.length
                        }).length)) return a.utils.noData(b, C), b;
                    C.selectAll(".nv-noData").remove();
                    var L = j.filter(function(a) {
                            return !a.disabled && 1 == a.yAxis
                        }).map(function(a) {
                            return a.values.map(function(a) {
                                return {
                                    x: a.x,
                                    y: a.y
                                }
                            })
                        }),
                        M = j.filter(function(a) {
                            return !a.disabled && 2 == a.yAxis
                        }).map(function(a) {
                            return a.values.map(function(a) {
                                return {
                                    x: a.x,
                                    y: a.y
                                }
                            })
                        });
                    o.domain(d3.extent(d3.merge(L.concat(M)), function(a) {
                        return a.x
                    })).range([0, D]);
                    var N = C.selectAll("g.wrap.multiChart").data([j]),
                        O = N.enter().append("g").attr("class", "wrap nvd3 multiChart").append("g");
                    O.append("g").attr("class", "nv-x nv-axis"), O.append("g").attr("class", "nv-y1 nv-axis"), O.append("g").attr("class", "nv-y2 nv-axis"), O.append("g").attr("class", "lines1Wrap"), O.append("g").attr("class", "lines2Wrap"), O.append("g").attr("class", "bars1Wrap"), O.append("g").attr("class", "bars2Wrap"), O.append("g").attr("class", "stack1Wrap"), O.append("g").attr("class", "stack2Wrap"), O.append("g").attr("class", "legendWrap");
                    var P = N.select("g"),
                        Q = j.map(function(a, b) {
                            return j[b].color || f(a, b)
                        });
                    if (i) {
                        var R = A.align() ? D / 2 : D,
                            S = A.align() ? R : 0;
                        A.width(R), A.color(Q), P.select(".legendWrap").datum(j.map(function(a) {
                            return a.originalKey = void 0 === a.originalKey ? a.key : a.originalKey, a.key = a.originalKey + (1 == a.yAxis ? "" : " (right axis)"), a
                        })).call(A), e.top != A.height() && (e.top = A.height(), E = a.utils.availableHeight(h, C, e)), P.select(".legendWrap").attr("transform", "translate(" + S + "," + -e.top + ")")
                    }
                    r.width(D).height(E).interpolate(m).color(Q.filter(function(a, b) {
                        return !j[b].disabled && 1 == j[b].yAxis && "line" == j[b].type
                    })), s.width(D).height(E).interpolate(m).color(Q.filter(function(a, b) {
                        return !j[b].disabled && 2 == j[b].yAxis && "line" == j[b].type
                    })), t.width(D).height(E).color(Q.filter(function(a, b) {
                        return !j[b].disabled && 1 == j[b].yAxis && "bar" == j[b].type
                    })), u.width(D).height(E).color(Q.filter(function(a, b) {
                        return !j[b].disabled && 2 == j[b].yAxis && "bar" == j[b].type
                    })), v.width(D).height(E).color(Q.filter(function(a, b) {
                        return !j[b].disabled && 1 == j[b].yAxis && "area" == j[b].type
                    })), w.width(D).height(E).color(Q.filter(function(a, b) {
                        return !j[b].disabled && 2 == j[b].yAxis && "area" == j[b].type
                    })), P.attr("transform", "translate(" + e.left + "," + e.top + ")");
                    var T = P.select(".lines1Wrap").datum(F.filter(function(a) {
                            return !a.disabled
                        })),
                        U = P.select(".bars1Wrap").datum(H.filter(function(a) {
                            return !a.disabled
                        })),
                        V = P.select(".stack1Wrap").datum(J.filter(function(a) {
                            return !a.disabled
                        })),
                        W = P.select(".lines2Wrap").datum(G.filter(function(a) {
                            return !a.disabled
                        })),
                        X = P.select(".bars2Wrap").datum(I.filter(function(a) {
                            return !a.disabled
                        })),
                        Y = P.select(".stack2Wrap").datum(K.filter(function(a) {
                            return !a.disabled
                        })),
                        Z = J.length ? J.map(function(a) {
                            return a.values
                        }).reduce(function(a, b) {
                            return a.map(function(a, c) {
                                return {
                                    x: a.x,
                                    y: a.y + b[c].y
                                }
                            })
                        }).concat([{
                            x: 0,
                            y: 0
                        }]) : [],
                        $ = K.length ? K.map(function(a) {
                            return a.values
                        }).reduce(function(a, b) {
                            return a.map(function(a, c) {
                                return {
                                    x: a.x,
                                    y: a.y + b[c].y
                                }
                            })
                        }).concat([{
                            x: 0,
                            y: 0
                        }]) : [];
                    p.domain(c || d3.extent(d3.merge(L).concat(Z), function(a) {
                        return a.y
                    })).range([0, E]), q.domain(d || d3.extent(d3.merge(M).concat($), function(a) {
                        return a.y
                    })).range([0, E]), r.yDomain(p.domain()), t.yDomain(p.domain()), v.yDomain(p.domain()), s.yDomain(q.domain()), u.yDomain(q.domain()), w.yDomain(q.domain()), J.length && d3.transition(V).call(v), K.length && d3.transition(Y).call(w), H.length && d3.transition(U).call(t), I.length && d3.transition(X).call(u), F.length && d3.transition(T).call(r), G.length && d3.transition(W).call(s), x._ticks(a.utils.calcTicksX(D / 100, j)).tickSize(-E, 0), P.select(".nv-x.nv-axis").attr("transform", "translate(0," + E + ")"), d3.transition(P.select(".nv-x.nv-axis")).call(x), y._ticks(a.utils.calcTicksY(E / 36, j)).tickSize(-D, 0), d3.transition(P.select(".nv-y1.nv-axis")).call(y), z._ticks(a.utils.calcTicksY(E / 36, j)).tickSize(-D, 0), d3.transition(P.select(".nv-y2.nv-axis")).call(z), P.select(".nv-y1.nv-axis").classed("nv-disabled", L.length ? !1 : !0).attr("transform", "translate(" + o.range()[0] + ",0)"), P.select(".nv-y2.nv-axis").classed("nv-disabled", M.length ? !1 : !0).attr("transform", "translate(" + o.range()[1] + ",0)"), A.dispatch.on("stateChange", function() {
                        b.update()
                    }), r.dispatch.on("elementMouseover.tooltip", k), s.dispatch.on("elementMouseover.tooltip", k), r.dispatch.on("elementMouseout.tooltip", function() {
                        B.hidden(!0)
                    }), s.dispatch.on("elementMouseout.tooltip", function() {
                        B.hidden(!0)
                    }), v.dispatch.on("elementMouseover.tooltip", l), w.dispatch.on("elementMouseover.tooltip", l), v.dispatch.on("elementMouseout.tooltip", function() {
                        B.hidden(!0)
                    }), w.dispatch.on("elementMouseout.tooltip", function() {
                        B.hidden(!0)
                    }), t.dispatch.on("elementMouseover.tooltip", n), u.dispatch.on("elementMouseover.tooltip", n), t.dispatch.on("elementMouseout.tooltip", function() {
                        B.hidden(!0)
                    }), u.dispatch.on("elementMouseout.tooltip", function() {
                        B.hidden(!0)
                    }), t.dispatch.on("elementMousemove.tooltip", function() {
                        B.position({
                            top: d3.event.pageY,
                            left: d3.event.pageX
                        })()
                    }), u.dispatch.on("elementMousemove.tooltip", function() {
                        B.position({
                            top: d3.event.pageY,
                            left: d3.event.pageX
                        })()
                    })
                }), b
            }
            var c, d, e = {
                    top: 30,
                    right: 20,
                    bottom: 50,
                    left: 60
                },
                f = a.utils.defaultColor(),
                g = null,
                h = null,
                i = !0,
                j = null,
                k = function(a) {
                    return a.x
                },
                l = function(a) {
                    return a.y
                },
                m = "monotone",
                n = !0,
                o = d3.scale.linear(),
                p = d3.scale.linear(),
                q = d3.scale.linear(),
                r = a.models.line().yScale(p),
                s = a.models.line().yScale(q),
                t = a.models.multiBar().stacked(!1).yScale(p),
                u = a.models.multiBar().stacked(!1).yScale(q),
                v = a.models.stackedArea().yScale(p),
                w = a.models.stackedArea().yScale(q),
                x = a.models.axis().scale(o).orient("bottom").tickPadding(5),
                y = a.models.axis().scale(p).orient("left"),
                z = a.models.axis().scale(q).orient("right"),
                A = a.models.legend().height(30),
                B = a.models.tooltip(),
                C = d3.dispatch();
            return b.dispatch = C, b.lines1 = r, b.lines2 = s, b.bars1 = t, b.bars2 = u, b.stack1 = v, b.stack2 = w, b.xAxis = x, b.yAxis1 = y, b.yAxis2 = z, b.tooltip = B, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g = a
                    }
                },
                height: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                showLegend: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                yDomain1: {
                    get: function() {
                        return c
                    },
                    set: function(a) {
                        c = a
                    }
                },
                yDomain2: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a
                    }
                },
                noData: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j = a
                    }
                },
                interpolate: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                tooltips: {
                    get: function() {
                        return B.enabled()
                    },
                    set: function(b) {
                        a.deprecated("tooltips", "use chart.tooltip.enabled() instead"), B.enabled(!!b)
                    }
                },
                tooltipContent: {
                    get: function() {
                        return B.contentGenerator()
                    },
                    set: function(b) {
                        a.deprecated("tooltipContent", "use chart.tooltip.contentGenerator() instead"), B.contentGenerator(b)
                    }
                },
                margin: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e.top = void 0 !== a.top ? a.top : e.top, e.right = void 0 !== a.right ? a.right : e.right, e.bottom = void 0 !== a.bottom ? a.bottom : e.bottom, e.left = void 0 !== a.left ? a.left : e.left
                    }
                },
                color: {
                    get: function() {
                        return f
                    },
                    set: function(b) {
                        f = a.utils.getColor(b)
                    }
                },
                x: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a, r.x(a), s.x(a), t.x(a), u.x(a), v.x(a), w.x(a)
                    }
                },
                y: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a, r.y(a), s.y(a), v.y(a), w.y(a), t.y(a), u.y(a)
                    }
                },
                useVoronoi: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a, r.useVoronoi(a), s.useVoronoi(a), v.useVoronoi(a), w.useVoronoi(a)
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.ohlcBar = function() {
            "use strict";

            function b(y) {
                return y.each(function(b) {
                    k = d3.select(this);
                    var y = a.utils.availableWidth(h, k, g),
                        A = a.utils.availableHeight(i, k, g);
                    a.utils.initSVG(k);
                    var B = y / b[0].values.length * .9;
                    l.domain(c || d3.extent(b[0].values.map(n).concat(t))), l.range(v ? e || [.5 * y / b[0].values.length, y * (b[0].values.length - .5) / b[0].values.length] : e || [5 + B / 2, y - B / 2 - 5]), m.domain(d || [d3.min(b[0].values.map(s).concat(u)), d3.max(b[0].values.map(r).concat(u))]).range(f || [A, 0]), l.domain()[0] === l.domain()[1] && l.domain(l.domain()[0] ? [l.domain()[0] - .01 * l.domain()[0], l.domain()[1] + .01 * l.domain()[1]] : [-1, 1]), m.domain()[0] === m.domain()[1] && m.domain(m.domain()[0] ? [m.domain()[0] + .01 * m.domain()[0], m.domain()[1] - .01 * m.domain()[1]] : [-1, 1]);
                    var C = d3.select(this).selectAll("g.nv-wrap.nv-ohlcBar").data([b[0].values]),
                        D = C.enter().append("g").attr("class", "nvd3 nv-wrap nv-ohlcBar"),
                        E = D.append("defs"),
                        F = D.append("g"),
                        G = C.select("g");
                    F.append("g").attr("class", "nv-ticks"), C.attr("transform", "translate(" + g.left + "," + g.top + ")"), k.on("click", function(a, b) {
                        z.chartClick({
                            data: a,
                            index: b,
                            pos: d3.event,
                            id: j
                        })
                    }), E.append("clipPath").attr("id", "nv-chart-clip-path-" + j).append("rect"), C.select("#nv-chart-clip-path-" + j + " rect").attr("width", y).attr("height", A), G.attr("clip-path", w ? "url(#nv-chart-clip-path-" + j + ")" : "");
                    var H = C.select(".nv-ticks").selectAll(".nv-tick").data(function(a) {
                        return a
                    });
                    H.exit().remove(), H.enter().append("path").attr("class", function(a, b, c) {
                        return (p(a, b) > q(a, b) ? "nv-tick negative" : "nv-tick positive") + " nv-tick-" + c + "-" + b
                    }).attr("d", function(a, b) {
                        return "m0,0l0," + (m(p(a, b)) - m(r(a, b))) + "l" + -B / 2 + ",0l" + B / 2 + ",0l0," + (m(s(a, b)) - m(p(a, b))) + "l0," + (m(q(a, b)) - m(s(a, b))) + "l" + B / 2 + ",0l" + -B / 2 + ",0z"
                    }).attr("transform", function(a, b) {
                        return "translate(" + l(n(a, b)) + "," + m(r(a, b)) + ")"
                    }).attr("fill", function() {
                        return x[0]
                    }).attr("stroke", function() {
                        return x[0]
                    }).attr("x", 0).attr("y", function(a, b) {
                        return m(Math.max(0, o(a, b)))
                    }).attr("height", function(a, b) {
                        return Math.abs(m(o(a, b)) - m(0))
                    }), H.attr("class", function(a, b, c) {
                        return (p(a, b) > q(a, b) ? "nv-tick negative" : "nv-tick positive") + " nv-tick-" + c + "-" + b
                    }), d3.transition(H).attr("transform", function(a, b) {
                        return "translate(" + l(n(a, b)) + "," + m(r(a, b)) + ")"
                    }).attr("d", function(a, c) {
                        var d = y / b[0].values.length * .9;
                        return "m0,0l0," + (m(p(a, c)) - m(r(a, c))) + "l" + -d / 2 + ",0l" + d / 2 + ",0l0," + (m(s(a, c)) - m(p(a, c))) + "l0," + (m(q(a, c)) - m(s(a, c))) + "l" + d / 2 + ",0l" + -d / 2 + ",0z"
                    })
                }), b
            }
            var c, d, e, f, g = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                h = null,
                i = null,
                j = Math.floor(1e4 * Math.random()),
                k = null,
                l = d3.scale.linear(),
                m = d3.scale.linear(),
                n = function(a) {
                    return a.x
                },
                o = function(a) {
                    return a.y
                },
                p = function(a) {
                    return a.open
                },
                q = function(a) {
                    return a.close
                },
                r = function(a) {
                    return a.high
                },
                s = function(a) {
                    return a.low
                },
                t = [],
                u = [],
                v = !1,
                w = !0,
                x = a.utils.defaultColor(),
                y = !1,
                z = d3.dispatch("tooltipShow", "tooltipHide", "stateChange", "changeState", "renderEnd", "chartClick", "elementClick", "elementDblClick", "elementMouseover", "elementMouseout", "elementMousemove");
            return b.highlightPoint = function(a, c) {
                b.clearHighlights(), k.select(".nv-ohlcBar .nv-tick-0-" + a).classed("hover", c)
            }, b.clearHighlights = function() {
                k.select(".nv-ohlcBar .nv-tick.hover").classed("hover", !1)
            }, b.dispatch = z, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                height: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                xScale: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                yScale: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                xDomain: {
                    get: function() {
                        return c
                    },
                    set: function(a) {
                        c = a
                    }
                },
                yDomain: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a
                    }
                },
                xRange: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e = a
                    }
                },
                yRange: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f = a
                    }
                },
                forceX: {
                    get: function() {
                        return t
                    },
                    set: function(a) {
                        t = a
                    }
                },
                forceY: {
                    get: function() {
                        return u
                    },
                    set: function(a) {
                        u = a
                    }
                },
                padData: {
                    get: function() {
                        return v
                    },
                    set: function(a) {
                        v = a
                    }
                },
                clipEdge: {
                    get: function() {
                        return w
                    },
                    set: function(a) {
                        w = a
                    }
                },
                id: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j = a
                    }
                },
                interactive: {
                    get: function() {
                        return y
                    },
                    set: function(a) {
                        y = a
                    }
                },
                x: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                y: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                open: {
                    get: function() {
                        return p()
                    },
                    set: function(a) {
                        p = a
                    }
                },
                close: {
                    get: function() {
                        return q()
                    },
                    set: function(a) {
                        q = a
                    }
                },
                high: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a
                    }
                },
                low: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a
                    }
                },
                margin: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g.top = void 0 != a.top ? a.top : g.top, g.right = void 0 != a.right ? a.right : g.right, g.bottom = void 0 != a.bottom ? a.bottom : g.bottom, g.left = void 0 != a.left ? a.left : g.left
                    }
                },
                color: {
                    get: function() {
                        return x
                    },
                    set: function(b) {
                        x = a.utils.getColor(b)
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.parallelCoordinates = function() {
            "use strict";

            function b(p) {
                return p.each(function(b) {
                    function p(a) {
                        return F(h.map(function(b) {
                            if (isNaN(a[b]) || isNaN(parseFloat(a[b]))) {
                                var c = g[b].domain(),
                                    d = g[b].range(),
                                    e = c[0] - (c[1] - c[0]) / 9;
                                if (J.indexOf(b) < 0) {
                                    var h = d3.scale.linear().domain([e, c[1]]).range([x - 12, d[1]]);
                                    g[b].brush.y(h), J.push(b)
                                }
                                return [f(b), g[b](e)]
                            }
                            return J.length > 0 ? (D.style("display", "inline"), E.style("display", "inline")) : (D.style("display", "none"), E.style("display", "none")), [f(b), g[b](a[b])]
                        }))
                    }

                    function q() {
                        var a = h.filter(function(a) {
                                return !g[a].brush.empty()
                            }),
                            b = a.map(function(a) {
                                return g[a].brush.extent()
                            });
                        k = [], a.forEach(function(a, c) {
                            k[c] = {
                                dimension: a,
                                extent: b[c]
                            }
                        }), l = [], M.style("display", function(c) {
                            var d = a.every(function(a, d) {
                                return isNaN(c[a]) && b[d][0] == g[a].brush.y().domain()[0] ? !0 : b[d][0] <= c[a] && c[a] <= b[d][1]
                            });
                            return d && l.push(c), d ? null : "none"
                        }), o.brush({
                            filters: k,
                            active: l
                        })
                    }

                    function r(a) {
                        m[a] = this.parentNode.__origin__ = f(a), L.attr("visibility", "hidden")
                    }

                    function s(a) {
                        m[a] = Math.min(w, Math.max(0, this.parentNode.__origin__ += d3.event.x)), M.attr("d", p), h.sort(function(a, b) {
                            return u(a) - u(b)
                        }), f.domain(h), N.attr("transform", function(a) {
                            return "translate(" + u(a) + ")"
                        })
                    }

                    function t(a) {
                        delete this.parentNode.__origin__, delete m[a], d3.select(this.parentNode).attr("transform", "translate(" + f(a) + ")"), M.attr("d", p), L.attr("d", p).attr("visibility", null)
                    }

                    function u(a) {
                        var b = m[a];
                        return null == b ? f(a) : b
                    }
                    var v = d3.select(this),
                        w = a.utils.availableWidth(d, v, c),
                        x = a.utils.availableHeight(e, v, c);
                    a.utils.initSVG(v), l = b, f.rangePoints([0, w], 1).domain(h);
                    var y = {};
                    h.forEach(function(a) {
                        var c = d3.extent(b, function(b) {
                            return +b[a]
                        });
                        return y[a] = !1, void 0 === c[0] && (y[a] = !0, c[0] = 0, c[1] = 0), c[0] === c[1] && (c[0] = c[0] - 1, c[1] = c[1] + 1), g[a] = d3.scale.linear().domain(c).range([.9 * (x - 12), 0]), g[a].brush = d3.svg.brush().y(g[a]).on("brush", q), "name" != a
                    });
                    var z = v.selectAll("g.nv-wrap.nv-parallelCoordinates").data([b]),
                        A = z.enter().append("g").attr("class", "nvd3 nv-wrap nv-parallelCoordinates"),
                        B = A.append("g"),
                        C = z.select("g");
                    B.append("g").attr("class", "nv-parallelCoordinates background"), B.append("g").attr("class", "nv-parallelCoordinates foreground"), B.append("g").attr("class", "nv-parallelCoordinates missingValuesline"), z.attr("transform", "translate(" + c.left + "," + c.top + ")");
                    var D, E, F = d3.svg.line().interpolate("cardinal").tension(n),
                        G = d3.svg.axis().orient("left"),
                        H = d3.behavior.drag().on("dragstart", r).on("drag", s).on("dragend", t),
                        I = f.range()[1] - f.range()[0],
                        J = [],
                        K = [0 + I / 2, x - 12, w - I / 2, x - 12];
                    D = z.select(".missingValuesline").selectAll("line").data([K]), D.enter().append("line"), D.exit().remove(), D.attr("x1", function(a) {
                        return a[0]
                    }).attr("y1", function(a) {
                        return a[1]
                    }).attr("x2", function(a) {
                        return a[2]
                    }).attr("y2", function(a) {
                        return a[3]
                    }), E = z.select(".missingValuesline").selectAll("text").data(["undefined values"]), E.append("text").data(["undefined values"]), E.enter().append("text"), E.exit().remove(), E.attr("y", x).attr("x", w - 92 - I / 2).text(function(a) {
                        return a
                    });
                    var L = z.select(".background").selectAll("path").data(b);
                    L.enter().append("path"), L.exit().remove(), L.attr("d", p);
                    var M = z.select(".foreground").selectAll("path").data(b);
                    M.enter().append("path"), M.exit().remove(), M.attr("d", p).attr("stroke", j), M.on("mouseover", function(a, b) {
                        d3.select(this).classed("hover", !0), o.elementMouseover({
                            label: a.name,
                            data: a.data,
                            index: b,
                            pos: [d3.mouse(this.parentNode)[0], d3.mouse(this.parentNode)[1]]
                        })
                    }), M.on("mouseout", function(a, b) {
                        d3.select(this).classed("hover", !1), o.elementMouseout({
                            label: a.name,
                            data: a.data,
                            index: b
                        })
                    });
                    var N = C.selectAll(".dimension").data(h),
                        O = N.enter().append("g").attr("class", "nv-parallelCoordinates dimension");
                    O.append("g").attr("class", "nv-parallelCoordinates nv-axis"), O.append("g").attr("class", "nv-parallelCoordinates-brush"), O.append("text").attr("class", "nv-parallelCoordinates nv-label"), N.attr("transform", function(a) {
                        return "translate(" + f(a) + ",0)"
                    }), N.exit().remove(), N.select(".nv-label").style("cursor", "move").attr("dy", "-1em").attr("text-anchor", "middle").text(String).on("mouseover", function(a) {
                        o.elementMouseover({
                            dim: a,
                            pos: [d3.mouse(this.parentNode.parentNode)[0], d3.mouse(this.parentNode.parentNode)[1]]
                        })
                    }).on("mouseout", function(a) {
                        o.elementMouseout({
                            dim: a
                        })
                    }).call(H), N.select(".nv-axis").each(function(a, b) {
                        d3.select(this).call(G.scale(g[a]).tickFormat(d3.format(i[b])))
                    }), N.select(".nv-parallelCoordinates-brush").each(function(a) {
                        d3.select(this).call(g[a].brush)
                    }).selectAll("rect").attr("x", -8).attr("width", 16)
                }), b
            }
            var c = {
                    top: 30,
                    right: 0,
                    bottom: 10,
                    left: 0
                },
                d = null,
                e = null,
                f = d3.scale.ordinal(),
                g = {},
                h = [],
                i = [],
                j = a.utils.defaultColor(),
                k = [],
                l = [],
                m = [],
                n = 1,
                o = d3.dispatch("brush", "elementMouseover", "elementMouseout");
            return b.dispatch = o, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a
                    }
                },
                height: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e = a
                    }
                },
                dimensionNames: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                dimensionFormats: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                lineTension: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                dimensions: {
                    get: function() {
                        return h
                    },
                    set: function(b) {
                        a.deprecated("dimensions", "use dimensionNames instead"), h = b
                    }
                },
                margin: {
                    get: function() {
                        return c
                    },
                    set: function(a) {
                        c.top = void 0 !== a.top ? a.top : c.top, c.right = void 0 !== a.right ? a.right : c.right, c.bottom = void 0 !== a.bottom ? a.bottom : c.bottom, c.left = void 0 !== a.left ? a.left : c.left
                    }
                },
                color: {
                    get: function() {
                        return j
                    },
                    set: function(b) {
                        j = a.utils.getColor(b)
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.pie = function() {
            "use strict";

            function b(E) {
                return D.reset(), E.each(function(b) {
                    function E(a, b) {
                        a.endAngle = isNaN(a.endAngle) ? 0 : a.endAngle, a.startAngle = isNaN(a.startAngle) ? 0 : a.startAngle, p || (a.innerRadius = 0);
                        var c = d3.interpolate(this._current, a);
                        return this._current = c(0),
                            function(a) {
                                return B[b](c(a))
                            }
                    }
                    var F = d - c.left - c.right,
                        G = e - c.top - c.bottom,
                        H = Math.min(F, G) / 2,
                        I = [],
                        J = [];
                    if (i = d3.select(this), 0 === z.length)
                        for (var K = H - H / 5, L = y * H, M = 0; M < b[0].length; M++) I.push(K), J.push(L);
                    else I = z.map(function(a) {
                        return (a.outer - a.outer / 5) * H
                    }), J = z.map(function(a) {
                        return (a.inner - a.inner / 5) * H
                    }), y = d3.min(z.map(function(a) {
                        return a.inner - a.inner / 5
                    }));
                    a.utils.initSVG(i);
                    var N = i.selectAll(".nv-wrap.nv-pie").data(b),
                        O = N.enter().append("g").attr("class", "nvd3 nv-wrap nv-pie nv-chart-" + h),
                        P = O.append("g"),
                        Q = N.select("g"),
                        R = P.append("g").attr("class", "nv-pie");
                    P.append("g").attr("class", "nv-pieLabels"), N.attr("transform", "translate(" + c.left + "," + c.top + ")"), Q.select(".nv-pie").attr("transform", "translate(" + F / 2 + "," + G / 2 + ")"), Q.select(".nv-pieLabels").attr("transform", "translate(" + F / 2 + "," + G / 2 + ")"), i.on("click", function(a, b) {
                        A.chartClick({
                            data: a,
                            index: b,
                            pos: d3.event,
                            id: h
                        })
                    }), B = [], C = [];
                    for (var M = 0; M < b[0].length; M++) {
                        var S = d3.svg.arc().outerRadius(I[M]),
                            T = d3.svg.arc().outerRadius(I[M] + 5);
                        u !== !1 && (S.startAngle(u), T.startAngle(u)), w !== !1 && (S.endAngle(w), T.endAngle(w)), p && (S.innerRadius(J[M]), T.innerRadius(J[M])), S.cornerRadius && x && (S.cornerRadius(x), T.cornerRadius(x)), B.push(S), C.push(T)
                    }
                    var U = d3.layout.pie().sort(null).value(function(a) {
                        return a.disabled ? 0 : g(a)
                    });
                    U.padAngle && v && U.padAngle(v), p && q && (R.append("text").attr("class", "nv-pie-title"), N.select(".nv-pie-title").style("text-anchor", "middle").text(function() {
                        return q
                    }).style("font-size", Math.min(F, G) * y * 2 / (q.length + 2) + "px").attr("dy", "0.35em").attr("transform", function() {
                        return "translate(0, " + s + ")"
                    }));
                    var V = N.select(".nv-pie").selectAll(".nv-slice").data(U),
                        W = N.select(".nv-pieLabels").selectAll(".nv-label").data(U);
                    V.exit().remove(), W.exit().remove();
                    var X = V.enter().append("g");
                    X.attr("class", "nv-slice"), X.on("mouseover", function(a, b) {
                        d3.select(this).classed("hover", !0), r && d3.select(this).select("path").transition().duration(70).attr("d", C[b]), A.elementMouseover({
                            data: a.data,
                            index: b,
                            color: d3.select(this).style("fill")
                        })
                    }), X.on("mouseout", function(a, b) {
                        d3.select(this).classed("hover", !1), r && d3.select(this).select("path").transition().duration(50).attr("d", B[b]), A.elementMouseout({
                            data: a.data,
                            index: b
                        })
                    }), X.on("mousemove", function(a, b) {
                        A.elementMousemove({
                            data: a.data,
                            index: b
                        })
                    }), X.on("click", function(a, b) {
                        A.elementClick({
                            data: a.data,
                            index: b,
                            color: d3.select(this).style("fill")
                        })
                    }), X.on("dblclick", function(a, b) {
                        A.elementDblClick({
                            data: a.data,
                            index: b,
                            color: d3.select(this).style("fill")
                        })
                    }), V.attr("fill", function(a, b) {
                        return j(a.data, b)
                    }), V.attr("stroke", function(a, b) {
                        return j(a.data, b)
                    });
                    X.append("path").each(function(a) {
                        this._current = a
                    });
                    if (V.select("path").transition().attr("d", function(a, b) {
                            return B[b](a)
                        }).attrTween("d", E), l) {
                        for (var Y = [], M = 0; M < b[0].length; M++) Y.push(B[M]), m ? p && (Y[M] = d3.svg.arc().outerRadius(B[M].outerRadius()), u !== !1 && Y[M].startAngle(u), w !== !1 && Y[M].endAngle(w)) : p || Y[M].innerRadius(0);
                        W.enter().append("g").classed("nv-label", !0).each(function(a) {
                            var b = d3.select(this);
                            b.attr("transform", function(a, b) {
                                if (t) {
                                    a.outerRadius = I[b] + 10, a.innerRadius = I[b] + 15;
                                    var c = (a.startAngle + a.endAngle) / 2 * (180 / Math.PI);
                                    return (a.startAngle + a.endAngle) / 2 < Math.PI ? c -= 90 : c += 90, "translate(" + Y[b].centroid(a) + ") rotate(" + c + ")"
                                }
                                return a.outerRadius = H + 10, a.innerRadius = H + 15, "translate(" + Y[b].centroid(a) + ")"
                            }), b.append("rect").style("stroke", "#fff").style("fill", "#fff").attr("rx", 3).attr("ry", 3), b.append("text").style("text-anchor", t ? (a.startAngle + a.endAngle) / 2 < Math.PI ? "start" : "end" : "middle").style("fill", "#000")
                        });
                        var Z = {},
                            $ = 14,
                            _ = 140,
                            ab = function(a) {
                                return Math.floor(a[0] / _) * _ + "," + Math.floor(a[1] / $) * $
                            };
                        W.watchTransition(D, "pie labels").attr("transform", function(a, b) {
                            if (t) {
                                a.outerRadius = I[b] + 10, a.innerRadius = I[b] + 15;
                                var c = (a.startAngle + a.endAngle) / 2 * (180 / Math.PI);
                                return (a.startAngle + a.endAngle) / 2 < Math.PI ? c -= 90 : c += 90, "translate(" + Y[b].centroid(a) + ") rotate(" + c + ")"
                            }
                            a.outerRadius = H + 10, a.innerRadius = H + 15;
                            var d = Y[b].centroid(a);
                            if (a.value) {
                                var e = ab(d);
                                Z[e] && (d[1] -= $), Z[ab(d)] = !0
                            }
                            return "translate(" + d + ")"
                        }), W.select(".nv-label text").style("text-anchor", function(a) {
                            return t ? (a.startAngle + a.endAngle) / 2 < Math.PI ? "start" : "end" : "middle"
                        }).text(function(a, b) {
                            var c = (a.endAngle - a.startAngle) / (2 * Math.PI),
                                d = "";
                            if (!a.value || o > c) return "";
                            if ("function" == typeof n) d = n(a, b, {
                                key: f(a.data),
                                value: g(a.data),
                                percent: k(c)
                            });
                            else switch (n) {
                                case "key":
                                    d = f(a.data);
                                    break;
                                case "value":
                                    d = k(g(a.data));
                                    break;
                                case "percent":
                                    d = d3.format("%")(c)
                            }
                            return d
                        })
                    }
                }), D.renderEnd("pie immediate"), b
            }
            var c = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                d = 500,
                e = 500,
                f = function(a) {
                    return a.x
                },
                g = function(a) {
                    return a.y
                },
                h = Math.floor(1e4 * Math.random()),
                i = null,
                j = a.utils.defaultColor(),
                k = d3.format(",.2f"),
                l = !0,
                m = !1,
                n = "key",
                o = .02,
                p = !1,
                q = !1,
                r = !0,
                s = 0,
                t = !1,
                u = !1,
                v = !1,
                w = !1,
                x = 0,
                y = .5,
                z = [],
                A = d3.dispatch("chartClick", "elementClick", "elementDblClick", "elementMouseover", "elementMouseout", "elementMousemove", "renderEnd"),
                B = [],
                C = [],
                D = a.utils.renderWatch(A);
            return b.dispatch = A, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                arcsRadius: {
                    get: function() {
                        return z
                    },
                    set: function(a) {
                        z = a
                    }
                },
                width: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a
                    }
                },
                height: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e = a
                    }
                },
                showLabels: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                title: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                titleOffset: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a
                    }
                },
                labelThreshold: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                valueFormat: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                x: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f = a
                    }
                },
                id: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                endAngle: {
                    get: function() {
                        return w
                    },
                    set: function(a) {
                        w = a
                    }
                },
                startAngle: {
                    get: function() {
                        return u
                    },
                    set: function(a) {
                        u = a
                    }
                },
                padAngle: {
                    get: function() {
                        return v
                    },
                    set: function(a) {
                        v = a
                    }
                },
                cornerRadius: {
                    get: function() {
                        return x
                    },
                    set: function(a) {
                        x = a
                    }
                },
                donutRatio: {
                    get: function() {
                        return y
                    },
                    set: function(a) {
                        y = a
                    }
                },
                labelsOutside: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                labelSunbeamLayout: {
                    get: function() {
                        return t
                    },
                    set: function(a) {
                        t = a
                    }
                },
                donut: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                growOnHover: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a
                    }
                },
                pieLabelsOutside: {
                    get: function() {
                        return m
                    },
                    set: function(b) {
                        m = b, a.deprecated("pieLabelsOutside", "use labelsOutside instead")
                    }
                },
                donutLabelsOutside: {
                    get: function() {
                        return m
                    },
                    set: function(b) {
                        m = b, a.deprecated("donutLabelsOutside", "use labelsOutside instead")
                    }
                },
                labelFormat: {
                    get: function() {
                        return k
                    },
                    set: function(b) {
                        k = b, a.deprecated("labelFormat", "use valueFormat instead")
                    }
                },
                margin: {
                    get: function() {
                        return c
                    },
                    set: function(a) {
                        c.top = "undefined" != typeof a.top ? a.top : c.top, c.right = "undefined" != typeof a.right ? a.right : c.right, c.bottom = "undefined" != typeof a.bottom ? a.bottom : c.bottom, c.left = "undefined" != typeof a.left ? a.left : c.left
                    }
                },
                y: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g = d3.functor(a)
                    }
                },
                color: {
                    get: function() {
                        return j
                    },
                    set: function(b) {
                        j = a.utils.getColor(b)
                    }
                },
                labelType: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a || "key"
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.pieChart = function() {
            "use strict";

            function b(e) {
                return q.reset(), q.models(c), e.each(function(e) {
                    var k = d3.select(this);
                    a.utils.initSVG(k);
                    var n = a.utils.availableWidth(g, k, f),
                        o = a.utils.availableHeight(h, k, f);
                    if (b.update = function() {
                            k.transition().call(b)
                        }, b.container = this, l.setter(s(e), b.update).getter(r(e)).update(), l.disabled = e.map(function(a) {
                            return !!a.disabled
                        }), !m) {
                        var q;
                        m = {};
                        for (q in l) m[q] = l[q] instanceof Array ? l[q].slice(0) : l[q]
                    }
                    if (!e || !e.length) return a.utils.noData(b, k), b;
                    k.selectAll(".nv-noData").remove();
                    var t = k.selectAll("g.nv-wrap.nv-pieChart").data([e]),
                        u = t.enter().append("g").attr("class", "nvd3 nv-wrap nv-pieChart").append("g"),
                        v = t.select("g");
                    if (u.append("g").attr("class", "nv-pieWrap"), u.append("g").attr("class", "nv-legendWrap"), i)
                        if ("top" === j) d.width(n).key(c.x()), t.select(".nv-legendWrap").datum(e).call(d), f.top != d.height() && (f.top = d.height(), o = a.utils.availableHeight(h, k, f)), t.select(".nv-legendWrap").attr("transform", "translate(0," + -f.top + ")");
                        else if ("right" === j) {
                        var w = a.models.legend().width();
                        w > n / 2 && (w = n / 2), d.height(o).key(c.x()), d.width(w), n -= d.width(), t.select(".nv-legendWrap").datum(e).call(d).attr("transform", "translate(" + n + ",0)")
                    }
                    t.attr("transform", "translate(" + f.left + "," + f.top + ")"), c.width(n).height(o);
                    var x = v.select(".nv-pieWrap").datum([e]);
                    d3.transition(x).call(c), d.dispatch.on("stateChange", function(a) {
                        for (var c in a) l[c] = a[c];
                        p.stateChange(l), b.update()
                    }), p.on("changeState", function(a) {
                        "undefined" != typeof a.disabled && (e.forEach(function(b, c) {
                            b.disabled = a.disabled[c]
                        }), l.disabled = a.disabled), b.update()
                    })
                }), q.renderEnd("pieChart immediate"), b
            }
            var c = a.models.pie(),
                d = a.models.legend(),
                e = a.models.tooltip(),
                f = {
                    top: 30,
                    right: 20,
                    bottom: 20,
                    left: 20
                },
                g = null,
                h = null,
                i = !0,
                j = "top",
                k = a.utils.defaultColor(),
                l = a.utils.state(),
                m = null,
                n = null,
                o = 250,
                p = d3.dispatch("tooltipShow", "tooltipHide", "stateChange", "changeState", "renderEnd");
            e.headerEnabled(!1).duration(0).valueFormatter(function(a, b) {
                return c.valueFormat()(a, b)
            });
            var q = a.utils.renderWatch(p),
                r = function(a) {
                    return function() {
                        return {
                            active: a.map(function(a) {
                                return !a.disabled
                            })
                        }
                    }
                },
                s = function(a) {
                    return function(b) {
                        void 0 !== b.active && a.forEach(function(a, c) {
                            a.disabled = !b.active[c]
                        })
                    }
                };
            return c.dispatch.on("elementMouseover.tooltip", function(a) {
                a.series = {
                    key: b.x()(a.data),
                    value: b.y()(a.data),
                    color: a.color
                }, e.data(a).hidden(!1)
            }), c.dispatch.on("elementMouseout.tooltip", function() {
                e.hidden(!0)
            }), c.dispatch.on("elementMousemove.tooltip", function() {
                e.position({
                    top: d3.event.pageY,
                    left: d3.event.pageX
                })()
            }), b.legend = d, b.dispatch = p, b.pie = c, b.tooltip = e, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                noData: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                showLegend: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                legendPosition: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j = a
                    }
                },
                defaultState: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                tooltips: {
                    get: function() {
                        return e.enabled()
                    },
                    set: function(b) {
                        a.deprecated("tooltips", "use chart.tooltip.enabled() instead"), e.enabled(!!b)
                    }
                },
                tooltipContent: {
                    get: function() {
                        return e.contentGenerator()
                    },
                    set: function(b) {
                        a.deprecated("tooltipContent", "use chart.tooltip.contentGenerator() instead"), e.contentGenerator(b)
                    }
                },
                color: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a, d.color(k), c.color(k)
                    }
                },
                duration: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a, q.reset(o)
                    }
                },
                margin: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f.top = void 0 !== a.top ? a.top : f.top, f.right = void 0 !== a.right ? a.right : f.right, f.bottom = void 0 !== a.bottom ? a.bottom : f.bottom, f.left = void 0 !== a.left ? a.left : f.left
                    }
                }
            }), a.utils.inheritOptions(b, c), a.utils.initOptions(b), b
        }, a.models.scatter = function() {
            "use strict";

            function b(N) {
                return P.reset(), N.each(function(b) {
                    function N() {
                        if (O = !1, !w) return !1;
                        if (M === !0) {
                            var a = d3.merge(b.map(function(a, b) {
                                return a.values.map(function(a, c) {
                                    var d = p(a, c),
                                        e = q(a, c);
                                    return [m(d) + 1e-4 * Math.random(), n(e) + 1e-4 * Math.random(), b, c, a]
                                }).filter(function(a, b) {
                                    return x(a[4], b)
                                })
                            }));
                            if (0 == a.length) return !1;
                            a.length < 3 && (a.push([m.range()[0] - 20, n.range()[0] - 20, null, null]), a.push([m.range()[1] + 20, n.range()[1] + 20, null, null]), a.push([m.range()[0] - 20, n.range()[0] + 20, null, null]), a.push([m.range()[1] + 20, n.range()[1] - 20, null, null]));
                            var c = d3.geom.polygon([
                                    [-10, -10],
                                    [-10, i + 10],
                                    [h + 10, i + 10],
                                    [h + 10, -10]
                                ]),
                                d = d3.geom.voronoi(a).map(function(b, d) {
                                    return {
                                        data: c.clip(b),
                                        series: a[d][2],
                                        point: a[d][3]
                                    }
                                });
                            U.select(".nv-point-paths").selectAll("path").remove();
                            var e = U.select(".nv-point-paths").selectAll("path").data(d),
                                f = e.enter().append("svg:path").attr("d", function(a) {
                                    return a && a.data && 0 !== a.data.length ? "M" + a.data.join(",") + "Z" : "M 0 0"
                                }).attr("id", function(a, b) {
                                    return "nv-path-" + b
                                }).attr("clip-path", function(a, b) {
                                    return "url(#nv-clip-" + b + ")"
                                });
                            C && f.style("fill", d3.rgb(230, 230, 230)).style("fill-opacity", .4).style("stroke-opacity", 1).style("stroke", d3.rgb(200, 200, 200)), B && (U.select(".nv-point-clips").selectAll("clipPath").remove(), U.select(".nv-point-clips").selectAll("clipPath").data(a).enter().append("svg:clipPath").attr("id", function(a, b) {
                                return "nv-clip-" + b
                            }).append("svg:circle").attr("cx", function(a) {
                                return a[0]
                            }).attr("cy", function(a) {
                                return a[1]
                            }).attr("r", D));
                            var k = function(a, c) {
                                if (O) return 0;
                                var d = b[a.series];
                                if (void 0 !== d) {
                                    var e = d.values[a.point];
                                    e.color = j(d, a.series), e.x = p(e), e.y = q(e);
                                    var f = l.node().getBoundingClientRect(),
                                        h = window.pageYOffset || document.documentElement.scrollTop,
                                        i = window.pageXOffset || document.documentElement.scrollLeft,
                                        k = {
                                            left: m(p(e, a.point)) + f.left + i + g.left + 10,
                                            top: n(q(e, a.point)) + f.top + h + g.top + 10
                                        };
                                    c({
                                        point: e,
                                        series: d,
                                        pos: k,
                                        seriesIndex: a.series,
                                        pointIndex: a.point
                                    })
                                }
                            };
                            e.on("click", function(a) {
                                k(a, L.elementClick)
                            }).on("dblclick", function(a) {
                                k(a, L.elementDblClick)
                            }).on("mouseover", function(a) {
                                k(a, L.elementMouseover)
                            }).on("mouseout", function(a) {
                                k(a, L.elementMouseout)
                            })
                        } else U.select(".nv-groups").selectAll(".nv-group").selectAll(".nv-point").on("click", function(a, c) {
                            if (O || !b[a.series]) return 0;
                            var d = b[a.series],
                                e = d.values[c];
                            L.elementClick({
                                point: e,
                                series: d,
                                pos: [m(p(e, c)) + g.left, n(q(e, c)) + g.top],
                                seriesIndex: a.series,
                                pointIndex: c
                            })
                        }).on("dblclick", function(a, c) {
                            if (O || !b[a.series]) return 0;
                            var d = b[a.series],
                                e = d.values[c];
                            L.elementDblClick({
                                point: e,
                                series: d,
                                pos: [m(p(e, c)) + g.left, n(q(e, c)) + g.top],
                                seriesIndex: a.series,
                                pointIndex: c
                            })
                        }).on("mouseover", function(a, c) {
                            if (O || !b[a.series]) return 0;
                            var d = b[a.series],
                                e = d.values[c];
                            L.elementMouseover({
                                point: e,
                                series: d,
                                pos: [m(p(e, c)) + g.left, n(q(e, c)) + g.top],
                                seriesIndex: a.series,
                                pointIndex: c,
                                color: j(a, c)
                            })
                        }).on("mouseout", function(a, c) {
                            if (O || !b[a.series]) return 0;
                            var d = b[a.series],
                                e = d.values[c];
                            L.elementMouseout({
                                point: e,
                                series: d,
                                seriesIndex: a.series,
                                pointIndex: c,
                                color: j(a, c)
                            })
                        })
                    }
                    l = d3.select(this);
                    var R = a.utils.availableWidth(h, l, g),
                        S = a.utils.availableHeight(i, l, g);
                    a.utils.initSVG(l), b.forEach(function(a, b) {
                        a.values.forEach(function(a) {
                            a.series = b
                        })
                    });
                    var T = E && F && I ? [] : d3.merge(b.map(function(a) {
                        return a.values.map(function(a, b) {
                            return {
                                x: p(a, b),
                                y: q(a, b),
                                size: r(a, b)
                            }
                        })
                    }));
                    m.domain(E || d3.extent(T.map(function(a) {
                        return a.x
                    }).concat(t))), m.range(y && b[0] ? G || [(R * z + R) / (2 * b[0].values.length), R - R * (1 + z) / (2 * b[0].values.length)] : G || [0, R]), n.domain(F || d3.extent(T.map(function(a) {
                        return a.y
                    }).concat(u))).range(H || [S, 0]), o.domain(I || d3.extent(T.map(function(a) {
                        return a.size
                    }).concat(v))).range(J || Q), K = m.domain()[0] === m.domain()[1] || n.domain()[0] === n.domain()[1], m.domain()[0] === m.domain()[1] && m.domain(m.domain()[0] ? [m.domain()[0] - .01 * m.domain()[0], m.domain()[1] + .01 * m.domain()[1]] : [-1, 1]), n.domain()[0] === n.domain()[1] && n.domain(n.domain()[0] ? [n.domain()[0] - .01 * n.domain()[0], n.domain()[1] + .01 * n.domain()[1]] : [-1, 1]), isNaN(m.domain()[0]) && m.domain([-1, 1]), isNaN(n.domain()[0]) && n.domain([-1, 1]), c = c || m, d = d || n, e = e || o;
                    var U = l.selectAll("g.nv-wrap.nv-scatter").data([b]),
                        V = U.enter().append("g").attr("class", "nvd3 nv-wrap nv-scatter nv-chart-" + k),
                        W = V.append("defs"),
                        X = V.append("g"),
                        Y = U.select("g");
                    U.classed("nv-single-point", K), X.append("g").attr("class", "nv-groups"), X.append("g").attr("class", "nv-point-paths"), V.append("g").attr("class", "nv-point-clips"), U.attr("transform", "translate(" + g.left + "," + g.top + ")"), W.append("clipPath").attr("id", "nv-edge-clip-" + k).append("rect"), U.select("#nv-edge-clip-" + k + " rect").attr("width", R).attr("height", S > 0 ? S : 0), Y.attr("clip-path", A ? "url(#nv-edge-clip-" + k + ")" : ""), O = !0;
                    var Z = U.select(".nv-groups").selectAll(".nv-group").data(function(a) {
                        return a
                    }, function(a) {
                        return a.key
                    });
                    Z.enter().append("g").style("stroke-opacity", 1e-6).style("fill-opacity", 1e-6), Z.exit().remove(), Z.attr("class", function(a, b) {
                        return "nv-group nv-series-" + b
                    }).classed("hover", function(a) {
                        return a.hover
                    }), Z.watchTransition(P, "scatter: groups").style("fill", function(a, b) {
                        return j(a, b)
                    }).style("stroke", function(a, b) {
                        return j(a, b)
                    }).style("stroke-opacity", 1).style("fill-opacity", .5);
                    var $ = Z.selectAll("path.nv-point").data(function(a) {
                        return a.values.map(function(a, b) {
                            return [a, b]
                        }).filter(function(a, b) {
                            return x(a[0], b)
                        })
                    });
                    $.enter().append("path").style("fill", function(a) {
                        return a.color
                    }).style("stroke", function(a) {
                        return a.color
                    }).attr("transform", function(a) {
                        return "translate(" + c(p(a[0], a[1])) + "," + d(q(a[0], a[1])) + ")"
                    }).attr("d", a.utils.symbol().type(function(a) {
                        return s(a[0])
                    }).size(function(a) {
                        return o(r(a[0], a[1]))
                    })), $.exit().remove(), Z.exit().selectAll("path.nv-point").watchTransition(P, "scatter exit").attr("transform", function(a) {
                        return "translate(" + m(p(a[0], a[1])) + "," + n(q(a[0], a[1])) + ")"
                    }).remove(), $.each(function(a) {
                        d3.select(this).classed("nv-point", !0).classed("nv-point-" + a[1], !0).classed("nv-noninteractive", !w).classed("hover", !1)
                    }), $.watchTransition(P, "scatter points").attr("transform", function(a) {
                        return "translate(" + m(p(a[0], a[1])) + "," + n(q(a[0], a[1])) + ")"
                    }).attr("d", a.utils.symbol().type(function(a) {
                        return s(a[0])
                    }).size(function(a) {
                        return o(r(a[0], a[1]))
                    })), clearTimeout(f), f = setTimeout(N, 300), c = m.copy(), d = n.copy(), e = o.copy()
                }), P.renderEnd("scatter immediate"), b
            }
            var c, d, e, f, g = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                h = null,
                i = null,
                j = a.utils.defaultColor(),
                k = Math.floor(1e5 * Math.random()),
                l = null,
                m = d3.scale.linear(),
                n = d3.scale.linear(),
                o = d3.scale.linear(),
                p = function(a) {
                    return a.x
                },
                q = function(a) {
                    return a.y
                },
                r = function(a) {
                    return a.size || 1
                },
                s = function(a) {
                    return a.shape || "circle"
                },
                t = [],
                u = [],
                v = [],
                w = !0,
                x = function(a) {
                    return !a.notActive
                },
                y = !1,
                z = .1,
                A = !1,
                B = !0,
                C = !1,
                D = function() {
                    return 25
                },
                E = null,
                F = null,
                G = null,
                H = null,
                I = null,
                J = null,
                K = !1,
                L = d3.dispatch("elementClick", "elementDblClick", "elementMouseover", "elementMouseout", "renderEnd"),
                M = !0,
                N = 250,
                O = !1,
                P = a.utils.renderWatch(L, N),
                Q = [16, 256];
            return b.dispatch = L, b.options = a.utils.optionsFunc.bind(b), b._calls = new function() {
                this.clearHighlights = function() {
                    return a.dom.write(function() {
                        l.selectAll(".nv-point.hover").classed("hover", !1)
                    }), null
                }, this.highlightPoint = function(b, c, d) {
                    a.dom.write(function() {
                        l.select(" .nv-series-" + b + " .nv-point-" + c).classed("hover", d)
                    })
                }
            }, L.on("elementMouseover.point", function(a) {
                w && b._calls.highlightPoint(a.seriesIndex, a.pointIndex, !0)
            }), L.on("elementMouseout.point", function(a) {
                w && b._calls.highlightPoint(a.seriesIndex, a.pointIndex, !1)
            }), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                height: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                xScale: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                yScale: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                pointScale: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                xDomain: {
                    get: function() {
                        return E
                    },
                    set: function(a) {
                        E = a
                    }
                },
                yDomain: {
                    get: function() {
                        return F
                    },
                    set: function(a) {
                        F = a
                    }
                },
                pointDomain: {
                    get: function() {
                        return I
                    },
                    set: function(a) {
                        I = a
                    }
                },
                xRange: {
                    get: function() {
                        return G
                    },
                    set: function(a) {
                        G = a
                    }
                },
                yRange: {
                    get: function() {
                        return H
                    },
                    set: function(a) {
                        H = a
                    }
                },
                pointRange: {
                    get: function() {
                        return J
                    },
                    set: function(a) {
                        J = a
                    }
                },
                forceX: {
                    get: function() {
                        return t
                    },
                    set: function(a) {
                        t = a
                    }
                },
                forceY: {
                    get: function() {
                        return u
                    },
                    set: function(a) {
                        u = a
                    }
                },
                forcePoint: {
                    get: function() {
                        return v
                    },
                    set: function(a) {
                        v = a
                    }
                },
                interactive: {
                    get: function() {
                        return w
                    },
                    set: function(a) {
                        w = a
                    }
                },
                pointActive: {
                    get: function() {
                        return x
                    },
                    set: function(a) {
                        x = a
                    }
                },
                padDataOuter: {
                    get: function() {
                        return z
                    },
                    set: function(a) {
                        z = a
                    }
                },
                padData: {
                    get: function() {
                        return y
                    },
                    set: function(a) {
                        y = a
                    }
                },
                clipEdge: {
                    get: function() {
                        return A
                    },
                    set: function(a) {
                        A = a
                    }
                },
                clipVoronoi: {
                    get: function() {
                        return B
                    },
                    set: function(a) {
                        B = a
                    }
                },
                clipRadius: {
                    get: function() {
                        return D
                    },
                    set: function(a) {
                        D = a
                    }
                },
                showVoronoi: {
                    get: function() {
                        return C
                    },
                    set: function(a) {
                        C = a
                    }
                },
                id: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                x: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = d3.functor(a)
                    }
                },
                y: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = d3.functor(a)
                    }
                },
                pointSize: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = d3.functor(a)
                    }
                },
                pointShape: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = d3.functor(a)
                    }
                },
                margin: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g.top = void 0 !== a.top ? a.top : g.top, g.right = void 0 !== a.right ? a.right : g.right, g.bottom = void 0 !== a.bottom ? a.bottom : g.bottom, g.left = void 0 !== a.left ? a.left : g.left
                    }
                },
                duration: {
                    get: function() {
                        return N
                    },
                    set: function(a) {
                        N = a, P.reset(N)
                    }
                },
                color: {
                    get: function() {
                        return j
                    },
                    set: function(b) {
                        j = a.utils.getColor(b)
                    }
                },
                useVoronoi: {
                    get: function() {
                        return M
                    },
                    set: function(a) {
                        M = a, M === !1 && (B = !1)
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.scatterChart = function() {
            "use strict";

            function b(z) {
                return D.reset(), D.models(c), t && D.models(d), u && D.models(e), q && D.models(g), r && D.models(h), z.each(function(z) {
                    m = d3.select(this), a.utils.initSVG(m);
                    var G = a.utils.availableWidth(k, m, j),
                        H = a.utils.availableHeight(l, m, j);
                    if (b.update = function() {
                            0 === A ? m.call(b) : m.transition().duration(A).call(b)
                        }, b.container = this, w.setter(F(z), b.update).getter(E(z)).update(), w.disabled = z.map(function(a) {
                            return !!a.disabled
                        }), !x) {
                        var I;
                        x = {};
                        for (I in w) x[I] = w[I] instanceof Array ? w[I].slice(0) : w[I]
                    }
                    if (!(z && z.length && z.filter(function(a) {
                            return a.values.length
                        }).length)) return a.utils.noData(b, m), D.renderEnd("scatter immediate"), b;
                    m.selectAll(".nv-noData").remove(), o = c.xScale(), p = c.yScale();
                    var J = m.selectAll("g.nv-wrap.nv-scatterChart").data([z]),
                        K = J.enter().append("g").attr("class", "nvd3 nv-wrap nv-scatterChart nv-chart-" + c.id()),
                        L = K.append("g"),
                        M = J.select("g");
                    if (L.append("rect").attr("class", "nvd3 nv-background").style("pointer-events", "none"), L.append("g").attr("class", "nv-x nv-axis"), L.append("g").attr("class", "nv-y nv-axis"), L.append("g").attr("class", "nv-scatterWrap"), L.append("g").attr("class", "nv-regressionLinesWrap"), L.append("g").attr("class", "nv-distWrap"), L.append("g").attr("class", "nv-legendWrap"), v && M.select(".nv-y.nv-axis").attr("transform", "translate(" + G + ",0)"), s) {
                        var N = G;
                        f.width(N), J.select(".nv-legendWrap").datum(z).call(f), j.top != f.height() && (j.top = f.height(), H = a.utils.availableHeight(l, m, j)), J.select(".nv-legendWrap").attr("transform", "translate(0," + -j.top + ")")
                    }
                    J.attr("transform", "translate(" + j.left + "," + j.top + ")"), c.width(G).height(H).color(z.map(function(a, b) {
                        return a.color = a.color || n(a, b), a.color
                    }).filter(function(a, b) {
                        return !z[b].disabled
                    })), J.select(".nv-scatterWrap").datum(z.filter(function(a) {
                        return !a.disabled
                    })).call(c), J.select(".nv-regressionLinesWrap").attr("clip-path", "url(#nv-edge-clip-" + c.id() + ")");
                    var O = J.select(".nv-regressionLinesWrap").selectAll(".nv-regLines").data(function(a) {
                        return a
                    });
                    O.enter().append("g").attr("class", "nv-regLines");
                    var P = O.selectAll(".nv-regLine").data(function(a) {
                        return [a]
                    });
                    P.enter().append("line").attr("class", "nv-regLine").style("stroke-opacity", 0), P.filter(function(a) {
                        return a.intercept && a.slope
                    }).watchTransition(D, "scatterPlusLineChart: regline").attr("x1", o.range()[0]).attr("x2", o.range()[1]).attr("y1", function(a) {
                        return p(o.domain()[0] * a.slope + a.intercept)
                    }).attr("y2", function(a) {
                        return p(o.domain()[1] * a.slope + a.intercept)
                    }).style("stroke", function(a, b, c) {
                        return n(a, c)
                    }).style("stroke-opacity", function(a) {
                        return a.disabled || "undefined" == typeof a.slope || "undefined" == typeof a.intercept ? 0 : 1
                    }), t && (d.scale(o)._ticks(a.utils.calcTicksX(G / 100, z)).tickSize(-H, 0), M.select(".nv-x.nv-axis").attr("transform", "translate(0," + p.range()[0] + ")").call(d)), u && (e.scale(p)._ticks(a.utils.calcTicksY(H / 36, z)).tickSize(-G, 0), M.select(".nv-y.nv-axis").call(e)), q && (g.getData(c.x()).scale(o).width(G).color(z.map(function(a, b) {
                        return a.color || n(a, b)
                    }).filter(function(a, b) {
                        return !z[b].disabled
                    })), L.select(".nv-distWrap").append("g").attr("class", "nv-distributionX"), M.select(".nv-distributionX").attr("transform", "translate(0," + p.range()[0] + ")").datum(z.filter(function(a) {
                        return !a.disabled
                    })).call(g)), r && (h.getData(c.y()).scale(p).width(H).color(z.map(function(a, b) {
                        return a.color || n(a, b)
                    }).filter(function(a, b) {
                        return !z[b].disabled
                    })), L.select(".nv-distWrap").append("g").attr("class", "nv-distributionY"), M.select(".nv-distributionY").attr("transform", "translate(" + (v ? G : -h.size()) + ",0)").datum(z.filter(function(a) {
                        return !a.disabled
                    })).call(h)), f.dispatch.on("stateChange", function(a) {
                        for (var c in a) w[c] = a[c];
                        y.stateChange(w), b.update()
                    }), y.on("changeState", function(a) {
                        "undefined" != typeof a.disabled && (z.forEach(function(b, c) {
                            b.disabled = a.disabled[c]
                        }), w.disabled = a.disabled), b.update()
                    }), c.dispatch.on("elementMouseout.tooltip", function(a) {
                        i.hidden(!0), m.select(".nv-chart-" + c.id() + " .nv-series-" + a.seriesIndex + " .nv-distx-" + a.pointIndex).attr("y1", 0), m.select(".nv-chart-" + c.id() + " .nv-series-" + a.seriesIndex + " .nv-disty-" + a.pointIndex).attr("x2", h.size())
                    }), c.dispatch.on("elementMouseover.tooltip", function(a) {
                        m.select(".nv-series-" + a.seriesIndex + " .nv-distx-" + a.pointIndex).attr("y1", a.pos.top - H - j.top), m.select(".nv-series-" + a.seriesIndex + " .nv-disty-" + a.pointIndex).attr("x2", a.pos.left + g.size() - j.left), i.position(a.pos).data(a).hidden(!1)
                    }), B = o.copy(), C = p.copy()
                }), D.renderEnd("scatter with line immediate"), b
            }
            var c = a.models.scatter(),
                d = a.models.axis(),
                e = a.models.axis(),
                f = a.models.legend(),
                g = a.models.distribution(),
                h = a.models.distribution(),
                i = a.models.tooltip(),
                j = {
                    top: 30,
                    right: 20,
                    bottom: 50,
                    left: 75
                },
                k = null,
                l = null,
                m = null,
                n = a.utils.defaultColor(),
                o = c.xScale(),
                p = c.yScale(),
                q = !1,
                r = !1,
                s = !0,
                t = !0,
                u = !0,
                v = !1,
                w = a.utils.state(),
                x = null,
                y = d3.dispatch("stateChange", "changeState", "renderEnd"),
                z = null,
                A = 250;
            c.xScale(o).yScale(p), d.orient("bottom").tickPadding(10), e.orient(v ? "right" : "left").tickPadding(10), g.axis("x"), h.axis("y"), i.headerFormatter(function(a, b) {
                return d.tickFormat()(a, b)
            }).valueFormatter(function(a, b) {
                return e.tickFormat()(a, b)
            });
            var B, C, D = a.utils.renderWatch(y, A),
                E = function(a) {
                    return function() {
                        return {
                            active: a.map(function(a) {
                                return !a.disabled
                            })
                        }
                    }
                },
                F = function(a) {
                    return function(b) {
                        void 0 !== b.active && a.forEach(function(a, c) {
                            a.disabled = !b.active[c]
                        })
                    }
                };
            return b.dispatch = y, b.scatter = c, b.legend = f, b.xAxis = d, b.yAxis = e, b.distX = g, b.distY = h, b.tooltip = i, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                height: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                container: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                showDistX: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                showDistY: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a
                    }
                },
                showLegend: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a
                    }
                },
                showXAxis: {
                    get: function() {
                        return t
                    },
                    set: function(a) {
                        t = a
                    }
                },
                showYAxis: {
                    get: function() {
                        return u
                    },
                    set: function(a) {
                        u = a
                    }
                },
                defaultState: {
                    get: function() {
                        return x
                    },
                    set: function(a) {
                        x = a
                    }
                },
                noData: {
                    get: function() {
                        return z
                    },
                    set: function(a) {
                        z = a
                    }
                },
                duration: {
                    get: function() {
                        return A
                    },
                    set: function(a) {
                        A = a
                    }
                },
                tooltips: {
                    get: function() {
                        return i.enabled()
                    },
                    set: function(b) {
                        a.deprecated("tooltips", "use chart.tooltip.enabled() instead"), i.enabled(!!b)
                    }
                },
                tooltipContent: {
                    get: function() {
                        return i.contentGenerator()
                    },
                    set: function(b) {
                        a.deprecated("tooltipContent", "use chart.tooltip.contentGenerator() instead"), i.contentGenerator(b)
                    }
                },
                tooltipXContent: {
                    get: function() {
                        return i.contentGenerator()
                    },
                    set: function() {
                        a.deprecated("tooltipContent", "This option is removed, put values into main tooltip.")
                    }
                },
                tooltipYContent: {
                    get: function() {
                        return i.contentGenerator()
                    },
                    set: function() {
                        a.deprecated("tooltipContent", "This option is removed, put values into main tooltip.")
                    }
                },
                margin: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j.top = void 0 !== a.top ? a.top : j.top, j.right = void 0 !== a.right ? a.right : j.right, j.bottom = void 0 !== a.bottom ? a.bottom : j.bottom, j.left = void 0 !== a.left ? a.left : j.left
                    }
                },
                rightAlignYAxis: {
                    get: function() {
                        return v
                    },
                    set: function(a) {
                        v = a, e.orient(a ? "right" : "left")
                    }
                },
                color: {
                    get: function() {
                        return n
                    },
                    set: function(b) {
                        n = a.utils.getColor(b), f.color(n), g.color(n), h.color(n)
                    }
                }
            }), a.utils.inheritOptions(b, c), a.utils.initOptions(b), b
        }, a.models.sparkline = function() {
            "use strict";

            function b(k) {
                return k.each(function(b) {
                    var k = h - g.left - g.right,
                        q = i - g.top - g.bottom;
                    j = d3.select(this), a.utils.initSVG(j), l.domain(c || d3.extent(b, n)).range(e || [0, k]), m.domain(d || d3.extent(b, o)).range(f || [q, 0]); {
                        var r = j.selectAll("g.nv-wrap.nv-sparkline").data([b]),
                            s = r.enter().append("g").attr("class", "nvd3 nv-wrap nv-sparkline");
                        s.append("g"), r.select("g")
                    }
                    r.attr("transform", "translate(" + g.left + "," + g.top + ")");
                    var t = r.selectAll("path").data(function(a) {
                        return [a]
                    });
                    t.enter().append("path"), t.exit().remove(), t.style("stroke", function(a, b) {
                        return a.color || p(a, b)
                    }).attr("d", d3.svg.line().x(function(a, b) {
                        return l(n(a, b))
                    }).y(function(a, b) {
                        return m(o(a, b))
                    }));
                    var u = r.selectAll("circle.nv-point").data(function(a) {
                        function b(b) {
                            if (-1 != b) {
                                var c = a[b];
                                return c.pointIndex = b, c
                            }
                            return null
                        }
                        var c = a.map(function(a, b) {
                                return o(a, b)
                            }),
                            d = b(c.lastIndexOf(m.domain()[1])),
                            e = b(c.indexOf(m.domain()[0])),
                            f = b(c.length - 1);
                        return [e, d, f].filter(function(a) {
                            return null != a
                        })
                    });
                    u.enter().append("circle"), u.exit().remove(), u.attr("cx", function(a) {
                        return l(n(a, a.pointIndex))
                    }).attr("cy", function(a) {
                        return m(o(a, a.pointIndex))
                    }).attr("r", 2).attr("class", function(a) {
                        return n(a, a.pointIndex) == l.domain()[1] ? "nv-point nv-currentValue" : o(a, a.pointIndex) == m.domain()[0] ? "nv-point nv-minValue" : "nv-point nv-maxValue"
                    })
                }), b
            }
            var c, d, e, f, g = {
                    top: 2,
                    right: 0,
                    bottom: 2,
                    left: 0
                },
                h = 400,
                i = 32,
                j = null,
                k = !0,
                l = d3.scale.linear(),
                m = d3.scale.linear(),
                n = function(a) {
                    return a.x
                },
                o = function(a) {
                    return a.y
                },
                p = a.utils.getColor(["#000"]);
            return b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                height: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                xDomain: {
                    get: function() {
                        return c
                    },
                    set: function(a) {
                        c = a
                    }
                },
                yDomain: {
                    get: function() {
                        return d
                    },
                    set: function(a) {
                        d = a
                    }
                },
                xRange: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e = a
                    }
                },
                yRange: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f = a
                    }
                },
                xScale: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                yScale: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                animate: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                x: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = d3.functor(a)
                    }
                },
                y: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = d3.functor(a)
                    }
                },
                margin: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g.top = void 0 !== a.top ? a.top : g.top, g.right = void 0 !== a.right ? a.right : g.right, g.bottom = void 0 !== a.bottom ? a.bottom : g.bottom, g.left = void 0 !== a.left ? a.left : g.left
                    }
                },
                color: {
                    get: function() {
                        return p
                    },
                    set: function(b) {
                        p = a.utils.getColor(b)
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.sparklinePlus = function() {
            "use strict";

            function b(p) {
                return p.each(function(p) {
                    function q() {
                        if (!j) {
                            var a = z.selectAll(".nv-hoverValue").data(i),
                                b = a.enter().append("g").attr("class", "nv-hoverValue").style("stroke-opacity", 0).style("fill-opacity", 0);
                            a.exit().transition().duration(250).style("stroke-opacity", 0).style("fill-opacity", 0).remove(), a.attr("transform", function(a) {
                                return "translate(" + c(e.x()(p[a], a)) + ",0)"
                            }).transition().duration(250).style("stroke-opacity", 1).style("fill-opacity", 1), i.length && (b.append("line").attr("x1", 0).attr("y1", -f.top).attr("x2", 0).attr("y2", u), b.append("text").attr("class", "nv-xValue").attr("x", -6).attr("y", -f.top).attr("text-anchor", "end").attr("dy", ".9em"), z.select(".nv-hoverValue .nv-xValue").text(k(e.x()(p[i[0]], i[0]))), b.append("text").attr("class", "nv-yValue").attr("x", 6).attr("y", -f.top).attr("text-anchor", "start").attr("dy", ".9em"), z.select(".nv-hoverValue .nv-yValue").text(l(e.y()(p[i[0]], i[0]))))
                        }
                    }

                    function r() {
                        function a(a, b) {
                            for (var c = Math.abs(e.x()(a[0], 0) - b), d = 0, f = 0; f < a.length; f++) Math.abs(e.x()(a[f], f) - b) < c && (c = Math.abs(e.x()(a[f], f) - b), d = f);
                            return d
                        }
                        if (!j) {
                            var b = d3.mouse(this)[0] - f.left;
                            i = [a(p, Math.round(c.invert(b)))], q()
                        }
                    }
                    var s = d3.select(this);
                    a.utils.initSVG(s);
                    var t = a.utils.availableWidth(g, s, f),
                        u = a.utils.availableHeight(h, s, f);
                    if (b.update = function() {
                            s.call(b)
                        }, b.container = this, !p || !p.length) return a.utils.noData(b, s), b;
                    s.selectAll(".nv-noData").remove();
                    var v = e.y()(p[p.length - 1], p.length - 1);
                    c = e.xScale(), d = e.yScale();
                    var w = s.selectAll("g.nv-wrap.nv-sparklineplus").data([p]),
                        x = w.enter().append("g").attr("class", "nvd3 nv-wrap nv-sparklineplus"),
                        y = x.append("g"),
                        z = w.select("g");
                    y.append("g").attr("class", "nv-sparklineWrap"), y.append("g").attr("class", "nv-valueWrap"), y.append("g").attr("class", "nv-hoverArea"), w.attr("transform", "translate(" + f.left + "," + f.top + ")");
                    var A = z.select(".nv-sparklineWrap");
                    if (e.width(t).height(u), A.call(e), m) {
                        var B = z.select(".nv-valueWrap"),
                            C = B.selectAll(".nv-currentValue").data([v]);
                        C.enter().append("text").attr("class", "nv-currentValue").attr("dx", o ? -8 : 8).attr("dy", ".9em").style("text-anchor", o ? "end" : "start"), C.attr("x", t + (o ? f.right : 0)).attr("y", n ? function(a) {
                            return d(a)
                        } : 0).style("fill", e.color()(p[p.length - 1], p.length - 1)).text(l(v))
                    }
                    y.select(".nv-hoverArea").append("rect").on("mousemove", r).on("click", function() {
                        j = !j
                    }).on("mouseout", function() {
                        i = [], q()
                    }), z.select(".nv-hoverArea rect").attr("transform", function() {
                        return "translate(" + -f.left + "," + -f.top + ")"
                    }).attr("width", t + f.left + f.right).attr("height", u + f.top)
                }), b
            }
            var c, d, e = a.models.sparkline(),
                f = {
                    top: 15,
                    right: 100,
                    bottom: 10,
                    left: 50
                },
                g = null,
                h = null,
                i = [],
                j = !1,
                k = d3.format(",r"),
                l = d3.format(",.2f"),
                m = !0,
                n = !0,
                o = !1,
                p = null;
            return b.sparkline = e, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g = a
                    }
                },
                height: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                xTickFormat: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                yTickFormat: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = a
                    }
                },
                showLastValue: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                alignValue: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                rightAlignValue: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                noData: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                margin: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f.top = void 0 !== a.top ? a.top : f.top, f.right = void 0 !== a.right ? a.right : f.right, f.bottom = void 0 !== a.bottom ? a.bottom : f.bottom, f.left = void 0 !== a.left ? a.left : f.left
                    }
                }
            }), a.utils.inheritOptions(b, e), a.utils.initOptions(b), b
        }, a.models.stackedArea = function() {
            "use strict";

            function b(m) {
                return u.reset(), u.models(r), m.each(function(m) {
                    var s = f - e.left - e.right,
                        v = g - e.top - e.bottom;
                    j = d3.select(this), a.utils.initSVG(j), c = r.xScale(), d = r.yScale();
                    var w = m;
                    m.forEach(function(a, b) {
                        a.seriesIndex = b, a.values = a.values.map(function(a, c) {
                            return a.index = c, a.seriesIndex = b, a
                        })
                    });
                    var x = m.filter(function(a) {
                        return !a.disabled
                    });
                    m = d3.layout.stack().order(o).offset(n).values(function(a) {
                        return a.values
                    }).x(k).y(l).out(function(a, b, c) {
                        a.display = {
                            y: c,
                            y0: b
                        }
                    })(x);
                    var y = j.selectAll("g.nv-wrap.nv-stackedarea").data([m]),
                        z = y.enter().append("g").attr("class", "nvd3 nv-wrap nv-stackedarea"),
                        A = z.append("defs"),
                        B = z.append("g"),
                        C = y.select("g");
                    B.append("g").attr("class", "nv-areaWrap"), B.append("g").attr("class", "nv-scatterWrap"), y.attr("transform", "translate(" + e.left + "," + e.top + ")"), 0 == r.forceY().length && r.forceY().push(0), r.width(s).height(v).x(k).y(function(a) {
                        return a.display.y + a.display.y0
                    }).forceY([0]).color(m.map(function(a) {
                        return a.color || h(a, a.seriesIndex)
                    }));
                    var D = C.select(".nv-scatterWrap").datum(m);
                    D.call(r), A.append("clipPath").attr("id", "nv-edge-clip-" + i).append("rect"), y.select("#nv-edge-clip-" + i + " rect").attr("width", s).attr("height", v), C.attr("clip-path", q ? "url(#nv-edge-clip-" + i + ")" : "");
                    var E = d3.svg.area().x(function(a, b) {
                            return c(k(a, b))
                        }).y0(function(a) {
                            return d(a.display.y0)
                        }).y1(function(a) {
                            return d(a.display.y + a.display.y0)
                        }).interpolate(p),
                        F = d3.svg.area().x(function(a, b) {
                            return c(k(a, b))
                        }).y0(function(a) {
                            return d(a.display.y0)
                        }).y1(function(a) {
                            return d(a.display.y0)
                        }),
                        G = C.select(".nv-areaWrap").selectAll("path.nv-area").data(function(a) {
                            return a
                        });
                    G.enter().append("path").attr("class", function(a, b) {
                        return "nv-area nv-area-" + b
                    }).attr("d", function(a) {
                        return F(a.values, a.seriesIndex)
                    }).on("mouseover", function(a) {
                        d3.select(this).classed("hover", !0), t.areaMouseover({
                            point: a,
                            series: a.key,
                            pos: [d3.event.pageX, d3.event.pageY],
                            seriesIndex: a.seriesIndex
                        })
                    }).on("mouseout", function(a) {
                        d3.select(this).classed("hover", !1), t.areaMouseout({
                            point: a,
                            series: a.key,
                            pos: [d3.event.pageX, d3.event.pageY],
                            seriesIndex: a.seriesIndex
                        })
                    }).on("click", function(a) {
                        d3.select(this).classed("hover", !1), t.areaClick({
                            point: a,
                            series: a.key,
                            pos: [d3.event.pageX, d3.event.pageY],
                            seriesIndex: a.seriesIndex
                        })
                    }), G.exit().remove(), G.style("fill", function(a) {
                        return a.color || h(a, a.seriesIndex)
                    }).style("stroke", function(a) {
                        return a.color || h(a, a.seriesIndex)
                    }), G.watchTransition(u, "stackedArea path").attr("d", function(a, b) {
                        return E(a.values, b)
                    }), r.dispatch.on("elementMouseover.area", function(a) {
                        C.select(".nv-chart-" + i + " .nv-area-" + a.seriesIndex).classed("hover", !0)
                    }), r.dispatch.on("elementMouseout.area", function(a) {
                        C.select(".nv-chart-" + i + " .nv-area-" + a.seriesIndex).classed("hover", !1)
                    }), b.d3_stackedOffset_stackPercent = function(a) {
                        var b, c, d, e = a.length,
                            f = a[0].length,
                            g = [];
                        for (c = 0; f > c; ++c) {
                            for (b = 0, d = 0; b < w.length; b++) d += l(w[b].values[c]);
                            if (d)
                                for (b = 0; e > b; b++) a[b][c][1] /= d;
                            else
                                for (b = 0; e > b; b++) a[b][c][1] = 0
                        }
                        for (c = 0; f > c; ++c) g[c] = 0;
                        return g
                    }
                }), u.renderEnd("stackedArea immediate"), b
            }
            var c, d, e = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                f = 960,
                g = 500,
                h = a.utils.defaultColor(),
                i = Math.floor(1e5 * Math.random()),
                j = null,
                k = function(a) {
                    return a.x
                },
                l = function(a) {
                    return a.y
                },
                m = "stack",
                n = "zero",
                o = "default",
                p = "linear",
                q = !1,
                r = a.models.scatter(),
                s = 250,
                t = d3.dispatch("areaClick", "areaMouseover", "areaMouseout", "renderEnd", "elementClick", "elementMouseover", "elementMouseout");
            r.pointSize(2.2).pointDomain([2.2, 2.2]);
            var u = a.utils.renderWatch(t, s);
            return b.dispatch = t, b.scatter = r, r.dispatch.on("elementClick", function() {
                t.elementClick.apply(this, arguments)
            }), r.dispatch.on("elementMouseover", function() {
                t.elementMouseover.apply(this, arguments)
            }), r.dispatch.on("elementMouseout", function() {
                t.elementMouseout.apply(this, arguments)
            }), b.interpolate = function(a) {
                return arguments.length ? (p = a, b) : p
            }, b.duration = function(a) {
                return arguments.length ? (s = a, u.reset(s), r.duration(s), b) : s
            }, b.dispatch = t, b.scatter = r, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f = a
                    }
                },
                height: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g = a
                    }
                },
                clipEdge: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                offset: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                order: {
                    get: function() {
                        return o
                    },
                    set: function(a) {
                        o = a
                    }
                },
                interpolate: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                x: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = d3.functor(a)
                    }
                },
                y: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l = d3.functor(a)
                    }
                },
                margin: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e.top = void 0 !== a.top ? a.top : e.top, e.right = void 0 !== a.right ? a.right : e.right, e.bottom = void 0 !== a.bottom ? a.bottom : e.bottom, e.left = void 0 !== a.left ? a.left : e.left
                    }
                },
                color: {
                    get: function() {
                        return h
                    },
                    set: function(b) {
                        h = a.utils.getColor(b)
                    }
                },
                style: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        switch (m = a) {
                            case "stack":
                                b.offset("zero"), b.order("default");
                                break;
                            case "stream":
                                b.offset("wiggle"), b.order("inside-out");
                                break;
                            case "stream-center":
                                b.offset("silhouette"), b.order("inside-out");
                                break;
                            case "expand":
                                b.offset("expand"), b.order("default");
                                break;
                            case "stack_percent":
                                b.offset(b.d3_stackedOffset_stackPercent), b.order("default")
                        }
                    }
                },
                duration: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a, u.reset(s), r.duration(s)
                    }
                }
            }), a.utils.inheritOptions(b, r), a.utils.initOptions(b), b
        }, a.models.stackedAreaChart = function() {
            "use strict";

            function b(k) {
                return F.reset(), F.models(e), r && F.models(f), s && F.models(g), k.each(function(k) {
                    var x = d3.select(this),
                        F = this;
                    a.utils.initSVG(x);
                    var K = a.utils.availableWidth(m, x, l),
                        L = a.utils.availableHeight(n, x, l);
                    if (b.update = function() {
                            x.transition().duration(C).call(b)
                        }, b.container = this, v.setter(I(k), b.update).getter(H(k)).update(), v.disabled = k.map(function(a) {
                            return !!a.disabled
                        }), !w) {
                        var M;
                        w = {};
                        for (M in v) w[M] = v[M] instanceof Array ? v[M].slice(0) : v[M]
                    }
                    if (!(k && k.length && k.filter(function(a) {
                            return a.values.length
                        }).length)) return a.utils.noData(b, x), b;
                    x.selectAll(".nv-noData").remove(), c = e.xScale(), d = e.yScale();
                    var N = x.selectAll("g.nv-wrap.nv-stackedAreaChart").data([k]),
                        O = N.enter().append("g").attr("class", "nvd3 nv-wrap nv-stackedAreaChart").append("g"),
                        P = N.select("g");
                    if (O.append("rect").style("opacity", 0), O.append("g").attr("class", "nv-x nv-axis"), O.append("g").attr("class", "nv-y nv-axis"), O.append("g").attr("class", "nv-stackedWrap"), O.append("g").attr("class", "nv-legendWrap"), O.append("g").attr("class", "nv-controlsWrap"), O.append("g").attr("class", "nv-interactive"), P.select("rect").attr("width", K).attr("height", L), q) {
                        var Q = p ? K - z : K;
                        h.width(Q), P.select(".nv-legendWrap").datum(k).call(h), l.top != h.height() && (l.top = h.height(), L = a.utils.availableHeight(n, x, l)), P.select(".nv-legendWrap").attr("transform", "translate(" + (K - Q) + "," + -l.top + ")")
                    }
                    if (p) {
                        var R = [{
                            key: B.stacked || "Stacked",
                            metaKey: "Stacked",
                            disabled: "stack" != e.style(),
                            style: "stack"
                        }, {
                            key: B.stream || "Stream",
                            metaKey: "Stream",
                            disabled: "stream" != e.style(),
                            style: "stream"
                        }, {
                            key: B.expanded || "Expanded",
                            metaKey: "Expanded",
                            disabled: "expand" != e.style(),
                            style: "expand"
                        }, {
                            key: B.stack_percent || "Stack %",
                            metaKey: "Stack_Percent",
                            disabled: "stack_percent" != e.style(),
                            style: "stack_percent"
                        }];
                        z = A.length / 3 * 260, R = R.filter(function(a) {
                            return -1 !== A.indexOf(a.metaKey)
                        }), i.width(z).color(["#444", "#444", "#444"]), P.select(".nv-controlsWrap").datum(R).call(i), l.top != Math.max(i.height(), h.height()) && (l.top = Math.max(i.height(), h.height()), L = a.utils.availableHeight(n, x, l)), P.select(".nv-controlsWrap").attr("transform", "translate(0," + -l.top + ")")
                    }
                    N.attr("transform", "translate(" + l.left + "," + l.top + ")"), t && P.select(".nv-y.nv-axis").attr("transform", "translate(" + K + ",0)"), u && (j.width(K).height(L).margin({
                        left: l.left,
                        top: l.top
                    }).svgContainer(x).xScale(c), N.select(".nv-interactive").call(j)), e.width(K).height(L);
                    var S = P.select(".nv-stackedWrap").datum(k);
                    if (S.transition().call(e), r && (f.scale(c)._ticks(a.utils.calcTicksX(K / 100, k)).tickSize(-L, 0), P.select(".nv-x.nv-axis").attr("transform", "translate(0," + L + ")"), P.select(".nv-x.nv-axis").transition().duration(0).call(f)), s) {
                        var T;
                        if (T = "wiggle" === e.offset() ? 0 : a.utils.calcTicksY(L / 36, k), g.scale(d)._ticks(T).tickSize(-K, 0), "expand" === e.style() || "stack_percent" === e.style()) {
                            var U = g.tickFormat();
                            D && U === J || (D = U), g.tickFormat(J)
                        } else D && (g.tickFormat(D), D = null);
                        P.select(".nv-y.nv-axis").transition().duration(0).call(g)
                    }
                    e.dispatch.on("areaClick.toggle", function(a) {
                        k.forEach(1 === k.filter(function(a) {
                            return !a.disabled
                        }).length ? function(a) {
                            a.disabled = !1
                        } : function(b, c) {
                            b.disabled = c != a.seriesIndex
                        }), v.disabled = k.map(function(a) {
                            return !!a.disabled
                        }), y.stateChange(v), b.update()
                    }), h.dispatch.on("stateChange", function(a) {
                        for (var c in a) v[c] = a[c];
                        y.stateChange(v), b.update()
                    }), i.dispatch.on("legendClick", function(a) {
                        a.disabled && (R = R.map(function(a) {
                            return a.disabled = !0, a
                        }), a.disabled = !1, e.style(a.style), v.style = e.style(), y.stateChange(v), b.update())
                    }), j.dispatch.on("elementMousemove", function(c) {
                        e.clearHighlights();
                        var d, g, h, i = [];
                        if (k.filter(function(a, b) {
                                return a.seriesIndex = b, !a.disabled
                            }).forEach(function(f, j) {
                                g = a.interactiveBisect(f.values, c.pointXValue, b.x());
                                var k = f.values[g],
                                    l = b.y()(k, g);
                                if (null != l && e.highlightPoint(j, g, !0), "undefined" != typeof k) {
                                    "undefined" == typeof d && (d = k), "undefined" == typeof h && (h = b.xScale()(b.x()(k, g)));
                                    var m = "expand" == e.style() ? k.display.y : b.y()(k, g);
                                    i.push({
                                        key: f.key,
                                        value: m,
                                        color: o(f, f.seriesIndex),
                                        stackedValue: k.display
                                    })
                                }
                            }), i.reverse(), i.length > 2) {
                            var m = b.yScale().invert(c.mouseY),
                                n = null;
                            i.forEach(function(a, b) {
                                m = Math.abs(m);
                                var c = Math.abs(a.stackedValue.y0),
                                    d = Math.abs(a.stackedValue.y);
                                return m >= c && d + c >= m ? void(n = b) : void 0
                            }), null != n && (i[n].highlight = !0)
                        }
                        var p = f.tickFormat()(b.x()(d, g)),
                            q = j.tooltip.valueFormatter();
                        "expand" === e.style() || "stack_percent" === e.style() ? (E || (E = q), q = d3.format(".1%")) : E && (q = E, E = null), j.tooltip.position({
                            left: h + l.left,
                            top: c.mouseY + l.top
                        }).chartContainer(F.parentNode).valueFormatter(q).data({
                            value: p,
                            series: i
                        })(), j.renderGuideLine(h)
                    }), j.dispatch.on("elementMouseout", function() {
                        e.clearHighlights()
                    }), y.on("changeState", function(a) {
                        "undefined" != typeof a.disabled && k.length === a.disabled.length && (k.forEach(function(b, c) {
                            b.disabled = a.disabled[c]
                        }), v.disabled = a.disabled), "undefined" != typeof a.style && (e.style(a.style), G = a.style), b.update()
                    })
                }), F.renderEnd("stacked Area chart immediate"), b
            }
            var c, d, e = a.models.stackedArea(),
                f = a.models.axis(),
                g = a.models.axis(),
                h = a.models.legend(),
                i = a.models.legend(),
                j = a.interactiveGuideline(),
                k = a.models.tooltip(),
                l = {
                    top: 30,
                    right: 25,
                    bottom: 50,
                    left: 60
                },
                m = null,
                n = null,
                o = a.utils.defaultColor(),
                p = !0,
                q = !0,
                r = !0,
                s = !0,
                t = !1,
                u = !1,
                v = a.utils.state(),
                w = null,
                x = null,
                y = d3.dispatch("stateChange", "changeState", "renderEnd"),
                z = 250,
                A = ["Stacked", "Stream", "Expanded"],
                B = {},
                C = 250;
            v.style = e.style(), f.orient("bottom").tickPadding(7), g.orient(t ? "right" : "left"), k.headerFormatter(function(a, b) {
                return f.tickFormat()(a, b)
            }).valueFormatter(function(a, b) {
                return g.tickFormat()(a, b)
            }), j.tooltip.headerFormatter(function(a, b) {
                return f.tickFormat()(a, b)
            }).valueFormatter(function(a, b) {
                return g.tickFormat()(a, b)
            });
            var D = null,
                E = null;
            i.updateState(!1);
            var F = a.utils.renderWatch(y),
                G = e.style(),
                H = function(a) {
                    return function() {
                        return {
                            active: a.map(function(a) {
                                return !a.disabled
                            }),
                            style: e.style()
                        }
                    }
                },
                I = function(a) {
                    return function(b) {
                        void 0 !== b.style && (G = b.style), void 0 !== b.active && a.forEach(function(a, c) {
                            a.disabled = !b.active[c]
                        })
                    }
                },
                J = d3.format("%");
            return e.dispatch.on("elementMouseover.tooltip", function(a) {
                a.point.x = e.x()(a.point), a.point.y = e.y()(a.point), k.data(a).position(a.pos).hidden(!1)
            }), e.dispatch.on("elementMouseout.tooltip", function() {
                k.hidden(!0)
            }), b.dispatch = y, b.stacked = e, b.legend = h, b.controls = i, b.xAxis = f, b.yAxis = g, b.interactiveLayer = j, b.tooltip = k, b.dispatch = y, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return m
                    },
                    set: function(a) {
                        m = a
                    }
                },
                height: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                showLegend: {
                    get: function() {
                        return q
                    },
                    set: function(a) {
                        q = a
                    }
                },
                showXAxis: {
                    get: function() {
                        return r
                    },
                    set: function(a) {
                        r = a
                    }
                },
                showYAxis: {
                    get: function() {
                        return s
                    },
                    set: function(a) {
                        s = a
                    }
                },
                defaultState: {
                    get: function() {
                        return w
                    },
                    set: function(a) {
                        w = a
                    }
                },
                noData: {
                    get: function() {
                        return x
                    },
                    set: function(a) {
                        x = a
                    }
                },
                showControls: {
                    get: function() {
                        return p
                    },
                    set: function(a) {
                        p = a
                    }
                },
                controlLabels: {
                    get: function() {
                        return B
                    },
                    set: function(a) {
                        B = a
                    }
                },
                controlOptions: {
                    get: function() {
                        return A
                    },
                    set: function(a) {
                        A = a
                    }
                },
                tooltips: {
                    get: function() {
                        return k.enabled()
                    },
                    set: function(b) {
                        a.deprecated("tooltips", "use chart.tooltip.enabled() instead"), k.enabled(!!b)
                    }
                },
                tooltipContent: {
                    get: function() {
                        return k.contentGenerator()
                    },
                    set: function(b) {
                        a.deprecated("tooltipContent", "use chart.tooltip.contentGenerator() instead"), k.contentGenerator(b)
                    }
                },
                margin: {
                    get: function() {
                        return l
                    },
                    set: function(a) {
                        l.top = void 0 !== a.top ? a.top : l.top, l.right = void 0 !== a.right ? a.right : l.right, l.bottom = void 0 !== a.bottom ? a.bottom : l.bottom, l.left = void 0 !== a.left ? a.left : l.left
                    }
                },
                duration: {
                    get: function() {
                        return C
                    },
                    set: function(a) {
                        C = a, F.reset(C), e.duration(C), f.duration(C), g.duration(C)
                    }
                },
                color: {
                    get: function() {
                        return o
                    },
                    set: function(b) {
                        o = a.utils.getColor(b), h.color(o), e.color(o)
                    }
                },
                rightAlignYAxis: {
                    get: function() {
                        return t
                    },
                    set: function(a) {
                        t = a, g.orient(t ? "right" : "left")
                    }
                },
                useInteractiveGuideline: {
                    get: function() {
                        return u
                    },
                    set: function(a) {
                        u = !!a, b.interactive(!a), b.useVoronoi(!a), e.scatter.interactive(!a)
                    }
                }
            }), a.utils.inheritOptions(b, e), a.utils.initOptions(b), b
        }, a.models.sunburst = function() {
            "use strict";

            function b(u) {
                return t.reset(), u.each(function(b) {
                    function t(a) {
                        a.x0 = a.x, a.dx0 = a.dx
                    }

                    function u(a) {
                        var b = d3.interpolate(p.domain(), [a.x, a.x + a.dx]),
                            c = d3.interpolate(q.domain(), [a.y, 1]),
                            d = d3.interpolate(q.range(), [a.y ? 20 : 0, y]);
                        return function(a, e) {
                            return e ? function() {
                                return s(a)
                            } : function(e) {
                                return p.domain(b(e)), q.domain(c(e)).range(d(e)), s(a)
                            }
                        }
                    }
                    l = d3.select(this);
                    var v, w = a.utils.availableWidth(g, l, f),
                        x = a.utils.availableHeight(h, l, f),
                        y = Math.min(w, x) / 2;
                    a.utils.initSVG(l);
                    var z = l.selectAll(".nv-wrap.nv-sunburst").data(b),
                        A = z.enter().append("g").attr("class", "nvd3 nv-wrap nv-sunburst nv-chart-" + k),
                        B = A.selectAll("nv-sunburst");
                    z.attr("transform", "translate(" + w / 2 + "," + x / 2 + ")"), l.on("click", function(a, b) {
                        o.chartClick({
                            data: a,
                            index: b,
                            pos: d3.event,
                            id: k
                        })
                    }), q.range([0, y]), c = c || b, e = b[0], r.value(j[i] || j.count), v = B.data(r.nodes).enter().append("path").attr("d", s).style("fill", function(a) {
                        return m((a.children ? a : a.parent).name)
                    }).style("stroke", "#FFF").on("click", function(a) {
                        d !== c && c !== a && (d = c), c = a, v.transition().duration(n).attrTween("d", u(a))
                    }).each(t).on("dblclick", function(a) {
                        d.parent == a && v.transition().duration(n).attrTween("d", u(e))
                    }).each(t).on("mouseover", function(a) {
                        d3.select(this).classed("hover", !0).style("opacity", .8), o.elementMouseover({
                            data: a,
                            color: d3.select(this).style("fill")
                        })
                    }).on("mouseout", function(a) {
                        d3.select(this).classed("hover", !1).style("opacity", 1), o.elementMouseout({
                            data: a
                        })
                    }).on("mousemove", function(a) {
                        o.elementMousemove({
                            data: a
                        })
                    })
                }), t.renderEnd("sunburst immediate"), b
            }
            var c, d, e, f = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                g = null,
                h = null,
                i = "count",
                j = {
                    count: function() {
                        return 1
                    },
                    size: function(a) {
                        return a.size
                    }
                },
                k = Math.floor(1e4 * Math.random()),
                l = null,
                m = a.utils.defaultColor(),
                n = 500,
                o = d3.dispatch("chartClick", "elementClick", "elementDblClick", "elementMousemove", "elementMouseover", "elementMouseout", "renderEnd"),
                p = d3.scale.linear().range([0, 2 * Math.PI]),
                q = d3.scale.sqrt(),
                r = d3.layout.partition().sort(null).value(function() {
                    return 1
                }),
                s = d3.svg.arc().startAngle(function(a) {
                    return Math.max(0, Math.min(2 * Math.PI, p(a.x)))
                }).endAngle(function(a) {
                    return Math.max(0, Math.min(2 * Math.PI, p(a.x + a.dx)))
                }).innerRadius(function(a) {
                    return Math.max(0, q(a.y))
                }).outerRadius(function(a) {
                    return Math.max(0, q(a.y + a.dy))
                }),
                t = a.utils.renderWatch(o);
            return b.dispatch = o, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                width: {
                    get: function() {
                        return g
                    },
                    set: function(a) {
                        g = a
                    }
                },
                height: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a
                    }
                },
                mode: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                id: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a
                    }
                },
                duration: {
                    get: function() {
                        return n
                    },
                    set: function(a) {
                        n = a
                    }
                },
                margin: {
                    get: function() {
                        return f
                    },
                    set: function(a) {
                        f.top = void 0 != a.top ? a.top : f.top, f.right = void 0 != a.right ? a.right : f.right, f.bottom = void 0 != a.bottom ? a.bottom : f.bottom, f.left = void 0 != a.left ? a.left : f.left
                    }
                },
                color: {
                    get: function() {
                        return m
                    },
                    set: function(b) {
                        m = a.utils.getColor(b)
                    }
                }
            }), a.utils.initOptions(b), b
        }, a.models.sunburstChart = function() {
            "use strict";

            function b(d) {
                return m.reset(), m.models(c), d.each(function(d) {
                    var h = d3.select(this);
                    a.utils.initSVG(h);
                    var i = a.utils.availableWidth(f, h, e),
                        j = a.utils.availableHeight(g, h, e);
                    if (b.update = function() {
                            0 === k ? h.call(b) : h.transition().duration(k).call(b)
                        }, b.container = this, !d || !d.length) return a.utils.noData(b, h), b;
                    h.selectAll(".nv-noData").remove();
                    var l = h.selectAll("g.nv-wrap.nv-sunburstChart").data(d),
                        m = l.enter().append("g").attr("class", "nvd3 nv-wrap nv-sunburstChart").append("g"),
                        n = l.select("g");
                    m.append("g").attr("class", "nv-sunburstWrap"), l.attr("transform", "translate(" + e.left + "," + e.top + ")"), c.width(i).height(j);
                    var o = n.select(".nv-sunburstWrap").datum(d);
                    d3.transition(o).call(c)
                }), m.renderEnd("sunburstChart immediate"), b
            }
            var c = a.models.sunburst(),
                d = a.models.tooltip(),
                e = {
                    top: 30,
                    right: 20,
                    bottom: 20,
                    left: 20
                },
                f = null,
                g = null,
                h = a.utils.defaultColor(),
                i = (Math.round(1e5 * Math.random()), null),
                j = null,
                k = 250,
                l = d3.dispatch("tooltipShow", "tooltipHide", "stateChange", "changeState", "renderEnd"),
                m = a.utils.renderWatch(l);
            return d.headerEnabled(!1).duration(0).valueFormatter(function(a) {
                return a
            }), c.dispatch.on("elementMouseover.tooltip", function(a) {
                a.series = {
                    key: a.data.name,
                    value: a.data.size,
                    color: a.color
                }, d.data(a).hidden(!1)
            }), c.dispatch.on("elementMouseout.tooltip", function() {
                d.hidden(!0)
            }), c.dispatch.on("elementMousemove.tooltip", function() {
                d.position({
                    top: d3.event.pageY,
                    left: d3.event.pageX
                })()
            }), b.dispatch = l, b.sunburst = c, b.tooltip = d, b.options = a.utils.optionsFunc.bind(b), b._options = Object.create({}, {
                noData: {
                    get: function() {
                        return j
                    },
                    set: function(a) {
                        j = a
                    }
                },
                defaultState: {
                    get: function() {
                        return i
                    },
                    set: function(a) {
                        i = a
                    }
                },
                color: {
                    get: function() {
                        return h
                    },
                    set: function(a) {
                        h = a, c.color(h)
                    }
                },
                duration: {
                    get: function() {
                        return k
                    },
                    set: function(a) {
                        k = a, m.reset(k), c.duration(k)
                    }
                },
                margin: {
                    get: function() {
                        return e
                    },
                    set: function(a) {
                        e.top = void 0 !== a.top ? a.top : e.top, e.right = void 0 !== a.right ? a.right : e.right, e.bottom = void 0 !== a.bottom ? a.bottom : e.bottom, e.left = void 0 !== a.left ? a.left : e.left
                    }
                }
            }), a.utils.inheritOptions(b, c), a.utils.initOptions(b), b
        }, a.version = "1.8.1"
}();