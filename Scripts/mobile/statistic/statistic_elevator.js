function statistic_elevator() {

	var _UserStatusData = {
		Id: window.localStorage.PpId,
		Type: window.localStorage.Type
	}
	JQajaxo("post", "/api/Elevator/get_dtPinfor", true, _UserStatusData, _UserSuccessStatus);
	//获取登录用户详细信息
	function _UserSuccessStatus(dt) {
		if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
			var result = dt.HttpData.data[0];
			var _initWarnData = {};
			if(window.localStorage.Type == "0") {
				var CompId = result.CompId;
				_ElevatorStatusData = {
					MaintId: CompId,
					PropId: null,
					accountType: window.localStorage.Type
				}
			} else if(window.localStorage.Type == "1") {
				var CompId = result.CompId;
				_ElevatorStatusData = {
					MaintId: null,
					PropId: CompId,
					accountType: window.localStorage.Type
				}
			} else if(window.localStorage.Type == "2") {
				_ElevatorStatusData = {
					MaintId: null,
					PropId: null,
					accountType: window.localStorage.Type
				}
			}
			JQajaxo("post", "/api/Elevator/get_dtElevatorStatus", true, _ElevatorStatusData, _ElevatorStatusSuccess);

			function _ElevatorStatusSuccess(dt) {
				if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
					var result = dt.HttpData.data[0];
					$("#equip_num").html(result.equip_num);
					$("#fault_num").html(result.fault_num);
					$("#complaint_num").html(result.complaint_num);
					$("#contract_soonnum").html(result.contract_soonnum);
					$("#nextmaint_soonnum").html(result.nextmaint_soonnum);
					$("#contract_overnum").html(result.contract_overnum);
					$("#nextmaint_overnum").html(result.nextmaint_overnum);
				}
			}
		}
	}
	
	$("#statistic_elevator .elevatorUl li").unbind().bind('click', function() {
		$("#elevatorUlLiId").val($(this).index());
		mainView.router.loadPage("statistic/statistic_elevator_detail.html");
	});
}