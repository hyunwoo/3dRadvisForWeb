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
        open: function (opt) {
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
                    if (!_.isNil(opt.pos.action)) opt.pos.action()
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
        close: function () {
            $Dialog.removeClass('open');
        }
    };

    this.onAuthChange = function (user) {
        console.log('??')
        __UIStatic.Loader.close();
        if (user) {
            $Nav.find('.logined').removeClass('hide');
            $Nav.find('.logouted').addClass('hide');
        } else {
            $Nav.find('.logined').addClass('hide');
            $Nav.find('.logouted').removeClass('hide');
        }
    };


    this.Message = {};
    var $Modal = $('.modalWrapper');
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
        open: function (opt) {
            $Modal.addClass('open');

            $ModalPos.unbind();
            $ModalPos.click(function () {
                that.Modal.close();
                opt.pos.action()
            });
        },
        close: function () {
            $Modal.removeClass('open');
        }
    };
    $ModalNeg.click(function () {
        that.Modal.close();
    });

    $('#signinButton').click(__Firebase.signInWithGoogle);
    $('#signoutButton').click(__Firebase.signOut);
    __Firebase.addAuthChangeFunction(this.onAuthChange);
    // this.onAuthChange(null);

    const LoaderString = '<div class="loader small">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100">' +
        '<g class="anim-0">' +
        '<circle cx="50" cy="50" r="50" fill="#ff5e7C"></circle>' +
        '</g>' +
        '<g class="anim-1">' +
        '<circle cx="50" cy="50" r="5" fill="white"></circle>' +
        '</g>' +
        '<g class="anim-2">' +
        '<circle cx="75" cy="50" r="5" fill="white"></circle>' +
        '<line x1="25" y1="50" x2="75" y2="50" stroke="white" stroke-width="3"></line>' +
        '</g>' +
        '<g class="anim-3">' +
        '<circle cx="50" cy="25" r="5" fill="white"></circle>' +
        '<line x1="50" y1="25" x2="25" y2="75" stroke="white" stroke-width="3"></line>' +
        '<line x1="50" y1="25" x2="75" y2="75" stroke="white" stroke-width="3"></line>' +
        '</g>' +
        '<g class="anim-4">' +
        '<circle cx="75" cy="25" r="5" fill="white"></circle>' +
        '<line x1="75" y1="25" x2="25" y2="25" stroke="white" stroke-width="3"></line>' +
        '</g>' +
        '</svg>' +
        '</div>';

    this.Loader = {
        open: function () {
            $('#globalLoader').addClass('open');
        },
        close: function () {
            $('#globalLoader').removeClass('open');
        },

        attach: function ($target) {
            if (_.isString($target)) $target = $($target);
            console.log($target);
            return $(LoaderString).appendTo($target);
        },

        detach: function ($target) {
            if (_.isString($target)) $target = $($target);
            $target.find('.loader').remove();
        }
    };

};


$(function () {
    //__UIStatic.Modal.open();

});

