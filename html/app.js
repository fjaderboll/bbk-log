
function loadData() {
	let r = Math.floor(Math.random() * 100000);
	$.get("bbk.log?r=" + r, function(data, status){
		displayFileContent(data);
		renderDiagram(data);
	});
}

function displayFileContent(fileContent) {
	document.getElementById('raw-content').innerText = fileContent;
}

function renderDiagram(fileContent) {
	var lySerie = { name: "Latency",  yAxis: 1, color: "orange",  data: [], tooltip: {valueSuffix: ' ms'} };
	var dlSerie = { name: "Download", yAxis: 0, color: "#008800", data: [], tooltip: {valueSuffix: ' Mbit/s'} };
	var ulSerie = { name: "Upload",   yAxis: 0, color: "#000088", data: [], tooltip: {valueSuffix: ' Mbit/s'} };

	var series = [dlSerie, ulSerie, lySerie];

	fileContent.split('\n').forEach(function(line) {
		if(line !== "") {
			var parts = line.split(' ');
			var time = new Date(parts[0]).getTime();

			var latency = parseFloat(parts[1]);
			var download = parseFloat(parts[2]);
			var upload = parseFloat(parts[3]);

			lySerie.data.push([time, latency]);
			dlSerie.data.push([time, download]);
			ulSerie.data.push([time, upload]);
		};
	});

	Highcharts.chart('container', {
		title: {
			text: 'Bredbandskollen - speed log'
		},
		chart: {
			type: 'line',
			zoomType: 'x'
		},
		legend: {
			layout: 'horizontal',
			align: 'center',
			verticalAlign: 'bottom'
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			valueDecimals: 1
		},
		yAxis: [
			{
				title: {
					text: 'Mbit/s'
				},
				min: 0
			},
			{
				title: {
					text: 'ms'
				},
				min: 0,
				opposite: true
			}
		],
		xAxis: {
			type: 'datetime'
		},
		series: series
	});
}

loadData();
