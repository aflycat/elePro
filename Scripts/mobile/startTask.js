var timer;
function startTask(){
	wy();
}
function wy(){
	$("#startTask .taskType span").text("巡查任务");
	var id=$("#taskIdS").val();
	$("#startTask .codeNum span").text(PrefixInteger(id, 10));
	var data={
		sql:"select * from Dt_PatrolTsk where id='"+id+"'",
		userName:window.localStorage.userName
	}
	JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,data,_sucGetWy)

}
function _sucGetWy(dt){
	console.log(dt)
	var res=$(dt).find("DataTable shen");
	res.each(function(){
		var startTime=$(this).find("ActualStart").text(),
			createTime=$(this).find("CreateTime").text(),
			content=$(this).find("Content").text(),
			remark=$(this).find("Remark").text(),
			type=$(this).find("Type").text();
		$("#taskKind").val(type)
		$("#startTime").val(timeSplit(startTime));
		$("#startTask .startTime span").text(timeSplit(startTime))
		$("#createTime").val(timeSplit(createTime));
		$("#startTask .content span").text(content);
		$("#startTask .remark span").text(remark);
	})
}
function finishedTask(){
	var id=$("#taskIdS").val();	
	var time=createtime();
	var data={
			sql:"update Dt_PatrolTsk set Status=2,ActualEnd='"+time+"' where id="+id,
			userName:window.localStorage.userName
		}
	JQajaxo("post","/GWService.asmx/ExecuteSQL",true,data,sucXc)
}
function sucXc(dt){
	var res=$(dt).find("int").text();
	if(res!=0){
		myApp.alert("操作成功","温馨提示");
		mainView.router.loadPage("taskList.html")
		
	}
}
