var MaintainMarkers; //所有的维保单位的Marker
var RemoveMarkers;   //返回后要移除的Marker

var map = new AMap.Map('container', {
    //resizeEnable: true,
    //mapStyle: 'amap://styles/9dbd7d59a2d46ffae2b38fa6007c954f',
    //mapStyle: 'amap://styles/darkblue',
    zoom: 11,
    center: [114.118906, 22.600259]
});

window.onload = function () {
    init();
}

//绑定Enter键
$('#searchipt').bind('keypress', function (event) {
    if (event.keyCode == "13") {
        FindMaintain();
    }
});

//初始化数据
function init()
{
    addShenZhen();
    ConnectService();
    AddDatafromSQL();
}

//添加深圳的边界线
function addShenZhen() {
    //加载行政区划插件
    AMap.service('AMap.DistrictSearch', function () {
        var opts = {
            subdistrict: 1,   //返回下一级行政区
            extensions: 'all',  //返回行政区边界坐标组等具体信息
            level: 'city'  //查询行政级别为 市
        };
        //实例化DistrictSearch
        district = new AMap.DistrictSearch(opts);
        district.setLevel('district');
        //行政区查询
        district.search('深圳', function (status, result) {
            var bounds = result.districtList[0].boundaries;
            var polygons = [];
            if (bounds) {
                for (var i = 0, l = bounds.length; i < l; i++) {
                    //生成行政区划polygon
                    var polygon = new AMap.Polygon({
                        map: map,
                        strokeWeight: 2,
                        path: bounds[i],
                        //fillOpacity: 0.7,
                        fillColor: 'transparent',
                        strokeColor:'#007EDE' //'#CC66CC'
                    });
                    polygons.push(polygon);
                }
                //map.setFitView();//地图自适应
            }
        });
    });
}

