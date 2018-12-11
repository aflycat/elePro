function wb_taskDetail(){
	
	InitEnsure();
	myApp.closeModal('.picker-info')
	// 获取人员类型
	var  taskType=$("#taskTypeDe").val();
	var id=$("#taskIdDe").val();
	var ppId=localStorage.PpId;
	getMemType(ppId)
	maintCo(id)
	
}
function goStart(){
	var id=$("#taskIdDe").val();
	var time=createtime();
	var type=$("#taskTypeDe").val();
	$.ajax({
				type:"post",
				async:false,
				url:"/GWService.asmx/ExecuteSQL",
				data:{
					sql:"update Dt_MaintTsk set ActualStart='"+time+"',Status=1 where id='"+id+"'",
					userName:window.localStorage.userName
				},
				success:function(dt){
					var res=$(dt).find("int").text();
					if(res!=0){
						mainView.router.loadPage("wb_startTask.html?Id="+id)
					}
				}
			})
}
function continuTas(){
	var id=$("#taskIdDe").val();
	var type=$("#taskTypeDe").val();
	mainView.router.loadPage("wb_startTask.html?type="+type+"&Id="+id)
}

function getMemType(ppId){
	$.ajax({
		url: '/GWService.asmx/GetDataTableFromSQL',
		type: 'post',
		async:false,
		data: {
			sql:"select * from Dt_MaintPpl where Id="+ppId,
			userName:window.localStorage.userName
		},
		success:function(dt){
			var res=$(dt).find("DataTable");
			$(res).find("shen").each(function(){
				var type=$(this).find("Type").text();
				$("#ppType").val(type);
				if(type==1){
					$(".edict").hide()

				}

			})
		}
	})
}

function maintCo(id){
	$.ajax({
		type:"post",
		url:"/GWService.asmx/GetDataTableFromSQL",
		data:{
			sql:"select a.*,b.Name as CreateName,c.CompName as WyName from Dt_MaintTsk a left join Dt_MaintPpl b  on a.CreatorId=b.Id left join Dt_PropertyCo c on a.PropId=c.id  where  a.Id="+id,
			userName:window.localStorage.userName
		},
		success:function(dt){
				console.log(dt);
			var res=$(dt).find("DataTable");
			$(res).find("shen").each(function(){
				var planStar=$(this).find("PlanStart").text(),
					creatTime=$(this).find("CreateTime").text(),
					content=$(this).find("Content").text(),
					remark=$(this).find("Remark").text(),
					type=$(this).find("Type").text(),
					equipId=$(this).find("EquipId").text(),
					creatorName=$(this).find("CreateName").text(),
					wyname=$(this).find("WyName").text(),
					mpId=$(this).find("MpId").text(),
					status=$(this).find("Status").text(),
					actualStart=$(this).find("ActualStart").text(),
					actualEnd=$(this).find("ActualEnd").text();
				console.log(type)
				var taskType=null;
				type==0?taskType="巡查任务":type==1?taskType="定期维保":taskType="维修任务";

				$("#taskDetail .planStar").text(timeSplit(planStar));
				$("#taskDetail .creatTime").text(timeSplit(creatTime));
				$("#taskDetail .content").text(content);
				$("#taskDetail .remark").text(remark);
				$("#taskDetail .type").text(taskType);
				$("#taskDetail .equipId").text(equipId);
				$("#taskDetail .creatorName").text(creatorName);
				$("#taskDetail .wyname").text(wyname);
				if(status==0){
					$("#taskDetail .taskStatus").text("未开始");
					$("#taskDetail .startTime").parents("li").hide();
					$("#taskDetail .finishTime").parents("li").hide();
					if($("#ppType").val()==1){
						$("#taskDetail .btn.twoBtn").hide();
					}else{
						$("#taskDetail .btn.twoBtn").hide();
						$("#taskDetail .goStar").hide()
					}
					// $("#taskDetail .btn.edict").show();
				}else if(status==1){
					$("#taskDetail .taskStatus").text("进行中");
					$("#taskDetail .startTime").text(timeSplit(actualStart));
					$("#taskDetail .finishTime").parents("li").hide();
					if($("#ppType").val()==1){

						$("#taskDetail .onBtn").hide();
						$("#taskDetail .btn.twoBtn").show();
						$("#taskDetail .btn.edict").hide();
						$("#taskDetail .btn.goStar p").text("继续任务");
						if(type==0){
							$("#taskDetail .btn.twoBtn a").hide();
							$("#taskDetail .btn.twoBtn p").css({"width":"100%"});
						}
						
						
					}else{
						$("#taskDetail .onBtn").hide();
						$("#taskDetail .btn.twoBtn").show();
						$("#taskDetail .btn.goStar p").hide();
						$("#taskDetail .btn.goStar a").css({"width":"100%"});
						$("#taskDetail .edict").hide();
					}
				}else{
					$("#taskDetail .taskStatus").text("已完成");
					$("#taskDetail .startTime").text(timeSplit(actualStart));
					$("#taskDetail .finishTime").text(timeSplit(actualEnd));
					$("#taskDetail .onBtn").hide();
					$("#taskDetail .btn.twoBtn").show();
					$("#taskDetail .btn.twoBtn a").css({"width":"100%"});
					$("#taskDetail .btn.twoBtn p").hide();
					$("#taskDetail .edict").hide();

					
				}
				var data={
					sql:"select name from  Dt_MaintPpl where id in ("+mpId+")",
					userName:window.localStorage.userName
				}
				JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,data,sucName)
				// var 
			})
		}
	})
}


function sucName(dt){
	// 获取维保人员的姓名
	var res=$(dt).find("DataTable");
	var txt="";
	$(res).find("shen").each(function(){
		txt+=$(this).find("name").text()+" ";
	})
	$("#taskDetail .name").text(txt)
	console.log(dt);
}

function edictTask(){
	var  type=$("#taskTypeDe").val(),
		 id=$("#taskIdDe").val();
	mainView.router.loadPage("wb_newTask.html?type="+type+"&id="+id)
}
function goLookPlc(){
	var id=$("#taskIdDe").val()
	mainView.router.loadPage("lookMplc.html?Id="+id)
}

