var map = new AMap.Map('container', {
    zoom: 11,
    layers: [new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()],
    center: [116.404, 39.915]
});

addMarker();
translatejw();

//添加Marker 和 信息窗体
function addMarker() {
    var marker = new AMap.Marker({ //添加自定义点标记
        map: map,
        position: [116.397428, 39.90923], //基点位置
        offset: new AMap.Pixel(-15, -11), //相对于基点的偏移位置
        draggable: true,  //是否可拖动
        content: '<div class="marker-route"><i></i></div>'   //自定义点标记覆盖物内容
    });
    AMap.event.addListener(marker, 'click', function () {
        if (infoWindow.getIsOpen()) {
            infoWindow.close();
        }
        else {
            infoWindow.open(map, marker.getPosition());
        }
    })
}


//切换百度地图坐标到高德地图
function translatejw() {
    $.get('http://restapi.amap.com/v3/assistant/coordinate/convert?locations=116.481499,39.990475&coordsys=baidu&output=json&key=94e45d688074c31551a65cdbb24a66e7').done(
        function (data) {
            console.log(data.locations);
        }
    )
}

//自定义信息窗体
var infoWindow = new AMap.InfoWindow({
    isCustom: true,  //使用自定义窗体
    content: createInfoWindow(),
    offset: new AMap.Pixel(0, -45)
});

function createInfoWindow() {
    var div = document.createElement("div");
    var profile = Vue.extend({
        template: Cargo,//markerInfo.Template,
        data: function () {
            return {
                data1: "Test",
            }
        }
    });
    var component = new profile().$mount();
    div.appendChild(component.$el);
    return div;
}


