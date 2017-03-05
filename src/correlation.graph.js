/**
 * Created by suhyun on 2017. 3. 5..
 */

var width;
var height;
var g;
var verticalG;
var horizonG;
$(function () {
    var svg = d3.select(".correlation-bg").append("svg").attr('class', 'correlation');

    width = $('.correlation').width();
    height = $('.correlation').height();

    //var variableSpace =

    g = svg.append('g');

    var dataNum = 20;

    var vx1 = 0;
    var vy1 = 0;
    var vx2 = width;
    var vy2 = 0;

    var hx1 = 0;
    var hy1 = 0;
    var hx2 = 0;
    var hy2 = height;
    var interval = width/dataNum;

    for(var i = 0 ; i <= dataNum ; i++){
        drawLine(g, vx1, vy1, vx2, vy2);
        vy1 += interval;
        vy2 += interval;
    }

    for(var i = 0 ; i <= dataNum ; i++){
        drawLine(g, hx1, hy1, hx2, hy2);
        hx1 += interval;
        hx2 += interval;
    }


});


function drawLine(section, x1, y1, x2, y2){
    var line = section.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2).attr("stroke", 'black')
}