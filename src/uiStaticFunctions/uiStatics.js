/**
 * Created by hyunwoo on 2017-02-23.
 */
const __UIStatic = new function () {
    var that = this;

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


    var $Dialog = $('.dialogWrapper');
    var $DialogTitle = $Dialog.find('.title');
    var $DialogText = $Dialog.find('.text');
    var $DialogPos = $Dialog.find('.pos');
    var $DialogNeg = $Dialog.find('.neg');

    this.Dialog = {
        open: function (opt) {
            $Dialog.addClass('open');
            $DialogTitle.html(opt.title);
            $DialogText.html(opt.text);

            $DialogPos.html(opt.pos.name);
            $DialogPos.unbind();
            $DialogPos.click(function () {
                that.Dialog.close();
                opt.pos.action();
            });

            $DialogNeg.html(opt.neg.name);
            $DialogNeg.unbind();
            $DialogNeg.click(function () {
                that.Dialog.close();
                opt.neg.action();
            });


            // title
            // text
            // button
            //  name
            //  action
        },

        close: function () {
            console.log('??');
            $Dialog.removeClass('open');
        }
    };
    this.Message = {};
};


//__UIStatic.Toast.open('asdfasdf');
// __UIStatic.Dialog.open({
//     title: "Lorem? Ipsum?",
//     text: 'HANGLE AN DEN DA',
//     pos: {
//         name: 'Pos',
//         action: function () {
//         }
//     },
//     neg: {
//         name: 'Neg',
//         action: function () {
//         },
//     },
// });
