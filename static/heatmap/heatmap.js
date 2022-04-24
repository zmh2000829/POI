var G2 = require("g2");

function addTitle(dest, config){
    $('<h2 style="margin-bottom: 5px; text-align: center">' +  config.gene_ensembl_id + ' - ' + config.title + '</h2>').appendTo($('#' + dest));
    $('<h5 style="text-align: center; margin: 5px 0px">log2(FPKM + 0.01)</h5>').appendTo($('#' + dest));
}

function heatmap(dest, res, config) {
	var data = res.data;
	var tissues = res.tissues;
	var transcripts = res.transcript_ids;
	config.gene_ensembl_id = res.gene_ensembl_id;
	addTitle(dest, config);

	var source = [];
	for(var i = 0; i < data.length; i++){
		var item = data[i];
		var obj = {};
		obj.transcript = item[0];
		obj.tissue = item[1];
		obj.expr_value = item[2];
		source.push(obj);
	}

	var chart = new G2.Chart({
		id: dest,
		forceFit: config.forceFit && true,
		height: config.height || 300,
		width: config.width || 1000,
		plotCfg: {
			margin: [10, 80, 70, 125]
		}
	});

	chart.source(source, {
		'tissue': {
			type: 'cat',
			values: tissues,
			alias: config.xTitle || 'Tissue Type'
		},
		'transcript': {
			type: 'cat',
			values: transcripts,
			alias: config.yTitle || 'TranscriptEnsemblID'
		},
		'expr_value': {
			alias: config.legendTitle || 'ExprValue'
		}
	});

	chart.axis('tissue', {
		titleOffset: 55,
		labelOffset: 10,
		labels: {
			autoRotate: false,
			label: {
				textAlign: 'right',
				fontSize: config.xAxisFontSize || '12',
				rotate: config.xAxisRotate || -30
			}
		}
	});

	chart.axis('transcript', {
		titleOffset: 115,
		title: {
			textAlign: 'center'
		},
		labelOffset: 10,
		labels: {
			autoRotate: false,
			label: {
				textAlign: 'right',
				fontSize: config.yAxisFontSize || '12',
				rotate: config.yAxisRotate || -30
			}
		}
  	});

  	chart.polygon().position('tissue*transcript').color('expr_value', '#f0d99c-#bf444c').label('expr_value').tooltip('transcript*expr_value');
	chart.tooltip({
		crosshairs: {
			type: 'cross'
		}
	});
	return chart;
}

module.exports = {
	heatmap: heatmap
};