//连接服务
function ConnectService()
{
    $.ajax({

        type: "POST",

        url: "/GWService.asmx/ConnectService",

        timeout: 5000,

        data: {
            user_name: "admin",
        },

        success: function (data) {

            var dt = $(data).find('string').text();

            //console.log(dt);

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
}

//添加维保单位的图标
function AddMaintainMarker(markinfo) {
    var point = StringToArray(markinfo.LngLat);
    var marker = new AMap.Marker({ //添加自定义点标记
        map: map,
        position: point, //基点位置
        offset: new AMap.Pixel(-12, -12), //相对于基点的偏移位置
        draggable: false,  //是否可拖动
        content: '<div class="marker-maintain"></div>',//自定义点标记覆盖物内容
        title: name,
        zIndex: 9999
    });
    AMap.event.addListener(marker, 'click', function () {
        var infoPosition = infoWindow.getPosition();
        var markerPosition = marker.getPosition();
        if (infoPosition == markerPosition) {
            if (infoWindow.getIsOpen()) {
                infoWindow.close();
            } else {
                infoWindow.open(map, marker.getPosition());
            }
        }
        else {
            var content = createInfoWindow(markinfo);
            infoWindow.setContent(content);
            infoWindow.open(map, marker.getPosition());
        }
    })
    MaintainMarkers.push(marker);
}

//获取维保单位数据
function AddDatafromSQL()
{
    MaintainMarkers = [];
    $.ajax({
        type: "post",
        url: "/GWService.asmx/GetDataTableFromSQL",//Http://192.168.0.223:8088
        async: false,
        data: {
            sql: "select * from GWElevatorMaintain",
            userName: "admin"
        }, //"sql=select * from GWElevatorMarker where ElevatorNum='"+dt+"'",
        success: function (data) {
            if ($(data).find('shen').length > 0) {
                var markerInfo;
                $(data).find('shen').each(function (i) {
                    markerInfo = new Object();
                    markerInfo.LngLat = $(this).children('MaintainPosition').text();
                    markerInfo.name = $(this).children('MaintainName').text();
                    markerInfo.code = $(this).children('MaintainCode').text();
                    markerInfo.certificate = $(this).children('Certificate').text();
                    if (markerInfo.LngLat != null && markerInfo.LngLat != '')
                    {
                        AddMaintainMarker(markerInfo);
                    }
                    
                })
               
            }
            else {
                alert("未能找到电梯，请检查是否输入错误");
            }

        }
    });
}

var infoWindow = new AMap.InfoWindow({
    isCustom: true,  //使用自定义窗体
    content: "",
    offset: new AMap.Pixel(0, 0)
});

//创建维保单位的信息窗口
function createInfoWindow(dt) {
    var div = document.createElement("div");
    var profile = Vue.extend({
        template: Maintain,//markerInfo.Template,
        data: function () {
            return {
                Name: dt.name,
                Code: dt.code,
                Certificate: dt.certificate,
                //Address: "广东省深圳市福田区",
                People:"刘先生",
                Phone:"13809667476"
            }
        },
        methods: {
        }
    });
    var component = new profile().$mount();
    div.appendChild(component.$el);
    return div;
}

//创建维保人员的信息窗口
function createInfoWindow2(dt)
{
    var div = document.createElement("div");
    var profile = Vue.extend({
        template: Maintainer,//markerInfo.Template,
        data: function () {
            return {
                Name: "李少吴",
                Maintain: "蒂森电梯深圳分公司",
                Paperwork: "有效",
                PaperworkID: "40086300065320",
                Phone: "13797840321"
            }
        },
        methods: {
        }
    });
    var component = new profile().$mount();
    div.appendChild(component.$el);
    return div;
}

//数据处理
function returnFloat(element) {
    return parseFloat(element, 10)
}

function StringToArray(Data) {
    var PointData = Data.split(',').map(returnFloat);
    return [PointData[0], PointData[1]];
}

function StringToPoint(Data) {
    var PointData = Data.split(',').map(returnFloat);
    return new AMap.LngLat(PointData[0], PointData[1]);
}

//找寻维保单位
function FindMaintain() {
    if (typeof (RemoveMarkers) !=="undefined")
    {
        infoWindow.close();
        map.remove(RemoveMarkers);
    }
   
    var a = $("#searchipt");
    if ($.trim(a.val()) != '') {
        GetMaintainFromSQL(a.val());

    }
    else {
        alert("请输入正确的设备号");
    }

}

//查询输入的维保单位数据
function GetMaintainFromSQL(dt) {
    $.ajax({
        type: "post",
        url: "/GWService.asmx/GetDataTableFromSQL",//Http://192.168.0.223:8088
        async: false,
        data: {
            sql: "select * from GWELevatorMaintain where MaintainName='" + dt + "'",
            userName: "admin"
        }, //"sql=select * from GWElevatorMarker where ElevatorNum='"+dt+"'",
        success: function (data) {
            if ($(data).find('shen').length > 0) {
                var markerInfo;
                $(data).find('shen').each(function (i) {
                    markerInfo = new Object();
                    markerInfo.LngLat = $(this).children('MaintainPosition').text();
                    markerInfo.name = $(this).children("MaintainName").text();
                    markerInfo.code = $(this).children('MaintainCode').text();
                    markerInfo.certificate = $(this).children('Certificate').text();
                })
                AddMaintain(markerInfo);
            }
            else {
                alert("未能找到维保单位，请检查是否输入错误");
            }

        }
    });
}

//返回主界面
function Back() {
    if (typeof (RemoveMarkers) !== "undefined") {
        map.remove(RemoveMarkers);
    }
    map.setZoom(11);
    infoWindow.close();
    map.setCenter(new AMap.LngLat(114.118906, 22.600259));
    for (var i = 0; i < MaintainMarkers.length; i++) {
        MaintainMarkers[i].show();
    }
}

//添加维保单位
function AddMaintain(dt) {
    RemoveMarkers = [];
    var position = StringToPoint(dt.LngLat);
    var position2 = StringToArray(dt.LngLat);
    //map.clearMap();
    map.setZoom(18);
    map.setCenter(position);
    for (var i = 0; i < MaintainMarkers.length; i++) {
        MaintainMarkers[i].hide();
    }
    var marker = new AMap.Marker({ //添加自定义点标记
        map: map,
        position: position2, //基点位置
        offset: new AMap.Pixel(-12, -12), //相对于基点的偏移位置
        draggable: false,  //是否可拖动
        content: '<div class="marker-maintain"><i></i></div>',//自定义点标记覆盖物内容
        zIndex:9999,
    });
    AMap.event.addListener(marker, 'click', function () {
        var infoPosition = infoWindow.getPosition();
        var markerPosition = marker.getPosition();
        if (infoPosition == markerPosition) {
            if (infoWindow.getIsOpen()) {
                infoWindow.close();
            } else {
                infoWindow.open(map, marker.getPosition());
            }
        }
        else {
            var content = createInfoWindow(dt);
            infoWindow.setContent(content);
            infoWindow.open(map, marker.getPosition());
        }
    })

    var contextMenu = new AMap.ContextMenu();  //创建右键菜单
    //右键放大
    contextMenu.addItem("查询单位维保人员", function () {
        var circle = new AMap.Circle({
            center: position2,// 圆心位置
            radius: 1000, //半径
            strokeColor: "#F33", //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 3, //线粗细度
            fillColor: "#ee2200", //填充颜色
            fillOpacity: 0.35//填充透明度
        });
        circle.setMap(map)
        RemoveMarkers.push(circle);
        GetMaintainer(marker.getPosition());
    }, 0);
    marker.on('rightclick', function (e) {
        contextMenu.open(map, e.lnglat);
    });
    RemoveMarkers.push(marker);
}

//获取维保人员信息
function GetMaintainer(dt) {
    $.ajax({
        type: "post",
        url: "/GWService.asmx/GetDataTableFromSQL",//Http://192.168.0.223:8088
        async: false,
        data: {
            sql: "select * from GWMaintainer",
            userName: "admin"
        }, //"sql=select * from GWElevatorMarker where ElevatorNum='"+dt+"'",
        success: function (data) {
            if ($(data).find('shen').length > 0) {
                var markerInfo;
                $(data).find('shen').each(function (i) {
                    markerInfo = new Object();
                    markerInfo.LngLat = $(this).children('MaintainerPosition').text();
                    markerInfo.name = $(this).children('MaintainerName').text();
                    if (dt.distance(StringToPoint(markerInfo.LngLat)) < 1000) {
                        AddMaintainer(markerInfo);
                    }

                })
                map.setFitView(RemoveMarkers);
            }
            else {
                alert("未能找到电梯，请检查是否输入错误");
            }

        }
    });
}

//添加维保人员标注
function AddMaintainer(markinfo) {
    var point = StringToArray(markinfo.LngLat);
    var marker = new AMap.Marker({ //添加自定义点标记
        map: map,
        position: point, //基点位置
        offset: new AMap.Pixel(-12, -12), //相对于基点的偏移位置
        draggable: false,  //是否可拖动
        content: '<div class="marker-maintainer2"></div>',//自定义点标记覆盖物内容
        title: name
    });
    AMap.event.addListener(marker, 'click', function () {
        var infoPosition = infoWindow.getPosition();
        var markerPosition = marker.getPosition();
        if (infoPosition == markerPosition) {
            if (infoWindow.getIsOpen())
            {
                infoWindow.close();
            } else
            {
                infoWindow.open(map, marker.getPosition());
            }
        }
        else {
            var content = createInfoWindow2(markinfo);
            infoWindow.setContent(content);
            infoWindow.open(map, marker.getPosition());
        }
    })
    RemoveMarkers.push(marker);
}



