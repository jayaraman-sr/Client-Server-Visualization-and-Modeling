var margin = 50;
var width = 600;
var height = 400;


function plotGraph() {
	var link = "http://127.0.0.1:5000/roc/" + document.querySelector('input[name = "scaler_option"]:checked').value + "/" + document.getElementById('c_value').value;
	var dataG = d3.select("svg")
		.attr("width", width + margin)
		.attr("height", height + 2 * margin)
		.append("g")
		.attr("transform", "translate(" + margin + ", " + margin + ")");


	d3.json(link).then(function(data) {

	var x = d3.scaleLinear()
		.domain(d3.extent(data, function (d) {
			return d.fpr;
		}))
		.range([0, width - 20]);

	var y = d3.scaleLinear()
		.domain(d3.extent(data, function (d) {
			return d.tpr;
		}))
		.range([height, 0]);

	var xAxisGroup = dataG
		.append("g")
		.attr("class", "xAxisGroup")
		.attr("transform", "translate(0," + height + ")");

	var xAxis = d3.axisBottom(x).ticks(5);
	xAxis(xAxisGroup);

	var yAxisGroup = dataG
		.append("g")
		.attr("class", "yAxisGroup");

	var yAxis = d3.axisLeft(y).ticks(5);
	yAxis(yAxisGroup);

	dataG.append("text")
		.attr("transform","translate(" + (width/2 - 20) + " ," + (height + 40) + ")")
		.style("text-anchor", "middle")
		.text("False Positive Rate");

	dataG.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - 45)
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("True Positive Rate");

	var scale_horizontal = d3.scaleLinear()
		.domain( [0.0, 1.5] )
		.range( [0.0, width] );

	var scale_vertical = d3.scaleLinear()
		.domain( [0.0, 1.0] )
		.range( [0.0, width - 20] );

	var gridlineshorizontal = d3.axisLeft()
		.tickFormat(" ")
		.tickSize(-width + 20)
		.ticks(9)
		.scale(scale_horizontal);

	var gridlinesvertical = d3.axisBottom()
		.tickFormat(" ")
		.tickSize(height)
		.ticks(5)
		.scale(scale_vertical);
        
	dataG.append("g")
		.attr("class", "grid")
		.attr("color", "gainsboro")
		.call(gridlineshorizontal);

	dataG.append("g")
		.attr("class", "grid")
		.attr("color", "gainsboro")
		.call(gridlinesvertical);

	var line = d3.line()
		.x(d => x(d.fpr))
		.y(d => y(d.tpr));

	dataG.append("path")
		.data([data])
		.attr("fill", "none")
		.attr("stroke", "blue")
		.attr("stroke-width", "2px")
		.attr("d", line);

	var random_choice_line_data = [{"x": 0.0, "y": 0.0}, {"x": 1.0, "y": 1.0}];
	var random_choice_line = d3.line()
		.x(d => x(d.x))
		.y(d => y(d.y));

        dataG.append("path")
            .data([random_choice_line_data])
            .attr("fill", "none")
            .style("stroke-dasharray", ("3, 3"))
            .attr("stroke", "red")
            .attr("stroke-width", "2px")
            .attr("d", random_choice_line);

        
    });
}
