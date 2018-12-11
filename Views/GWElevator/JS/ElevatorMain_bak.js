var getWebUser, ServerHub = null;

var AlarmMarkers = [];//报警的点的合集

var FindMarkers = [];
var map = new AMap.Map('container', {
    //resizeEnable: true,
    //mapStyle: 'amap://styles/darkblue',
    zoom: 11,
    center: [114.118906, 22.600259]
});

AMapUI.loadUI(['control/BasicControl'], function (BasicControl) {
    //添加一个缩放控件
    map.addControl(new BasicControl.Zoom({
        position: 'rb'
    }));
})
//map.on('click', function(e) {
//    //document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
//    alert(e.lnglat);
//});

//初始化地图的海量点和区划
function initPage(DistrictCluster, PointSimplifier, $) {
    var groupStyleMap;

    var pointSimplifierIns = new PointSimplifier({
        map: map, //所属的地图实例
        autoSetFitView: false, //禁止自动更新地图视野
        zIndex: 110,
        getPosition: function (item) {

            if (!item) {
                return null;
            }
            //var parts = item.split(',');
            var parts = item.position.split(',');

            //返回经纬度
            return [parseFloat(parts[0]), parseFloat(parts[1])];
        },
        getHoverTitle: function (dataItem, idx) {
            //console.log(dataItem);
            return dataItem.info;
        },

        renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
        renderOptions: {
            //点的样式
            pointStyle: {
                content: 'circle',
                fillStyle: 'green',
                width: 6,
                height: 6,
                lineWidth: 1
            },
            getGroupId: function (item, idx) {

                //var parts = item.split(',');
                var parts = item.state;
                ////按纬度区间分组
                //return Math.abs(Math.round(parseFloat(parts[1]) / 5));
                return Math.abs(parts);
            },
            groupStyleOptions: function (gid) {
                return groupStyleMap[gid];
            }
        }
    });

    function onIconLoad() {
        pointSimplifierIns.renderLater();
    }

    function onIconError(e) {
        alert('图片加载失败！');
    }

    groupStyleMap = {
        'A': {
            //pointStyle: {
            //    //绘制点占据的矩形区域
            //    content: PointSimplifier.Render.Canvas.getImageContent(
            //        '../Images/test1.png', onIconLoad, onIconError),
            //    //宽度
            //    width: 16,
            //    //高度
            //    height: 16,
            //    //定位点为中心
            //    offset: ['-50%', '-50%'],
            //    fillStyle: null,
            //    //strokeStyle: null
            //}
            pointStyle: {
                content: 'circle',
                width: 6,
                height: 6,
                fillStyle: 'green',
                lineWidth: 1,
            }
        },
        '1': {
            //pointStyle: {
            //    //绘制点占据的矩形区域
            //    content: PointSimplifier.Render.Canvas.getImageContent(
            //        '../Images/test2.png', onIconLoad, onIconError),
            //    //宽度
            //    width: 16,
            //    //高度
            //    height: 16,
            //    //定位点为中心
            //    offset: ['-50%', '-50%'],
            //    fillStyle: null,
            //    // strokeStyle: null
            //}
            pointStyle: {
                content: 'circle',
                width: 15,
                height: 15,
                fillStyle: 'yellow',
                lineWidth: 1,
            }
        },
        '2': {
            //pointStyle: {
            //    //绘制点占据的矩形区域
            //    content: PointSimplifier.Render.Canvas.getImageContent(
            //        '../Images/test3.png', onIconLoad, onIconError),
            //    //宽度
            //    width: 16,
            //    //高度
            //    height: 16,
            //    //定位点为中心
            //    offset: ['-50%', '-50%'],
            //    fillStyle: null,
            //    //strokeStyle: null
            //}
              pointStyle: {
                content: 'circle',
                width: 15,
                height: 15,
                fillStyle: 'red',
                lineWidth: 1,
            }
        },
        '3': {
            pointStyle: {
                //绘制点占据的矩形区域
                content: PointSimplifier.Render.Canvas.getImageContent(
                    '../Images/test1.png', onIconLoad, onIconError),
                //宽度
                width: 16,
                //高度
                height: 16,
                //定位点为中心
                offset: ['-50%', '-50%'],
                fillStyle: null,
                //strokeStyle: null
            }
        }
    };

    var distCluster = new DistrictCluster({
        zIndex: 100,
        map: map,
        topAdcodes: [440300],
        autoSetFitView: false,
        getPosition: function (item) {

            if (!item) {
                return null;
            }
            var parts = item.position.split(',');
            //返回经纬度
            return [parseFloat(parts[0]), parseFloat(parts[1])];
        },
        renderOptions: {
            animEnable: true,
            //featureEventSupport: true,
            clusterMarkerEventSupport: true,
            //标注信息Marker上需要监听的事件
            clusterMarkerEventNames: ['click', 'rightclick', 'mouseover', 'mouseout'],
            //基础样式
            featureStyle: {
                fillStyle: 'rgba(102,170,0,0.5)', //填充色
                lineWidth: 2, //描边线宽
                strokeStyle: 'rgb(255, 255, 0)', //描边色
                //鼠标Hover后的样式
                hoverOptions: {
                    fillStyle: 'rgba(255,255,255,0.2)'
                }
            },
            //特定区划级别的默认样式
            featureStyleByLevel: {
                //全国
                country: {
                    fillStyle: 'rgba(49, 163, 84, 0.8)'
                },
                //省
                province: {
                    fillStyle: 'rgba(116, 196, 118, 0.7)'
                },
                //市
                city: {
                    fillStyle: 'rgba(161, 217, 155, 0.6)'
                },
                //区县
                district: {
                    fillStyle: 'rgba(0,139,220,0.6)',//'rgba(199, 233, 192, 0.1)'
                    hoverOptions: {
                        fillStyle: 'rgba(131,255,255,0.6)'
                    }
                }
            }
        }
    });

    window.distCluster = distCluster;

    window.pointSimplifierIns = pointSimplifierIns;

    function refresh() {
        //var zoom = map.getZoom();
        //console.log(zoom);
        //获取 pointStyle
        var pointStyle = pointSimplifierIns.getRenderOptions().pointStyle;
        //根据当前zoom调整点的尺寸
        pointStyle.width = pointStyle.height = 2 * Math.pow(1.2, map.getZoom() - 3);

        var zoom = map.getZoom();

        if (zoom < 12) {
            distCluster.show();
        } else {
            distCluster.hide();
        }
    }
     map.on('zoomend', function () {
         refresh();
     });
    // refresh();
    $('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body);

    $.ajax({
        type: "post",
        url: "/GWService.asmx/GetDataTableFromSQL",//Http://192.168.0.223:8088
        async: false,
        data: {
            sql: "select * from GWElevatorMarker where ElevatorState=0",
            userName: "admin",
        },

        success: function (data) {
            $('#loadingTip').remove();
            var markerInfo = [];
            var markerAlarm = [];
            if ($(data).find('shen').length > 0) {
                $(data).find('shen').each(function (i) {
                    var AlarmMarker = new Object();
                    AlarmMarker.position = $(this).children('ElevatorPosition').text();
                    AlarmMarker.info = $(this).children('ElevatorNum').text();
                    AlarmMarker.state = $(this).children('ElevatorState').text();
                    markerInfo.push(AlarmMarker);

                })
                distCluster.setData(markerInfo);
                distCluster.on('clusterMarkerClick', function (e, record) {
                    // console.log(e.type + ': ' + record.feature.properties.name);
                    //distCluster.hide();
                });

                pointSimplifierIns.setData(markerInfo);

                pointSimplifierIns.on('pointClick', function (e, record) {

                    var contextMenu = new AMap.ContextMenu();  //创建右键菜单
                    //右键放大
                    contextMenu.addItem("查看电梯详细信息", function () {
                        bindcmd.CommandExecute("AM3008(2D@" + record.data.position + "-" + record.data.info + ")");
                    }, 0);
                    contextMenu.open(map, StringToArray(record.data.position));
                });
                //console.log(markerInfo);
            }
        }
    });
}

//找寻电梯
function FindElevator() {
    if (typeof (FindMarkers) !== "undefined") {
        infoWindow.close();
        map.remove(FindMarkers);
    }
    FindMarkers = [];
    var a = $("#searchipt");
    if ($.trim(a.val()) != '') {
        AddDataFromSQL(a.val());

    }
    else {
        alert("请输入正确的查询点信息");
    }
}

//返回主界面
function Back() {
    //map.clearMap();
    if (typeof (FindMarkers) !== "undefined") {
        infoWindow.close();
        map.remove(FindMarkers);
    }
    FindMarkers = [];
    distCluster.hide();
    pointSimplifierIns.hide();
    distCluster.show();
    pointSimplifierIns.show();
    map.setZoom(11);
    map.setCenter(new AMap.LngLat(114.118906, 22.600259));
}

//加载数据库中的海量点
function AddDataFromSQL(dt) {
    $.ajax({
        type: "post",
        url: "/GWService.asmx/GetDataTableFromSQL",//Http://192.168.0.223:8088
        async: false,
        data: {
            sql: "select * from GWElevatorMarker where ElevatorNum='" + dt + "'",
            userName: "admin"
        }, //"sql=select * from GWElevatorMarker where ElevatorNum='"+dt+"'",
        success: function (data) {
            if ($(data).find('shen').length > 0) {
                var markerInfo;
                $(data).find('shen').each(function (i) {
                    markerInfo = new Object();
                    markerInfo.LngLat = $(this).children('ElevatorPosition').text();
                    markerInfo.Name = $(this).children('ElevatorNum').text();
                })
                addMarker(markerInfo);
            }
            else {
                alert("未能找到电梯，请检查是否输入错误");
            }

        }
    });
}

//寻找电梯添加的图标
function addMarker(dt) {
    var position = StringToPoint(dt.LngLat);
    var position2 = StringToArray(dt.LngLat);
    distCluster.hide();
    pointSimplifierIns.hide();
    //map.clearMap();
    map.setZoom(18);
    map.setCenter(position);
    var marker = new AMap.Marker({ //添加自定义点标记
        map: map,
        position: position2, //基点位置
        offset: new AMap.Pixel(-15, -15), //相对于基点的偏移位置
        draggable: true,  //是否可拖动
        content: '<div class="marker-common"><i></i></div>'   //自定义点标记覆盖物内容
    });

    var data1 = getRealData("3001", "yxp");
    var content1 = createInfoWindow(data1, dt.Name);
    infoWindow.setContent(content1);
    infoWindow.open(map, marker.getPosition());
    AMap.event.addListener(marker, 'click', function () {
        if (infoWindow.getIsOpen()) {
            infoWindow.close();
        }
        else {
            var data = getRealData("3001", "yxp");
            var content = createInfoWindow(data, dt.Name);
            infoWindow.setContent(content);
            infoWindow.open(map, marker.getPosition());
        }
    })
    FindMarkers.push(marker);
}

//电梯报警添加的图标
function AddAlarmMarker(dt, dt2, dt3) {
    var position = StringToPoint(dt);
    var position2 = StringToArray(dt);
    //map.setCenter(position);
    //map.clearMap();
    //map.setZoom(18);
    //distCluster.hide();
    //pointSimplifierIns.hide();
    var marker = new AMap.Marker({ //添加自定义点标记
        map: map,
        position: position2, //基点位置
        offset: new AMap.Pixel(-7.5, -7.5), //相对于基点的偏移位置
        draggable: false,  //是否可拖动
        content: '<div class="marker-route"><i></i></div>',//自定义点标记覆盖物内容
        title: dt3
    });
    marker.id = dt2;
    var info = getRealData("3001", "yxp");
    var content1 = createInfoWindow(info, dt3);
    infoWindow.setContent(content1);
    infoWindow.open(map, marker.getPosition());
    AMap.event.addListener(marker, 'click', function () {
        if (infoWindow.getIsOpen()) {
            infoWindow.close();
        }
        else {
            let data = getRealData("3001", "yxp");
            let content = createInfoWindow(data, dt3);
            infoWindow.setContent(content);
            infoWindow.open(map, marker.getPosition());
        }
    })
    var contextMenu = new AMap.ContextMenu();  //创建右键菜单
    //右键放大
    contextMenu.addItem("查询报警点详细信息", function () {
        bindcmd.CommandExecute("AM3008(2D@" + dt + "-" + dt3 + ")");
    }, 0);
    marker.on('rightclick', function (e) {
        contextMenu.open(map, e.lnglat);
    });
  
    AlarmMarkers.push(marker);
}

//移除报警电梯
function removeMarker(dt) {
    infoWindow.close();
    var deleteMarkers = [];
    distCluster.show();
    pointSimplifierIns.show();
    for (var i = 0; i < AlarmMarkers.length; i++) {
        if (AlarmMarkers[i].id == dt) {
            deleteMarkers.push(AlarmMarkers[i]);
            map.remove(deleteMarkers);
        }
    }

}

//电梯的弹出框
var infoWindow = new AMap.InfoWindow({
    isCustom: true,  //使用自定义窗体
    content: createInfoWindow(),
    offset: new AMap.Pixel(0, 0)
});

function createInfoWindow(dt, dt2) {
    console.log(dt);
    var div = document.createElement("div");
    var profile = Vue.extend({
        template: Elevator,//markerInfo.Template,
        data: function () {
            return {
                Name: dt2,
                Elevators: dt,
                //Elevators: [
                //    {
                //        url: "../Images/CommunicationOK.png",
                //        name: "电梯1"
                //    },
                //    {
                //        url: "../Images/CommunicationOK.png",
                //        name: "电梯2"
                //    },
                //    {
                //        url: "../Images/HaveAlarm.png",
                //        name: "电梯23"
                //    }
                //]

            }
        },
        methods: {
            SwitchInfo: function () {
                bindcmd.CommandExecute("AM3007"); //(2D@" + dt3 + "-" + dt2 + ")"
            }
        }
    });
    var component = new profile().$mount();
    div.appendChild(component.$el);
    return div;
}

//获取设备各个测点的实时状态
function getRealData(dt, dt2) {
    var realData = [];
    $.ajax({
        type: "post",
        url: "/GWService.asmx/GetRealTimeData",//Http://192.168.0.223:8088
        async: false,
        data: {
            equip_no: dt,
            table_name: dt2
        },
        success: function (data) {
            var Data = JSON.parse($(data).find('string').text());
            for (var i = 0; i < Data.length; i++) {
                var item = {};
                item.name = Data[i].m_YXNm;
                item.url = Data[i].m_IsAlarm ? "../Images/HaveAlarm.png" : "../Images/CommunicationOK.png";
                item.position = Data[i].ZiChanID;
		console.log(item);
                realData.push(item);
            }
        }
    });
    return realData;
}

//加载相关组件
AMapUI.load(['ui/geo/DistrictCluster', 'ui/misc/PointSimplifier', 'lib/$'], function (DistrictCluster, PointSimplifier, $) {
    var ajaxVar = $.ajax({

        type: "POST",

        url: "/GWService.asmx/ConnectService",

        timeout: 5000,

        data: {
            user_name: "admin",
        },

        success: function (data) {

            var dt = $(data).find('string').text();

            console.log(dt);

        },

        complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数

            if (status == 'timeout') {//超时

                ajaxVar.abort();

                console.log("超时");

                XMLHttpRequest = null;

            }

        },

        error: function () {

            console.log("连接服务器错误");

        }

    });

    $.ajax({
        type: "post",
        url: "/GWService.asmx/UserPermissions",
        data: "userName=" + window.localStorage.userName,
        success: function (dt) {
            getWebUser = $(dt).children("UserItem");
            connect();
        }
    });

    $.ajax({
        type: "post",
        url: "/GWService.asmx/GetEquipAllState",
        success: function (data) {
            var GetAlarmEquip = [];
            var resultStr = $(data).children("string").text();
            if (resultStr != 'false') {
                var AllEquipStat = resultStr.split(';');
                console.log(AllEquipStat);
                for (var i = 0; i < AllEquipStat.length; i++) {
                    if (AllEquipStat[i].split(',')[2] == "HaveAlarm")
                    {
                        GetAlarmEquip.push(AllEquipStat[i]);
                    }
                }
            }
            InitAlarmEquip(GetAlarmEquip);
        }
    });

    $.ajax({
        type: "post",
        url: "/GWService.asmx/GWEquipTree",
        success: function (data) {
            var test = createXml($(data).children("string").text());
            $(test).find("GWEquipTreeItem").each(function () {
                console.log($(this).attr("Name"));
            });
            //if (resultStr != 'false') {
            //    var AllEquipStat = resultStr.split(';');
            //    console.log(AllEquipStat);
            //}
        }
    });

    //启动页面
    initPage(DistrictCluster, PointSimplifier, $);

    InitUL();
});

