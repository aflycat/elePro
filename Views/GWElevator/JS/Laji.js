//分组图标有可能自己处理问题的代码
switch (gid) {
    case "正常":
        return {
            pointStyle: {
                //content: gid % 2 ? 'circle' : 'rect',
                fillStyle: 'pink',
                width: 8,
                height: 8
            },
            pointHardcoreStyle: {
                width: size - 2,
                height: size - 2
            }
        };
    case "维修":
        return {
            pointStyle: {
                //content: gid % 2 ? 'circle' : 'rect',
                fillStyle: 'yellow',
                width: 10,
                height: 10
            },
            pointHardcoreStyle: {
                width: size - 2,
                height: size - 2
            }
        };
    case "停运":
        return {
            pointStyle: {
                //content: gid % 2 ? 'circle' : 'rect',
                fillStyle: 'red',
                width: 15,
                height: 15
            },
            pointHardcoreStyle: {
                width: size - 2,
                height: size - 2
            }
        };
    default:
        return {
            pointStyle: {
                //content: gid % 2 ? 'circle' : 'rect',
                fillStyle: 'gray',
                width: size,
                height: size
            },
            pointHardcoreStyle: {
                width: size - 2,
                height: size - 2
            }
        }
}



  //renderOptions: {
        //    //点的样式
        //    pointStyle: {
        //        width: 6,
        //        height: 6,
        //        fillStyle: 'rgba(153, 0, 153, 0.38)'
        //    },
        //    //鼠标hover时的title信息
        //    hoverTitleStyle: {
        //        position: 'top'
        //    }
        //},



        groupStyleOptions: function (gid) {
            //var size = 8;
            //return {
            //            pointStyle: {
            //               // content: gid % 2 ? 'circle' : 'rect',
            //                fillStyle: colors[gid],
            //                width: size,
            //                height: size,
            //                offset: ['-50%', '-100%'],
            //                fillStyle: null,
            //                strokeStyle: null
            //            },
            //            pointHardcoreStyle: {
            //               width: size - 2,
            //                height: size - 2
            //           }
            //      }
            return groupStyleMap[gid];
        }
    }