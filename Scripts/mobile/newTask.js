// var eqnameArr=[],oldEqid="";
function newTask(){
	InitEnsure();
	var ppId=localStorage.PpId;
	getMem(ppId);
	$("#creatId").val(ppId)


	var idArr=[],nameArr=[];
	var num=0,name="",ppid="";
	$("#newTask .proList.peo ").delegate("li","click",function(){
			var check=$(this).find("input").prop("checked");
			name=$(this).find(".peoDet .name").text();
			ppid=$(this).find(".peoDet .name").attr("ppId");
			if(!check){
				num++;
				idArr.push(ppid);
				nameArr.push(name);
			}else{
				num--;
				idArr.remove(ppid);
				nameArr.remove(name);
			}
			if(num==0){
				$(this).parent().siblings(".menu").find("span").text("请选择");
			}else{
				$(this).parent().siblings(".menu").find("span").text(nameArr.toString());
			}
		
		$("#peoId").val(idArr.toString())
	});

		

	var taskId=$("#taskId").val();
	if(taskId!=""){
		var data={
			sql:"select * from Dt_PatrolTsk where id='"+taskId+"'",
			userName:window.localStorage.userName
		}
		JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",false,data,_sucGet)
	}

	
}
function getMem(ppId){
	$.ajax({
		type:"post",
		url:"/GWService.asmx/GetDataTableFromSQL",
		data:{
			sql:"select CompId from Dt_PropertyPpl where id='"+ppId+"'",
			userName:window.localStorage.userName
		},
		success:function(dt){
			var res=$(dt).find("DataTable");
			$(res).find("shen").each(function(){
				ComId=$(this).find("CompId").text();
				$("#wyIdNe").val(ComId);
				getMems(ComId)
			})

		}
	})
}
function getMems(ComId){
	var _dats={
 		sql:"select Id,Name from Dt_PropertyPpl where Type='1' and CompId='"+ComId+"'" ,
 		userName:window.localStorage.userName
 	}
 	JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,_dats,_sucMemWy);

}

function  _sucMemWy(dt){
	var res=$(dt).find("DataTable");
	$(res).find("shen").each(function(m){
		var peoHtml="",num="0";
		name=$(this).find("Name").text(),
		ppid=$(this).find("Id").text();
		//获取未完成的任务数

		$.ajax({
			type:"post",
			url:"/GWService.asmx/GetDataTableFromSQL",
			async:false,
			data:{
				sql:"select count(id) as num from Dt_PatrolTsk where Status<>'2' and   PpId like('%"+ppid+"%')" ,
 				userName:window.localStorage.userName
			},
			success:function(dt){
				num=$(dt).find("DataTable").find("shen num").text();
			}
		})
		peoHtml='<li>'+
					'<label class="label-checkbox item-content">'+
						'<input type="checkbox" name="my-checkbox" >'+
						'<div class="item-media">'+
							'<i class="icon icon-form-checkbox"></i>'+
						'</div>'+
						'<div class="item-inner">'+
							'<div class="item-title peoDet">'+
								'<span class="name" ppId="'+ppid+'">'+name+'</span>'+
								'<span class="num">已有任务'+num+'个</span>'+
							'</div>'+
						'</div>'+
					'</label>'+
				'</li>';
		$("#newTask .peo").append(peoHtml)
	})
}




function _sucGet(dt){
	console.log(dt);
	var taskType=$("#taskType").val();
	var res=$(dt).find("DataTable");
	$(res).find("shen").each(function(){
			var content=$(this).find("Content").text(),//任务内容
				remark=$(this).find("Remark").text(),//任务备注
				timeStr=$(this).find("PlanStart").text(),//计划开始时间
				mpId=$(this).find("MpId").text(),//维保人序号
				propId=$(this).find("PropId").text(),//物业公司序号
				type=$(this).find("Type").text(),//任务类型
				creatorId=$(this).find("CreatorId").text(),//创建人序号
				ppId=$(this).find("PpId").text(),//巡查人员id,此为物业
				createTimeStr=$(this).find("CreateTime").text();//创建时间
				
				$("#peoId").val(mpId);//维保人序号
				$("#wyIdNe").val(propId);//物业公司序号
				
				$("#dateCho").val(timeSplit(timeStr).split(" ")[0]);
				$("#timeCho").val(timeSplit(timeStr).split(" ")[1].toString().substring(0,5));
			
				$("#newTask .conTask").val(content);//任务内容
				$("#newTask .remark").val(remark);//任务备注
				if(type==0){
					$("#newTask .task span").text("巡查任务").attr("Id",type)
				}
				
		
	})
}

