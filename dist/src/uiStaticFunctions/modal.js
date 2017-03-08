'use strict';

/**
 * Created by hyunwoo on 2017-03-02.
 */

var __Modal = new function () {
    var that = this;
    var $dimension = $('#modalDimensionFieldMaker');

    var $dimensionTitle = $dimension.find('.title');
    var $dimensionContent = $dimension.find('.content');
    var $dimensionPos = $dimension.find('.pos');
    var $dimensionNeg = $dimension.find('.neg');
    var $dimensionAxisSelector = $dimension.find('#axisListSelector');
    this.dimension = {};

    function CreateDimensionModal() {
        var dimensionModal = this;
        $dimension.find('.step').click(function () {
            $dimension.find('.step').removeClass('select');
            $dimension.find('.left .content').removeClass('select');

            $(this).addClass('select');
            $dimension.find('.left .content[page=' + $(this).attr("for") + ']').addClass('select');
        });

        $('#DFName').focusout(function () {
            // TODO Save Name TO FB
        });
        $('#DFOverview').focusout(function () {
            // TODO Save Overview TO FB
        });

        var corrNetwork;
        this.injectDataSet = function (info, data, corr) {
            console.log(info, data, corr);
            clearAxisList();
            _.forEach(corr.keys, function (c, i) {
                return data.stats[c]['index'] = i;
            });
            _.forEach(data.stats, dimensionModal.addAxisList);
            createCorrGraph('#correlationGraph', corr.keys, corr.corr);
            corrNetwork = new CreateCorrNetwork('#correlationNetwork', corr.keys, corr.corr);
            createComponentDropDown('#componentNetwork', {
                name: "Correlation Network Link Setting",
                listItem: ['Most Impact (ABS Correlation more that 0.7)', 'Most Impact (ABS Correlation more that 0.5)', '^# Raw Correlation Graph', 'Almost Same Correlation (Correlation more than 0.9)', 'High Correlation (Correlation more than 0.7)', 'Medium Correlation (Correlation more than 0.5)'],
                selected: 'Most Impact (ABS Correlation more that 0.7)'
            }, function (mode) {
                corrNetwork.setEdge(mode);
            });

            var pos_powers = _.map(corr.keys, function (k, i) {
                return { value: 0, from: [], name: k, index: i };
            });

            var neg_powers = _.map(corr.keys, function (k, i) {
                return { value: 0, from: [], name: k, index: i };
            });

            _.forEach(corr.corr, function (cs, x) {
                var maxVal = 0;
                var maxIndex = -1;
                var minVal = 0;
                var minIndex = -1;
                _.forEach(cs, function (c, y) {
                    if (x == y) return;
                    if (c < -.5) {
                        minVal = c;
                        minIndex = y;
                    } else if (c > .5) {
                        maxVal = c;
                        maxIndex = y;
                    }
                    //
                    // if (c < -0.7) {
                    //     neg_powers[y].value += c;
                    //     neg_powers[y].from.push({
                    //         name: corr.keys[y],
                    //         index: y,
                    //     });
                    // }
                    //
                    // if (c > 0.7) {
                    //     pos_powers[y].value += c;
                    //     pos_powers[y].from.push({
                    //         name: corr.keys[y],
                    //         index: y,
                    //     });
                    // }
                });
                if (minIndex != -1) {
                    neg_powers[minIndex].value += minVal;
                    neg_powers[minIndex].from.push({
                        name: corr.keys[minIndex],
                        index: minIndex
                    });
                }

                if (maxIndex != -1) {
                    pos_powers[maxIndex].value += maxVal;
                    pos_powers[maxIndex].from.push({
                        name: corr.keys[maxIndex],
                        index: maxIndex
                    });
                }
            });

            _.forEach(neg_powers, function (v) {
                return addDimensionGroupItem(v);
            });
            _.forEach(pos_powers, function (v) {
                return addDimensionGroupItem(v);
            });
        };

        var dgn = $('#DGNoneImpact');
        var dgm = $('#DGMediumImpact');
        var dgh = $('#DGHighImpact');

        function addDimensionGroupItem(v) {
            console.log(v);
            var abs = Math.abs(v.value);
            var item;
            if (v.from.length > 2) {
                if (v.value > 0) item = $('<div class="item posHigh">' + v.name + '</div>').appendTo(dgh);else item = $('<div class="item negHigh">' + v.name + '</div>').appendTo(dgh);
            } else if (abs > 0.2) {
                if (v.value > 0) item = $('<div class="item posMid">' + v.name + '</div>').appendTo(dgm);else item = $('<div class="item negMid">' + v.name + '</div>').appendTo(dgm);
            } else {
                // item = $(`<div class="item">${v.name}</div>`).appendTo(dgn)
            }
        };

        this.open = function (opt) {
            $dimension.addClass('open');
            $dimensionPos.unbind();
            $dimensionPos.click(function () {
                that.dimension.close();
                opt.pos.action();
            });
        };

        $dimension.find('.closer').click(function () {
            console.log('?');
            that.dimension.close();
        });
        this.close = function () {
            $dimension.removeClass('open');
        };

        function clearAxisList() {
            $dimension.find('#axisListSelector').empty();
        };

        this.addAxisList = function (value) {
            var item = $('<div class="item dimension" index="' + value.index + '">' + '<div class="checkbox i material-icons">check_box</div>' + ('<div class="axis">' + value.name + '</div>') + '<div class="value"></div>' + ('<div class="value">' + __Formatter.number(value.mean) + '</div>') + ('<div class="value">' + __Formatter.number(value.min) + '</div>') + ('<div class="value">' + __Formatter.number(value.max) + '</div>') + ('<div class="value">' + __Formatter.number(value.median) + '</div>') + ('<div class="value">' + __Formatter.number(value.sigma) + '</div>') + '</div>').appendTo($dimensionAxisSelector);
            item.click(function () {
                var box = $(this).find('.checkbox');
                if (box.hasClass('unchecked')) {
                    box.removeClass('unchecked');
                    box.html('check_box');
                } else {
                    box.addClass('unchecked');
                    box.html('check_box_outline_blank');
                }
            });
        };
    }

    $dimensionNeg.click(function () {
        that.Modal.close();
    });
    $(function () {
        return that.dimension = new CreateDimensionModal();
    });
}();
//# sourceMappingURL=modal.js.map