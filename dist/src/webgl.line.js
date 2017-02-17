'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by hyunwoo on 2017-02-14.
 */

// Line Segment Required


// Basket Line Segment : Flex Length
// Node BufferGeometry : Static Length **

// ** ���Ͽ� ������ �и��Ѵ� **

var RadvisController = function () {
    function RadvisController(scene, data) {
        _classCallCheck(this, RadvisController);

        this.data = data;
        this.groupAxis = new THREE.Group();
        this.groupNode = new THREE.Group();

        // Axis Data


        // Axis Geometry
        this.geometryBasket = new THREE.BufferGeometry();
        this.material = new THREE.LineBasicMaterial({
            vertexColors: THREE.VertexColors,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        this.axisLength = data.axis.length;
        this.axisDestPosition = new Float32Array(this.axisLength * 3 * 2);
        this.axisDestColor = new Float32Array(this.axisLength * 3 * 2);
        this.vertices = new Float32Array(this.axisLength * 3 * 2);
        this.colors = new Float32Array(this.axisLength * 3 * 2);
        this.indices = [];
        this.geometryBasket.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3).setDynamic(true));
        this.geometryBasket.addAttribute('color', new THREE.BufferAttribute(this.colors, 3).setDynamic(true));
        this.radius = 500;

        var x = void 0,
            z = void 0,
            i = void 0;

        for (i = 0; i < this.axisLength; i++) {
            x = Math.sin(Math.PI * 2 / this.axisLength * i) * this.radius;
            z = Math.cos(Math.PI * 2 / this.axisLength * i) * this.radius;

            this.axisDestPosition[i * 6] = x;
            this.axisDestPosition[i * 6 + 1] = -400;
            this.axisDestPosition[i * 6 + 2] = z;
            this.axisDestPosition[i * 6 + 3] = x;
            this.axisDestPosition[i * 6 + 4] = 400;
            this.axisDestPosition[i * 6 + 5] = z;

            this.axisDestColor[i * 6] = .5;
            this.axisDestColor[i * 6 + 1] = 0;
            this.axisDestColor[i * 6 + 2] = 0;
            this.axisDestColor[i * 6 + 3] = 0.5;
            this.axisDestColor[i * 6 + 4] = 0.5;
            this.axisDestColor[i * 6 + 5] = 1;
        }

        for (i = 0; i < this.axisLength; i++) {
            this.indices.push(i * 2, i * 2 + 1);
        }this.geometryBasket.setIndex(new THREE.BufferAttribute(new Uint16Array(this.indices), 1));
        this.geometryBasket.computeBoundingSphere();
        this.axisMesh = new THREE.LineSegments(this.geometryBasket, this.material);

        this.groupAxis.add(this.axisMesh);

        // Nodes Data

        // Nodes Geometry
        var uniforms = {
            color: { value: new THREE.Color(0xffffff) },
            texture: { value: new THREE.TextureLoader().load("textures/radvis/node.png") }
        };
        this.nodeMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });

        console.log(data);
        this.geometryNodes = new THREE.BufferGeometry();
        this.nodeCount = data.nodes.length * 20;
        this.nodeDestPositions = new Float32Array(this.nodeCount * 3);
        this.nodePositions = new Float32Array(this.nodeCount * 3);

        this.nodeDestColors = new Float32Array(this.nodeCount * 3);
        this.nodeColors = new Float32Array(this.nodeCount * 3);

        this.nodeDestSize = new Float32Array(this.nodeCount);
        this.nodeSizes = new Float32Array(this.nodeCount);

        var color = new THREE.Color();
        var i3;
        for (i = 0, i3 = 0; i < this.nodeCount; i++, i3 += 3) {
            this.nodeDestPositions[i3] = (Math.random() * 2 - 1) * this.radius;
            this.nodeDestPositions[i3 + 1] = (Math.random() * 2 - 1) * 400;
            this.nodeDestPositions[i3 + 2] = (Math.random() * 2 - 1) * this.radius;
            color.setHSL(1.0, 1.0, 1);
            this.nodeDestColors[i3] = color.r * 0.2;
            this.nodeDestColors[i3 + 1] = color.g * 0.2;
            this.nodeDestColors[i3 + 2] = color.b * 0.2;
            this.nodeSizes[i] = 20;
        }

        this.geometryNodes.addAttribute('position', new THREE.BufferAttribute(this.nodePositions, 3));
        this.geometryNodes.addAttribute('customColor', new THREE.BufferAttribute(this.nodeColors, 3));
        this.geometryNodes.addAttribute('size', new THREE.BufferAttribute(this.nodeSizes, 1));

        this.groupNode = new THREE.Points(this.geometryNodes, this.nodeMaterial);

        console.log(this.geometryNodes);
        scene.add(this.groupNode);
        scene.add(this.groupAxis);
    }

    _createClass(RadvisController, [{
        key: 'animate',
        value: function animate() {
            var i = void 0;
            for (i = 0; i < this.axisLength * 6; i++) {
                this.vertices[i] = THREE.Math.lerp(this.vertices[i], this.axisDestPosition[i], 0.1);
                this.colors[i] = THREE.Math.lerp(this.colors[i], this.axisDestColor[i], 0.1);
            }

            for (i = 0; i < this.nodeCount; i++) {
                this.nodePositions[i * 3] = THREE.Math.lerp(this.nodePositions[i * 3], this.nodeDestPositions[i * 3], 0.1);
                this.nodePositions[i * 3 + 1] = THREE.Math.lerp(this.nodePositions[i * 3 + 1], this.nodeDestPositions[i * 3 + 1], 0.1);
                this.nodePositions[i * 3 + 2] = THREE.Math.lerp(this.nodePositions[i * 3 + 2], this.nodeDestPositions[i * 3 + 2], 0.1);

                this.nodeColors[i * 3] = THREE.Math.lerp(this.nodeColors[i * 3], this.nodeDestColors[i * 3], 0.1);
                this.nodeColors[i * 3 + 1] = THREE.Math.lerp(this.nodeColors[i * 3 + 1], this.nodeDestColors[i * 3 + 1], 0.1);
                this.nodeColors[i * 3 + 2] = THREE.Math.lerp(this.nodeColors[i * 3 + 2], this.nodeDestColors[i * 3 + 2], 0.1);

                this.nodePositions[i] = THREE.Math.lerp(this.nodePositions[i], this.nodeDestPositions[i], 0.1);
            }
        }
    }, {
        key: 'setNodePosition',
        value: function setNodePosition(index, x, y, z) {
            this.nodeDestPositions[index * 3] = x;
            this.nodeDestPositions[index * 3 + 1] = y;
            this.nodeDestPositions[index * 3 + 2] = z;
        }
    }, {
        key: 'setNodeColor',
        value: function setNodeColor(index, r, g, b) {
            this.nodeDestColors[index * 3] = r;
            this.nodeDestColors[index * 3 + 1] = g;
            this.nodeDestColors[index * 3 + 2] = b;
        }
    }, {
        key: 'setNodeSize',
        value: function setNodeSize(index, size) {
            this.nodeDestSize[index] = size;
        }
    }, {
        key: 'updateAxis',
        value: function updateAxis() {
            var activeAxisLength = _.filter(this.data.axis, function (d) {
                console.log(d.active);
                return d.active;
            }).length;

            var cnt = 0;

            for (var i = 0; i < this.axisLength; i++) {
                var rad = this.radius;
                var color = .3;
                var x = Math.sin(Math.PI * 2 / activeAxisLength * cnt) * rad;
                var z = Math.cos(Math.PI * 2 / activeAxisLength * cnt) * rad;

                if (this.data.axis[i].active) cnt++;else {
                    rad = rad + 200;
                    color = 0;
                    x = Math.sin(Math.PI * 2 / activeAxisLength * (cnt - .8)) * rad;
                    z = Math.cos(Math.PI * 2 / activeAxisLength * (cnt - .8)) * rad;
                }

                this.axisDestPosition[i * 6] = x;
                this.axisDestPosition[i * 6 + 1] = -400;
                this.axisDestPosition[i * 6 + 2] = z;
                this.axisDestPosition[i * 6 + 3] = x;
                this.axisDestPosition[i * 6 + 4] = 400;
                this.axisDestPosition[i * 6 + 5] = z;

                this.axisDestColor[i * 6] = color;
                this.axisDestColor[i * 6 + 1] = color;
                this.axisDestColor[i * 6 + 2] = color;
                this.axisDestColor[i * 6 + 3] = color;
                this.axisDestColor[i * 6 + 4] = color;
                this.axisDestColor[i * 6 + 5] = color;
            }
        }
    }, {
        key: 'adjustAxis',
        value: function adjustAxis() {
            this.updateAxis();
        }
    }, {
        key: 'setActiveAxis',
        value: function setActiveAxis(active, idx) {
            if (_.isNil(active)) active = true;
            idx = Number(idx);
            if (active) {
                this.colors[idx * 6] = 0.5;
                this.colors[idx * 6 + 1] = 0;
                this.colors[idx * 6 + 2] = 0;
                this.colors[idx * 6 + 3] = 0.5;
                this.colors[idx * 6 + 4] = 0.5;
                this.colors[idx * 6 + 5] = 1;
            } else {
                this.colors[idx * 6] = 0;
                this.colors[idx * 6 + 1] = 0;
                this.colors[idx * 6 + 2] = 0;
                this.colors[idx * 6 + 3] = 0;
                this.colors[idx * 6 + 4] = 0;
                this.colors[idx * 6 + 5] = 0;
            }
        }
    }]);

    return RadvisController;
}();

