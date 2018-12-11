function manage_basicInfo() {
	var PpId = window.localStorage.PpId;
	var Type = window.localStorage.Type;
	var resultId = $("#resultId").val();
	var _UserData = {
		Id: resultId,
		Type: Type
	}

	//获取用户详细信息
	JQajaxo("post", "/api/Elevator/get_dtPnameinfor", true, _UserData, _UserSuccess);

	function _UserSuccess(dt) {
		if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
			var result = dt.HttpData.data[0];
			console.log(result)
			$("#basicNameId").html(result.Name);
			$("#userNameId").html("账号："+result.Username);
			$("#userPhotoId img").attr("src",result.Photo);
			if(result.Sex == "0") {
				$("#basicSexId").html("男");
			} else if(result.Sex == "1") {
				$("#basicSexId").html("女");
			}
			$("#basicAgeId").html(result.Age);
			$("#basicIdCardId").html(result.IdCard);
			$("#basicTelId").html(result.Tel);
			$("#basicCompId").html(result.CompName);
			$("#basicComCardId").html(result.CompCode);
			if(result.Type == "0") {
				$("#basicTypeId").html("维保人员");
			} else if(result.Type == "1") {
				$("#basicTypeId").html("管理人员");
			}

			$("#basicGradeId").html(result.BonusPoint);
		}
	}
}