function contourColorStroke(){

	// return d3.scale
	// 			.linear()
	// 			.domain([ case_study[default_case].startLevel + case_study[default_case].zoom,
	// 				case_study[default_case].endLevel + case_study[default_case].zoom ])
	// 			.range(["#0000ff","#ff0000"]);

	//diverging from blue to red;
	//var color = ["#034e7b", "#3690c0", "#66ccff", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"];
	//constant color;
	var color = ["#3182bd"];

	var q = d3.scale.quantize().domain([ profile.startLevel + profile.zoom,
										profile.endLevel + profile.zoom ])
								.range(color);
	return q;
}

function contourColorFill(){

	if(userStudyController != null && userStudyController.constructor.name == 'UserStudyController')
		return d3.scale.quantize().domain([ 1, 20 ])
								.range(["#ffffff", "#ffffff"]);


	var numOfLevels = profile.endLevel - profile.startLevel + 1;

	var greys = colorbrewer['Greys'][numOfLevels];
	var blues = ['#eff3ff','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#084594'];

	//for case study;
	// var divergent
	// if(globalName == 'rnc_l1')
	// 	divergent = colorbrewer['RdYlBu'][numOfLevels+3].slice(3, numOfLevels+3);
	// else if(globalName == 'rnc_l2')
	// 	divergent = colorbrewer['RdYlBu'][numOfLevels+5].slice(0, numOfLevels);
	// else
	// 	divergent = colorbrewer['RdYlBu'][numOfLevels].slice();

	// divergent.reverse();

	var divergent = colorbrewer['RdYlBu'][numOfLevels].slice();
	divergent.reverse();

	var quant;
	if(numOfLevels< 9)
		quant = colorbrewer['Set2'][numOfLevels];
	else
		quant = colorbrewer['Set3'][numOfLevels];

	var color = null;
	if(ContourVis.CONTOUR == ContourVis.CONTOURMODE.FILLSINGLE)
		color = ["#9ecae1"];
	else if(ContourVis.CONTOUR == ContourVis.CONTOURMODE.FILLSEQUENTIAL )
		color = blues;
	else if(ContourVis.CONTOUR == ContourVis.CONTOURMODE.DIVERGENT )
		color = divergent;
	else if(ContourVis.CONTOUR == ContourVis.CONTOURMODE.QUANT )
		color = quant;
	else if(ContourVis.CONTOUR == ContourVis.CONTOURMODE.BOUND)
		color = ["none"];
	else if(ContourVis.CONTOUR == ContourVis.CONTOURMODE.DENSITY){
		return densityColor(ContourVis.densityMin, ContourVis.densityMax);
	}

	//diverging from blue to red;
	//var color = ["#034e7b", "#3690c0", "#66ccff", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"];
	//sequential;
	//var color = ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c'];
	//constant color;
	//var color = ["#9ecae1"];

	var q = d3.scale.quantize().domain([ profile.startLevel + profile.zoom,
										profile.endLevel + profile.zoom ])
								.range(color);
	return q;
}


function contourColorForUS1(){

	var numOfLevels = profile.endLevel - profile.startLevel + 1;

	var greys = colorbrewer['Greys'][numOfLevels];
	var blues = ['#eff3ff','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#084594'];

	//for case study;
	// var divergent
	// if(globalName == 'rnc_l1')
	// 	divergent = colorbrewer['RdYlBu'][numOfLevels+3].slice(3, numOfLevels+3);
	// else if(globalName == 'rnc_l2')
	// 	divergent = colorbrewer['RdYlBu'][numOfLevels+5].slice(0, numOfLevels);
	// else
	// 	divergent = colorbrewer['RdYlBu'][numOfLevels].slice();

	// divergent.reverse();

	var divergent = colorbrewer['RdYlBu'][numOfLevels].slice();
	divergent.reverse();

	var quant;
	if(numOfLevels< 9)
		quant = colorbrewer['Set2'][numOfLevels];
	else
		quant = colorbrewer['Set3'][numOfLevels];

	var color = null;
	if(ContourVis.CONTOUR == ContourVis.CONTOURMODE.FILLSINGLE)
		color = ["#9ecae1"];
	else if(ContourVis.CONTOUR == ContourVis.CONTOURMODE.FILLSEQUENTIAL )
		color = blues;
	else if(ContourVis.CONTOUR == ContourVis.CONTOURMODE.DIVERGENT )
		color = divergent;
	else if(ContourVis.CONTOUR == ContourVis.CONTOURMODE.QUANT )
		color = quant;
	else if(ContourVis.CONTOUR == ContourVis.CONTOURMODE.BOUND)
		color = ["none"];
	else if(ContourVis.CONTOUR == ContourVis.CONTOURMODE.DENSITY){
		return densityColor(ContourVis.densityMin, ContourVis.densityMax);
	}

	//diverging from blue to red;
	//var color = ["#034e7b", "#3690c0", "#66ccff", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"];
	//sequential;
	//var color = ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c'];
	//constant color;
	//var color = ["#9ecae1"];

	// var q = d3.scale.quantize().domain([ profile.startLevel + profile.zoom,
	// 									profile.endLevel + profile.zoom ])
	// 							.range(color);
	return color;
}

// function statColor(){

// 	//divergent color scheme
// 	//var color = ['#8c510a','#bf812d','#dfc27d','#f6e8c3','#f5f5f5','#c7eae5','#80cdc1','#35978f','#01665e'];
// 	var color = ['#fbb4ae','#b3cde3','#ccebc5','#decbe4'];
// 	color.unshift('#aaaaaa');
	
// 	var q = d3.scale.quantize().domain([-1, 3]).range(color);
// 	return q;
// }

//https://bl.ocks.org/mbostock/5577023
function divergentColorList(){


	if(userStudyController != null && UserStudyController.numOfCate == 2)
		return ["#fb6a4a", "#2b8cbe"];
	if(userStudyController != null && UserStudyController.numOfCate == 4)
		//return ["#33a02c", '#ff7f00', "#6a3d9a", "#ff0000"];
		return ['#1f78b4','#e31a1c','#33a02c','#ff7f00'];

	//light
	// return ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9'];
	//lighter
	//return ['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6','#ffffcc','#e5d8bd','#fddaec','#f2f2f2'];
	//dark
	//return ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'];

	//modified:
	//var set3 = ["#ffffb3", "#fb8072", "#8dd3c7", "#bc80bd"];
	var color = ['#1f78b4','#e31a1c','#33a02c','#ff7f00'];
	// var color = colorbrewer['Set3'][4];

	//for 3 cates, this is good;
	//var color = ["#33a02c", '#ff7f00', "#6a3d9a"];

	//for 2 cates, this is good;
	//var color = ["#fb6a4a", "#2b8cbe"];

	return color;
}

//for density
function densityColor(min, max){
	
	if(min >= max)
		if(max == 0)
			return function() { return "#fff"; };
		else
			return function() { return "#faa"; };

	return d3.scale.linear()
					.domain([min, max])
					.range(['#fee8c8', '#e34a33']);

}

//two normalized vectors (the sum of array is 1), their distance is less or equal to 1
//0 maps to light color, 1 maps to 
function variaceColor(){

	return d3.scale.linear()
					.domain([0, 1])
					.range(['#fee0d2', '#de2d26']);
}