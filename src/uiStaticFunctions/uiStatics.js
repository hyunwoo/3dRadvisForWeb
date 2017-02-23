/**
 * Created by hyunwoo on 2017-02-23.
 */
const __UIStatic = new function () {
    var that = this;

    this.$Toast = $('#toast');
    this.Toast = {
        interval: undefined,
        open: function (text) {
            that.$Toast.addClass('open');
            that.$Toast.find('.text').html(text);

            if (!_.isNil(this.interval)) clearTimeout(this.interval);
            this.interval = setTimeout(this.close, 2500);
        },

        close: function () {
            that.$Toast.removeClass('open');
            if (!_.isNil(this.interval)) clearTimeout(this.interval);
        }
    };

    this.Dialog = {};

    this.Message = {};
};


setTimeout(function () {
    __UIStatic.Toast.open('asdfasdfasdfasdfasdf');
}, 1000);