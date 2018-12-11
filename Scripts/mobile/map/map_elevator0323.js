var myLatitude, myLongitude;

function map_elevator() {
	// 百度地图API功能
	var map = new BMap.Map("mapElevatorId");
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
	//自定义图标样式
	map.setMapStyle({
		styleJson: styleJsons()
	});
	var bdary = new BMap.Boundary();
	bdary.get("深圳市", function(rs) { //获取行政区域

		var count = rs.boundaries.length; //行政区域的点有多少个
		if(count === 0) {
			return;
		}
		var pointArray = [];
		for(var i = 0; i < count; i++) {
			var ply = new BMap.Polygon(rs.boundaries[i], {
				strokeWeight: 3,
				strokeColor: "#4a91eb"
			}); //建立多边形覆盖物
			map.addOverlay(ply); //添加覆盖物
			pointArray = pointArray.concat(ply.getPath());
		}
		map.setViewport(pointArray); //调整视野               
	});
	var _ElevatorUserData = {
		Id: window.localStorage.PpId,
		Type: window.localStorage.Type
	}

	JQajaxo("post", "/api/Elevator/get_dtPinfor", true, _ElevatorUserData, _ElevatorUserSuccess);
	//获取登录用户详细信息
	function _ElevatorUserSuccess(dt) {
		var Type = window.localStorage.Type;
		if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
			var result = dt.HttpData.data[0];
			var CompId = result.CompId;
			var _ElevatorData = {};
			if(Type == "0") {
				_ElevatorData = {
					MaintId: CompId,
					PropId: null,
					accountType: 0,
				}
			} else if(Type == "1") {
				_ElevatorData = {
					MaintId: null,
					PropId: CompId,
					accountType: 1,
				}
			} else {
				_ElevatorData = {
					MaintId: null,
					PropId: null,
					accountType: 2,
				}
			}
			JQajaxo("post", "/api/Elevator/get_dtElevatorMap", true, _ElevatorData, _ElevatorSuccess);
			//查询所有电梯设备信息
			function _ElevatorSuccess(dt) {
				if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
					var resultData = dt.HttpData.data;
					var centerPositionArrs = [];

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
							var markerSures = [];
							var markerWarns = [];
							var markerErrors = [];
							var j = 0;
							for(var i = 0; i < resultData.length; i++) {
								var centerPositionArr = resultData[i].LngLat.toString().split(",");
								if(resultData[i].Status == 0 && resultData[i].TskStatus == 0) {
									markerSures.push(new BMap.Point(centerPositionArr[0], centerPositionArr[1]))
								} else if(resultData[i].Status == 0 && resultData[i].TskStatus == 1) {
									markerWarns.push(new BMap.Point(centerPositionArr[0], centerPositionArr[1]))
								} else {
									markerErrors.push(new BMap.Point(centerPositionArr[0], centerPositionArr[1]))
								}
							}
							var optionSures = {
								size: BMAP_POINT_SIZE_SMALL,
								color: '#4cc165'
							}
							var optionWarns = {
								size: BMAP_POINT_SIZE_SMALL,
								color: '#FFEB00'
							}
							var optionErrors = {
								size: BMAP_POINT_SIZE_SMALL,
								color: '#f04a49'
							}
							var pointSureCollection = new BMap.PointCollection(markerSures, optionSures);
							var pointWarnCollection = new BMap.PointCollection(markerWarns, optionWarns);
							var pointErrorCollection = new BMap.PointCollection(markerErrors, optionErrors);
							pointSureCollection.addEventListener('click', function(e) {
								alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat); // 监听点击事件
							});
							pointWarnCollection.addEventListener('click', function(e) {
								alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat); // 监听点击事件
							});
							pointErrorCollection.addEventListener('click', function(e) {
								alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat); // 监听点击事件
							});

							map.addOverlay(pointSureCollection);
							map.addOverlay(pointWarnCollection);
							map.addOverlay(pointErrorCollection);

							//隐藏底部百度logo
							$('#mapElevatorId div.anchorBL').hide();
							//调整到最佳视野
							//							map.setViewport(centerPositionArrs);
						}
					});
				}
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