function checkpeo(dom){
	$(dom).siblings(".proList").toggle();
	$(dom).parent().siblings(".proContent").find(".proList").hide();
	$(dom).parent().siblings(".proContent").find(".menu i").removeClass("icon-web-triangle-top").addClass("icon-web-triangle-bottom");
	var isDown=$(dom).siblings(".proList").css("display");
	if(isDown=="block"){
		$(dom).find(".menu i").removeClass("icon-web-triangle-bottom").addClass("icon-web-triangle-top");
	}else{
		$(dom).find(".menu i").removeClass("icon-web-triangle-top").addClass("icon-web-triangle-bottom");
	}
}
function _success(dt){
	// console.log(dt);
	var table=null,ppId=null,Type=null;
	var res=$(dt).find("DataTable");
	$(res).find("shen").each(function(){
		ppId=$(this).find("PpId").text();//创建人id#######################
		// console.log(ppId);
		$("#creatId").val(ppId)
		$("#newTask .creatPeoId").text(ppId);
		Type=$(this).find("Type").text();
		Type==0?table="Dt_MaintPpl":Type==1?table="Dt_PropertyPpl":table="Dt_GovPpl"
		// console.log(Type,table);
// 0:维保
// 1:物业
// 2:政府
	})
// 	//获取公司信息
	var ComId=null;
	$.ajax({
		type:"post",
		url:"/GWService.asmx/GetDataTableFromSQL",
		data:{
			sql:"select CompId from "+table+" where id='"+ppId+"'",
			userName:window.localStorage.userName
		},
		success:function(dt){
			var res=$(dt).find("DataTable");
			$(res).find("shen").each(function(){
				ComId=$(this).find("CompId").text();
				$("#compIdNe").val(ComId);
				Type==0?maintStep(ComId):propertyStep(ComId);
				//获取该公司下的员工和人物个数
			})
			// console.log("公司id"+ComId);

		}
	})
}

function propertyStep(ComId){
	$("#newTask .patrol").hide();
	$("#newTask .equipLi").hide();
	$("#newTask .btn.wb").hide();
	$("#newTask .taskType .wy").remove();
	var _dats={
 		sql:"select Id,Name from Dt_PropertyPpl where Type='1' and CompId='"+ComId+"'" ,
 		userName:window.localStorage.userName
 	}
 	JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,_dats,_sucMemWy);
}

//任务类型选择
function checkTakTyp(dom){
	var tyId=$(dom).attr("tyId");
	$(dom).parent().hide();
	$(dom).parents(".proContent").find("span").text($(dom).find(".item-title").text()).attr("Id",tyId);
	
}



function submitTsk(typ){
	var taskType=$("#taskType").val(),
		taskId=$("#taskId").val();

	if(taskId!=""){
	// 	// 更新任务
	
			var PpId=$("#peoId").val(),//巡查人序号
				PropId=$("#wyIdNe").val(),//物业公司序号
				Type=$("#newTask .task .menu span").attr("id"),//任务类型
				Content=$("#newTask .conTask").val(),//任务内容
				Remark=$("#newTask .remark").val(),//任务备注
				CreateTime=createtime(),//创建时间
				PlanStart=$("#dateCho").val()+" "+$("#timeCho").val(),//计划开始时间
				CreatorId=$("#creatId").val(),//维保设备序号
				Status="0";//任务状态

				var data={
					sql:"update  Dt_PatrolTsk set  PpId='"+PpId+"',PropId='"+PropId+"',CreatorId='"+CreatorId+"',Type='"+Type+"',Content='"+Content+"',Remark='"+Remark+"',CreateTime='"+CreateTime+"',PlanStart='"+PlanStart+"',Status='"+Status+"' where id='"+taskId+"'",
					userName:window.localStorage.userName
				}
				 console.log(data.sql);
				JQajaxo("post","/GWService.asmx/ExecuteSQL",true,data,_sucSub)
	
	}else{
		//创建任务
		
		var PpId=$("#peoId").val(),//巡查人序号
			PropId=$("#wyIdNe").val(),//物业公司序号
			Type=$("#newTask .task .menu span").attr("id"),//任务类型
			Content=$("#newTask .conTask").val(),//任务内容
			Remark=$("#newTask .remark").val(),//任务备注
			CreateTime=createtime(),//创建时间
			PlanStart=$("#dateCho").val()+" "+$("#timeCho").val(),//计划开始时间
			CreatorId=$("#creatId").val(),//创建人id
			Status="0";//任务状态
			var data={
				sql:"insert into Dt_PatrolTsk (PpId,PropId,CreatorId,Type,Content,Remark,CreateTime,PlanStart,Status) values ('"+PpId+"',"+"'"+PropId+"',"+"'"+CreatorId+"',"+"'"+Type+"',"+"'"+Content+"',"+"'"+Remark+"',"+"'"+CreateTime+"',"+"'"+PlanStart+"',"+"'"+Status+"'"+")",
				userName:window.localStorage.userName
			}
			console.log(data);
			JQajaxo("post","/GWService.asmx/ExecuteSQL",true,data,_sucSub)
		
	}
	
}
function _sucSub(dt){
	 var res=$(dt).find("int").text();
	 console.log(dt)
	 if(res=="1"){
	 	myApp.alert("操作成功","温馨提示",function(){
	 		mainView.router.loadPage("taskList.html")
	 	});
	 }

}
