function statistic_elevator_info(){
	var elevatorId = $("#elevatorId").val();
	var _ElevatorInfoData = {
		Id: elevatorId
	}

	JQajaxo("post", "/api/Elevator/get_dtElevatorDetail", true, _ElevatorInfoData, _ElevatorInfoSuccess);
	//获取电梯详细信息
	function _ElevatorInfoSuccess(dt) {console.log(dt)
		if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
			var resultData = dt.HttpData.data[0];   
			
			$("#elevatorInfoId .euipId").text(resultData.Id);
			$("#elevatorInfoId .DeviceId").text(resultData.DeviceId);
			$("#elevatorInfoId .SerialNum").text(resultData.SerialNum);
			$("#elevatorInfoId .RegCode").text(resultData.RegCode);
			$("#elevatorInfoId .Category").text(resultData.Category);
			$("#elevatorInfoId .Model").text(resultData.Model);
			$("#elevatorInfoId .InstallAddr").text(resultData.InstallAddr);
			$("#elevatorInfoId .LngLat").text(resultData.LngLat);
			$("#elevatorInfoId .Fixed").text(resultData.Fixed=="1"?"是":"否");
			
			$("#elevatorInfoId .InternalNum").text(resultData.InternalNum);
			$("#elevatorInfoId .Oem").text(resultData.Oem);
			$("#elevatorInfoId .Agent").text(resultData.Agent);
			$("#elevatorInfoId .FactoryDate").text(timeSplit(resultData.FactoryDate));
			$("#elevatorInfoId .UpgradeCo").text(resultData.UpgradeCo);
			$("#elevatorInfoId .UpgradeDate").text(timeSplit(resultData.UpgradeDate));
			$("#elevatorInfoId .InstallCo").text(resultData.InstallCo);
			$("#elevatorInfoId .InstallDate").text(timeSplit(resultData.InstallDate));
			$("#elevatorInfoId .MaintId").text(resultData.maintCompName);
			
			$("#elevatorInfoId .Esn").text(resultData.Esn);
			$("#elevatorInfoId .PropId").text(resultData.PropertyCompName);
			$("#elevatorInfoId .ContractEmp").text(timeSplit(resultData.ContractEmp));
			$("#elevatorInfoId .Others").text(resultData.Others);
			$("#elevatorInfoId .NextMaint").text(timeSplit(resultData.NextMaint));
			$("#elevatorInfoId .Inspt").text(resultData.Inspt);
			$("#elevatorInfoId .Insurance").text(resultData.Insurance);
			$("#elevatorInfoId .InsuPlc").text(resultData.InsuPlc);
			$("#elevatorInfoId .InsuTel").text(resultData.InsuTel);
			$("#elevatorInfoId .InsuEmp").text(timeSplit(resultData.InsuEmp));
		}
	}
}
