/**
 * Created by hyunwoo on 2017-03-02.
 */

const __Modal = new function () {
    const that = this;
    const $dimension = $('#modalDimensionFieldMaker');

    var $dimensionTitle = $dimension.find('.title');
    var $dimensionContent = $dimension.find('.content');
    var $dimensionPos = $dimension.find('.pos');
    var $dimensionNeg = $dimension.find('.neg');

    this.dimension = new function () {
        this.open = function (opt) {
            $dimension.addClass('open');

            $dimensionPos.unbind();
            $dimensionPos.click(function () {
                that.dimension.close();
                opt.pos.action()
            });
        };

        this.close = function () {
            $dimension.removeClass('open');
        };
    };

    $dimensionNeg.click(function () {
        that.Modal.close();
    });
};


$(function () {
    console.log(__Modal);
    __Modal.dimension.open({
        title: 'Data Overview',
        content: '',
        pos: {
            name: 'Update',
            action: function () {
                __Firebase.addDimensionField({
                    name: '임수현이 제정신이 아닙니다.'
                });
            },
        }
    });
});