function map_company() {

	var _CompanyUserData = {
		Id: window.localStorage.PpId,
		Type: window.localStorage.Type
	}

	JQajaxo("post", "/api/Elevator/get_dtPinfor", true, _CompanyUserData, _CompanyUserSuccess);
	//获取登录用户详细信息
	function _CompanyUserSuccess(dt) {
		var Type = window.localStorage.Type;
		if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
			var result = dt.HttpData.data[0];
			var CompId = result.CompId;
			var _CompanyData = {};
			if(Type == "0") {
				_CompanyData = {
					MaintId: CompId,
					accountType: 0,
				}
				JQajaxo("post", "/api/Elevator/get_dtCompanyMap", true, _CompanyData, _CompanySuccess);
			} else if(Type == "1") {} else {
				_CompanyData = {
					MaintId: null,
					accountType: 2,
				}
				JQajaxo("post", "/api/Elevator/get_dtCompanyMap", true, _CompanyData, _CompanyAllSuccess);
			}

			function _CompanyAllSuccess(data) {
				// 百度地图API功能
				var map = new BMap.Map("mapCompanyId");
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
				var markers = [];
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
							markers.push(new BMap.Point(centerPositionArr[0], centerPositionArr[1]))
						}
						var options = {
							color: '#0099FF',
							shape: BMAP_POINT_SHAPE_STAR
						}
						var pointCollection = new BMap.PointCollection(markers, options);
						map.addOverlay(pointCollection);
					}
				});
				var companyFlag = true;
				map.addEventListener("tilesloaded", function() {
					//隐藏底部百度logo
					if(companyFlag) {
						$('#recordMaintTaskMapId div.anchorBL').hide();
						map.setViewport(markers);
					}
					companyFlag = false;
				});
			}

			//查询所有电梯设备信息
			function _CompanySuccess(dt) {
				if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
					var resultData = dt.HttpData.data;
					var centerPositionArrs = [];
					// 百度地图API功能
					var map = new BMap.Map("mapCompanyId");
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
									//设置维保人员图标控件
									var myIcon, content, opts;
									if(resultData[i].pIdCompName != null && resultData[i].pIdCompName != "") {
										//设置维保人员图标控件
										myIcon = new BMap.Icon("/Image/elevator/Marker_warn.png", new BMap.Size(32, 32));
										opts = {
											width: 260, // 信息窗口宽度
											height: 120, // 信息窗口高度
											offset: {
												height: -30,
												width: -2
											},
											title: "", // 信息窗口标题
											enableMessage: true //设置允许信息窗发送短息
										};
										content = "<div style='height:120px;font-size:12px;line-height:20px;'><font style='font-size:14px;color:#E43820'><i class='iconfont icon-web-zuoyebaojing' style='font-size:24px;'></i>" +
											"<span style='position:relative;top:-2px;left:3px'>子公司信息</span></font><hr style='height:1px;border:none;border-top:1px solid #EFEFEF;'>" +
											"<div style='height:85px;overflow-y:scroll;'>公司名称：" + resultData[i].CompName + "<br>" +
											"父公司名：" + resultData[i].pIdCompName + "<br>" +
											"公司法人：" + resultData[i].LegalPs + "<br>" +
											"公司电话：" + resultData[i].CompTel + "<br>" +
											"公司地址：" + resultData[i].CompAddr + "<br>" +
											"公司人数：" + (resultData[i].countnum == null ? 0 : resultData[i].countnum) + "人</div></div>";
									} else {
										//设置维保人员图标控件
										myIcon = new BMap.Icon("/Image/elevator/Marker.png", new BMap.Size(32, 32));
										opts = {
											width: 260, // 信息窗口宽度
											height: 120, // 信息窗口高度
											offset: {
												height: -30,
												width: -2
											},
											title: "", // 信息窗口标题
											enableMessage: true //设置允许信息窗发送短息
										};
										content = "<div style='height:120px;font-size:12px;line-height:20px;'><font style='font-size:14px;color:#1E88FE'><i class='iconfont icon-web-zuoyebaojing' style='font-size:24px;'></i>" +
											"<span style='position:relative;top:-2px;left:3px'>公司信息</span></font><hr style='height:1px;border:none;border-top:1px solid #EFEFEF;'>" +
											"<div style='height:85px;overflow-y:scroll;'>公司名称：" + resultData[i].CompName + "<br>" +
											"公司代码：" + resultData[i].CompCode + "<br>" +
											"公司电话：" + resultData[i].CompTel + "<br>" +
											"公司地址：" + resultData[i].CompAddr + "<br>" +
											"公司人数：" + (resultData[i].countnum == null ? 0 : resultData[i].countnum) + "人</div></div>";
									}
									var marker = new BMap.Marker(point, {
										icon: myIcon,
										offset: new BMap.Size(-2, -15)
									});
									markers.push(marker);
									map.addOverlay(marker);
									marker.addEventListener("click", function(e) {
										openInfo(content, e)
									});

									if(resultData[i].Id == CompId) {
										marker.dispatchEvent("click");
									}

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
							$('#mapCompanyId div.anchorBL').hide();
							//调整到最佳视野
							map.setViewport(centerPositionArrs);
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