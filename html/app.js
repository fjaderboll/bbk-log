
function loadData() {
	let r = Math.floor(Math.random() * 100000);
	$.get("bbk.log?r=" + r, function(data, status) {
		displayFileContent(data);

		let entries = parseData(data);
		drawLogChart(entries);
		drawGroupByChart(
			entries,
			'hour-chart',
			'Speed by hour',
			function(entry) { return entry.timestamp.getHours(); },
			function(entry) { return entry.timestamp.getHours(); }
		);
		drawGroupByChart(
			entries,
			'day-chart',
			'Speed by day',
			function(entry) { return (entry.timestamp.getDay() + 6) % 7; },
			function(entry) { return entry.timestamp.toLocaleString('en-us', { weekday: 'long' }); }
		);
	});
}

function displayFileContent(fileContent) {
	document.getElementById('raw-content').innerText = fileContent;
}

function parseData(fileContent) {
	const entries = [];
	fileContent.split('\n').forEach(function(line) {
		if(line !== "") {
			const parts = line.split(' ');
			const entry = {
				timestamp: new Date(parts[0]),
				latency: parseFloat(parts[1]),
				download: parseFloat(parts[2]),
				upload: parseFloat(parts[3])
			}
			entries.push(entry);
		};
	});
	return entries;
}

function createSeries() {
	const dlSerie = { name: "Download", yAxis: 0, color: "#008800", data: [], tooltip: {valueSuffix: ' Mbit/s'} };
	const ulSerie = { name: "Upload",   yAxis: 0, color: "#000088", data: [], tooltip: {valueSuffix: ' Mbit/s'} };
	const lySerie = { name: "Latency",  yAxis: 1, color: "orange",  data: [], tooltip: {valueSuffix: ' ms'} };

	const series = [dlSerie, ulSerie, lySerie];
	return series;
}

function drawLogChart(entries) {
	var series = createSeries();

	entries.forEach(function(entry) {
		series[0].data.push([entry.timestamp.getTime(), entry.download]);
		series[1].data.push([entry.timestamp.getTime(), entry.upload]);
		series[2].data.push([entry.timestamp.getTime(), entry.latency]);
	});

	Highcharts.chart('log-chart', {
		title: {
			text: 'Speed'
		},
		subtitle: {
			text: entries.length + ' entries'
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

function drawGroupByChart(entries, chartId, chartTitle, groupKeyFunc, groupNameFunc) {
	// group by hour
	let n = 0;
	const groupObj = {};
	entries.forEach(function(entry) {
		if(entry.latency < 0 || entry.download < 0 || entry.upload < 0) {
			return;
		}

		let key = groupKeyFunc(entry);
		let group = groupObj[key];
		if(!group) {
			group = {
				key: key,
				name: groupNameFunc(entry),
				entries: []
			};
			groupObj[key] = group;
		}
		group.entries.push(entry);
		n++;
	});
	let groups = Object.values(groupObj);
	groups.sort(function(g1, g2) {
		return g1.key - g2.key;
	});

	// calculate average
	groups.forEach(function(group) {
		group.average = {
			latency: 0,
			download: 0,
			upload: 0
		};
		group.entries.forEach(function(entry) {
			group.average.latency += entry.latency;
			group.average.download += entry.download;
			group.average.upload += entry.upload;
		});
		group.average.latency /= group.entries.length;
		group.average.download /= group.entries.length;
		group.average.upload /= group.entries.length;
	});

	// create chart data
	const categories = [];
	const series = createSeries();
	groups.forEach(function(group) {
		categories.push(group.name);
		series[0].data.push(group.average.download);
		series[1].data.push(group.average.upload);
		series[2].data.push(group.average.latency);
	});

	Highcharts.chart(chartId, {
		title: {
			text: chartTitle
		},
		subtitle: {
			text: n + ' entries'
		},
		chart: {
			type: 'column'
		},
		legend: {
			layout: 'horizontal',
			align: 'center',
			verticalAlign: 'bottom'
		},
		tooltip: {
			shared: true,
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
			categories: categories
		},
		series: series
	});
}

loadData();