var __RadvisController = void 0;
var __ParellelController = void 0;

function createRadvis() {
    var stats = void 0;
    var renderer = void 0,
        controls = void 0;
    var group = void 0,
        scene = void 0,
        camera = void 0,
        container = void 0;

    function init() {
        container = document.getElementById('renderer');
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
        camera.position.z = 1500;
        camera.position.y = 150;
        camera.lookAt(0, 0, 0);

        // controls = new THREE.OrbitControls( camera, container );
        scene = new THREE.Scene();
        __RadvisController = new RadvisController(scene, __data);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        container.appendChild(renderer.domElement);

        //scene.add(group);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;

        stats = new Stats();
        console.log(stats.dom);
        $(stats.dom).attr('id', 'radvisStats');
        container.appendChild(stats.dom);
    }

    function render() {
        controls.update();
        __RadvisController.animate();
        __RadvisController.geometryBasket.attributes.position.needsUpdate = true;
        __RadvisController.geometryBasket.attributes.color.needsUpdate = true;

        __RadvisController.geometryNodes.attributes.position.needsUpdate = true;
        __RadvisController.geometryNodes.attributes.customColor.needsUpdate = true;
        __RadvisController.geometryNodes.attributes.size.needsUpdate = true;

        renderer.render(scene, camera);
        stats.update();
        requestAnimationFrame(render);
    }

    init();
    render();
}
//# sourceMappingURL=webgl.line.js.map