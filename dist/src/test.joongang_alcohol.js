'use strict';

/**
 * Created by hyunwoo on 2017-03-21.
 */
console.log('asdfasdf');

console.log(surveyKeys);

var arr = [];
var edgeArr = [];
_.forEach(surveyKeys, function (d) {
    if (d == '입원환자') return;
    arr.push({ id: d, label: d, color: '#ff5e7C', size: 20, select: true });
});

_.forEach(testKeys, function (d) {
    if (d == '입원환자') return;
    arr.push({ id: d, label: d, color: '#0188E5', size: 5, select: true });
});

_.mapKeys(corrs, function (f, k) {
    var t = f[0];
    edgeArr.push({ from: k, to: t.name, color: t.corr < 0 ? '#ff5e7C' : '#0188E5', arrows: 'from' });
    return;
    _.forEach(f, function (t) {
        if (Math.abs(t.corr) > 0.3) {
            edgeArr.push({ from: k, to: t.name, color: t.corr < 0 ? '#ff5e7C' : '#0188E5', arrows: 'from' });
        }
    });
});

// _.mapKeys(invCorrs, (f, k) => {
//     var t = f[0];
//     edgeArr.push({from: k, to: t.name, color: t.corr < 0 ? '#ff5e7C' : '#0188E5', arrows: 'from'});
//     return;
//     _.forEach(f, (t) => {
//         if (Math.abs(t.corr) > 0.35) {
//             edgeArr.push({from: k, to: t.name, color: t.corr < 0 ? '#ff5e7C' : '#0188E5', arrows: 'from'});
//         }
//     });
// });

var container = document.getElementById('network');
console.log(container);
var edges = new vis.DataSet(edgeArr);
var nodes = new vis.DataSet(arr);
console.log(nodes);
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
//# sourceMappingURL=test.joongang_alcohol.js.map