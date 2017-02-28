'use strict';

/**
 * Created by suhyun on 2017. 2. 23..
 */
$(function () {
    //__IndexDataList.createDataList(data);
    var data = [];
    __Firebase.on('child_added', function (d) {
        data.push(d);
        console.log(data);
        GridSystem.addGridContentItem('#grid1Overview', {
            _id: d._id, text: d.name + (' <small>' + d.type + '</small>'), action: function action() {
                console.log(d);
                GridSystem.clearPage(function () {
                    createDataWindow(d);
                });
            }
        });
        GridSystem.clearGridAddition('#grid2Overview');

        var number = __Formatter.numberWithSymbol(_.sumBy(data, function (d) {
            return d.size;
        }));
        console.log(number);
        GridSystem.setGridContentAddition('#grid2Overview', [{
            class: 'title',
            text: 'Usage'
        }, {
            class: 'jumbo',
            text: number.number + '<small>' + number.symbol + 'b</small>'
        }, {
            class: 'desc-small',
            text: '\uCD1D \uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC6A9\uB7C9\uC740 50MB \uC774\uACE0 <action>' + number.number + number.symbol + 'b</action>\uB97C \uC0AC\uC6A9 \uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.'
        }]);
    });

    function createDataListWindow() {
        GridSystem.createPage().createGrid({ cell: 12, _id: 'gridOverview' });

        GridSystem.setGridHeader('#gridOverview', {
            text: 'Making the Data Set Freely'
        });
        GridSystem.setGridContent('#gridOverview', "This program aims to suggest multivariate data semantically " + "and to suggest visualization, " + "and users can freely group clusters of data.");

        GridSystem.createGrid([{ cell: 7, _id: 'grid1Overview' }, { cell: 5, _id: 'grid2Overview' }]);
        GridSystem.setGridHeader('#grid1Overview', {
            text: 'Data List', actions: [{
                icon: 'add', action: function action() {
                    $('#inputFileUpload').trigger('click');
                }
            }]
        });
        GridSystem.setGridContentAddition('#grid2Overview', [{
            class: 'title',
            text: 'Usage'
        }, {
            class: 'jumbo',
            text: '-'
        }, {
            class: 'desc-small',
            text: ''
        }]);
    }

    function createDataWindow(data) {

        // Overview
        GridSystem.createPage().createGrid({ cell: 12, _id: 'gridDataOverview' });

        GridSystem.setGridHeader('#gridDataOverview', {
            text: data.name, actions: [{
                icon: 'delete', action: function action() {
                    __UIStatic.Dialog.open({
                        title: data.name,
                        text: '정말 삭제하시겠습니까?',
                        pos: {
                            name: 'Delete Data',
                            action: function action() {}
                        },
                        neg: {
                            name: 'Cancel',
                            action: function action() {}
                        }
                    });
                }, addition: 'remove'
            }]
        });
        // Description
        var fileSize = __Formatter.numberWithSymbol(data.size);
        GridSystem.createGrid([{ cell: 5, _id: 'gridDataDescription' }, { cell: 4, _id: 'gridDataInfo' }, { cell: 3, _id: 'gridDataAddition' }]).setGridHeader('#gridDataDescription', {
            text: 'Data Overview', actions: [{
                icon: 'edit', action: function action() {
                    __UIStatic.Toast.open('데이터의 Overview 를 수정합니다. 해당기능은 아직 구현되지 않았습니다.');
                }
            }]
        }).setGridContent('#gridDataDescription', data.overview).setGridHeader('#gridDataInfo', { text: 'Data Info' }).setGridContent('#gridDataInfo', data.type + ' , ' + fileSize.number + fileSize.symbol + 'b').setGridHeader('#gridDataAddition', { text: 'Addition' }).addGridContentDesc('#gridDataAddition', [{ text: '해당 데이터에는 총 83개의 변인이 있습니다. <br><action>데이터의 변인 정보</action>를 확인 할 수 있습니다.<br> ' }, { text: '데이터의 크기는 ' + __Formatter.number(data.size) + '입니다. <br><action>데이터를 다운로드</action> 할 수 있습니다.' }]);

        function testAction() {
            __UIStatic.Toast.open('변인 분석 필드를 선택하였습니다. 해당기능은 아직 구현되지 않았습니다.');
        }

        GridSystem.createGrid([{ cell: 5, _id: 'gridDataChildList' }, { cell: 7, _id: 'gridDataChildInfo' }]).setGridHeader('#gridDataChildList', {
            text: 'Dimension Field List', actions: [{
                icon: 'add', action: function action() {
                    __UIStatic.Toast.open('변인 필드를 추가합니다. 해당기능은 아직 구현되지 않았습니다.');
                }
            }]
        }) //7B76313B62617369633B6879756E776F6F2068616E3B313B682E6879756E776F6F40676D61696C2E636F6D3B3B303B307D
        .addGridContentItem('#gridDataChildList', [{
            text: 'Education 대한 상관관계 분석 후 변인 군집화',
            action: testAction
        }, {
            text: 'SIDAL 대한 상관관계 [0.9]이상 그룹화',
            action: testAction
        }, {
            text: 'SVD,AD 중요 변인 필드',
            action: testAction
        }]).setGridHeader('#gridDataChildInfo', {
            text: 'Dimension Field Overview',
            actions: [{
                icon: 'remove_circle', action: function action() {
                    __UIStatic.Toast.open('변인 필드를 추가합니다. 해당기능은 아직 구현되지 않았습니다.');
                }, addition: 'remove'
            }, {
                icon: 'play_circle_filled', action: function action() {
                    __UIStatic.Dialog.open({
                        title: '3DRadvis',
                        text: data.name + '에 대한 시각화 분석을 시작합니다.',
                        pos: {
                            name: 'Start Analysis',
                            action: function action() {
                                window.location = '/testing';
                            }
                        },
                        neg: {
                            name: 'Cancel',
                            action: function action() {}
                        }
                    });
                }
            }]
        }).setGridContent('#gridDataChildInfo', '선택된 변인 필드에 대한 정보를 나타냅니다. 현재 구현중에 있습니다.');
    }

    createDataListWindow();

    //__Firebase.on(__Firebase.EventName.ChildRemoved, function (d) {
    //  __IndexDataList.deleteDataList(d);
    //})
});
//# sourceMappingURL=index.js.map