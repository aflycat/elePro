var map = new AMap.Map('container', {
    //resizeEnable: true,
    //zoom: 11,
    //center: [114.118906, 22.600259]
});
var Markers;

window.onload = function (){
	init("1","2");
}

//初始化dt为经纬度,dt2为信息
function init(dt,dt2)
{
    var position = StringToPoint("113.916206,22.491202");
    map.clearMap();
    map.setZoom(16);
    map.setCenter(position);
    Markers = [];
    addMarker(dt,dt2);
}

//添加当前所要展示的marker
function addMarker(dt,dt2)
{
    var point = StringToArray("113.916206,22.491202");
    var point2 = StringToPoint("113.916206,22.491202");
    var marker = new AMap.Marker({ //添加自定义点标记
        map: map,
        position: point, //基点位置
        offset: new AMap.Pixel(-12, -12), //相对于基点的偏移位置
        draggable: false,  //是否可拖动
        content: '<div class="marker-elevator"><i></i></div>',//自定义点标记覆盖物内容
        title: dt2,
        zIndex:9999
    });
    //var contextMenu = new AMap.ContextMenu();  //创建右键菜单
    ////右键放大
    //contextMenu.addItem("查询周边维保人员", function () {
    //    var circle = new AMap.Circle({
    //        center: point2,// 圆心位置
    //        radius: 1000, //半径
    //        strokeColor: "#F33", //线颜色
    //        strokeOpacity: 1, //线透明度
    //        strokeWeight: 3, //线粗细度
    //        fillColor: "#ee2200", //填充颜色
    //        fillOpacity: 0.35//填充透明度
    //    });
    //    circle.setMap(map)
    //    Markers.push(circle);
    //    //map.zoomIn();
    //    GetDatafromSQL(marker.getPosition());
    //}, 0);
    //marker.on('rightclick', function (e) {
    //    contextMenu.open(map, e.lnglat);
    //});
    //var content = createInfoWindow2(dt2);
    //infoWindow.setContent(content);
    //infoWindow.open(map, marker.getPosition());
    //AMap.event.addListener(marker, 'click', function () {
    //    var infoPosition = infoWindow.getPosition();
    //    var markerPosition = marker.getPosition();
    //    if (infoPosition == markerPosition) {
    //        if (infoWindow.getIsOpen()) {
    //            infoWindow.close();
    //        } else {
    //            infoWindow.open(map, marker.getPosition());
    //        }
    //    }
    //    else {
    //        var content = createInfoWindow2(dt2);
    //        infoWindow.setContent(content);
    //        infoWindow.open(map, marker.getPosition());
    //    }
    //})
}

//获取1000米内所有的维保人员的数据
function GetDatafromSQL(dt) {
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
                    if (dt.distance(StringToPoint(markerInfo.LngLat)) < 1000)
                    {
                        AddMaintainer(markerInfo);
                    }
                   
                })
                map.setFitView(Markers);      
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

//维保人员的信息窗口
function createInfoWindow(dt) {
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

//当前电梯使用单位的信息窗口
function createInfoWindow2(dt) {
    var div = document.createElement("div");
    var profile = Vue.extend({
        template: Maintain,//markerInfo.Template,
        data: function () {
            return {
                Name:"万融大厦C座",
                PlaceName: "万融大厦C座",
                PlaceAdress: "深圳市南山区南海大道1029号万融大厦C座",
                MaintainBusiness: "蒂森电梯有限公司深圳分公司",
                MaintainPhone: "18362456834",
                UseBusiness: "万融大厦",
                SafterName: "周平义 1803307117",
            }
        },
        methods: {
        }
    });
    var component = new profile().$mount();
    div.appendChild(component.$el);
    return div;

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
        title: name,
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
    });
    Markers.push(marker);
}

//数据处理
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