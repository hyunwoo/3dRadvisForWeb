'use strict';

/**
 * Created by hyunwoo on 2017-02-14.
 */

var a = 0;
var renderer;
var group, scene;

// Line Segment Required


// Basket Line Segment : Flex Length
// Node BufferGeometry : Static Length **

// ** ���Ͽ� ������ �и��Ѵ� **


var basket = {
    points: [],
    color: []
};

function createAxisGeometry() {
    var axises = ['a', 'b', 'c', 'end'];
    var axisLength = axises.length;

    var geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({});

    var radius = 100;
    var axisCount = 10;
    var vertices = [];
    var indices = [];

    _.forEach(axises, function (x, i) {
        var x = Math.sin(Math.PI * 2 / axisLength * i) * radius,
            z = Math.cos(Math.PI * 2 / axisLength * i) * radius;
        vertices.push(x, 400, z);
        vertices.push(x, -400, z);

        indices.push(i, i + 2);
        indices.push(i + 1, i + 3);
    });

    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    //geometryBasket.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    geometry.computeBoundingSphere();
    var mesh = new THREE.LineSegments(geometry, material);

    group.add(mesh);
}

function init() {
    container = document.getElementById('renderer');
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);

    camera.position.z = 1750;
    // controls = new THREE.OrbitControls( camera, container );
    scene = new THREE.Scene();
    group = new THREE.Group();

    createAxisGeometry();

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    container.appendChild(renderer.domElement);

    scene.add(group);
}

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

window.onload = function () {
    init();
    render();
};
//# sourceMappingURL=radvis.core.js.map