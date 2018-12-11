function PostThing() {

	var PpId = window.localStorage.PpId;
	var Type = window.localStorage.Type;
	var _PostUserData = {
		Id: PpId,
		Type: Type
	}

	JQajaxo("post", "/api/Elevator/get_dtPinfor", true, _PostUserData, _PostUserSuccess);
	//获取登录用户详细信息
	function _PostUserSuccess(dt) {
		if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
			var result = dt.HttpData.data[0];
			var accountType = 0;
			if(Type == "0") {
				if(result.Type == "0") {
					accountType = 0
				} else {
					accountType = 1;
				}
			} else if(Type == "1") {
				if(result.Type == "0") {
					accountType = 0
				} else {
					accountType = 1
				}
			} else {
				accountType = 1;
			}
		}
		if(Type==0){
			if(accountType == 1) {
				toolbarActive("PostThingTool");
				$("#manageDetailBackId").hide();
			} else {
				toolbarActive("recordTool");
				$("#manageDetailBackId").show();
			}
		}else{
			toolbarActive("PostThingTool");
			$("#manageDetailBackId").hide();
		}
		

	}
}