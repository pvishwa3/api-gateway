/**
 * jQuery Number & Trend Widget
 *
 * Author: Guy Ben Shoshan 12/2014.
 * Tested: FF 33, Chrome 39, IE 11, Opera 12, Safari 5
 *
 * Copyright (c) 2017 Inneractive
 * Dual licensed under the MIT and GPL licenses:
 *
 * Depends:
 *    jquery core 1.11.1 - http://code.jquery.com/jquery-1.11.1.min.js
 *    jquery ui 1.11 - http://jqueryui.com/resources/download/jquery-ui-1.11.2.zip
 *
 * Description:
 *      This widget is intended to present a numeric value in a KPI box
 *
 * options:
 *      title - widget title                                                            - default: ""
 *      value - Widget value                                                            - default: 0
 *      trend - trend of value change. "up" / "down" / "flat"                           - default: 0
 *              this value is used for the placement of an optional trend image.
 *              in case of "", no image will be shown                                    - default: 0
 *      symbol - currency (or any other) symbol that will be placed before the value    - default: 0
 *      footer - text that will appear inside the widget footer                         - default: ""
 *      height - widget height in px                                                    - default: 148
 *      width - widget width in px                                                      - default: 230
 *      showDecimalPoint - show 2 digits after the decimal point                        - default: true
 *      maxValueForSize - above this number, the widget font size wil decrease
 *                        and get the num-trend-kpi-data-text-small style class         - default: 100000
 *
 *      clickHandler -    click handler that triggers when the widget value             - default: null
 *                        is being clicked
 *
 *      style classes:
 *      --------------------------------------------------------------------------------------------------------------------
 *      containerStyleClass     - style class for the widget container                  - default: "num-trend-kpi-container"
 *      headerStyleClass        - style class for the header                            - default: "kpi-title"
 *      headerTextStyleClass    - style class for the header text                       - default: "kpi-title-text"
 *      valueStyleClass         - style class for the value text                        - default: "num-trend-kpi-data-text"
 *      trendUpStyleClass       - style class for the trend up img                      - default: "kpi-trend-up"
 *      trendDownStyleClass     - style class for the trend down img                    - default: "kpi-trend-down"
 *      trendFlatStyleClass     - style class for the trend flat img                    - default: "kpi-trend-flat"
 *      footerStyleClass        - style class for the footer                            - default: "num-trend-kpi-footer"
 *      footerTextStyleClass    - style class for the footer text                       - default: "kpi-footer-text"
 *
 *
 * methods:
 *      setData(data) - sets the value/trend/symbol in the widget object and refreshes the view accordingly
 *          param - JSON Array
 *          usage:
 *              numTrend = $("#numAndTrendKPI").NumTrendKPI(....);
 *              numTrend.NumTrendKPI("setData", {
 *                   value: 102300,
 *                   trend: "up",
 *                   symbol : "$"
 *              });
 *
 *      getData() - gets the value from the widget object
 *          return - JSON Array
 *          usage:
 *              numTrend = $("#numAndTrendKPI").NumTrendKPI(....);
 *              numTrend.NumTrendKPI("getData");
 */

(function ($, undefined) {
    $.widget("inneractive.NumTrendKPI", {
        // Default options.
        options: {
            title: "",
            data: {
                value: 0,
                trend: "",
                symbol: ""
            },
            footer: "",
            height: 148,
            width: 230,
            showDecimalPoint: true,
            maxValueForSize: 100000,
            clickHandler: null,

            /* css style classes */
            containerStyleClass: "num-trend-kpi-container",
            headerStyleClass: "kpi-title",
            headerTextStyleClass: "kpi-title-text",
            valueStyleClass: "num-trend-kpi-data-text",
            trendUpStyleClass: "kpi-trend-up",
            trendDownStyleClass: "kpi-trend-down",
            trendFlatStyleClass: "kpi-trend-flat",
            footerStyleClass: "num-trend-kpi-footer",
            footerTextStyleClass: "kpi-footer-text"
        },

        _create: function () {
            var _that = this;
            var titleHeight = this.options.height / 4;
            var footerHeight = titleHeight / 2;
            var dataHeight = this.options.height - titleHeight - footerHeight;
            var titleCursor = "";
            var dataCursor = (typeof(_that.options.clickHandler) == "function") ? "pointer" : "";

            var containerDiv = $('<div/>', {
                "height": this.options.height + "px",
                "width": this.options.width + "px",
                "class": this.options.containerStyleClass
            })

            var titleDiv = $('<div/>', {
                html: "<div class=\"" + this.options.headerTextStyleClass + "\" style=\"height:" + titleHeight + "px;cursor:" + titleCursor + ";\">" + this.options.title + "</div>",
                "class": this.options.headerStyleClass,
                height: titleHeight
            });

            var dataDiv = this._createDataDiv(dataCursor).click(function (abc) {
                if (typeof(_that.options.clickHandler) == "function") {
                    _that.options.clickHandler.apply()
                }
            });

            var footerDiv = $('<div/>', {
                html: "<div class=\"" + this.options.footerTextStyleClass + "\">" + this.options.footer + "</div>",
                "class": this.options.footerStyleClass,
                height: footerHeight
            });

            containerDiv.append(titleDiv).append(dataDiv).append(footerDiv);
            this.element.append(containerDiv);
        },

        _createDataDiv: function (dataCursor) {
            var titleHeight = this.options.height / 4;
            var footerHeight = titleHeight / 2;
            var dataHeight = this.options.height - titleHeight - footerHeight;
            var value = this.options.data.value;
            var valueStr = value;

            try{
                if(value % 1 == 0 || !this.options.showDecimalPoint){
                    valueStr = parseInt(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }else{
                    valueStr = parseFloat(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
                }
            }catch(exception){}

            var htmlDataStr =
                "<div style=\"display:inline-table;height:" + dataHeight + "px;cursor:" + dataCursor + "\">";

            if (value >= this.options.maxValueForSize) {
                htmlDataStr += "<div class=\"" + this.options.valueStyleClass + " num-trend-kpi-data-text-small\">";
            } else {
                htmlDataStr += "<div class=\"" + this.options.valueStyleClass + "\">";
            }


            htmlDataStr += (this.options.data.symbol != "" ? this.options.data.symbol : "") + valueStr;
            htmlDataStr += "</div>";

            if (this.options.data.trend != "") {
                var trendClass = this.options.trendFlatStyleClass;

                if (this.options.data.trend == "down") {
                    trendClass = this.options.trendDownStyleClass;
                } else if (this.options.data.trend == "flat") {
                    trendClass = this.options.trendFlatStyleClass;
                } else if (this.options.data.trend == "up") {
                    trendClass = this.options.trendUpStyleClass;
                }

                var kpiTrendHeight = dataHeight / 5 * 4;
                htmlDataStr += "<div class=\"" + trendClass + "\" style=\"height:" + kpiTrendHeight + "px;\"  />";
            }

            htmlDataStr += "</div>";

            var dataDiv = $('<div/>', {
                html: htmlDataStr,
                "class": "kpi-data num-trend-kpi-data",
                height: dataHeight,
                style: "cursor: " + dataCursor + ";"
            });

            return dataDiv;
        },

        setData: function (data) {
            this.options.data = data;
            var dataDiv = this._createDataDiv();

            this.element.find($(".num-trend-kpi-data")).remove();
            this.element.find($("." + this.options.headerStyleClass)).after(dataDiv);
        },

        getData: function () {
            return this.options.data;
        }


    });
}(jQuery));