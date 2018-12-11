function record_warn_map() {
	var recordPosition = $("#recordPoitionLng").val();
	var _initComplainMapData = {
		sql: "select top 10 a.*,b.DeviceId,b.InstallAddr,b.LngLat from Dt_Fault a left join Dt_Equip b on a.EquipId=b.Id where a.Id=" + recordPosition + " order by a.SubmitTime desc",
		userName: window.localStorage.userName,
	}

	JQajaxo("post", "/GWService.asmx/GetDataTableFromSQL", true, _initComplainMapData, _initComplainMapSuccess);

	function _initComplainMapSuccess(data) {
		console.log($(data).find('shen'))
		var strData = "";
		$(data).find("shen").each(function(i) {
			var pointMap = $(this).find('LngLat').text();
			var DeviceId = $(this).find('DeviceId').text();
			var InstallAddr = $(this).find('InstallAddr').text();
			var rContent = $(this).find('Content').text();
			var ResultInfo = $(this).find('Result').text();
			var HandlingTime = $(this).find('HandlingTime').text();
			var SubmitTime = $(this).find('SubmitTime').text();
			var FeedBack = $(this).find('FeedBack').text();
			// 百度地图API功能
			var map = new BMap.Map("recordWarnMapId");
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
			var myIcon = new BMap.Icon("/Image/elevator/Marker_big_warn.png", new BMap.Size(64, 64));
			//地图加载完毕自动调整到最佳视野
			var loadNum = 0;
			var markers = [];
			var centerPositionArrs = [];
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
				map.addEventListener("tilesloaded", function() {
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
						if(ResultInfo == 1) {
							content = "<div style='height:120px;font-size:12px;line-height:20px;'><font style='font-size:14px;color:#1E88FE'><i class='iconfont icon-web-zuoyebaojing' style='font-size:24px;'></i>" +
								"<span style='position:relative;top:-2px;left:3px'>报障信息</span></font><hr style='height:1px;border:none;border-top:1px solid #EFEFEF;'>" +
								"<div style='height:85px;overflow-y:scroll;'>电梯设备号：" + DeviceId + "<br>" +
								"电梯地址：" + InstallAddr + "<br>" +
								"报障内容：" + rContent + "<br>" +
								"是否处理：已处理<br>" +
								"处理时间：" + timeSplit(HandlingTime) + "<br>" +
								"处理结果：" + FeedBack + "<br>" +
								"</div></div>";
						} else {
							content = "<div style='height:120px;font-size:12px;line-height:20px;'><font style='font-size:14px;color:#E43820'><i class='iconfont icon-web-zuoyebaojing' style='font-size:24px;'></i>" +
								"<span style='position:relative;top:-2px;left:3px'>报障信息</span></font><hr style='height:1px;border:none;border-top:1px solid #EFEFEF;'>" +
								"<div style='height:85px;overflow-y:scroll;'>电梯设备号：" + DeviceId + "<br>" +
								"电梯地址：" + InstallAddr + "<br>" +
								"报障时间：" + timeSplit(SubmitTime) + "<br>" +
								"报障内容：" + rContent + "<br>" +
								"是否处理：未处理<br>" +
								"</div></div>";
						}
						marker.addEventListener("click", function(e) {
							openInfo(content, e)
						});
						marker.dispatchEvent("click");

						function openInfo(content, e) {
							var p = e.target;
							var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
							var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
							map.openInfoWindow(infoWindow, point); //开启信息窗口
						}

						//隐藏底部百度logo
						$('#recordWarnMapId div.anchorBL').hide();
						//调整到最佳视野
						map.setViewport(centerPositionArrs);
					}
				});
				map.setMapStyle({
					styleJson: styleJsons()
				});
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