'use strict';

function createCorrGraph(id, keys, corr) {
    // 1. 그래프 그리기
    // 아이디의 속성 값을 정해줄 클래스를 붙여준다


    var $parent = $(id);
    $parent.empty();
    var axisMargin = 100;
    var parent = d3.select(id);

    var eles = new Array(keys.length);
    var svgMatrix = parent.append('svg').attr('class', 'field');
    var gMatrix = svgMatrix.append('g');

    var svgAxisHori = parent.append('svg').attr('class', 'axis horizon');
    var gAxisHori = svgAxisHori.append('g');

    var svgAxisVert = parent.append('svg').attr('class', 'axis vertical');
    var gAxisVert = svgAxisVert.append('g');

    var dataNum = keys.length;

    var interval = 25;

    var e = interval * dataNum;

    _.forEach(keys, function (k, i) {
        var p = interval * i;
        writeText(gAxisHori, k, p + interval / 2, axisMargin - 20, -90, 'axis');
        writeText(gAxisVert, k, axisMargin - 20, p + interval / 2, 0, 'axis').attr('text-anchor', 'end');
        drawLine(gMatrix, 0, p, e, p).attr('class', 'line');
        drawLine(gMatrix, p, 0, p, e).attr('class', 'line');
    });

    var gx = 0;
    var gy = 0;

    svgMatrix.call(d3.drag().on('drag', function () {

        var gMaxX = interval * dataNum - $(id).width() + axisMargin;
        var gMaxY = interval * dataNum - $(id).height() + axisMargin;

        gx -= d3.event.dx * 1;
        gy -= d3.event.dy * 1;

        gx = Math.min(gMaxX, Math.max(0, gx));
        gy = Math.min(gMaxY, Math.max(0, gy));

        gMatrix.attr('transform', 'translate(' + -gx + ',' + -gy + ')');
        gAxisHori.attr('transform', 'translate(' + -gx + ',0)');
        gAxisVert.attr('transform', 'translate(0,' + -gy + ')');
    }).on('end', function () {
        var modX = gx % interval;
        var modY = gy % interval;
        gx -= modX < interval / 2 ? modX : -(interval - modX);
        gy -= modY < interval / 2 ? modY : -(interval - modY);

        gMatrix.transition().attr('transform', 'translate(' + -gx + ',' + -gy + ')');
        gAxisHori.transition().attr('transform', 'translate(' + -gx + ',0)');
        gAxisVert.transition().attr('transform', 'translate(0,' + -gy + ')');
    }));

    var d = [12, 3];

    var circle = gMatrix.selectAll('circle').data(corr);
    circle.enter().append('circle');

    var rColor = d3.rgb(151, 15, 38);
    var bColor = d3.rgb(5, 48, 97);

    _.forEach(corr, function (d, y) {
        _.forEach(d, function (d, x) {
            // var c = d > 0 ? bColor.brighter((1 - d) * cWeight) : rColor.brighter((1 + d) * cWeight);
            // var rc = drawRect(gMatrix, x * interval + interval / 2, y * interval + interval / 2, Math.abs(d) * interval / 2).attr('fill', c);
            var c = d > 0 ? bColor : rColor;
            var rc = drawRect(gMatrix, x * interval + 1, y * interval + 1, interval - 2).attr('fill', c).attr('opacity', Math.min(Math.abs(d) * 1.3, 1));
        });
    });
}

var __CorrNetwork = void 0;
function CreateCorrNetwork(id, keys, corr) {
    $(id).empty();
    var comp = $('<div class="absolute"></div>').appendTo(id);

    var container = document.getElementById(id.replace('#', ''));

    var nodes = new vis.DataSet(_.map(keys, function (d, i) {
        return { id: i, label: d, color: '#0188E5', size: 20, select: true };
    }));

    if (!_.isNil(__CorrNetwork)) {
        console.log(__CorrNetwork);
        __CorrNetwork.destroy();
        __CorrNetwork = null;
    }
    // create an array with edges
    var edges = new vis.DataSet([]);
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            shape: 'dot',
            size: 10
        },
        "edges": {
            "smooth": {
                "forceDirection": "none"
            }
        },
        "physics": {
            "maxVelocity": 4,
            "minVelocity": 0.07
        }
    };
    __CorrNetwork = new vis.Network(container, data, options);

    var savedIdx = 0;
    var idx = 0;
    this.setEdge = function (mode) {
        if (_.isNil(mode)) mode = 'Most Impact (ABS Correlation more that 0.7)';
        var rawEdges = [];

        for (var i = 0; i < idx; i++) {
            edges.remove({ id: i });
        }console.log(edges);
        idx = 0;

        var val = _.takeRight(mode, 5);
        var cut_cor = (val[0] == '-' ? -.1 : .1) * Number(val[3]);
        if (mode.startsWith('Most Impact')) {
            _.forEach(corr, function (cs, x) {
                var maxVal = 0;
                var maxIndex = -1;
                var minVal = 0;
                var minIndex = -1;
                _.forEach(cs, function (c, y) {
                    if (x < y) {
                        if (c < -cut_cor) {
                            minVal = c;
                            minIndex = y;
                        } else if (c > cut_cor) {
                            maxVal = c;
                            maxIndex = y;
                        }
                    }
                });

                if (maxIndex != -1) edges.update({ id: ++idx, from: x, to: maxIndex, color: '#0188E5', arrows: 'to' });
                if (minIndex != -1) edges.update({ id: ++idx, from: x, to: minIndex, color: '#ff5e7C', arrows: 'to' });
            });
        } else {
            _.forEach(corr, function (cs, x) {
                return _.forEach(cs, function (c, y) {
                    if (x < y && Math.abs(c) > cut_cor) {
                        edges.update({ id: ++idx, from: x, to: y, color: c < 0 ? '#ff5e7C' : '#0188E5' });
                    }
                });
            });
        }

        for (var i = idx; i < savedIdx; i++) {
            edges.remove({ id: i });
        }savedIdx = idx;
    };

    __CorrNetwork.on("stabilized", function (params) {
        // network.physics.physicsEnabled = false;
    });

    __CorrNetwork.on("selectNode", function (params) {
        var node = nodes._data[params.nodes[0]];
        node.select = !node.select;
        if (node.select) {
            node.size = 20;
            node.color = '#0188E5';
        } else {
            node.size = 20;
            node.color = '#cccccc';
        }
        nodes.update(node);
    });

    this.setEdge();
}
//# sourceMappingURL=correlation.graph.js.map