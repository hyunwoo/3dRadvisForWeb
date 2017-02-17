"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by hyunwoo on 2017-02-17.
 */
var ParallelAxis = function () {
    function ParallelAxis(controller, axis, stats) {
        _classCallCheck(this, ParallelAxis);

        this.controller = controller;
        this.axis = axis;
        _.assign(this, stats);
    }

    _createClass(ParallelAxis, [{
        key: "setPosition",
        value: function setPosition(x) {
            this.controller.vertices[this.axis.index * 6] = this.controller.axisDestPosition[this.axis.index * 6] = x;
            this.controller.vertices[this.axis.index * 6 + 1] = this.controller.axisDestPosition[this.axis.index * 6 + 1] = 0;
            this.controller.vertices[this.axis.index * 6 + 2] = this.controller.axisDestPosition[this.axis.index * 6 + 2] = 0;
            this.controller.vertices[this.axis.index * 6 + 3] = this.controller.axisDestPosition[this.axis.index * 6 + 3] = x;
            this.controller.vertices[this.axis.index * 6 + 4] = this.controller.axisDestPosition[this.axis.index * 6 + 4] = this.controller.height / 2;
            this.controller.vertices[this.axis.index * 6 + 5] = this.controller.axisDestPosition[this.axis.index * 6 + 5] = 0;
        }
    }, {
        key: "setColor",
        value: function setColor(color) {
            this.controller.axisDestColor[this.axis.index * 6] = color.r;
            this.controller.axisDestColor[this.axis.index * 6 + 1] = color.g;
            this.controller.axisDestColor[this.axis.index * 6 + 2] = color.b;
            this.controller.axisDestColor[this.axis.index * 6 + 3] = color.r;
            this.controller.axisDestColor[this.axis.index * 6 + 4] = color.g;
            this.controller.axisDestColor[this.axis.index * 6 + 5] = color.b;
        }
    }, {
        key: "located",
        value: function located(val) {
            var ratio = (val - this.min) / (this.max - this.min);
            var x = this.controller.axisDestPosition[this.axis.index * 6] * ratio;
            var y = this.controller.axisDestPosition[this.axis.index * 6 + 1] * ratio + this.controller.axisDestPosition[this.axis.index * 6 + 4] * (1 - ratio);
            var z = this.controller.axisDestPosition[this.axis.index * 6 + 5] * ratio;
            var v = new THREE.Vector3(x, y, z).multiplyScalar(Setting.Radvis.NodeScale);
            return v;
        }
    }, {
        key: "bottom",
        get: function get() {
            return THREE.Vector3(this.controller.axisDestPosition[this.axis.index * 6], this.controller.axisDestPosition[this.axis.index * 6 + 1], this.controller.axisDestPosition[this.axis.index * 6 + 2]);
        }
    }, {
        key: "top",
        get: function get() {
            return THREE.Vector3(this.controller.axisDestPosition[this.axis.index * 6 + 3], this.controller.axisDestPosition[this.axis.index * 6 + 4], this.controller.axisDestPosition[this.axis.index * 6 + 5]);
        }
    }]);

    return ParallelAxis;
}();
//# sourceMappingURL=parallel.axis.js.map