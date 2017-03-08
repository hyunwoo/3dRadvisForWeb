function createCorrGraph(id, keys, corr) {
    // 1. 그래프 그리기
    // 아이디의 속성 값을 정해줄 클래스를 붙여준다


    var $parent = $(id);
    $parent.empty();
    var axisMargin = 100;
    var parent = d3.select(id);

    let eles = new Array(keys.length);
    // graph가 붙을 svg를 만들어 주는데, 클래스 속성 absolute를 이용해 왼쪽과 윗 부분을 100px씩 남긴다
    const svgMatrix = parent.append('svg').attr('class', 'field');
    const gMatrix = svgMatrix.append('g');


    // horizon tag 가 붙을 svg를 만들어 주는데, 클래스 속성 absolute를 이용해 남겨둔 윗부분에 붙여준다
    const svgAxisHori = parent.append('svg').attr('class', 'axis horizon')
    const gAxisHori = svgAxisHori.append('g');

    // vertical tag 가 붙을 svg를 만들어 주는데, 클래스 속성 absolute를 이용해 남겨둔 왼쪽부분에 붙여준다
    const svgAxisVert = parent.append('svg').attr('class', 'axis vertical')
    const gAxisVert = svgAxisVert.append('g');

    // 데이터의 개수
    var dataNum = keys.length;

    // 위에서 저장해둔 그래프가 붙은 g의 가로 사이즈를 데이터 개수로 나누어 준다
    // 함수를 이용해 그래프 한 칸의 최소값을 정해준다
    var interval = 25;

    // 그래프의 전테 길이를 저정한다 (그래프 한 칸 간격 * 실제 데이터 개수)
    var e = interval * dataNum;

    // 데이터의 개수만큼 돌면서
    _.forEach(keys, function (k, i) {
        // 데이터 name tag가 붙을 위치를 잡아준다
        var p = interval * i;
        // 데이터 순서에 따른 간격읋 잡아 준 뒤 간격 반을 더해주어 가운데 위치하도록
        writeText(gAxisHori, k, p + interval / 2, axisMargin - 20, -90, 'axis');
        writeText(gAxisVert, k, axisMargin - 20, p + interval / 2, 0, 'axis')
            .attr('text-anchor', 'end');
        // 라인을 그려준다
        drawLine(gMatrix, 0, p, e, p).attr('class', 'line');
        drawLine(gMatrix, p, 0, p, e).attr('class', 'line');
    });


    // 2. 마우스 이동에 따라 화면을 고정
    var gx = 0;
    var gy = 0;

    svgMatrix.call(d3.drag().on('drag', () => {

        var gMaxX = interval * dataNum - $(id).width() + axisMargin;
        var gMaxY = interval * dataNum - $(id).height() + axisMargin;

        gx -= d3.event.dx * 1;
        gy -= d3.event.dy * 1;

        gx = Math.min(gMaxX, Math.max(0, gx));
        gy = Math.min(gMaxY, Math.max(0, gy));

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

    var d = [12, 3];

    var circle = gMatrix.selectAll('circle').data(corr);
    circle.enter().append('circle');

    var rColor = d3.rgb(151, 15, 38);
    var bColor = d3.rgb(5, 48, 97);
    var cWeight = 3;

    _.forEach(corr, function (d, y) {
        _.forEach(d, function (d, x) {
            var c = d > 0 ? bColor.brighter((1 - d) * cWeight) : rColor.brighter((1 + d) * cWeight);
            var circle = drawCircle(gMatrix, x * interval + interval / 2, y * interval + interval / 2, Math.abs(d) * interval / 2).attr('fill', c);

        });
    });

}


let __CorrNetwork;
function CreateCorrNetwork(id, keys, corr) {
    $(id).empty();
    let comp = $('<div class="absolute"></div>').appendTo(id);

    var container = document.getElementById(id.replace('#', ''));

    var nodes = new vis.DataSet(_.map(keys, (d, i) => {
        return {id: i, label: d, color: '#0188E5', size: 20, select: true}
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

        for (var i = 0; i < idx; i++) edges.remove({id: i});

        console.log(edges);
        idx = 0;

        var val = _.takeRight(mode, 5);
        var cut_cor = (val[0] == '-' ? -.1 : .1 ) * Number(val[3]);
        if (mode.startsWith('Most Impact')) {
            _.forEach(corr, (cs, x) => {
                var maxVal = 0;
                var maxIndex = -1;
                var minVal = 0;
                var minIndex = -1;
                _.forEach(cs, (c, y) => {
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

                if (maxIndex != -1) edges.update({id: ++idx, from: x, to: maxIndex, color: '#0188E5', arrows: 'to'});
                if (minIndex != -1) edges.update({id: ++idx, from: x, to: minIndex, color: '#ff5e7C', arrows: 'to'});
            });
        } else {
            _.forEach(corr, (cs, x) => _.forEach(cs, (c, y) => {
                if (x < y && Math.abs(c) > cut_cor) {
                    edges.update({id: ++idx, from: x, to: y, color: c < 0 ? '#ff5e7C' : '#0188E5'});
                }
            }));
        }


        for (var i = idx; i < savedIdx; i++) edges.remove({id: i});
        savedIdx = idx;
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
        }
        else {
            node.size = 20;
            node.color = '#cccccc';
        }
        nodes.update(node);
    });

    this.setEdge();

}