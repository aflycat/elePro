function map_elevator() {
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
				JQajaxo("post", "/api/Elevator/get_dtElevatorMap", true, _ElevatorData, _ElevatorSuccess);
			} else if(Type == "1") {
				_ElevatorData = {
					MaintId: null,
					PropId: CompId,
					accountType: 1,
				}
				JQajaxo("post", "/api/Elevator/get_dtElevatorMap", true, _ElevatorData, _ElevatorSuccess);
			} else {
				_ElevatorData = {
					MaintId: null,
					PropId: null,
					accountType: 2,
				}
				JQajaxo("post", "/api/Elevator/get_dtElevatorMap", true, _ElevatorData, _ElevatorAllSuccess);
			}

			function _ElevatorAllSuccess(data) {
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
				//显示维保人员位置信息
				var markerSures = [];
				var markerWarns = [];
				var markerErrors = [];
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
					if(data.HttpStatus == 200 && data.HttpData.data != "") {
						var resultData = data.HttpData.data;
						var centerPositionArrs = [];
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
							color: '#4cc165',
							shape: BMAP_POINT_SHAPE_STAR
						}
						var optionWarns = {
							color: '#FFEB00',
							shape: BMAP_POINT_SHAPE_STAR
						}
						var optionErrors = {
							color: '#f04a49',
							shape: BMAP_POINT_SHAPE_STAR
						}
						var pointSureCollection = new BMap.PointCollection(markerSures, optionSures);
						var pointWarnCollection = new BMap.PointCollection(markerWarns, optionWarns);
						var pointErrorCollection = new BMap.PointCollection(markerErrors, optionErrors);

						map.addOverlay(pointSureCollection);
						map.addOverlay(pointWarnCollection);
						map.addOverlay(pointErrorCollection);
					}
				});
				var companyFlag = true;
				map.addEventListener("tilesloaded", function() {
					//隐藏底部百度logo
					if(companyFlag) {
						$('#recordMaintTaskMapId div.anchorBL').hide();
						map.setViewport(markerSures);
					}
					companyFlag = false;
				});
			}

			//查询所有电梯设备信息
			function _ElevatorSuccess(dt) {
				if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
					var resultData = dt.HttpData.data;
					var centerPositionArrs = [];
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
							var j = 0;
							for(var i = 0; i < resultData.length; i++) {
								(function(x) {
									var faultContent = resultData[i].faultContent;
									var complaintContent = resultData[i].complaintContent;
									var myIcon, content;
									if(faultContent == null && complaintContent == null) {
										//设置维保人员图标控件
										myIcon = new BMap.Icon("/Image/elevator/Marker.png", new BMap.Size(32, 32));
										content = "<div style='height:120px;font-size:12px;line-height:20px;'><font style='font-size:14px;color:#1E88FE'><i class='iconfont icon-web-zuoyebaojing' style='font-size:24px;'></i>" +
											"<span style='position:relative;top:-2px;left:3px'>电梯信息</span></font><hr style='height:1px;border:none;border-top:1px solid #EFEFEF;'>" +
											"<div style='height:85px;overflow-y:scroll;'>设备识别码：" + resultData[i].DeviceId + "<br>" +
											"安装地址：" + resultData[i].InstallAddr + "<br>" +
											"维保公司：" + resultData[i].CompName + "<br>" +
											"维保公司：" + resultData[i].CompName + "<br>" +
											"合同有效期：" + timeSplit(resultData[i].ContractEmp) + "</div></div>";
									} else {
										//设置维保人员图标控件
										myIcon = new BMap.Icon("/Image/elevator/Marker_warn.png", new BMap.Size(32, 32));
										content = "<div style='height:120px;font-size:12px;line-height:20px;'><font style='font-size:14px;color:#E43820'><i class='iconfont icon-web-zuoyebaojing' style='font-size:24px;'></i>" +
											"<span style='position:relative;top:-2px;left:3px'>电梯信息</span></font><hr style='height:1px;border:none;border-top:1px solid #EFEFEF;'>" +
											"<div style='height:85px;overflow-y:scroll;'>设备识别码：" + resultData[i].DeviceId + "<br>" +
											"安装地址：" + resultData[i].InstallAddr + "<br>" +
											"维保公司：" + resultData[i].CompName + "<br>";
										if(faultContent != null) {
											content += "最新报障：" + faultContent + "<br>";
										}
										if(complaintContent != null) {
											content += "最新投诉：" + complaintContent + "<br>";
										}
										content += "合同有效期：" + timeSplit(resultData[i].ContractEmp) + "</div>";
									}
									var centerPositionArr = resultData[i].LngLat.toString().split(",");
									var point = new BMap.Point(centerPositionArr[0], centerPositionArr[1]);
									centerPositionArrs.push(point);
									var marker = new BMap.Marker(point, {
										icon: myIcon,
										offset: new BMap.Size(-2, -15)
									});
									markers.push(marker);
									map.addOverlay(marker);

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
							$('#mapElevatorId div.anchorBL').hide();
							//调整到最佳视野
							map.setViewport(centerPositionArrs);
						}
					});
				}
			}
		}
	}
}