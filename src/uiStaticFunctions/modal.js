/**
 * Created by hyunwoo on 2017-03-02.
 */

// setInterval(() => {
//     console.log(window.performance.memory)
// }, 1000);
const __Modal = new function () {
    const that = this;
    const $dimension = $('#modalDimensionFieldMaker');

    var $dimensionTitle = $dimension.find('.title');
    var $dimensionContent = $dimension.find('.content');
    var $dimensionPos = $dimension.find('.pos');
    var $dimensionNeg = $dimension.find('.neg');
    var $dimensionAxisSelector = $dimension.find('#axisListSelector');
    this.dimension = {};
    var summaryUsageDimension = $('#summary-recommend-dimension');
    var usageDimension = $('#usage-dimension');


    var powers = [];
    var usingDimensions = {};

    function addUsingDimension(v) {
        let i1 = $(`<div class="item _axis" using="${v.name}">` +
            `<div class="name">${v.name}</div>` +
            `<div class="num">${__Formatter.number(v.value)}</div>` +
            `</div>`).appendTo(usageDimension);

        var stats = v.stats;
        let item = $(`<div class="item _axis" using="${v.name}" index="${stats.index}">` +
            `<div class="axis">${v.name}</div>` +
            `<div class="value">${__Formatter.number(stats.mean)}</div>` +
            `<div class="value">${__Formatter.number(stats.min)}</div>` +
            `<div class="value">${__Formatter.number(stats.max)}</div>` +
            `<div class="value">${__Formatter.number(stats.sigma)}</div>` +
            `<div class="impact neg">${__Formatter.number(v.neg)}</div>` +
            `<div class="impact pos">${__Formatter.number(v.pos)}</div>` +
            `</div>`).appendTo($dimensionAxisSelector);

        var btn = $(`<div class="check"><div class="i material-icons">add_circle_outline</div></div>`).prependTo(item);
        var detail = $(`<div class="detail"><div class="i material-icons">keyboard_arrow_down</div></div>`).prependTo(item);
        btn.click(() => {
            if (item.hasClass('use'))
                setUnUsingDimension(v);
            else setUsingDimension(v);
        });
        detail.click(() => {
            console.log('?', item.attr('detail'));
            if (item.attr('detail') == 'show') {
                item.attr('detail', 'hide');
                item.find('.impact-field').remove();
            } else {
                item.attr('detail', 'show');
                var f = $(`<div class="impact-field"></div>`).appendTo(item);
                var pig = $(`<div class="impact-group">positive impact</div>`).appendTo(f);
                var nig = $(`<div class="impact-group">negative impact</div>`).appendTo(f);

                var froms = _.sortBy(v.from, (t) => {
                    return -Math.abs(t.val);
                });
                _.forEach(froms, (t) => {
                    var isPos = t.val > 0;
                    $(`<div class="impact-item ${isPos ? 'pos' : 'neg'}">${t.name}(${__Formatter.number(t.val)})</div>`).appendTo(isPos ? pig : nig);
                })
            }
        })
    }


    function addSummaryUsageDimension(v) {
        let i2 = $(`<div class="item _axis" using="${v.name}">${v.name}` +
            `<div class="i material-icons">add_circle_outline</div>` +
            `</div>`).appendTo(summaryUsageDimension)
            .click(() => {
                if (i2.hasClass('use'))
                    setUnUsingDimension(v);
                else setUsingDimension(v);
            });
    }

    function setUnUsingDimension(v) {
        delete usingDimensions[v.name];
        $(`._axis[using="${v.name}"]`).removeClass('use');
        updateRadvisPreview();
    }

    function setUsingDimension(v) {
        usingDimensions[v.name] = v;
        $(`._axis[using="${v.name}"]`).addClass('use');
        updateRadvisPreview();
    }

    function addDimensionGroupItem(v) {
        // console.log(v);
        var abs = Math.abs(v.value);
        var item;
        // item = $(`<div class="item use">${v.name}</div>`).appendTo(dgh);
    }

    function addAxisList(value) {

    }

    function CreateDimensionModal() {
        var dimensionModal = this;
        $dimension.find('.step').click(function () {
            $dimension.find('.step').removeClass('select');
            $dimension.find('.modal-field .content').removeClass('select');

            $(this).addClass('select');
            $dimension.find('.modal-field .content[page=' + $(this).attr("for") + ']').addClass('select');
        });


        $('#DFName').focusout(() => {
            // TODO Save Name TO FB
        });
        $('#DFOverview').focusout(() => {
            // TODO Save Overview TO FB
        });

        var corrNetwork;
        this.injectDataSet = function (info, data, corr) {
            console.log(info, data, corr);
            clearAxisList();
            _.forEach(corr.keys, (c, i) => data.stats[c]['index'] = i);

            createCorrGraph('#correlationGraph', corr.keys, corr.corr);
            corrNetwork = new CreateCorrNetwork('#correlationNetwork', corr.keys, corr.corr);
            createComponentDropDown('#componentNetwork', {
                name: "Correlation Network Link Setting",
                listItem: [
                    'Most Impact (ABS Correlation more that 0.7)',
                    'Most Impact (ABS Correlation more that 0.5)',
                    '^# Raw Correlation Graph',
                    'Almost Same Correlation (Correlation more than 0.9)',
                    'High Correlation (Correlation more than 0.7)',
                    'Medium Correlation (Correlation more than 0.5)',
                ],
                selected: 'Most Impact (ABS Correlation more that 0.7)',
            }, (mode) => {
                corrNetwork.setEdge(mode)
            });


            powers = _.map(corr.keys, (k, i) => {
                return {value: 0, from: [], name: k, index: i, pos: 0, neg: 0, stats: data.stats[k]};
            });

            _.forEach(corr.corr, (cs, x) => {
                var maxVal = 0;
                var maxIndex = -1;
                var minVal = 0;
                var minIndex = -1;
                _.forEach(cs, (c, y) => {
                    if (x == y) return;
                    if (c < -.5) {
                        minVal = c;
                        minIndex = y;
                    } else if (c > .5) {
                        maxVal = c;
                        maxIndex = y;
                    }
                });

                if (minIndex != -1) {
                    powers[minIndex].value += Math.abs(minVal);
                    powers[minIndex].neg += minVal;
                    powers[minIndex].from.push({
                        name: corr.keys[x],
                        index: x,
                        val: minVal,
                    });
                }

                if (maxIndex != -1) {
                    powers[maxIndex].value += Math.abs(maxVal);
                    powers[maxIndex].pos += maxVal;
                    powers[maxIndex].from.push({
                        name: corr.keys[x],
                        index: x,
                        val: maxVal,
                    });
                }
            });
            powers = _.sortBy(powers, (d) => {
                return -d.value;
            });

            _.forEach(powers, (v) => {
                addAxisList(v);
                addUsingDimension(v);
            });

            $('#usage-dimension').sortable({
                update: (d) => {
                    updateRadvisPreview();
                }
            });


            _.forEach(_.take(powers, 10), (v) => {
                addSummaryUsageDimension(v);
                setUsingDimension(v);
            });
            updateRadvisPreview();
        };


        this.open = function (opt) {
            $dimension.addClass('open');
            $dimensionPos.unbind();
            $dimensionPos.click(function () {
                that.dimension.close();
                opt.pos.action()
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


    }


    // PREVIEW
    var previewOpener = $('#rad-view-opener');
    var preview = $('#rad-view');

    preview.draggable({handle: '.handle'});
    preview.resizable();
    preview.on('resizestop', resizeRadvisPreview);
    // preview.draggable();

    preview.find('#preview-closer').click(previewEvent);
    previewOpener.click(previewEvent);
    function previewEvent() {
        if (preview.hasClass('open')) {
            preview.removeClass('open');
            previewOpener.html('Show Preview Field');
        }
        else {
            preview.addClass('open');
            previewOpener.html('Hide Preview Field');
        }
    }

    var svg = d3.select('#preview-svg');
    var $previewSvg = $('#preview-svg')
    $previewSvg.resize(resizeRadvisPreview);
    var radViewSizeX = 300;
    var radViewSizeY = 300;
    var radViewScale = 1;
    var preview_g = svg.append('g')
        .attr('transform', `translate(${radViewSizeX / 2},${radViewSizeY / 2}) scale(${radViewScale},${radViewScale})`);

    function resizeRadvisPreview() {
        radViewSizeX = $previewSvg.width();
        radViewSizeY = $previewSvg.height();
        radViewScale = Math.min(radViewSizeY, radViewSizeX) / 300;
        preview_g.attr('transform', `translate(${radViewSizeX / 2},${radViewSizeY / 2}) scale(${radViewScale},${radViewScale})`);
        updateRadvisPreview();
    }

    function updateRadvisPreview() {
        var usings = usageDimension.find('.item.use .name');
        var cnt = usings.length;
        preview_g.html("");
        var radius = 100;
        drawCircle(preview_g, 0, 0, radius, radius)
            .attr('fill', 'none').attr('stroke', '#aaa');
        _.forEach(usings, (u, i) => {
            var name = $(u).html();
            var x = Math.sin(i / cnt * Math.PI * 2) * radius;
            var y = Math.cos(i / cnt * Math.PI * 2) * radius;

            var tx = Math.sin(i / cnt * Math.PI * 2) * (radius + 10);
            var ty = Math.cos(i / cnt * Math.PI * 2) * (radius + 10);
            drawCircle(preview_g, x, y, 4).attr('fill', '#fff')
                .attr('stroke', '#aaa').attr('stroke-width', 1);
            writeText(preview_g, name, tx, ty, -i / cnt * 360)
                .attr('text-anchor', 'middle').attr('font-size', '5px');
        });

    }

    $dimensionNeg.click(function () {
        that.Modal.close();
    });
    $(() => that.dimension = new CreateDimensionModal());
};
