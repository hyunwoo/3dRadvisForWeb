/**
 * Created by suhyun on 2017. 2. 23..
 */
$(function () {
    //__IndexDataList.createDataList(data);
    var data = [];
    __Firebase.on('child_added', function (d) {
        data.push(d);
        console.log(data);
        __UIStatic.Loader.detach('#grid1Overview');

        GridSystem.addGridContentItem('#grid1Overview', {
            _id: d._id, text: d.name + ` <small>${d.type}</small>`, action: function () {
                GridSystem.clearPage(function () {
                    createDataWindow(d);
                });
            }
        });
        GridSystem.clearGridAddition('#grid2Overview');

        var number = __Formatter.numberWithSymbol(_.sumBy(data, function (d) {
            return d.size;
        }));
        GridSystem.setGridContentAddition('#grid2Overview', [{
            class: 'title',
            text: 'Usage'
        }, {
            class: 'jumbo',
            text: `${number.number}<small>${number.symbol}b</small>`
        }, {
            class: 'desc-small',
            text: `총 사용 가능한 용량은 50MB 이고 <action>${number.number}${number.symbol}b</action>를 사용 하고 있습니다.`
        }]);

    });


    window.onpopstate = history.onpushstate = function (e) {
        GridSystem.clearPage(() => {
            createDataListWindow();
        });
    };

    function createDataListWindow() {
        GridSystem.createPage().createGrid({cell: 12, _id: 'gridOverview'});
        GridSystem.setGridHeader('#gridOverview', {
            text: 'Making the Data Set Freely',
        });
        GridSystem.setGridContent('#gridOverview',
            "This program aims to suggest multivariate data semantically " +
            "and to suggest visualization, " +
            "and users can freely group clusters of data."
        );

        GridSystem.createGrid([{cell: 7, _id: 'grid1Overview'}, {cell: 5, _id: 'grid2Overview'}]);
        GridSystem.setGridHeader('#grid1Overview', {
            text: 'Data List', actions: [{
                icon: 'add', action: function () {
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

        _.forEach(__Firebase.DataList, function (d) {
            GridSystem.addGridContentItem('#grid1Overview', {
                _id: d._id, text: d.name + ` <small>${d.type}</small>`, action: function () {
                    GridSystem.clearPage(function () {
                        createDataWindow(d);
                    });
                }
            });
        });

        let totalSize = 0;
        _.forEach(__Firebase.DataList, function (v) {
            totalSize += v.size;
        });

        let number = __Formatter.numberWithSymbol(totalSize);

        GridSystem.clearGridAddition('#grid2Overview');
        GridSystem.setGridContentAddition('#grid2Overview', [{
            class: 'title',
            text: 'Usage'
        }, {
            class: 'jumbo',
            text: `${number.number}<small>${number.symbol}b</small>`
        }, {
            class: 'desc-small',
            text: `총 사용 가능한 용량은 50MB 이고 <action>${number.number}${number.symbol}b</action>를 사용 하고 있습니다.`
        }]);

        __Firebase.releaseUsageData();
    }


    function createDataWindow(data) {
        window.history.pushState('page2', '', '/dataSummary/' + data.name);

        __Firebase.setUsageData(data);
        // Overview
        GridSystem.createPage().createGrid({cell: 12, _id: 'gridDataOverview'});
        GridSystem.setGridHeader('#gridDataOverview', {
            text: data.name, actions: [{
                icon: 'delete', action: function () {
                    __UIStatic.Dialog.open({
                        title: data.name,
                        text: '정말 삭제하시겠습니까?',
                        pos: {
                            name: 'Delete Data',
                            action: () => {
                            },
                        },
                        neg: {
                            name: 'Cancel',
                            action: () => {
                            },
                        }
                    });
                }, addition: 'remove',
            }]
        });


        // Description
        const fileSize = __Formatter.numberWithSymbol(data.size);
        GridSystem.createGrid([
            {cell: 5, _id: 'gridDataDescription'},
            {cell: 4, _id: 'gridDataInfo'},
            {cell: 3, _id: 'gridDataAddition'}])
            .setGridHeader('#gridDataDescription', {
                text: 'Data Overview', actions: [{
                    icon: 'edit', action: function () {
                        //__UIStatic.Toast.open('데이터의 Overview 를 수정합니다. 해당기능은 아직 구현되지 않았습니다.');
                        __UIStatic.Modal.open({
                            title: 'Data Overview',
                            content: '',
                            pos: {
                                name: 'Update',
                                action: "?",
                            }
                        })
                    }
                }]
            })
            .setGridContent('#gridDataDescription', data.overview)
            .setGridHeader('#gridDataInfo', {text: 'Data Info'})
            .setGridContent('#gridDataInfo', data.type + ' , ' + fileSize.number + fileSize.symbol + 'b')
            .setGridHeader('#gridDataAddition', {text: 'Addition'})

            .addGridContentDesc('#gridDataAddition', [
                {text: '해당 데이터에는 총 83개의 변인이 있습니다. <br><action>데이터의 변인 정보</action>를 확인 할 수 있습니다.<br> '},
                {text: '데이터의 크기는 ' + __Formatter.number(data.size) + '입니다. <br><action>데이터를 다운로드</action> 할 수 있습니다.'}
            ]);

        function testAction() {
            __UIStatic.Toast.open('변인 분석 필드를 선택하였습니다. 해당기능은 아직 구현되지 않았습니다.');
        }

        GridSystem.createGrid([
            {cell: 5, _id: 'gridDataChildList'},
            {cell: 7, _id: 'gridDataChildInfo'},])
            .setGridHeader('#gridDataChildList', {
                text: 'Dimension Field List', actions: [{
                    icon: 'add', action: function () {
                        __UIStatic.Modal.open({
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
                        })
                    }
                }]
            });

        _.forEach(__Firebase.DimensionFieldList, addDimensionField);
        __Firebase.onDimension(__Firebase.EventName.ChildAdded, addDimensionField);

        function addDimensionField(d) {
            GridSystem.addGridContentItem('#gridDataChildList', {
                text: d.name,
                action: () => {
                    setDimensionFieldOverview(__Firebase.DimensionFieldList[d._id]);
                },
                _id: d._id
            });
        }

        __Firebase.onDimension(__Firebase.EventName.ChildRemoved, function (d) {
            GridSystem.removeElement('#' + d._id);
        });

        __Firebase.onDimension(__Firebase.EventName.ChildChange, function (d) {
            GridSystem.updateGridContentItem('#' + d._id, d);
        });

        __Firebase.onDimension(__Firebase.EventName.ChildRemoved, function (d) {
            setDimensionFieldOverview();
        });

        setDimensionFieldOverview();

        function setDimensionFieldOverview(d) {
            console.log('dimension : ', d);
            let headerData = {
                text: 'Dimension Field Overview',
            };

            if (!_.isNil(d)) {
                headerData['actions'] = [{
                    icon: 'remove_circle', action: function () {
                        __UIStatic.Dialog.open({
                            title: 'Delete Dimension Field',
                            text: '선택된 "<strong>' + d.name + '</strong>" Dimension Field 가 삭제됩니다<br>삭제된 Field는 <u>복구 할 수 없습니다.</u>',
                            pos: {
                                name: 'Delete',
                                action: function () {
                                    __Firebase.deleteDimensionField(d);
                                }
                            },
                            neg: {
                                name: 'Cancel'
                            }
                        });


                    }, addition: 'remove'
                }, {
                    icon: 'play_circle_filled', action: function () {
                        __UIStatic.Dialog.open({
                            title: '3DRadvis',
                            text: data.name + '에 대한 시각화 분석을 시작합니다.',
                            pos: {
                                name: 'Start Analysis',
                                action: () => {
                                    window.location = '/testing';
                                }
                            },
                            neg: {
                                name: 'Cancel',
                                action: () => {
                                }
                            }
                        });
                    }
                }];
                GridSystem.setGridContent('#gridDataChildInfo', `<strong>${d.name}</strong>`);
            } else {
                GridSystem.setGridContent('#gridDataChildInfo', '선택된 Dimension Field 가 없습니다.<br>분석 하고자 하는 Dimension Field를 선택 해주세요.');
            }
            GridSystem.setGridHeader('#gridDataChildInfo', headerData)

        }

    }

    createDataListWindow();
    console.log(__UIStatic.Loader.attach('#grid1Overview'));
    //__Firebase.on(__Firebase.EventName.ChildRemoved, function (d) {
    //  __IndexDataList.deleteDataList(d);
    //})
});



