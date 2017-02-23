/**
 * Created by hyunwoo on 2017-02-23.
 */
const __UIStatic = new function () {
    var that = this;
    var $Nav = $('.nav');
    var $Toast = $('#toast');
    var toastTimeout;
    this.Toast = {
        removeTimeout: function () {
            if (!_.isNil(toastTimeout)) clearTimeout(toastTimeout);
        },

        open: function (text) {
            $Toast.addClass('open');
            $Toast.find('.text').html(text);
            that.Toast.removeTimeout();
            toastTimeout = setTimeout(this.close, 2500);
        },

        close: function () {
            $Toast.removeClass('open');
            that.Toast.removeTimeout();
        },
    };
    $Toast.on('mouseover', this.Toast.removeTimeout);
    $Toast.find('.closer').click(that.Toast.close);

    var $Dialog = $('#dialogWrapper');
    var $DialogTitle = $Dialog.find('.title');
    var $DialogText = $Dialog.find('.text');
    var $DialogPos = $Dialog.find('.pos');
    var $DialogNeg = $Dialog.find('.neg');

    this.Dialog = {
        open: function (opt) {

            if (_.isNil(opt.pos) || _.isNil(opt.neg)) {
                __UIStatic.Toast.open('Nil Value : pos or neg');
                return;
            }
            $Dialog.addClass('open');
            $DialogTitle.html(opt.title);
            $DialogText.html(opt.text);

            if (!_.isNil(opt.pos.name)) {
                $DialogPos.css('display', 'block');
                $DialogPos.html(opt.pos.name);
                $DialogPos.unbind();
                $DialogPos.click(function () {
                    that.Dialog.close();
                    if (_.isNil(opt.pos.action)) opt.pos.action()
                });
            } else $DialogPos.css('display', 'none');

            if (!_.isNil(opt.neg.name)) {
                $DialogNeg.css('display', 'block');
                $DialogNeg.html(opt.neg.name);
                $DialogNeg.unbind();
                $DialogNeg.click(function () {
                    that.Dialog.close();
                    if (_.isNil(opt.neg.action)) opt.neg.action();
                });
            } else $DialogNeg.css('display', 'none');

            var content = $Dialog.find('.content');
            content.empty();
            if (!_.isNil(opt.func)) opt.func($Dialog.find('.content'));
        },

        close: function () {
            console.log('??');
            $Dialog.removeClass('open');
        }
    };
    this.Message = {};


    this.onAuthChange = function (user) {
        console.log('???', user)
        if (user) {
            $Nav.find('.logined').removeClass('hide');
            $Nav.find('.logouted').addClass('hide');
        } else {
            $Nav.find('.logined').addClass('hide');
            $Nav.find('.logouted').removeClass('hide');
        }

    }
};



