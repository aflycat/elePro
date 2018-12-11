var map = new AMap.Map('container', {
    zoom: 11,
    center: [114.118906,22.600259]
});

map.on('click', function(e) {
    //document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
    alert(e.lnglat);
    //infoWindow.open(map,e.lnglat);

});

function initPage(DistrictCluster, $) {

    var distCluster = new DistrictCluster({
        map: map, //所属的地图实例
        //设置显示3个省
        topAdcodes: [440300],
        autoSetFitView: false,
        getPosition: function(item) {

            if (!item) {
                return null;
            }

            var parts = item.split(',');

            //返回经纬度
            return [parseFloat(parts[0]), parseFloat(parts[1])];
        }
    });

    window.distCluster = distCluster;

    $('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body);
    $.get('../Data/data.txt', function(csv) {

        $('#loadingTip').remove();

        var data = csv.split('\n');

        distCluster.setData(data);
    });
}

//加载相关组件
AMapUI.load(['ui/geo/DistrictCluster', 'lib/$'], function(DistrictCluster, $) {

    window.DistrictCluster = DistrictCluster;

    //启动页面
    initPage(DistrictCluster, $);
});