function manage() {
	var _AccountData = {
		userName: window.localStorage.userName
	}

	//根据用户名获取账号关系信息
	JQajaxo("post", "/api/Elevator/get_dtAccount", true, _AccountData, _AccountSuccess);

	function _AccountSuccess(dt) {
		console.log(dt);
		if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
			var _UserData = {
				Id: dt.HttpData.data[0].PpId,
				Type: dt.HttpData.data[0].Type
			}
			window.localStorage.PpId = dt.HttpData.data[0].PpId;
			window.localStorage.Type = dt.HttpData.data[0].Type;

			//获取登录用户详细信息
			JQajaxo("post", "/api/Elevator/get_dtPinfor", true, _UserData, _UserSuccess);

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

					//根据公司序号查询公司成员信息
					JQajaxo("post", "/api/Elevator/get_dtCompanyPerson", true, _ComPersonData, _ComPersonSuccess);

					function _ComPersonSuccess(dt) {
						console.log(dt);
						if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
							var result = dt.HttpData.data;
							var strData = "";
							for(var i = 0; i < result.length; i++) {
								var resultId = result[i].Id == null ? "" : result[i].Id;
								var resultName = result[i].Name == null ? "" : result[i].Name;
								var resultBonusPoint = result[i].BonusPoint == null ? "0" : result[i].BonusPoint;
								strData += "<li class='item-content' onclick='getUserDetailInfo(" + resultId + ")'><img src='"+result[i].Photo+"' style='height:30px;width:35px;margin-right:10px'><div class='item-inner'><div class='item-title'>" + resultName + "</div></div></li>";
							}
							$("#contractManageId ul").html(strData);
						}
					}
				}
			}
		} else {
			myApp.alert("未登录", "");
			mainView.router.back();
		}
	}
}

//根据
function getUserDetailInfo(resultId) {
	$("#resultId").val(resultId);
	mainView.router.loadPage("manage/manage_basicInfo.html");
}