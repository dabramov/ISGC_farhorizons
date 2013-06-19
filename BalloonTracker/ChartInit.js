var chart1; // globally available
$(document).ready(function() {
      chart1 = new Highcharts.Chart({
         chart: {
            renderTo: 'chart-container-1',
            defaultSeriesType: 'scatter'
         },
         title: {
            text: 'Altitude'
         },
	 credits: {
		  enabled: false
	 },
         xAxis: {
            title: {
               text: 'Time'
            }
         },
         yAxis: {
            title: {
               text: 'Altitude'
            }
         },
         series: [{
            name: 'WB9SKY-11',
            data: [[0,625],[1,1600],[2,2500],[3,3550],[4,4600],[5,4000],[6,2500],[7,1500]]
         }]
      });
   });