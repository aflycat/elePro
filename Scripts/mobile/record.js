function record() {
	toolbarActive('recordTool');
	var _UserData = {
		Id: window.localStorage.PpId,
		Type: window.localStorage.Type
	}
	JQajaxo("post", "/api/Elevator/get_dtPinfor", true, _UserData, _UserSuccessStatus);
	//获取登录用户详细信息
	function _UserSuccessStatus(dt) {
		if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
			var result = dt.HttpData.data[0];
			var userType = result.Type;
			if(userType == 1) {
				$("#backLeftId a").hide();
			} else{
				$("#backLeftId a").show();
			} 
		}
	}
}