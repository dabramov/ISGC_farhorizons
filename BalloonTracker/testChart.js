Highcharts.setOptions({
   global: {
      useUTC: false
   }
});
   
var chart1;
$(document).ready(function() {
	chart1 = new Highcharts.Chart({
		chart: {
		    renderTo: 'chart-container-1',
		    defaultSeriesType: 'scatter',
		    marginRight: 10,
		    events: {
			load: function() {
			}
		    }
		},
		title: {
		    text: 'Altitude'
		},
		credits: {
		    enabled: false
		},
		xAxis: {
		    title: {
			text: 'Time (min)'
		    }
		},
		yAxis: {
		    title: {
			text: 'Altitude (ft)'
		    },
		    min : 0,
		    plotLines: [{
			    value: 0,
			    width: 1,
			    color: '#808080'
			}]
		},
		tooltip: {
		    formatter: function() {
			return '<b>'+ this.series.name +'</b><br/>'+
			Highcharts.numberFormat(this.x,2) +'<br/>'+ 
			Highcharts.numberFormat(this.y, 2);
		    }
		},
		legend: {
		    enabled: false
		},
		exporting: {
		    enabled: false
		},
		series: [{
			name: 'altitudeVtime_lig',
			data: [],
			color: '#E00000'
		    },{
			name: 'altitudeVtime_lhw',
			data: [],
			color: '#00E000'
		    },{
			name: 'altitudeVtime_sky',
			data: [],
			color: '#0000E0'
		    }]
	    });
	
	
    });

var chart2;
$(document).ready(function() {
	chart2 = new Highcharts.Chart({
		chart: {
		    renderTo: 'chart-container-2',
		    defaultSeriesType: 'scatter',
		    marginRight: 10,
		    events: {
			load: function() {
			}
		    }
		},
		title: {
		    text: 'Wind Speed'
		},
		credits: {
		    enabled: false
		},
		xAxis: {
		    title: {
			text: 'Wind Speed (mph)'
		    },
		    min:0.0001,
		},
		yAxis: {
		    title: {
			text: 'Altitude (ft)'
		    },
		    min: 0,
		    plotLines: [{
			    value: 0,
			    width: 1,
			    color: '#808080'
			}]
		},
		tooltip: {
		    formatter: function() {
			return '<b>'+ this.series.name +'</b><br/>'+
			Highcharts.numberFormat(this.x,2) +'<br/>'+ 
			Highcharts.numberFormat(this.y, 2);
		    }
		},
		legend: {
		    enabled: false
		},
		exporting: {
		    enabled: false
		},
		series: [{
			name: 'speedValtitude_lig',
			data: [],
			color: '#E00000'},
	                 {
			name: 'speedValtitude_lhw',
			data: [],			
			color: '#00E000'},
	                 {
			name: 'speedValtitude_sky',
			data: [],
			color: '#0000E0'}]});
	
	
    });
