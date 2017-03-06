/**
 * Created by suhyun on 2017. 3. 6..
 */


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