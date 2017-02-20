/**
 * Created by hyunwoo on 2017-02-16.
 */


class RadvisAxis {
    constructor(controller, axis, stats) {
        this.controller = controller;
        this.axis = axis;
        _.assign(this, stats);
        // console.log(this.controller.$canvas);
        this.$name = $('<div class="axisHeader">' + this.axis.name + '</div>').appendTo(controller.$);
    }

    setPosition(x, z) {
        this.controller.axisDestPosition[this.axis.index * 6] = x;
        this.controller.axisDestPosition[this.axis.index * 6 + 1] = -Setting.Radvis.Height / 2;
        this.controller.axisDestPosition[this.axis.index * 6 + 2] = z;
        this.controller.axisDestPosition[this.axis.index * 6 + 3] = x;
        this.controller.axisDestPosition[this.axis.index * 6 + 4] = Setting.Radvis.Height / 2;
        this.controller.axisDestPosition[this.axis.index * 6 + 5] = z;
    }

    updatePosition(weightCurrent, weightSum) {

        let rad, color, x, z, ratio = weightCurrent / weightSum;

        if (this.axis.active) {
            rad = Setting.Radvis.Radius;
            color = new THREE.Color(Setting.Radvis.Axis.Color);
            this.$name.css('opacity', 0.6)
        } else {
            rad = Setting.Radvis.Radius + 200;
            color = new THREE.Color(Setting.Radvis.Background);
            this.$name.css('opacity', 0.0)
        }

        x = Math.sin(Math.PI * 2 * ratio) * rad;
        z = Math.cos(Math.PI * 2 * ratio) * rad;

        this.setPosition(x, z);
        this.setColor(color);

    }

    updateProjection() {
        var vector = RadvisController.projectPosition(this.controller.camera,
            this.controller.vertices[this.axis.index * 6],
            this.controller.vertices[this.axis.index * 6 + 1],
            this.controller.vertices[this.axis.index * 6 + 2],
            this.controller.width,
            this.controller.height
        );

        this.$name.css('left', vector.x - this.$name.width() / 2);
        this.$name.css('top', vector.y);
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

    get topScreen() {

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

