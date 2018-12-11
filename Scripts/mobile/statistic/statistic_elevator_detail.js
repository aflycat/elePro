function statistic_elevator_detail() {
	var oldElevatorUlLiId=$("#elevatorUlLiId").val();
	var elevatorUlLiId="0";
	if(oldElevatorUlLiId!=undefined&&oldElevatorUlLiId!=""&&oldElevatorUlLiId!=null){
		elevatorUlLiId = $("#elevatorUlLiId").val();
		$("#newElevatorYlLiId").val(elevatorUlLiId)
	}else{
		elevatorUlLiId = $("#newElevatorYlLiId").val();
	}
	var _UserData = {
		Id: window.localStorage.PpId,
		Type: window.localStorage.Type
	}

	JQajaxo("post", "/api/Elevator/get_dtPinfor", true, _UserData, _UserSuccess);
	//获取登录用户详细信息
	function _UserSuccess(dt) {
		if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
			var result = dt.HttpData.data[0];
			var _ElevatorData = {};
			if(window.localStorage.Type == "0") {
				var CompId = result.CompId;
				_ElevatorData = {
					MaintId: CompId,
					PropId: null,
					accountType: 0,
					elevatorType: elevatorUlLiId,
				}
			} else if(window.localStorage.Type == "1") {
				var CompId = result.CompId;
				_ElevatorData = {
					MaintId: null,
					PropId: CompId,
					accountType: 1,
					elevatorType: elevatorUlLiId,
				}
			} else if(window.localStorage.Type == "2") {
				_ElevatorData = {
					MaintId: null,
					PropId: null,
					accountType: 2,
					elevatorType: elevatorUlLiId,
				}
			}
			//根据时间周期查询任务记录
			JQajaxo("post", "/api/Elevator/get_dtElevatorDataById", true, _ElevatorData, _initElevatorDataSuccess);

			//查询所有电梯设备信息
			function _initElevatorDataSuccess(dt) {
				if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
					var resultData = dt.HttpData.data;
					var strData = "";
					for(var i = 0; i < resultData.length; i++) {
						var SubmitTime = timeSplit(resultData[i].NextMaint);
						strData += "<li onclick='getElevatorDataDetail(\"" + resultData[i].Id + "\")' style='height:18.2%'><div class='complain-list-header'>" +
							"<div class='header-title item-title'>设备识别码：" + resultData[i].DeviceId + "</div>" +
							"<div class='header-after'>电梯信息</div>" +
							"</div>" +
							"<div class='complain-list-content'>" +
							"<div class='equip-desc'>下次检验时间：" + SubmitTime + "</div>";
						if(contrastTime(resultData[i].ContractEmp) == "0") {
							strData += "<div class='equip-status color-green'>维保正常</div></div>";
						} else {
							strData += "<div class='equip-status color-red'>维保过期</div></div>";
						}
						if(resultData[i].LngLat != "" && resultData[i].LngLat != null) {
							strData += "<div class='complain-list-info'>" +
								"<div class='equip-address'>地址：" + resultData[i].InstallAddr + "</div>" +
								"<div class='equip-mapinfo'><span onclick='checkElevatorMapInfo(\"" + resultData[i].Id + "\")'>查看地图</span></div>" +
								"</div>" +
								"</li>";
						} else {
							strData += "<div class='complain-list-info'>" +
								"<div class='equip-address'>地址：" + resultData[i].InstallAddr + "</div>" +
								"<div class='equip-mapinfo'></div>" +
								"</div>" +
								"</li>";
						}
					}
					$("#elevatorDetailListId ul").html(strData);
				} else {
					$("#elevatorDetailListId ul").html("<p style='text-align:center;color:#C2C2C2'>查无记录</p>");
				}
			}
		}
	}
}

function getElevatorDataDetail(elevatorId){
	$("#elevatorId").val(elevatorId)
	mainView.router.loadPage("statistic/statistic_elevator_info.html");
}

//根据经纬度显示当前位置
function checkElevatorMapInfo(elevatorId) {
	$("#elevatorId").val(elevatorId);
	mainView.router.loadPage("statistic/statistic_elevator_map.html");
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

//判断当前选择时间是否小于是当前实际时间  
function contrastTime(nowTimeValue) {
	var newNowTimeValue=timeSplit(nowTimeValue);
    var d = new Date();  
    var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();//获取当前实际日期  
    if (Date.parse(str) > Date.parse(newNowTimeValue)) {//时间戳对比  
           return 1;  
    }   
    return 0;  
}  