/**
 * Created by hyunwoo on 2017-02-17.
 */
class ParallelAxis {
    constructor(controller, axis, stats) {
        this.controller = controller;
        this.axis = axis;
        _.assign(this, stats);

    }


    setPosition(x) {
        this.controller.vertices[this.axis.index * 6] = this.controller.axisDestPosition[this.axis.index * 6] = x;
        this.controller.vertices[this.axis.index * 6 + 1] = this.controller.axisDestPosition[this.axis.index * 6 + 1] = 0;
        this.controller.vertices[this.axis.index * 6 + 2] = this.controller.axisDestPosition[this.axis.index * 6 + 2] = 0;
        this.controller.vertices[this.axis.index * 6 + 3] = this.controller.axisDestPosition[this.axis.index * 6 + 3] = x;
        this.controller.vertices[this.axis.index * 6 + 4] = this.controller.axisDestPosition[this.axis.index * 6 + 4] = this.controller.height / 2;
        this.controller.vertices[this.axis.index * 6 + 5] = this.controller.axisDestPosition[this.axis.index * 6 + 5] = 0;
    }

    setColor(color) {
        this.controller.axisDestColor[this.axis.index * 6] = color.r;
        this.controller.axisDestColor[this.axis.index * 6 + 1] = color.g;
        this.controller.axisDestColor[this.axis.index * 6 + 2] = color.b;
        this.controller.axisDestColor[this.axis.index * 6 + 3] = color.r;
        this.controller.axisDestColor[this.axis.index * 6 + 4] = color.g;
        this.controller.axisDestColor[this.axis.index * 6 + 5] = color.b;
    }

    get bottom() {
        return THREE.Vector3(
            this.controller.axisDestPosition[this.axis.index * 6],
            this.controller.axisDestPosition[this.axis.index * 6 + 1],
            this.controller.axisDestPosition[this.axis.index * 6 + 2],
        );
    }

    get top() {
        return THREE.Vector3(
            this.controller.axisDestPosition[this.axis.index * 6 + 3],
            this.controller.axisDestPosition[this.axis.index * 6 + 4],
            this.controller.axisDestPosition[this.axis.index * 6 + 5],
        );
    }


    located(val) {
        var ratio = (val - this.min) / (this.max - this.min);
        var x = this.controller.axisDestPosition[this.axis.index * 6] * ratio;
        var y = this.controller.axisDestPosition[this.axis.index * 6 + 1] * ratio +
            this.controller.axisDestPosition[this.axis.index * 6 + 4] * (1 - ratio);
        var z = this.controller.axisDestPosition[this.axis.index * 6 + 5] * ratio;
        var v = new THREE.Vector3(x, y, z).multiplyScalar(Setting.Radvis.NodeScale);
        return v;
    }
}