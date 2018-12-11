function taskDetail(){
	myApp.closeModal('.picker-info')
	var id=$("#taskIdDe").val();
	var ppId=localStorage.PpId;
	getType(ppId)
	propertyCo(id)
	
}
function continueTask(dom){
	var time=createtime();
	var id=$("#taskIdDe").val();
	var txt=$(dom).text();
	if(txt=="继续任务"){
		mainView.router.loadPage("startTask.html?Id="+id)
	}else if(txt=="开始任务"){
		$.ajax({
			type:"post",
			url:"/GWService.asmx/ExecuteSQL",
			data:{
				sql:"update Dt_PatrolTsk set ActualStart='"+time+"',Status=1 where id='"+id+"'",
				userName:window.localStorage.userName
			},
			success:function(dt){
				var res=$(dt).find("int").text();
				if(res!=0){
					mainView.router.loadPage("startTask.html?Id="+id)
				}
			}
		})
	}
	
}
function getType(ppId){
	$.ajax({
		url: '/GWService.asmx/GetDataTableFromSQL',
		type: 'post',
		data: {
			sql:"select Type from Dt_PropertyPpl where Id="+ppId,
			userName:window.localStorage.userName
		},success:function(dt){
			var res=$(dt).find("DataTable");
			$(res).find("shen").each(function(){
				var type=$(this).find("Type").text();
				$("#ppType").val(type)
				if(type==1){
					$("#taskDetail .btn.edict").hide();
				}else{
					$("#taskDetail .btn.edict").show();
				}
			})
		}
	})
	
	
}

function propertyCo(id){
	$.ajax({
		type:"post",
		url:"/GWService.asmx/GetDataTableFromSQL",
		data:{
			sql:"select a.*,b.Name as creatorName  from Dt_PatrolTsk a left join Dt_PropertyPpl b on a.CreatorId=b.Id where a.Id="+id,
			userName:window.localStorage.userName
		},
		success:function(dt){
			var res=$(dt).find("DataTable");
			$(res).find("shen").each(function(){
				var planStar=$(this).find("PlanStart").text(),
					creatTime=$(this).find("CreateTime").text(),
					content=$(this).find("Content").text(),
					remark=$(this).find("Remark").text(),
					type=$(this).find("Type").text(),
					creatorName=$(this).find("creatorName").text(),
					PpId=$(this).find("PpId").text(),
					status=$(this).find("Status").text(),
					actualStart=$(this).find("ActualStart").text(),
					actualEnd=$(this).find("ActualEnd").text();
				var taskType=null;
				console.log(type)
				type==0?taskType="巡查任务":type==1?taskType="定期维保":"维修任务";

				$("#taskDetail .planStar").text(timeSplit(planStar));
				$("#taskDetail .creatTime").text(timeSplit(creatTime));
				$("#taskDetail .content").text(content);
				$("#taskDetail .remark").text(remark);
				$("#taskDetail .type").text(taskType);
				$("#taskDetail .creatorName").text(creatorName);
				if(status==0){
					$("#taskDetail .taskStatus").text("未开始");
					$("#taskDetail .startTime").parents("li").hide();
					$("#taskDetail .finishTime").parents("li").hide();
					if($("#ppType").val()==1){
						$("#taskDetail .btn.goStar").show();
					}else{
						$("#taskDetail .btn.goStar").hide();
					}
				}else if(status==1){
					$("#taskDetail .taskStatus").text("进行中");
					$("#taskDetail .startTime").text(timeSplit(actualStart));
					$("#taskDetail .finishTime").parents("li").hide();
					if($("#ppType").val()==1){
						$("#taskDetail .btn.goStar").show();
						$("#taskDetail .btn p").text("继续任务")
					}else{
						$("#taskDetail .btn.goStar").hide();
						$("#taskDetail .btn.edict").hide();
					}
					
				}else{
					$("#taskDetail .taskStatus").text("已完成");
					$("#taskDetail .startTime").text(timeSplit(actualStart));
					$("#taskDetail .finishTime").text(timeSplit(actualEnd));
					$("#taskDetail .btn").hide();
				}
				var data={
					sql:"select name from  Dt_PropertyPpl where id in ("+PpId+")",
					userName:window.localStorage.userName
				}
				JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,data,sucName)
			})
		}
	})
}

function sucName(dt){
	var res=$(dt).find("DataTable");
	var txt="";
	$(res).find("shen").each(function(){
		txt+=$(this).find("name").text()+" ";
	})
	$("#taskDetail .name").text(txt)
}


function edictTask(){
	var  type=$("#taskTypeDe").val(),
		 id=$("#taskIdDe").val();
		 console.log(type,id);
	mainView.router.loadPage("newTask.html?type="+type+"&id="+id)
}