//连接SingleR接收测点实时状态的上报
function connect() {
    ServerHub = null;
    ServerHub = $.connection.serverHub;
    //监听所有设备报警状态
    ServerHub.client.sendEquipSingle = function (data) {
        var dts = data.split(',');
        console.log(dts);
        if (dts[2] == "HaveAlarm") {
            var dt = dts[3] + "," + dts[4];
            var dt2 = dts[0];
            var dt3 = dts[1];
            setTimeout(function () {
                 AddAlarmMarker(dt, dt2, dt3);
            }, 50);
        }
        else {
            removeMarker(dts[0]);
            //Back();
        }
    };

    ServerHub.client.sendConnect = function (data) {
        console.log(data);
        //data = null;
    };

    ServerHub.client.sendAll = function (data, name) {
        //ycyxDataAll(data, name);
    };

    ServerHub.client.sendYcpSingle = function (data) {
        console.log(data);
        //ycpSingleData(data);
    }

    ServerHub.client.sendYxpSingle = function (data) {
        //yxpSingleData(data);
        console.log(data);
    }

    $.connection.hub.start().done(function () {
        ServerHub.server.connect();
        ServerHub.server.listenEquipAll(window.localStorage.userName);
    });

    $.connection.hub.disconnected(function () {
        //console.log('已断开');
    });

    $.connection.hub.connectionSlow(function () {
        //console.log('当客户端检测到慢速或频繁下降连接时引发。');
    });

    $.connection.hub.received(function () {
        //console.log('在连接上接收到任何数据时引发。提供接收数据。');
    });

    $.connection.hub.reconnecting(function () {
        //console.log('当底层传输开始重新连接。');
        //initEnsureChonglian(function () {
        //$.connection.hub.stop();
        //if ($('.main').attr('value') == '1') {
        //    $.connection.hub.start().done(function () {
        //        ServerHub.server.connect();
        //        ServerHub.server.listenEquipAll(window.localStorage.userName);
        //        ServerHub.server.startListen(equip_nos, window.localStorage.userName);
        //    });
        //}
        //});
    });

    $.connection.hub.stateChanged(function () {
        //console.log('当连接状态改变时引发。提供旧状态和新状态（连接，连接，连接，或断开）。');
    });
}

