function record_maintTask_map() {
	var recordPosition = $("#recordPoitionLng").val();
	var _initMaintTaskMapData = {};
	if(window.localStorage.Type == "0") {
		_initMaintTaskMapData = {
			sql: "select a.*,b.CompAddr,b.LngLat,c.Id as PplId,c.LngLat as PplLat,c.Name as PplName from Dt_MaintTsk a left join Dt_PropertyCo b on a.PropId=b.Id left join Dt_MaintPpl c on a.MaintId=c.CompId where a.Id=" + recordPosition + " order by a.CreateTime desc",
			userName: window.localStorage.userName,
		}
	} else {
		_initMaintTaskMapData = {
			sql: "select a.*,b.CompAddr,b.LngLat,c.Id as PplId,c.LngLat as PplLat,c.Name as PplName from Dt_PatrolTsk a left join Dt_PropertyCo b on a.PropId=b.Id left join Dt_PropertyPpl c on a.PropId=c.CompId where a.Id=" + recordPosition + " order by a.CreateTime desc",
			userName: window.localStorage.userName,
		}
	}
	JQajaxo("post", "/GWService.asmx/GetDataTableFromSQL", true, _initMaintTaskMapData, _initMaintTaskMapSuccess);

	function _initMaintTaskMapSuccess(data) {
		console.log($(data).find('shen'))
		var strData = "";
		// 百度地图API功能
		var map = new BMap.Map("recordMaintTaskMapId");
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
		var centerPositionArrs = [];
		$(data).find("shen").each(function(i) {
			var MpIdArr = [];
			var MpId = $(this).find('MpId').text();
			var PplId = $(this).find('PplId').text();
			MpIdArr = MpId == null ? "" : MpId.toString().split(",");
			for(var n = 0; n < MpIdArr.length; n++) {
				if(MpIdArr[n] == PplId) {
					var pointMap = $(this).find('LngLat').text();
					var Type = $(this).find('Type').text();
					if(Type == 0) {
						typeName = "巡查任务";
					} else if(Type == 1) {
						typeName = "定期维保";
					} else if(Type == 2) {
						typeName = "维修任务";
					}
					var CompAddr = $(this).find('CompAddr').text();
					var rContent = $(this).find('Content').text();
					var Status = $(this).find('Status').text();
					var Comment = $(this).find('Comment').text();
					var StatusData = "";
					if(Status == 0) {
						StatusData = "未开始"
					} else if(Status == 1) {
						StatusData = "进行中"
					} else {
						StatusData = "已完成"
					}

					//设置维保人员图标控件
					var myIcon = new BMap.Icon("/Image/elevator/Marker_big_warn.png", new BMap.Size(64, 64));
					//地图加载完毕自动调整到最佳视野
					var loadNum = 0;
					var markers = [];

					if(pointMap != "" && pointMap != null && pointMap != undefined) {
						var opts = {
							width: 260, // 信息窗口宽度
							height: 120, // 信息窗口高度
							offset: {
								height: -45,
								width: -2
							},
							title: "", // 信息窗口标题
							enableMessage: true //设置允许信息窗发送短息
						};
						if(loadNum == 0) {
							loadNum++;
							//显示维保人员位置信息
							var recordPositionArr = pointMap.split(",");
							var point = new BMap.Point(recordPositionArr[0], recordPositionArr[1]);
							centerPositionArrs.push(point);

							var marker = new BMap.Marker(point, {
								icon: myIcon,
								offset: new BMap.Size(-2, -15)
							});
							map.addOverlay(marker);

							var content;
							if(Status == 2) {
								content = "<div style='height:120px;font-size:12px;line-height:20px;'><font style='font-size:14px;color:#E43820'><i class='iconfont icon-web-zuoyebaojing' style='font-size:24px;'></i>" +
									"<span style='position:relative;top:-2px;left:3px'>任务信息</span></font><hr style='height:1px;border:none;border-top:1px solid #EFEFEF;'>" +
									"<div style='height:85px;overflow-y:scroll;'>任务类型：" + typeName + "<br>" +
									"电梯地址：" + CompAddr + "<br>" +
									"任务内容：" + rContent + "<br>" +
									"任务状态：" + StatusData + "<br>" +
									"任务评价：" + Comment + "<br>" +
									"</div></div>";
							} else {
								content = "<div style='height:120px;font-size:12px;line-height:20px;'><font style='font-size:14px;color:#E43820'><i class='iconfont icon-web-zuoyebaojing' style='font-size:24px;'></i>" +
									"<span style='position:relative;top:-2px;left:3px'>任务信息</span></font><hr style='height:1px;border:none;border-top:1px solid #EFEFEF;'>" +
									"<div style='height:85px;overflow-y:scroll;'>任务类型：" + typeName + "<br>" +
									"电梯地址：" + CompAddr + "<br>" +
									"任务内容：" + rContent + "<br>" +
									"任务状态：" + StatusData + "<br>" +
									"</div></div>";
							}

							marker.addEventListener("click", function(e) {
								openInfo(content, e)
							});

							function openInfo(content, e) {
								var p = e.target;
								var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
								var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
								map.openInfoWindow(infoWindow, point); //开启信息窗口
							}

						}
					}

					//显示维保人员位置信息
					var personLngLatArr = $(this).find('PplLat').text().split(",");
					var personLngLat = new BMap.Point(personLngLatArr[0], personLngLatArr[1]);
					centerPositionArrs.push(personLngLat);
					var personIcon = new BMap.Icon("/Image/elevator/maint.png", new BMap.Size(32, 32));
					var personMarker = new BMap.Marker(personLngLat, {
						icon: personIcon,
						offset: new BMap.Size(-2, -15)
					});
					map.addOverlay(personMarker);
					var personLabel = new BMap.Label($(this).find('PplName').text(), {
						offset: new BMap.Size(5, -20)
					});
					personLabel.setStyle({
						borderWidth: "0",
					});

					personMarker.setLabel(personLabel);
					if(n == (MpIdArr.length - 1)) {
						var flag=true;
						map.addEventListener("tilesloaded", function() {
							//隐藏底部百度logo
							if(flag){
								$('#recordMaintTaskMapId div.anchorBL').hide();
							map.setViewport(centerPositionArrs);
							}
							flag=false;
						});
					}
				}

			}

		});

	}
}
//自定义地图样式
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