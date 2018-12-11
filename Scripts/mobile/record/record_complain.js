function record_complain() {
	var calendarRange = myApp.calendar({
		input: '#calendar-range',
		dateFormat: 'yyyy-mm-dd',
		rangePicker: true,
		monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
		dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
toolbarTemplate: '<div class="toolbar">' +
			'<div class="toolbar-inner">' +
			'<div class="left">' +
			'<a href="#" class="link close-picker">取消</a>' +
			'</div>' +
			'<div class="right">' +
			'<a href="#" class="link close-picker" onclick="searchDate()">确定</a>' +
			'</div>' +
			'</div>' +
			'</div>',
		onClose: function() {
			getComplainUserData();
		}
	});
	getComplainUserData();
}

function getComplainUserData() {
	var calendarValue = $("#calendar-range").val();
	var calendarValueArr = null;
	if(calendarValue != "") {
		calendarValueArr = calendarValue.split(" - ");
	}
	var beginTime = calendarValueArr == null ? "" : calendarValueArr[0];
	var endTime = calendarValueArr == null ? "" : calendarValueArr[1];
	var _UserData = {
		Id: window.localStorage.PpId,
		Type: window.localStorage.Type
	}
	JQajaxo("post", "/api/Elevator/get_dtPinfor", true, _UserData, _UserSuccessStatus);
	//获取登录用户详细信息
	function _UserSuccessStatus(dt) {
		if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
			var result = dt.HttpData.data[0];
			var _initComplainData = {};
			if(window.localStorage.Type == "0") {
				var CompId = result.CompId;
				_initComplainData = {
					tableData: 'Dt_Complaint',
					beginTime: beginTime,
					endTime: endTime,
					CompId: CompId,
					accountType: window.localStorage.Type
				}
			} else if(window.localStorage.Type == "1") {
				var CompId = result.CompId;
				_initComplainData = {
					tableData: 'Dt_Complaint',
					beginTime: beginTime,
					endTime: endTime,
					CompId: CompId,
					accountType: window.localStorage.Type
				}
			} else if(window.localStorage.Type == "2") {
				console.log("政府人员");
				return;
			}
			//根据时间周期查询投诉记录
			JQajaxo("post", "/api/Elevator/get_dtComplainList", true, _initComplainData, _initComplainSuccess);

			function _initComplainSuccess(dt) {
				console.log(dt);
				if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
					var result = dt.HttpData.data;
					var strData = "";
					for(var i = 0; i < result.length; i++) {
						var SubmitTime = getTimeFormat(result[i].SubmitTime);
						strData += "<li onclick='goComplainDetail(\"" + result[i].Id + "\")'><div class='complain-list-header'>" +
							"<div class='header-title'>故障：" + result[i].Content + "</div>" +
							"<div class='header-after'>" + SubmitTime + "</div>" +
							"</div>" +
							"<div class='complain-list-content'>" +
							"<div class='equip-desc'>电梯设备号：" + result[i].DeviceId + "</div>";
						if(result[i].Result == "1") {
							strData += "<div class='equip-status color-green'>已处理</div></div>";
						} else {
							strData += "<div class='equip-status color-red'>未处理</div></div>";
						}
						if(result[i].LngLat != "" && result[i].LngLat != null) {
							strData += "<div class='complain-list-info'>" +
								"<div class='equip-address'>地址：" + result[i].InstallAddr + "</div>" +
								"<div class='equip-mapinfo'><span onclick='checkComplainPositionInfo(\"" + result[i].Id + "\")'>查看地图</span></div>" +
								"</div>" +
								"</li>";
						} else {
							strData += "<div class='complain-list-info'>" +
								"<div class='equip-address'>地址：" + result[i].InstallAddr + "</div>" +
								"<div class='equip-mapinfo'></div>" +
								"</div>" +
								"</li>";
						}
					}
					$("#complainListId ul").html(strData);
				} else {
					$("#complainListId ul").html("<p style='text-align:center;color:#C2C2C2'>查无记录</p>");
				}
			}
		}
	}
}

function goComplainDetail(taskId){
	$("#taskId").val(taskId)
    $("#tableName").val('Dt_Complaint')
	mainView.router.loadPage("record/record_complain_detail.html");
}

//根据经纬度显示当前位置
function checkComplainPositionInfo(Id) {
	$("#recordPoitionLng").val(Id);
	mainView.router.loadPage("record/record_complain_map.html");
}

//时间格式化 HH:mm yyyy/MM-dd
function getTimeFormat(myTime) {
	if(myTime != null) {
		var myTimeArr = myTime.split("T");
		var timeDate = myTimeArr[0].split('-').join('/');
		var newTime = myTimeArr[1].substring(0, 5)
		return "<span>" + newTime + "</span>" + timeDate;
	} else {
		return "";
	}
}