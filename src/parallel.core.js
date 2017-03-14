/**
 * Created by hyunwoo on 2017-02-17.
 */
class ParallelCoordinate {
    constructor(scene, data, width, height) {
        const that = this;
        this.width = width;
        this.height = height;
        let i;
        this.groupAxis = new THREE.Group();
        this.geometryAxis = new THREE.BufferGeometry();
        this.material = new THREE.LineBasicMaterial({
            vertexColors: THREE.VertexColors,
            transparent: true
        });
        this.objects = [];

        this.axisLength = data.axis.length;
        this.axisDestPosition = new Float32Array(this.axisLength * 6);
        this.axisDestColor = new Float32Array(this.axisLength * 6);
        this.vertices = new Float32Array(this.axisLength * 6);
        this.colors = new Float32Array(this.axisLength * 6);

        this.indices = [];
        this.geometryAxis.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3).setDynamic(true));
        this.geometryAxis.addAttribute('color', new THREE.BufferAttribute(this.colors, 3).setDynamic(true));

        this.axises = {};
        _.forEach(data.axis, function (a, i) {
            that.axises[a.name] = new ParallelAxis(that, a, data.stats[a.name]);
        });


        let x, y, z;
        var axisColor = new THREE.Color(0xffffff);

        var cnt = 0;
        console.log(that.axises);
        _.forEach(that.axises, function (axis, i) {
            cnt++;
            // axis.setPosition(that.width / that.axisLength * cnt - that.width / 2 - that.width / that.axisLength * 0.5);
            axis.setColor(axisColor);
        });

        setTimeout(function () {
            var cnt = 0;
            _.forEach(that.axises, function (axis, i) {
                cnt++;
                axis.setPosition(that.width / that.axisLength * cnt - that.width / 2 - that.width / that.axisLength * 0.5);
                axis.setColor(axisColor);
            });
            that.geometryAxis.computeBoundingSphere();
        }, 1000);


        this.geometryAxis.computeBoundingSphere();
        console.log('??');


        for (i = 0; i < this.axisLength - 1; i++) {
            this.indices.push(i * 2, i * 2 + 2, i * 2 + 1);
            this.indices.push(i * 2 + 2, i * 2 + 3, i * 2 + 1);
        }


        this.geometryAxis.setIndex(new THREE.BufferAttribute(new Uint16Array(this.indices), 1));
        this.axisMesh = new THREE.Mesh(this.geometryAxis, new THREE.MeshBasicMaterial({visible: true}));
        this.objects.push(this.axisMesh);
        console.log(this.axisMesh);
        scene.add(this.axisMesh);

        console.log(this.axisMesh);

        // Raycast
        this.raycaster = new THREE.Raycaster();
        this.raycaster.linePrecision = 13;
        this.mouse = new THREE.Vector2();

        document.addEventListener('mousemove', onDocumentMouseMove, false);


        function onDocumentMouseMove(event) {
            event.preventDefault();
            that.mouse.x = ( event.clientX / width ) * 2 - 1;
            that.mouse.y = -( event.clientY / height ) * 2 + 1;
        }

    }

    animate() {
        let i;
        for (i = 0; i < this.axisLength * 6; i++) {
            this.vertices[i] = THREE.Math.lerp(this.vertices[i], this.axisDestPosition[i], 0.1);
            this.colors[i] = THREE.Math.lerp(this.colors[i], this.axisDestColor[i], 0.1);
        }
    }

    raycast(scene, camera) {
        camera.updateMatrixWorld();
        this.raycaster.setFromCamera(this.mouse, camera);
        var intersects = this.raycaster.intersectObject(this.axisMesh);
        if (intersects.length > 0) {
            console.log(intersects[0])
            console.log("??")
        }
    }

}

let __ParellelController;
function create2DViewer() {
    let stats;
    let renderer, controls;
    let group, scene, camera, container;

    function init() {
        container = document.getElementById('rendererParallel');
        const $renderer = $('#rendererParallel');
        const width = $renderer.width(), height = $renderer.height();


        console.log(width, height);

        camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -1000, 1000);
        scene = new THREE.Scene();
        scene.add(camera);
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        renderer.setClearColor(0x20000000);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        container.appendChild(renderer.domElement);

        __ParellelController = new ParallelCoordinate(scene, __data, width, height);


        //scene.add(group);
        // controls = new THREE.OrbitControls(camera, renderer.domElement);
        // controls.enableZoom = true;


        // stats = new Stats();
        // $(stats.dom).attr('id', 'radvisStats');
        // container.appendChild(stats.dom);
    }

    function render() {
        // controls.update();
        __ParellelController.animate();

        __ParellelController.geometryAxis.attributes.position.needsUpdate = true;
        __ParellelController.geometryAxis.attributes.color.needsUpdate = true;

        __ParellelController.raycast(scene, camera);

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    init();
    render();
}

