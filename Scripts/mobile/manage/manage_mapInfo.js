var myLatitude, myLongitude;

function manage_mapInfo() {
	var _AccountData = {
		userName: window.localStorage.userName
	}

	JQajaxo("post", "/api/Elevator/get_dtAccount", true, _AccountData, _AccountSuccess);
	//根据用户名获取账号关系信息
	function _AccountSuccess(dt) {
		if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
			var _UserData = {
				Id: dt.HttpData.data[0].PpId,
				Type: dt.HttpData.data[0].Type
			}
			window.localStorage.PpId = dt.HttpData.data[0].PpId;
			window.localStorage.Type = dt.HttpData.data[0].Type;

			JQajaxo("post", "/api/Elevator/get_dtPinfor", true, _UserData, _UserSuccess);
			//获取登录用户详细信息
			function _UserSuccess(dt) {
				var PpId = window.localStorage.PpId;
				var Type = window.localStorage.Type;
				if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
					var result = dt.HttpData.data[0];
					if(Type == "0") {
						if(result.Type == "0") {
							console.log("管理人员");
						} else {
							console.log("维保人员");
						}
					} else if(Type == "1") {
						if(result.Type == "0") {
							console.log("管理人员");
						} else {
							console.log("巡查人员");
						}
					} else {
						console.log("政府人员")
					}

					var _ComPersonData = {
						CompId: result.CompId,
						Type: Type
					}

					JQajaxo("post", "/api/Elevator/get_dtCompanyPerson", true, _ComPersonData, _ComPersonSuccess);
					//根据公司序号查询公司成员信息
					function _ComPersonSuccess(dt) {
						console.log(dt);
						if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
							//		var result = dt.HttpData.data;
							//		result.

							var userLists = dt.HttpData.data;
							//判断是否获取公司下维保人员信息
							if(userLists != undefined && userLists != null && userLists != "") {
								var centerPositionArrs = [];
								// 百度地图API功能
								var map = new BMap.Map("manageMapId");
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
								map.enableScrollWheelZoom(true);
								//设置维保人员图标控件
								var myIcon = new BMap.Icon("/Image/elevator/person.png", new BMap.Size(30, 30));
								//地图加载完毕自动调整到最佳视野
								var loadNum = 0;
								var markers = [];
								map.addEventListener("tilesloaded", function() {
									if(loadNum == 0) {
										loadNum++;
										//显示维保人员位置信息
										for(var i = 0; i < userLists.length; i++) {
											var centerPositionArr = userLists[i].LngLat.split(",");
											var point = new BMap.Point(centerPositionArr[0], centerPositionArr[1]);
											centerPositionArrs.push(point);
											var label = new BMap.Label(userLists[i].Name, {
												offset: new BMap.Size(0, -20)
											});
											label.setStyle({
												color: "#f00",
												borderWidth: "0px",
												backgroundColor: "transparent",
												fontFamily: "微软雅黑"
											});
											var marker = new BMap.Marker(point, {
												icon: myIcon
											});
											map.addOverlay(marker);
											marker.setLabel(label);
										}
										//隐藏底部百度logo
										$('#allmap div.anchorBL').hide();
										//调整到最佳视野
										map.setViewport(centerPositionArrs);
									}
								});
								//自定义图标样式
								map.setMapStyle({
									styleJson: styleJsons()
								});

							} else {
								myApp.alert("查无数据！", "");
							}

						}
					}
				}
			}
		}
	}
	//判断是否是app登录
	if(window.localStorage.terminal != undefined && window.localStorage.terminal.split('.')[1] == "App") {
		//调用百度地图GPS定位
		myJavaFun.OpenLocationBD();
		setInterval(function() {
			myJavaFun.OpenLocationBD();
		}, 300000);
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