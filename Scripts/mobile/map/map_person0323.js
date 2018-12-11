var myLatitude, myLongitude;

function map_person() {
	var _UserData = {
		Id: window.localStorage.PpId,
		Type: window.localStorage.Type
	}

	JQajaxo("post", "/api/Elevator/get_dtPinfor", true, _UserData, _UserSuccess);
	//获取登录用户详细信息
	function _UserSuccess(dt) {
		var Type = window.localStorage.Type;
		if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
			var result = dt.HttpData.data[0];
			var CompId = result.CompId;
			var _PersonData = {};
			if(Type == "0") {
				_PersonData = {
					MaintId: CompId,
					accountType: 0,
				}
			} else if(Type == "1") {} else {
				_PersonData = {
					MaintId: null,
					accountType: 2,
				}
			}
			JQajaxo("post", "/api/Elevator/get_dtPersonMap", true, _PersonData, _PersonSuccess);

			//查询所有电梯设备信息
			function _PersonSuccess(dt) {
				var resultData = dt.HttpData.data;
				var centerPositionArrs = [];
				// 百度地图API功能
				var map = new BMap.Map("mapPersonId");
				// 初始化地图,设置中心点坐标和地图级别
				map.centerAndZoom('深圳市', 12);
				//添加地图类型控件
				map.addControl(new BMap.MapTypeControl({
					mapTypes: [
						BMAP_NORMAL_MAP,
						BMAP_HYBRID_MAP
					]
				}));
				//添加地图缩放控件
				map.addControl(new BMap.NavigationControl({
					type: BMAP_NAVIGATION_CONTROL_LARGE
				}));
				//开启鼠标滚轮缩放
				map.enableScrollWheelZoom();
				//启用地图拖拽
				map.enableDragging();
				//启用地图惯性拖拽
				map.enableInertialDragging();
				//地图加载完毕自动调整到最佳视野
				var loadNum = 0;
				var markers = [];

				var opts = {
					width: 250, // 信息窗口宽度
					height: 120, // 信息窗口高度
					offset: {
						height: -30,
						width: -2
					},
					title: "", // 信息窗口标题
					enableMessage: true //设置允许信息窗发送短息
				};
				map.addEventListener("tilesloaded", function() {
					if(loadNum == 0) {
						loadNum++;
						//显示维保人员位置信息
						var markers = [];
						var j = 0;
						for(var i = 0; i < resultData.length; i++) {
							(function(x) {
								var centerPositionArr = resultData[i].LngLat.toString().split(",");
								var point = new BMap.Point(centerPositionArr[0], centerPositionArr[1]);
								centerPositionArrs.push(point);
								var myIcon = new BMap.Icon("/Image/elevator/Marker.png", new BMap.Size(32, 32));
								var marker = new BMap.Marker(point, {
									icon: myIcon,
									offset: new BMap.Size(-2, -15)
								});
								markers.push(marker)
								map.addOverlay(marker);
								var content = "<div style='height:120px;font-size:12px;line-height:20px;'><font style='font-size:14px;color:#1E88FE'><i class='iconfont icon-web-zuoyebaojing' style='font-size:24px;'></i>" +
									"<span style='position:relative;top:-2px;left:3px'>人员信息</span></font><hr style='height:1px;border:none;border-top:1px solid #EFEFEF;'>" +
									"<div style='height:85px;overflow-y:scroll;'>姓名：" + resultData[i].Name + "<br>" +
									"性别：" + (resultData[i].Sex == 0 ? '男' : '女') + "<br>" +
									"人员类型：" + (resultData[i].Type == 0 ? '管理人员' : '维保人员') + "<br>" +
									"联系电话：" + resultData[i].Tel + "<br>" +
									"所属公司：" + resultData[i].CompName + "</div>";

								marker.addEventListener("click", function(e) {
									openInfo(content, e)
								});

								function openInfo(content, e) {
									var p = e.target;
									var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
									var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
									map.openInfoWindow(infoWindow, point); //开启信息窗口
								}
								j++;
							})(j);
						}
						//最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
						var markerClusterer = new BMapLib.MarkerClusterer(map, {
							markers: markers
						});

						//隐藏底部百度logo
						$('#mapPersonId div.anchorBL').hide();
						//调整到最佳视野
						map.setViewport(centerPositionArrs);
					}
				});
			}
		}
	}

	//自定义图标样式
	function styleJsons() {
		var styleJson = [{
				'featureType': 'highway', //高速
				'elementType': 'all',
				'stylers': {
					'visibility': 'off'
				}
			},
			{
				'featureType': 'railway', //铁路
				'elementType': 'geometry.fill', //填充
				'stylers': {
					'color': '#00131c',
					'visibility': 'off'
				}
			},
			{
				'featureType': 'railway', //铁路
				'elementType': 'geometry.stroke', //边框
				'stylers': {
					//'color': '#08304b',
					'visibility': 'off'
				}
			},
			{
				'featureType': 'subway', //地铁
				'elementType': 'geometry', //全部
				'stylers': {
					// 'lightness': -70
					'visibility': 'off' //显示on  不显示off
				}
			},

		];
		return styleJson;
	}
}