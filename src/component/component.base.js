/**
 * Created by hyunwoo on 2017-02-21.
 */
const __ComponentUtil = new function () {
    this.createName = function (target, option) {
        if (_.isNil(option.name)) return undefined;
        return $('<div class="name">' + option.name + '</div>').appendTo(target);
    };

    this.createDesc = function (target, option) {
        if (_.isNil(option.desc)) return undefined;
        return $('<div class="desc">' + option.desc + '</div>').appendTo(target);
    };

    this.createOptions = function (target, vals, option) {
        _.forEach(vals, function (v) {
            if (_.isNil(option[v])) return;
            $('<div class="' + v + '">' + option[v] + '</div>').appendTo(target);
        });
    }
}