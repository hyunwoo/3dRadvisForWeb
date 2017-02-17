/**
 * Created by hyunwoo on 2017-02-14.
 */


// Line Segment Required


// Basket Line Segment : Flex Length
// Node BufferGeometry : Static Length **

// ** 기하와 정보를 분리한다 **

class RadvisController {
    constructor(element, data) {
        let container = this.container = document.getElementById('rendererRadvis');
        this.$ = $(this.container);
        const $renderer = $('#rendererRadvis');
        const width = this.width = $renderer.width();
        const height = this.height = $renderer.height();
        console.log(width, height);
        let camera = this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
        camera.position.z = 1500;
        camera.position.y = 150;
        camera.lookAt(0, 0, 0);

        let scene = this.scene = new THREE.Scene();


        // set Renderer
        let renderer = this.renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        renderer.setClearColor(Setting.Radvis.Background);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        container.appendChild(renderer.domElement);
        this.$canvas = $(renderer.domElement);


        // Set Other
        var that = this;
        this.data = data;
        this.groupAxis = new THREE.Group();
        this.groupNode = new THREE.Group();

        let i;
        // Axis Data
        this.axises = {};
        _.forEach(data.axis, function (a, i) {
            that.axises[a.name] = new RadvisAxis(that, a, data.stats[a.name]);
        });


        // Axis Geometry
        this.geometryBasket = new THREE.BufferGeometry();
        this.material = new THREE.LineBasicMaterial({
            vertexColors: THREE.VertexColors,
            transparent: true
        });

        this.axisLength = data.axis.length;
        this.axisDestPosition = new Float32Array(this.axisLength * 3 * 2 + Setting.Radvis.Geometry.BasketCount * 6);
        this.axisDestColor = new Float32Array(this.axisLength * 3 * 2 + Setting.Radvis.Geometry.BasketCount * 6);
        this.vertices = new Float32Array(this.axisLength * 3 * 2 + Setting.Radvis.Geometry.BasketCount * 6);
        this.colors = new Float32Array(this.axisLength * 3 * 2 + Setting.Radvis.Geometry.BasketCount * 6);
        this.indices = [];
        this.geometryBasket.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3).setDynamic(true));
        this.geometryBasket.addAttribute('color', new THREE.BufferAttribute(this.colors, 3).setDynamic(true));

        let x, z;

        const axisColor = new THREE.Color(Setting.Radvis.Axis.Color);
        _.map(this.axises, function (axis) {
            x = Math.sin(Math.PI * 2 / that.axisLength * axis.axis.index) * Setting.Radvis.Radius;
            z = Math.cos(Math.PI * 2 / that.axisLength * axis.axis.index) * Setting.Radvis.Radius;
            axis.setPosition(x, z);
            axis.setColor(axisColor);
        });

        this.createBasketTopBottom(axisColor);

        this.geometryBasket.setIndex(new THREE.BufferAttribute(new Uint16Array(this.indices), 1));
        this.geometryBasket.computeBoundingSphere();
        this.axisMesh = new THREE.LineSegments(this.geometryBasket, this.material);

        this.groupAxis.add(this.axisMesh);

        // Nodes Data

        // Nodes Geometry
        const uniforms = {
            color: {value: new THREE.Color(0xffffff)},
            texture: {value: new THREE.TextureLoader().load("textures/radvis/node.png")}
        };
        this.nodeMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent,
            depthTest: false,
            transparent: true
        });

        console.log(data);
        this.geometryNodes = new THREE.BufferGeometry();

        this.nodes = data.numericNodes;
        this.nodeCount = data.numericNodes.length;
        this.nodeDestPositions = new Float32Array(this.nodeCount * 3);
        this.nodePositions = new Float32Array(this.nodeCount * 3);

        this.nodeDestColors = new Float32Array(this.nodeCount * 3);
        this.nodeColors = new Float32Array(this.nodeCount * 3);

        this.nodeDestSize = new Float32Array(this.nodeCount);
        this.nodeSizes = new Float32Array(this.nodeCount);

        let color = new THREE.Color();
        var i3;
        for (i = 0, i3 = 0; i < this.nodeCount; i++, i3 += 3) {
            this.nodeDestPositions[i3] = ( Math.random() * 2 - 1 ) * Setting.Radvis.Radius;
            this.nodeDestPositions[i3 + 1] = ( Math.random() * 2 - 1 ) * Setting.Radvis.Height * 0.5;
            this.nodeDestPositions[i3 + 2] = ( Math.random() * 2 - 1 ) * Setting.Radvis.Radius;
            color.setHSL(1.0, 0, 0);
            this.nodeDestColors[i3] = 1;
            this.nodeDestColors[i3 + 1] = 0;
            this.nodeDestColors[i3 + 2] = 0;
            this.nodeSizes[i] = Setting.Radvis.NodeSize;
        }

        this.geometryNodes.addAttribute('position', new THREE.BufferAttribute(this.nodePositions, 3));
        this.geometryNodes.addAttribute('customColor', new THREE.BufferAttribute(this.nodeColors, 3));
        this.geometryNodes.addAttribute('size', new THREE.BufferAttribute(this.nodeSizes, 1));

        this.groupNode = new THREE.Points(this.geometryNodes, this.nodeMaterial);

        console.log(this.geometryNodes);
        scene.add(this.groupNode);
        scene.add(this.groupAxis);

        this.updateNodes();


        //scene.add(group);
        let controls = this.controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        let stats = this.stats = new Stats();
        $(stats.dom).attr('id', 'radvisStats');
        container.appendChild(stats.dom);

        this.render();


    }

    animate() {
        let i;
        for (i = 0; i < this.axisLength * 6; i++) {
            this.vertices[i] = THREE.Math.lerp(this.vertices[i], this.axisDestPosition[i], 0.1);
            this.colors[i] = THREE.Math.lerp(this.colors[i], this.axisDestColor[i], 0.1);
        }
        for (i = this.axisLength * 6; i < (this.axisLength + Setting.Radvis.Geometry.BasketCount) * 6; i++) {
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

    setNodePosition(index, x, y, z) {
        this.nodeDestPositions[index * 3] = x;
        this.nodeDestPositions[index * 3 + 1] = y;
        this.nodeDestPositions[index * 3 + 2] = z;
    }

    setNodeColor(index, r, g, b) {
        this.nodeDestColors[index * 3] = r;
        this.nodeDestColors[index * 3 + 1] = g;
        this.nodeDestColors[index * 3 + 2] = b;
    }

    setNodeSize(index, size) {
        this.nodeDestSize[index] = size;
    }

    updateAxis() {

        const axisList = [];
        _.forEach(this.axises, function (d) {
            axisList.push(d);
        });

        const sortedAxises = _.sortBy(axisList, function (axis) {
            return axis.axis.index;
        });

        const weightSum = _.sumBy(sortedAxises, function (axis) {
            return axis.axis.active ? axis.axis.weight : 0;
        });

        let weightCurrent = 0;
        _.forEach(sortedAxises, function (axis) {
            axis.updatePosition(weightCurrent, weightSum);
            if (axis.axis.active) weightCurrent += axis.axis.weight;
        });
    }

    updateNodes() {
        const that = this;
        _.map(this.nodes, function (node, i) {
            var poses = [];
            _.forEach(node, function (v, k) {
                if (!that.axises[k].axis.active) return;
                poses.push(that.axises[k].located(v))
            });
            var x = 0, y = 0, z = 0;
            _.forEach(poses, function (p) {
                x += p.x;
                y += p.y;
                z += p.z;
            });
            that.setNodePosition(i, x / poses.length, y / poses.length, z / poses.length);
        });

    }


    adjustAxis() {
        this.updateAxis();
        this.updateNodes();
    }

    updateAxisColor(color) {
        let i;
        for (i = this.axisLength; i < this.axisLength + Setting.Radvis.Geometry.BasketCount; i++) {
            this.axisDestColor[i * 6] = color.r;
            this.axisDestColor[i * 6 + 1] = color.g;
            this.axisDestColor[i * 6 + 2] = color.b;
            this.axisDestColor[i * 6 + 3] = color.r;
            this.axisDestColor[i * 6 + 4] = color.g;
            this.axisDestColor[i * 6 + 5] = color.b;
        }
        this.updateAxis();
    }

    createBasketTopBottom(axisColor) {
        let i, x, z;
        for (i = this.axisLength; i < this.axisLength + Setting.Radvis.Geometry.BasketCount; i++) {
            x = Math.sin(Math.PI * 2 / Setting.Radvis.Geometry.BasketCount * i) * Setting.Radvis.Radius;
            z = Math.cos(Math.PI * 2 / Setting.Radvis.Geometry.BasketCount * i) * Setting.Radvis.Radius;

            this.vertices[i * 6] = x;
            this.vertices[i * 6 + 1] = -Setting.Radvis.Height / 2;
            this.vertices[i * 6 + 2] = z;
            this.vertices[i * 6 + 3] = x;
            this.vertices[i * 6 + 4] = Setting.Radvis.Height / 2;
            this.vertices[i * 6 + 5] = z;

            this.axisDestColor[i * 6] = axisColor.r;
            this.axisDestColor[i * 6 + 1] = axisColor.g;
            this.axisDestColor[i * 6 + 2] = axisColor.b;
            this.axisDestColor[i * 6 + 3] = axisColor.r;
            this.axisDestColor[i * 6 + 4] = axisColor.g;
            this.axisDestColor[i * 6 + 5] = axisColor.b;
        }
        for (i = 0; i < this.axisLength; i++) this.indices.push(i * 2, i * 2 + 1);

        for (i = this.axisLength; i < this.axisLength + Setting.Radvis.Geometry.BasketCount - 1; i++) {
            this.indices.push(i * 2, i * 2 + 2);
            this.indices.push(i * 2 + 1, i * 2 + 2 + 1);
        }
        let lastIdx = this.axisLength + Setting.Radvis.Geometry.BasketCount - 1;
        this.indices.push(lastIdx * 2, this.axisLength * 2 + 2);
        this.indices.push(lastIdx * 2 + 1, this.axisLength * 2 + 2 + 1);


    }

    render() {
        this.controls.update();
        this.animate();
        this.geometryBasket.attributes.position.needsUpdate = true;
        this.geometryBasket.attributes.color.needsUpdate = true;

        this.geometryNodes.attributes.position.needsUpdate = true;
        this.geometryNodes.attributes.customColor.needsUpdate = true;
        this.geometryNodes.attributes.size.needsUpdate = true;

        _.forEach(this.axises, function (axis) {
            axis.updateProjection()
        });

        this.renderer.render(this.scene, this.camera);
        this.stats.update();
        requestAnimationFrame(this.render.bind(this));
    }

    static projectPosition(camera, x, y, z, width, height) {
        var p = new THREE.Vector3(x, y, z);
        var vector = p.project(camera);
        vector.x = (vector.x + 1) / 2 * width;
        vector.y = -(vector.y - 1) / 2 * height;
        return vector;
    }
}

let __RadvisController;


function createRadvis() {
    __RadvisController = new RadvisController('#', __data);
}
