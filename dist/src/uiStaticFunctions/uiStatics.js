'use strict';

/**
 * Created by hyunwoo on 2017-02-23.
 */
var __UIStatic = new function () {
    var that = this;
    var $Nav = $('.nav');
    var $Toast = $('#toast');
    var toastTimeout;

    this.Toast = {
        removeTimeout: function removeTimeout() {
            if (!_.isNil(toastTimeout)) clearTimeout(toastTimeout);
        },

        open: function open(text) {
            $Toast.addClass('open');
            $Toast.find('.text').html(text);
            that.Toast.removeTimeout();
            toastTimeout = setTimeout(this.close, 2500);
        },

        close: function close() {
            $Toast.removeClass('open');
            that.Toast.removeTimeout();
        }
    };

    $Toast.on('mouseover', this.Toast.removeTimeout);
    $Toast.find('.closer').click(that.Toast.close);

    var $Dialog = $('#dialogWrapper');
    var $DialogTitle = $Dialog.find('.title');
    var $DialogText = $Dialog.find('.text');
    var $DialogPos = $Dialog.find('.pos');
    var $DialogNeg = $Dialog.find('.neg');

    /**
     *
     * @type {{open: __UIStatic.Dialog.open, close: __UIStatic.Dialog.close}}
     */
    this.Dialog = {
        /**
         * @param opt : object
         *      @title
         *      @text
         *      @pos : {
         *          @name :string
         *          @action : function
         *      }
         *      @neg : {
         *          @name :string
         *          @action : function
         *      }
         */
        open: function open(opt) {
            if (_.isNil(opt.pos) || _.isNil(opt.neg)) {
                __UIStatic.Toast.open('Nil Value : pos or neg');
                console.log(opt);
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
                    if (!_.isNil(opt.pos.action)) opt.pos.action();
                });
            } else $DialogPos.css('display', 'none');

            if (!_.isNil(opt.neg.name)) {
                $DialogNeg.css('display', 'block');
                $DialogNeg.html(opt.neg.name);
                $DialogNeg.unbind();
                $DialogNeg.click(function () {
                    that.Dialog.close();
                    if (!_.isNil(opt.neg.action)) opt.neg.action();
                });
            } else $DialogNeg.css('display', 'none');

            var content = $Dialog.find('.content');
            content.empty();
            if (!_.isNil(opt.func)) opt.func($Dialog.find('.content'));
        },

        close: function close() {
            $Dialog.removeClass('open');
        }
    };

    this.onAuthChange = function (user) {
        __UIStatic.GlobalLoader.close();
        if (user) {
            $Nav.find('.logined').removeClass('hide');
            $Nav.find('.logouted').addClass('hide');
        } else {
            $Nav.find('.logined').addClass('hide');
            $Nav.find('.logouted').removeClass('hide');
        }
    };

    this.Message = {};

    var $Modal = $('#modalWrapper');
    var $ModalTitle = $Modal.find('.title');
    var $ModalContent = $Modal.find('.content');
    var $ModalPos = $Modal.find('.pos');
    var $ModalNeg = $Modal.find('.neg');

    this.Modal = {
        /**
         * @param opt : object
         *      @title
         *      @content
         *      @pos : {
         *          @name :string
         *          @action : function
         *      }
         */
        open: function open(opt) {
            $Modal.addClass('open');
        },
        close: function close() {
            $Modal.removeClass('open');
        }
    };
    $ModalNeg.click(function () {
        console.log('click neg');
        that.Modal.close();
    });

    $('#signinButton').click(__Firebase.signInWithGoogle);
    $('#signoutButton').click(__Firebase.signOut);
    __Firebase.addAuthChangeFunction(this.onAuthChange);
    // this.onAuthChange(null);

    this.GlobalLoader = {
        open: function open() {
            $('#globalLoader').addClass('open');
        },
        close: function close() {
            $('#globalLoader').removeClass('open');
        }
    };
}();

$(function () {
    //__UIStatic.Modal.open();
    __UIStatic.GlobalLoader.open();
    console.log('?');
});
//# sourceMappingURL=uiStatics.js.map