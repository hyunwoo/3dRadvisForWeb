/**
 * Created by suhyun on 2017. 2. 23..
 */

var __IndexDataList = new function () {
    let that = this;
    let $list;
    let currentSelectedData;
    let $viewer = {};

    this.createDataList = function (data) {
        $list = $('.dataList .list');
        _.forEach(data, addDataListItem);
        const viewer = $('.dataListViewer .viewer');
        $viewer['overview'] = viewer.find('.input');
        $viewer['date'] = viewer.find('#dataListDate');
        $viewer['type'] = viewer.find('#dataListType');
        $viewer['size'] = viewer.find('#dataListSize');
    };

    function addDataListItem(d) {
        const $item = $('<div class="item"> ' +
            '<div class="parentItem">' + d.name + '</div>' +
            '<div class="showChildList i material-icons">more_vert</div>' +
            '</div>').appendTo($list);

        $item.attr('id', d._id);
        const $childList = $('<div class="childList show"></div>').appendTo($item);


        console.log(__ContextMenu);
        __ContextMenu.addContextItem($item, '데이터 추가하기', function () {
            addDataListChildItem($childList, {
                name: 'Default Data',
                _id: '_dd',
            });

        }).addContextItem($item, '삭제하기', function () {
        });
        $item.find('.showChildList').click(function (evt) {
            //selectDataList(d);
            __ContextMenu.open(evt, $item);
        });


        _.forEach(d.child, function (d) {
            addDataListChildItem($childList, d)
        });
    }

    function addDataListChildItem(parent, d) {
        const $child = $('<div class="childItem">' + d.name + '</div>').appendTo(parent);
        $child.attr('id', d._id);
    }


    function showChildList() {
        var $childList = $(this).siblings('.childList');
        var $childItem = $childList.find('.childItem');
        if (!$childList.hasClass('show')) $childList.addClass('show');
        else $childList.removeClass('show')
    }


    this.addDataList = function (data) {
        addDataListItem(data);
    };

    this.deleteDataList = function (d) {
        $('#' + d._id).remove();
    };

    this.modifyDataList = function (data) {
    };


    this.addDataListChild = function (_id, childData) {
        //자식 데이터를 추가하려는 엄마 데이터가 누군지 알고
        console.log('맛있겠다', _id, childData)
        //엄마 데이터 아이디를 이용해서 리스트에 임의 자식 데이터 리스트를 동적으로 추가

    };

    this.removeDataListChild = function (_id, _childId) {
    };

    this.modifyDataListChild = function (_id, childData) {
    };

    function selectDataList(d) {
        _.forEach($viewer, function (v, k) {
            console.log(d[k]);
            v.html(d[k]);
        });

        const btnDelete = $('#dataListDelete');
        console.log('deleteButton', btnDelete);
        btnDelete.unbind();
        btnDelete.click(function () {
            __UIStatic.Dialog.open({
                title: d.name,
                text: '정말 삭제하시겠습니까?',
                pos: {
                    name: 'Delete Data',
                    action: function () {
                        __Firebase.deleteData(d);
                    }
                },
                neg: {
                    name: 'Cancel'
                },

            });

            //__Firebase.deleteData(d._id);
        });

    }

    function controlDesc() {
        var $viewInput = $('.viewer .input');
        var $icon = $('#descModifier');
        var $viewTextArea = $('.viewer textarea');
        $viewTextArea.on('change', function (ele) {
            console.log($viewTextArea.html())
        });
        if (!$viewTextArea.hasClass('visible')) {
            $viewInput.removeClass('visible');
            $viewTextArea.addClass('visible');
            $viewTextArea.val($viewInput.html());
            $icon.html('done');
        } else {
            $viewInput.addClass('visible');
            $viewTextArea.removeClass('visible');
            $viewInput.html($viewTextArea.val());
            $icon.html('mode_edit');
        }
    }

    var controller = $('#descModifier');
    $(controller).click(controlDesc);

    $('#DataListUploadFile').click(function () {
        $('#DataListUploadFileInput').trigger('click');
    });
    __FileReader.InputReadFile($('#DataListUploadFileInput'), __Firebase.uploadData);


    $('.showChildList').click(this.showChildList);


};
