function taskList(){
	toolbarActive('taskTool');
	loadInform("Order By a.PlanStart  Desc")
}
function  loadInform(orderBy,date){
	$.ajax({
		type:"post",
		url:"/GWService.asmx/GetDataTableFromSQL",
		data:{
			sql:"select * from Dt_Account where Username='"+window.localStorage.userName+"'",
			userName:window.localStorage.userName
		},
		success:function(dt){
			var table=null,ppId=null,Type=null;
			var res=$(dt).find("DataTable");
			// console.log(dt);
			$(res).find("shen").each(function(){
				ppId=$(this).find("PpId").text();//人员id
				Type=$(this).find("Type").text();//公司类型
				if(Type==0){
					table="Dt_MaintPpl"
				}else if(Type==1){
					table="Dt_PropertyPpl"
				}
				// table="Dt_GovPpl"
				// console.log(Type,table);
				// 0:维保
				// 1:物业
			})
			//获取人员任务信息列表
			//管理人员创建任务
			//获取公司信息和人员类型
			$.ajax({
				type:"post",
				url:"/GWService.asmx/GetDataTableFromSQL",
				async:true,
				data:{
					sql:"select CompId,Type from "+table+" where id='"+ppId+"'",
					userName:window.localStorage.userName
				},
				success:function(dt){
					var res=$(dt).find("DataTable");
					// console.log(dt);
					$(res).find("shen").each(function(){
						var typ=$(this).find("Type").text();//管理还是普通人员
						var comId=$(this).find("CompId").text();//公司id
						// console.log(Type,typ,comId,ppId);
						if(typ==0){
							getTaskList(Type,typ,comId,ppId,orderBy)
							//guanlirenyuan
						}else{
							$("#createTas").html("");
							//zhixing
							getTaskList(Type,typ,comId,ppId,orderBy)
						}
					})
				}
			})
		}
	})
}
function getTaskList(Type,typ,comId,ppId,orderBy){
				// 公司类型,人员类型,公司id,人员id
		// console.log(Type,typ,comId,ppId);
		if(typ==0){//管理人员
			if(Type==0){//维保管理
				var dataTas={
					sql:"select a.Id,a.PropId,a.EquipId,a.PlanStart,a.Status,a.Type,b.CompAddr,b.CompName from Dt_MaintTsk a left join Dt_PropertyCo b on a.PropId=b.Id where a.Status<>2 and a.MaintId='"+comId+"' "+orderBy,
					userName:window.localStorage.userName
				}
				JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,dataTas,_sucTask)
			}else if(Type==1){//物业管理
				var dataTas={
					sql:"select a.Id,a.PropId,a.PlanStart,a.Status,a.Type,b.CompAddr from Dt_PatrolTsk a left join Dt_PropertyCo b on a.PropId=b.Id where a.Status<>2 and a.PropId='"+comId+"' "+orderBy,
					userName:window.localStorage.userName
				}
				JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,dataTas,_sucTaskwy)
			}
		}else{//普通人员
			if(Type==0){//维保人员
				var dataTas={
					sql:"select a.Id,a.PropId,a.EquipId,a.PlanStart,a.Status,a.Type,b.CompAddr,b.CompName from Dt_MaintTsk a left join Dt_PropertyCo b on a.PropId=b.Id where a.Status<>2 and a.MaintId='"+comId+"' and a.MpId like ('%"+ppId+"%') "+orderBy,
					userName:window.localStorage.userName
				}
				JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,dataTas,_sucTask)
			}else if(Type==1){//物业人员
				var dataTas={
					sql:"select a.Id,a.PropId,a.PlanStart,a.Status,a.Type,b.CompAddr from Dt_PatrolTsk a left join Dt_PropertyCo b on a.PropId=b.Id where a.Status<>2 and a.PropId='"+comId+"' and a.PpId in("+ppId+") "+orderBy,
					// 获取该公司下的该人员的任务
					userName:window.localStorage.userName
				}
				JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,dataTas,_sucTaskwy)
			 }
		}
}
function _sucTask(dt){
	$("#taskList .taskList .list").html("")
	var res=$(dt).find("DataTable");
	if($(res).find("shen").length==0){
		$("#taskList .taskList .list").html("<p style='text-align:center;color:#C2C2C2'>查无记录</p>");
	}else{
		$(res).find("shen").each(function(){
			var status=$(this).find("Status").text();
			var timeHtml=$(this).find("PlanStart").text();
			var dateTxt=timeHtml.split("T")[0];
			var timeTxt=timeHtml.split("T")[1].split("+")[0];
			var equipNum=$(this).find("EquipId").text();
			var CompAddr=$(this).find("CompAddr").text();
			var CompName=$(this).find("CompName").text();
			var id=$(this).find("Id").text();
			var type=$(this).find("Type").text();
			var iHtml=null,text=null,color=null,stahtml=null,finished=null,txtColor="",conColor="";

			if(type=="0"){
					//巡查任务
					iHtml="icon-web-check";
					text="巡查任务"
					 color="blueColor"
			}else if(type=="1"){
					//定期维保
					iHtml="icon-web-weixiu3"
					text="定期维保"
					color="yellowColor"
			}else{
					//维修任务
					iHtml="icon-web-weixiu1"
					text="维修任务"
					color="redColor"
			}
			if(status=="0"){
				//巡查任务
				stahtml="未开始";
				finished="";
				txtColor="huiColor"
			}else if(status=="1"){
				//定期维保
				stahtml="进行中";
				finished="";
				txtColor="blueColor"

			}else{
				//维修任务
				stahtml="已完成";
				finished='<img class="finishedImg" src="../../Image/finished.png">';
				color="huiColor";
				txtColor="huiColor";
				conColor="huiColor";
			}

			var taskHtml="";
				taskHtml='<div class="card"  onclick="goDetail(0,'+id+')">'+
					'<div class="card-footer timeTyp">'+
						'<a href="#" class="iconType">'+
							'<i class="icon iconfont '+iHtml+' '+color+'"></i><span class="'+color+'">'+text+'</span>'+
						'</a>'+
						'<a href="#" class="time">'+
						'<span class="min '+color+'">'+timeTxt+'</span>'+
						'<span class="date huiColor">'+dateTxt+'</span>'+
						'</a>'+
					'</div>'+
					'<div class="card-content">'+
						'<div class="card-content-inner">'+
							'<div class="row">'+
								'<div class="col-60 '+conColor+'">'+
									'<p class="equNum ">电梯设备号:<span>'+equipNum+'</span></p>'+
									'<p class="addr">地址:<span>'+CompAddr+'</span>'+
									'&nbsp;&nbsp;'+
									'<span>'+CompName+'</span>'+
									'</p>'+
								'</div>'+
								'<div class="col-40 rig">'+
									'<p>'+
										'<span class="status '+txtColor+'">'+stahtml+'</span>'+
										// '<span class="redeploy redColor">未转派</span>'+
									'</p>'+
									'<p >'+
										'<button class="lookMap" onclick="lookMap(event,'+id+')">查看地图</button>'+
									'</p>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
					finished+
				'</div>';
				status==1?$("#taskList .taskList .list").prepend(taskHtml):$("#taskList .taskList .list").append(taskHtml);
		})
	}
	

}
function _sucTaskwy(dt){
	console.log(dt);
	$("#taskList .taskList .list").html("")
	var res=$(dt).find("DataTable");
	if($(res).find("shen").length==0){
		$("#taskList .taskList .list").html("<p style='text-align:center;color:#C2C2C2'>查无记录</p>");
	}else{
		$(res).find("shen").each(function(){
			var iHtml=null,text=null,color=null;
			var status=$(this).find("Status").text();
			var stahtml=null,staColor="";
			if(status=="0"){
				//巡查任务
				finished="";
				stahtml="未开始";
				staColor="huiColor";
			}else if(status=="1"){
				//定期维保
				stahtml="进行中";
				finished="";
				staColor="blueColor";
			}else{
				//维修任务
				stahtml="已完成";
				finished='<img class="finishedImg" src="../../Image/finished.png">';
				staColor="huiColor";
				color='huiColor';
			}
			var timeHtml=$(this).find("PlanStart").text();
			var dateTxt=timeHtml.split("T")[0];
			var timeTxt=timeHtml.split("T")[1].split("+")[0];
			var equipNum=$(this).find("EquipId").text();
			var CompAddr=$(this).find("CompAddr").text();
			var CompName=$(this).find("CompName").text();
			var id=$(this).find("Id").text();
			var taskHtml="";
			//物业1还是维保0,
				taskHtml='<div class="card" onclick="goDetail(1,'+id+')">'+
					'<div class="card-footer timeTyp">'+
						'<a href="#" class="iconType">'+
							'<i class="icon iconfont icon-web-check '+color+'"></i><span class=" '+color+'">巡查任务</span>'+
						'</a>'+
						'<a href="#" class="time">'+
						'<span class="min  '+color+'">'+timeTxt+'</span>'+
						'<span class="date huiColor">'+dateTxt+'</span>'+
						'</a>'+
					'</div>'+
					'<div class="card-content">'+
						'<div class="card-content-inner">'+
							'<div class="row">'+
								'<div class="col-60  '+color+'">'+
									'<p >地址:<span>'+CompAddr+'</span>'+
									'&nbsp;&nbsp;'+
									'<span>'+CompName+'</span>'+
									'</p>'+
								'</div>'+
								'<div class="col-40 rig">'+
									'<p>'+
										'<span class="status '+staColor+'">'+stahtml+'</span>'+
										// '<span class="redeploy redColor">未转派</span>'+
									'</p>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
					finished+
				'</div>';
				status==2?$("#taskList .taskList .list").append(taskHtml):$("#taskList .taskList .list").prepend(taskHtml);
		})
	}
	
}
function goDetail(type,id){
	if(type==0){
		mainView.router.loadPage("wb_taskDetail.html?type="+type+"&id="+id)
	}else{
		mainView.router.loadPage("taskDetail.html?type="+type+"&id="+id)
	}
	

}
function lookMap(event,id){
	 event.stopPropagation();
	 $("#recordPoitionLng").val(id);console.log(id)
	mainView.router.loadPage("record/record_maintTask_map.html");
//	 alert("地图")
}
function searchDate(){
	var date=$("#dateCho2").val();
	// convert(varchar(10),a.PlanStart,120) = '2018-03-23'
	var orderBy="and convert(varchar(10),a.PlanStart,120) ='"+date+"'";
	// console.log(orderBy);
	loadInform(orderBy)
}

function getRegCode(id){
	ids=id.split(",");
	var regCode=""
	for(var i=0;i<ids.length;i++){
		$.ajax({
			url: '/GWService.asmx/GetDataTableFromSQL',
			type: 'post',
			async:false,
			data: {
				sql:"select RegCode from Dt_Equip where id='"+ids[i]+"'",
				userName:window.localStorage.userName
			},success:function(res){
				console.log(res);
				regCode+=$(res).find("DataTable").find("shen RegCode").text()+"</br>"
			}
		})
	}
	
	return regCode
	
}
function loadNewTsak(){
	var type=localStorage.Type;
	if(type==0){
		mainView.router.loadPage("wb_newTask.html")
	}else{
		mainView.router.loadPage("newTask.html")
	}
	console.log(type)
}