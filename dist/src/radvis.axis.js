'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by hyunwoo on 2017-02-16.
 */

var RadvisAxis = function () {
    function RadvisAxis(controller, axis, stats) {
        _classCallCheck(this, RadvisAxis);

        this.controller = controller;
        this.axis = axis;
        _.assign(this, stats);
        // console.log(this.controller.$canvas);
        this.$name = $('<div class="axisHeader">' + this.axis.name + '</div>').appendTo(controller.$);
    }

    _createClass(RadvisAxis, [{
        key: 'setPosition',
        value: function setPosition(x, z) {
            this.controller.axisDestPosition[this.axis.uniqueIndex * 6] = x;
            this.controller.axisDestPosition[this.axis.uniqueIndex * 6 + 1] = -Setting.Radvis.Height / 2;
            this.controller.axisDestPosition[this.axis.uniqueIndex * 6 + 2] = z;
            this.controller.axisDestPosition[this.axis.uniqueIndex * 6 + 3] = x;
            this.controller.axisDestPosition[this.axis.uniqueIndex * 6 + 4] = Setting.Radvis.Height / 2;
            this.controller.axisDestPosition[this.axis.uniqueIndex * 6 + 5] = z;
        }
    }, {
        key: 'updatePosition',
        value: function updatePosition(weightCurrent, weightSum) {

            var rad = void 0,
                color = void 0,
                x = void 0,
                z = void 0,
                ratio = weightCurrent / weightSum;

            if (this.axis.active) {
                rad = Setting.Radvis.Radius;
                color = new THREE.Color(Setting.Radvis.Axis.Color);
                this.$name.css('opacity', 0.6);
            } else {
                rad = Setting.Radvis.Radius + 200;
                color = new THREE.Color(Setting.Radvis.Background);
                this.$name.css('opacity', 0.0);
            }

            x = Math.sin(Math.PI * 2 * ratio) * rad;
            z = Math.cos(Math.PI * 2 * ratio) * rad;

            this.setPosition(x, z);
            this.setColor(color);
        }
    }, {
        key: 'updateProjection',
        value: function updateProjection() {
            var vector = RadvisController.projectPosition(this.controller.camera, this.controller.vertices[this.axis.uniqueIndex * 6], this.controller.vertices[this.axis.uniqueIndex * 6 + 1], this.controller.vertices[this.axis.uniqueIndex * 6 + 2], this.controller.width, this.controller.height);

            this.$name.css('left', vector.x - this.$name.width() / 2);
            this.$name.css('top', vector.y);
        }
    }, {
        key: 'setColor',
        value: function setColor(color) {
            this.controller.axisDestColor[this.axis.uniqueIndex * 6] = color.r;
            this.controller.axisDestColor[this.axis.uniqueIndex * 6 + 1] = color.g;
            this.controller.axisDestColor[this.axis.uniqueIndex * 6 + 2] = color.b;
            this.controller.axisDestColor[this.axis.uniqueIndex * 6 + 3] = color.r;
            this.controller.axisDestColor[this.axis.uniqueIndex * 6 + 4] = color.g;
            this.controller.axisDestColor[this.axis.uniqueIndex * 6 + 5] = color.b;
        }
    }, {
        key: 'located',
        value: function located(val) {
            var ratio = (val - this.min) / (this.max - this.min);
            var x = this.controller.axisDestPosition[this.axis.uniqueIndex * 6] * ratio;
            var y = this.controller.axisDestPosition[this.axis.uniqueIndex * 6 + 1] * ratio + this.controller.axisDestPosition[this.axis.uniqueIndex * 6 + 4] * (1 - ratio);
            var z = this.controller.axisDestPosition[this.axis.uniqueIndex * 6 + 5] * ratio;
            var v = new THREE.Vector3(x, y, z).multiplyScalar(Setting.Radvis.NodeScale);
            return v;
        }
    }, {
        key: 'bottom',
        get: function get() {
            return THREE.Vector3(this.controller.axisDestPosition[this.axis.uniqueIndex * 6], this.controller.axisDestPosition[this.axis.uniqueIndex * 6 + 1], this.controller.axisDestPosition[this.axis.uniqueIndex * 6 + 2]);
        }
    }, {
        key: 'top',
        get: function get() {
            return THREE.Vector3(this.controller.axisDestPosition[this.axis.uniqueIndex * 6 + 3], this.controller.axisDestPosition[this.axis.uniqueIndex * 6 + 4], this.controller.axisDestPosition[this.axis.uniqueIndex * 6 + 5]);
        }
    }, {
        key: 'topScreen',
        get: function get() {}
    }]);

    return RadvisAxis;
}();
//# sourceMappingURL=radvis.axis.js.map