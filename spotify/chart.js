function drawStreamsChart(){
  google.load('visualization', '1.0', {'packages':['corechart']});
  google.setOnLoadCallback(drawChart);
}


function drawChart(weeks) {
        var data = google.visualization.arrayToDataTable([
          ['Date', 'Streams'],
          [ 28/04/2013, 10,000],
          [ 05/05/2013, 20,000],
          [ 12/05/2013, 25,000]
        ]);

        var options = {
          title: 'Age vs. Weight comparison',
          hAxis: {title: 'Date', minValue: 28/04/2013, maxValue: 12/05/2013},
          vAxis: {title: 'Streams', minValue: 0, maxValue: 200,000},
          legend: 'none'
        };

        var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

        chart.draw(data, options);
      }