//处理经纬度数据
function returnFloat(element) {
    return parseFloat(element, 10)
}

function StringToPoint(Data) {
    var PointData = Data.split(',').map(returnFloat);
    return new AMap.LngLat(PointData[0], PointData[1]);
}

function StringToArray(Data) {
    var PointData = Data.split(',').map(returnFloat);
    return [PointData[0], PointData[1]];
}

function createXml(str) {
    if (document.all) {
        var xmlDom = new ActiveXObject("Microsoft.XMLDOM");
        xmlDom.loadXML(str);
        return xmlDom;
    }
    else
        return new DOMParser().parseFromString(str, "text/xml");
}

//初始化侧边选择栏
function InitUL() {
    // 网页版本
    $(".legendul li").find("a").bind('click', function () {
        if (!$(this).hasClass("animation"))
            $(this).addClass("animation").parent().siblings().find("a").removeClass("animation animation1");
        //地图处理
        var CurrentSort = $(this).text();
        console.log(CurrentSort);
        ChangeElevator(CurrentSort);
    });
    $(".legendul li").find("a").hover(function () {
        if (!$(this).hasClass("animation1"))
            $(this).addClass("animation1");
    }, function () {
        if ($(this).hasClass("animation1"))
            $(this).removeClass("animation1");
    });
}

