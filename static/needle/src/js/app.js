paintModule = require("./MutsNeedlePlot");
axios = require("axios");
var gene_ensembl_id = "ENSG00000134207"
var api_prefix = "http://139.224.117.98／pgx-level4/level4data/api/v1/mutations/"
axios.get(api_prefix + gene_ensembl_id + "?project_name=TCGAMutation&loader=mutation_gene_needle")
.then(function(response){
    colorMap = {
        // mutation categories
        "missense_variant": "yellow",
        "frameshift_variant": "blue",
        "stop_gained": "red",
        "stop_lost": "orange",
        "synonymous_variant": "lightblue",
        // regions
        "X-binding": "olive",
        "region1": "olive"
    };

    legends = {
        x: "Corresponding gene positions to gene " + gene_ensembl_id,
        y: "Number of recorded mutation in gene " + gene_ensembl_id
    };

    //Crate config Object
    plotConfig = {
        windowWidth: $(window).width(),
        maxCoord :      response.data.metadata.max_coord,
        minCoord :      response.data.metadata.min_coord,
        height:         350,
        targetElement : "yourDiv",
        mutationData:   response.data.data,
        // regionData:     "snippets/data/regions.json",
        colorMap:       colorMap,
        legends:        legends,
        responsive: 'resize'
    };

    // Instantiate a plot
    MutsNeedlePlot = paintModule["MutsNeedlePlot"];
    repaint = paintModule["repaint"];
    p = new MutsNeedlePlot(plotConfig);

    // $('yourDiv').click(repaint(plotConfig));
})
