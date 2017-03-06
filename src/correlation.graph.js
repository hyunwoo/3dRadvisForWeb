function createCorrGraph(id, keys, corr) {


    $(id).addClass('correlation-bg');

    var axisMargin = 100;
    var parent = d3.select(id);


    var width = $(id).width();
    console.log('corr graph width ', $(id), width, $(id).css('width'));
    $(id).css('height', width);

    //var variableSpace =
    var drag = d3.drag().on('drag', d => console.log(d));

    const svgMatrix = parent.append('svg').attr('class', 'field');
    const gMatrix = svgMatrix.append('g');
    const fieldSize = width - axisMargin;

    const svgAxisHori = parent.append('svg').attr('class', 'axis horizon')
    const gAxisHori = svgAxisHori.append('g');

    const svgAxisVert = parent.append('svg').attr('class', 'axis vertical')
    const gAxisVert = svgAxisVert.append('g');

    var dataNum = keys.length;

    var interval = Math.max((fieldSize) / dataNum, 25);

    var e = interval * dataNum;
    _.forEach(keys, function (k, i) {
        var p = interval * i;
        writeText(gAxisHori, k, p + interval / 2, axisMargin - 20, -90, 'axis');
        writeText(gAxisVert, k, axisMargin - 20, p + interval / 2, 0, 'axis')
            .attr('text-anchor', 'end');

        drawLine(gMatrix, 0, p, e, p).attr('class', 'line');
        drawLine(gMatrix, p, 0, p, e).attr('class', 'line');
    });


    var gx = 0;
    var gy = 0;
    var gmax = interval * dataNum - fieldSize;

    svgMatrix.call(d3.drag().on('drag', () => {
        gx -= d3.event.dx * 1;
        gy -= d3.event.dy * 1;

        gx = Math.min(gmax, Math.max(0, gx));
        gy = Math.min(gmax, Math.max(0, gy));

        gMatrix.attr('transform', `translate(${-gx},${-gy})`);
        gAxisHori.attr('transform', `translate(${-gx},0)`);
        gAxisVert.attr('transform', `translate(0,${-gy})`);

    }).on('end', () => {
        var modX = gx % interval;
        var modY = gy % interval;
        gx -= modX < interval / 2 ? modX : -(interval - modX);
        gy -= modY < interval / 2 ? modY : -(interval - modY);

        gMatrix.transition().attr('transform', `translate(${-gx},${-gy})`);
        gAxisHori.transition().attr('transform', `translate(${-gx},0)`);
        gAxisVert.transition().attr('transform', `translate(0,${-gy})`);
    }));


    var rColor = d3.rgb(151, 15, 38);
    var bColor = d3.rgb(5, 48, 97);
    var cWeight = 3;
    _.forEach(corr, function (d, y) {
        _.forEach(d, function (d, x) {
            var c = d > 0 ? bColor.brighter((1 - d) * cWeight) : rColor.brighter((1 + d) * cWeight);
            drawCircle(gMatrix, x * interval + interval / 2, y * interval + interval / 2, Math.abs(d) * interval / 2).attr('fill', c);
        });
    });


    function writeText(section, text, x, y, rotate, cls) {
        if (_.isNil(rotate)) rotate = 0;

        var d3_text = section.append('text')
            .text(text)
            .attr('transform', `translate(${x},${y}), rotate(${rotate})`)
            .attr('alignment-baseline', 'middle');

        if (!_.isNil(cls)) d3_text.attr('class', cls);
        return d3_text;
    }

    function drawLine(section, x1, y1, x2, y2) {
        return section.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2).attr("stroke", 'black')
    }

    function drawCircle(section, x, y, r) {
        return section.append('circle').attr('cx', x).attr('cy', y).attr('r', r);
    }
}


$(function () {
    createCorrGraph('#corrGraph', ['a', 'b', 'c'],
        [[1, 0.7, 0.5], [.3, 0, -.3], [-.5, -.7, -1]]);
});