//侧边栏选中不同状态时切换电梯数据
function ChangeElevator(dt) {
    if (dt == "正常") {
        $.ajax({
            type: "post",
            url: "/GWService.asmx/GetDataTableFromSQL",//Http://192.168.0.223:8088
            async: false,
            data: {
                sql: "select * from GWElevatorMarker where ElevatorState=0",
                userName: "admin",
            },

            success: function (data) {
                $('#loadingTip').remove();
                var markerInfo = [];
                if ($(data).find('shen').length > 0) {
                    $(data).find('shen').each(function (i) {
                        var AlarmMarker = new Object();
                        AlarmMarker.position = $(this).children('ElevatorPosition').text();
                        AlarmMarker.info = $(this).children('ElevatorNum').text();
                        AlarmMarker.state = $(this).children('ElevatorState').text();
                        markerInfo.push(AlarmMarker);
                    })
                    distCluster.setData(markerInfo);
                    distCluster.on('clusterMarkerClick', function (e, record) {
                        // console.log(e.type + ': ' + record.feature.properties.name);
                        //distCluster.hide();
                    });

                    pointSimplifierIns.setData(markerInfo);

                    //pointSimplifierIns.on('pointClick', function (e, record) {
                    //    console.log(e, record);
                    //});
                    //console.log(markerInfo);
                }
            }
        });
    }
    else if (dt == "警告") {
        $.ajax({
            type: "post",
            url: "/GWService.asmx/GetDataTableFromSQL",//Http://192.168.0.223:8088
            async: false,
            data: {
                sql: "select * from GWElevatorMarker where ElevatorState=1",
                userName: "admin",
            },

            success: function (data) {
                $('#loadingTip').remove();

                var markerAlarm = [];
                if ($(data).find('shen').length > 0) {
                    $(data).find('shen').each(function (i) {
                        var AlarmMarker = new Object();
                        AlarmMarker.position = $(this).children('ElevatorPosition').text();
                        AlarmMarker.info = $(this).children('ElevatorNum').text();
                        AlarmMarker.state = $(this).children('ElevatorState').text();
                        markerAlarm.push(AlarmMarker);

                    })
                    distCluster.setData(markerAlarm);
                    distCluster.on('clusterMarkerClick', function (e, record) {
                        // console.log(e.type + ': ' + record.feature.properties.name);
                        //distCluster.hide();
                    });

                    pointSimplifierIns.setData(markerAlarm);

                    //pointSimplifierIns.on('pointClick', function (e, record) {
                    //    console.log(e, record);
                    //});
                    //console.log(markerInfo);
                }
            }
        });
    }
    else {
        $.ajax({
            type: "post",
            url: "/GWService.asmx/GetDataTableFromSQL",//Http://192.168.0.223:8088
            async: false,
            data: {
                sql: "select * from GWElevatorMarker where ElevatorState=2",
                userName: "admin",
            },

            success: function (data) {
                $('#loadingTip').remove();
             
                var markerWarn = [];
                if ($(data).find('shen').length > 0) {
                    $(data).find('shen').each(function (i) {
                        var AlarmMarker = new Object();
                        AlarmMarker.position = $(this).children('ElevatorPosition').text();
                        AlarmMarker.info = $(this).children('ElevatorNum').text();
                        AlarmMarker.state = $(this).children('ElevatorState').text();
                        markerWarn.push(AlarmMarker);
                    })
                    distCluster.setData(markerWarn);
                    distCluster.on('clusterMarkerClick', function (e, record) {
                        // console.log(e.type + ': ' + record.feature.properties.name);
                        //distCluster.hide();
                    });

                    pointSimplifierIns.setData(markerWarn);

                    //pointSimplifierIns.on('pointClick', function (e, record) {
                    //    console.log(e, record);
                    //});
                    //console.log(markerInfo);
                }
            }
        });
    }
}

//页面启动时初始化电梯状态
function InitAlarmEquip(dt) {
    for (var i = 0; i < dt.length; i++) {
        var dts = dt[i].split(',');
        var data = getRealData(dts[0], 'yxp');
         if (typeof (data[0].position) !== "undefined" && data[0].position!="")
        {
            AddAlarmMarker(data[0].position, dts[0], dts[1]);
        }
    }
}