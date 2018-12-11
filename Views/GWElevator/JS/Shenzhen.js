//var GainStockMap = echarts.init(document.getElementById('container'));
// JSON
 
//var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
$.getJSON('../Data/Shenzhen.json', function (data) {
    echarts.registerMap('Shenzhen', data);
    var chart = echarts.init(document.getElementById('container'));
    chart.setOption({
        geo: {
            map: 'Shenzhen',
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    borderColor: '#738CAF',
                    areaColor: '#1E2434',
                    borderWidth: 2
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series: [
            {  
            type: 'lines',
            zlevel: 1,
            effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3
            },
            lineStyle: {
                normal: {
                    color:'#a6c84c',
                    width: 0,
                    curveness: 0.2
                }
            },
            data:
            
            [
                {
                    coords:
                    [
                        [113.9073, 22.5275],
                        [114.5107, 23.2196]
                   ] 
                }
             
            ]
            }
         

        ]
    });
});