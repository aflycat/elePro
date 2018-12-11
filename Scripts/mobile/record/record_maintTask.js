function record_maintTask() {
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
			getTaskUserData();
		}
	});
	
	getTaskUserData();
}

function getTaskUserData() {
	var calendarValue = $("#calendar-range").val();
	var calendarValueArr = null;
	if(calendarValue != "") {
		calendarValueArr = calendarValue.split(" - ");
	}
	var beginTime=calendarValueArr == null ? "" : calendarValueArr[0];
	var endTime=calendarValueArr == null ? "" : calendarValueArr[1];
	var _UserData = {
		Id: window.localStorage.PpId,
		Type: window.localStorage.Type
	}
	JQajaxo("post", "/api/Elevator/get_dtPinfor", true, _UserData, _UserSuccessStatus);
	//获取登录用户详细信息
	function _UserSuccessStatus(dt) {
		if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
			var result = dt.HttpData.data[0];
			var _initMaintTaskData = {};
			var companyType=0;
			if(window.localStorage.Type == "0") {
				if(result.Type == "0") {
					console.log("管理人员");
					var CompId = result.CompId;
					_initMaintTaskData = {
						tableData: 'Dt_MaintTsk',
						beginTime: beginTime,
						endTime: endTime,
						CompId: CompId,
						MaintPplId: null,
						accountType: window.localStorage.Type,
						userType: result.Type
					}
				} else {
					console.log("维保人员");
					var MaintPplId = result.Id;
					_initMaintTaskData = {
						tableData: 'Dt_MaintTsk',
						beginTime: beginTime,
						endTime: endTime,
						CompId: CompId,
						MaintPplId: MaintPplId,
						accountType: window.localStorage.Type,
						userType: result.Type
					}
				}
				companyType=0;
			} else if(window.localStorage.Type == "1") {
				if(result.Type == "0") {
					console.log("管理人员");
					var CompId = result.CompId;
					_initMaintTaskData = {
						tableData: 'Dt_PatrolTsk',
						beginTime: beginTime,
						endTime: endTime,
						CompId: CompId,
						MaintPplId: null,
						accountType: window.localStorage.Type,
						userType: result.Type
					}
				} else {
					console.log("巡查人员");
					var MaintPplId = result.Id;
					_initMaintTaskData = {
						tableData: 'Dt_PatrolTsk',
						beginTime: beginTime,
						endTime: endTime,
						CompId: CompId,
						MaintPplId: MaintPplId,
						accountType: window.localStorage.Type,
						userType: result.Type
					}
				}
				companyType=1;
			} else if(window.localStorage.Type == "2") {
				console.log("政府人员");
				return;
			}
			//根据时间周期查询任务记录
			JQajaxo("post", "/api/Elevator/get_dtTaskDataList", true, _initMaintTaskData, _initMaintTaskSuccess);

			function _initMaintTaskSuccess(dt) {
				console.log(dt);
				if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
					var result = dt.HttpData.data;
					var strData = "";
					for(var i = 0; i < result.length; i++) {
						var resultType = result[i].Type;
						var CreateTime = getTimeFormat(result[i].CreateTime);
						if(resultType == "0") {
							strData += "<li onclick='goTaskDetail(\"" + result[i].Id + "\",\"" + companyType + "\")'><div class='complain-list-header'>" +
								"<div class='header-title'><i class='iconfont icon-web-check'></i>巡查任务</div>";
						} else if(resultType == "1") {
							strData += "<li onclick='goTaskDetail(\"" + result[i].Id + "\",\"" + companyType + "\")'><div class='complain-list-header'>" +
								"<div class='header-title'><i class='iconfont icon-web-weixiu1'></i>定期维保</div>";
						} else {
							strData += "<li onclick='goTaskDetail(\"" + result[i].Id + "\",\"" + companyType + "\")'><div class='complain-list-header'>" +
								"<div class='header-title'><i class='iconfont icon-web-weixiu2'></i>维修任务</div>";
						}
						strData += "<div class='header-after'>" + CreateTime + "</div>" +
							"</div>" +
							"<div class='complain-list-content'>" +
							"<div class='equip-desc'>故障内容：" + result[i].Content + "</div>";
						if(result[i].Status == "2") {
							strData += "<div class='equip-status color-green'>已完成</div></div>";
						} else if(result[i].Status == "1") {
							strData += "<div class='equip-status color-yellow'>进行中</div></div>";
						} else {
							strData += "<div class='equip-status color-red'>未开始</div></div>";
						}
						if(result[i].LngLat != "" && result[i].LngLat != null) {
							strData += "<div class='complain-list-info'>" +
								"<div class='equip-address'>地址：" + result[i].CompAddr + "</div>" +
								"<div class='equip-mapinfo'><span onclick='checkTaskPositionInfo(\"" + result[i].Id + "\")'>查看地图</span></div>" +
								"</div>" +
								"</li>";
						} else {
							strData += "<div class='complain-list-info'>" +
								"<div class='equip-address'>地址：" + result[i].CompAddr + "</div>" +
								"<div class='equip-mapinfo'></div>" +
								"</div>" +
								"</li>";
						}
					}
					$("#maintTaskListId ul").html(strData);
				} else {
					$("#maintTaskListId ul").html("<p style='text-align:center;color:#C2C2C2'>查无记录</p>");
				}
			}
		}
	}
}

function goTaskDetail(taskId,companyType){
	mainView.router.loadPage("taskDetail.html?id="+taskId+"&type="+companyType+"");
//	initPageJS('taskDetail', '');
}

//根据经纬度显示当前位置
function checkTaskPositionInfo(position) {
	$("#recordPoitionLng").val(position);
	mainView.router.loadPage("record/record_maintTask_map.html");
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