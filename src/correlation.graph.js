function createCorrGraph(id, keys, corr) {
    // 1. 그래프 그리기

    // 아이디의 속성 값을 정해줄 클래스를 붙여준다
    $(id).addClass('correlation-bg');

    var axisMargin = 100;
    var parent = d3.select(id);


    var width = $(id).width();
    
    // 정사각형으로 만들어준다
    $(id).css('height', width);

    var drag = d3.drag().on('drag', d => console.log(d));
    
    // graph가 붙을 svg를 만들어 주는데, 클래스 속성 absolute를 이용해 왼쪽과 윗 부분을 100px씩 남긴다
    const svgMatrix = parent.append('svg').attr('class', 'field');

    // 위의 svg에 그래프가 붙을 g를 붙여준다
    const gMatrix = svgMatrix.append('g');

    // 정확한 그래프 g의 가로 사이즈를 저장
    const fieldSize = width - axisMargin;
    
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
    var interval = Math.max((fieldSize) / dataNum, 25);

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

    
    // 3. color

    var rColor = d3.rgb(151, 15, 38);
    var bColor = d3.rgb(5, 48, 97);
    var cWeight = 3;
    _.forEach(corr, function (d, y) {
        _.forEach(d, function (d, x) {
            var c = d > 0 ? bColor.brighter((1 - d) * cWeight) : rColor.brighter((1 + d) * cWeight);
            drawCircle(gMatrix, x * interval + interval / 2, y * interval + interval / 2, Math.abs(d) * interval / 2).attr('fill', c);
        });
    });



}


$(function () {
    createCorrGraph('#corrGraph', ['a', 'b', 'c'],
        [[1, 0.7, 0.5], [.3, 0, -.3], [-.5, -.7, -1]]);
});

