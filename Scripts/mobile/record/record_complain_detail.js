function record_complain_detail() {
	var taskId=$("#taskId").val();
    var tableName=$("#tableName").val();
	var _tableData = {
		Id: taskId,
		tableName: tableName
	}
	JQajaxo("post", "/api/Elevator/get_dtTableDataByName", true, _tableData, _tableDataSuccess);

	function _tableDataSuccess(dt) {
		console.log(dt);
		if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
			var result = dt.HttpData.data[0];
			var strData = "";
			var dates = result.SubmitTime;
			var name = result.Submitter;
			var tel = result.Tel;
			var con = result.Content;
			var rem = result.Remark;
			var pic = result.Pic;
			var Equ = result.EquipId;
			var resultInfo = result.Result;
			var Handler = result.Handler;
			var HandlingTime = result.HandlingTime;
			var feedBack = result.FeedBack;
			
			$("#recordDetailId .name").text(name);
			$("#recordDetailId .tel").text(tel);
			$("#recordDetailId .con").text(con);
			$("#recordDetailId .remark").text(rem);
			$("#recordDetailId .imgBoxs img").attr("src", pic)
			$("#recordDetailId .euipId").text(Equ);
			if(resultInfo==1){
				$("#recordDetailId .resultInfoId").text("已处理");
				$("#recordDetailId .FeedBackId").show();
				$("#recordDetailId .FeedBackId").text(feedBack);
				$("#recordDetailId .Handler").text(Equ);
				$("#recordDetailId .euipId").text(Equ);
				$("#recordDetailId .euipId").text(Equ);
			}else{
				$("#recordDetailId .resultInfoId").text("未处理");
				$("#recordDetailId .FeedBackId").hide();
			}
			
		}
	}
}