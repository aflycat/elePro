var map = new AMap.Map('container', {
    //resizeEnable: true,
    //mapStyle: 'amap://styles/9dbd7d59a2d46ffae2b38fa6007c954f',
    zoom: 14,
    center: [113.916203, 22.491197]
});



window.onload = function () {
    init();
}

function init() {
    addShenZhen();
    ConnectService();
    AddDatafromSQL();
}

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
                        strokeColor: 'yellow' //'#CC66CC'
                    });
                    polygons.push(polygon);
                }
               // map.setFitView();//地图自适应
            }
        });
    });
}

function ConnectService() {
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

function AddMarker(markinfo) {
    var point = StringToArray(markinfo.LngLat);
    var marker = new AMap.Marker({ //添加自定义点标记
        map: map,
        position: point, //基点位置
        offset: new AMap.Pixel(-7, -7), //相对于基点的偏移位置
        draggable: false,  //是否可拖动
        content: '<div class="marker-maintainer"></div>',//自定义点标记覆盖物内容
        title: name
    });
    AMap.event.addListener(marker, 'click', function () {
        if (infoWindow.getIsOpen()) {
            infoWindow.close();
        }
        else {
            var content = createInfoWindow(markinfo);
            infoWindow.setContent(content);
            infoWindow.open(map, marker.getPosition());
        }
    })
  
}

function AddDatafromSQL() {
  
    $.ajax({
        type: "post",
        url: "/GWService.asmx/GetDataTableFromSQL",//Http://192.168.0.223:8088
        async: false,
        data: {
            sql: "select * from Dt_MaintCo",
            userName: "admin"
        }, //"sql=select * from GWElevatorMarker where ElevatorNum='"+dt+"'",
        success: function (data) {
            if ($(data).find('shen').length > 0) {
                var markerInfo;
                $(data).find('shen').each(function (i) {
                    markerInfo = new Object();
                    markerInfo.LngLat = $(this).children('LngLat').text();
                    markerInfo.name = $(this).children('CompName').text();
                    AddMarker(markerInfo);
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

function createInfoWindow(dt) {
    var div = document.createElement("div");
    var profile = Vue.extend({
        template: Maintain,//markerInfo.Template,
        data: function () {
            return {
                Name: dt.name
            }
        },
        methods: {
        }
    });
    var component = new profile().$mount();
    div.appendChild(component.$el);
    return div;
}

function returnFloat(element) {
    return parseFloat(element, 10)
}

function StringToArray(Data) {
    var PointData = Data.split(',').map(returnFloat);
    return [PointData[0], PointData[1]];
}
