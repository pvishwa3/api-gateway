var CBoardKpiRender = function (jqContainer, options) {
	this.container = jqContainer; // jquery object
	this.options = options;
};

CBoardKpiRender.prototype.html = function (persist) {
	var self = this;
	var temp = "" + self.template;
	var html = temp.render(self.options);
	if (persist) {
		setTimeout(function () {
			self.container.css('background', '#fff');
			html2canvas(self.container, {
				onrendered: function (canvas) {
					persist.data = canvas.toDataURL("image/jpeg");
					persist.type = "jpg";
					persist.widgetType = "kpi";
				}
			});
		}, 1000);

	}
	return html;
};

CBoardKpiRender.prototype.realTimeTicket = function () {
	var self = this;
	return function (o) {
		$(self.container).find('h3').html(o.kpiValue);
	}
};

CBoardKpiRender.prototype.do = function () {
	var self = this;
	$(self.container).html(self.rendered());
};

CBoardKpiRender.prototype.template =
	'<div class = "visChart__container kbn-resetFocusState">'+
	'<div class = "visChart">'+
	'<div class = "mtrVis">'+
	
	'<div class="mtrVis__container">'+
	'<div class="mtrVis__value"">'+
	'<span> {kpiValue}'+
	' </span>'+
	'</div>'+
	'<div class = "d-flex justify-content-center" style = "margin-top: -14px;"> <h5 style = "font-size:27px">{kpiPercentageOfChange}</h5>'+
	'<i class = "{textColor} icon-sm {class} d-flex align-items-center" style = "font-size:23px;margin-top:-13px"></i>'
	'</div>'+
	'</div>'+
	'</div>'+
	'</div>'+
	'</div>'
	