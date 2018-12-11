function wb_newTask(){
	var ppId=localStorage.PpId;
	$("#creatId").val(ppId);
	// 获取登录人员的公司id
	loadWbMem(ppId)
	$.ajax({
		url: '/GWService.asmx/GetDataTableFromSQL',
		type: 'post',
		data: {
			sql:"select CompId from Dt_MaintPpl  where id="+ppId,
 			userName:window.localStorage.userName
		},success:function(dt){
			console.log(dt);
			var res=$(dt).find("DataTable");
			$(res).find("shen").each(function(){
				var idCom=$(this).find("CompId").text();
				$("#compIdNe").val(idCom)
				loadWbCo(idCom)
			})
		}
	})
	
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
	

	var eqidArr=[],eqnameArr=[];
	var eqnum=0,eqname="",eqppid="";
	$("#newTask .proList.equip ").delegate("li","click",function(){
			var check=$(this).find("input").prop("checked");
			eqname=$(this).find(".peoDet .name").text();
			eqppid=$(this).find(".peoDet .name").attr("RegCode");
			if(!check){
				eqnum++;
				eqidArr.push(eqppid);
				eqnameArr.push(eqname);
			}else{
				eqnum--;
				eqidArr.remove(eqppid);
				eqnameArr.remove(eqname);
			}
		if(eqnum==0){
			$(this).parent().siblings(".menu").find("span").text("请选择");
		}else{
			$(this).parent().siblings(".menu").find("span").text(eqnameArr.toString());
		}
		$("#eqpeoId").val(eqidArr.toString())
	});
	var taskId=$("#taskId").val();
	if(taskId!=""){
		var data={
			sql:"select * from Dt_MaintTsk where id='"+taskId+"'",
			userName:window.localStorage.userName
		}
		JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",false,data,_sucGet)
	}
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
				equipId=$(this).find("EquipId").text(),
				createTimeStr=$(this).find("CreateTime").text();//创建时间
				
				$(".taskCon").addClass('disabled');
				$(".wbType").addClass('disabled');
				$(".patrol").addClass('disabled');
				$(".equipLi").addClass('disabled');
				$(".task").addClass('disabled');
				$(".fixItem").addClass('disabled');

				$("#peoId").val(mpId);//维保人序号
				$("#wyIdNe").val(propId);//物业公司序号
				$("#eqpeoId").val(equipId);
				// $(".equipLi span").text(equipId);
				$("#dateCho").val(timeSplit(timeStr).split(" ")[0]);
				$("#timeCho").val(timeSplit(timeStr).split(" ")[1].toString().substring(0,5));
			
				$("#newTask .conTask").val(content);//任务内容
				$("#newTask .remark").val(remark);//任务备注
				if(type==0){
					$("#newTask .task span").text("巡查任务").attr("Id",type)
				}else if(type==1){
					$("#newTask .task span").text("定期维保").attr("Id",type)
				}else{
					$("#newTask .task span").text("维修任务").attr("Id",type)
				}




				getComName(propId);
				getEquipName(equipId);
	})

}
function getEquipName(equipId){
	var arr=equipId.split(",")
	var name="";
	for(var i=0;i<arr.length;i++){
		$.ajax({
			url: '/GWService.asmx/GetDataTableFromSQL',
			type: 'post',
			async:false,
			data: {
				sql: "select InternalNum from Dt_Equip where RegCode='"+arr[i]+"'",
				userName:window.localStorage.userName
			},
			success:function(dt){
				var res=$(dt).find("DataTable");
				console.log(dt)
				$(res).find("shen").each(function(m){
					name+=$(this).find("InternalNum").text()+" ";

				})
			}
		})
	}
	$(".equipLi span").text(name)
	
	
	

}
function getComName(propId){
	$.ajax({
		url: '/GWService.asmx/GetDataTableFromSQL',
		type: 'post',
		data: {
			sql: 'select CompName from Dt_PropertyCo where Id='+propId,
			userName:window.localStorage.userName
		},
		success:function(dt){
				var res=$(dt).find("DataTable");
				console.log(dt)
				$(res).find("shen").each(function(m){
					var name=$(this).find("CompName").text()+" ";
					$(".patrol span").text(name)
				})
		}
	})
}
function loadWbMem(ppId){
	var _dats={
 		sql:"select Id,Name from Dt_MaintPpl  where Type='1' and CompId=(select CompId from Dt_MaintPpl where id="+ppId+")" ,
 		userName:window.localStorage.userName
 	}
 	JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,_dats,_sucMemWb);
}
function _sucMemWb(dt){
	var res=$(dt).find("DataTable");
	$(res).find("shen").each(function(m){
		var peoHtml="",num="0";
		name=$(this).find("Name").text(),
		ppid=$(this).find("Id").text();
		$.ajax({
			type:"post",
			url:"/GWService.asmx/GetDataTableFromSQL",
			async:false,
			data:{
				sql:"select count(id) as num from Dt_MaintTsk where Status<>'2' and MpId like('%"+ppid+"%')" ,
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

function loadWbCo(ComId){
	var _dataGetP={
 		sql:"select Id,CompName from Dt_PropertyCo where Id in( select PropId from Dt_Equip where MaintId='"+ComId+"' group by PropId)",
 		userName:window.localStorage.userName
 	}
 	JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,_dataGetP,_sucGetP)
}
function _sucGetP(dt){
	var res=$(dt).find("DataTable");
	$(res).find("shen").each(function(){
		var wyId=$(this).find("Id").text(),
			wyName=$(this).find("CompName").text();
		var wyHtml="";
			wyHtml='<li class="item-content" onclick=checkLi('+wyId+',this)>'+
							'<div class="item-inner">'+
								'<div class="item-title">'+wyName+'</div>'+
							'</div>'+
					'</li>';
		$("#newTask .wycom").append(wyHtml)

	})
}
function checkLi(id,dom){
	$("#newTask .equipLi .menu span").text("请选择");
	$(dom).parents(".proContent").find("span").text($(dom).find(".item-title").text()).attr("Id",id);
	$(dom).parent().hide();
	$("#eqpeoId").val("");
	var compId=$("#compIdNe").val();
	$(".proList.equip").html("")
	$("#wyIdNe").val(id);
	$.ajax({
			type:"post",
			url:"/GWService.asmx/GetDataTableFromSQL",
			async:true,
			data:{
				sql:"select Id,InternalNum,DeviceId,RegCode  from Dt_Equip where PropId='"+id+"' and MaintId='"+compId+"' and TskStatus=0" ,
 				userName:window.localStorage.userName
			},success:function(dt){
				var res=$(dt).find("DataTable");
					$(res).find("shen").each(function(){
						var eqId=$(this).find("Id").text(),
							InternalNum=$(this).find("InternalNum").text(),
							RegCode=$(this).find("RegCode").text(),
							DeviceId=$(this).find("DeviceId").text();

						var eqHtml="";
							eqHtml='<li>'+
										'<label class="label-checkbox item-content">'+
											'<input type="checkbox" name="my-checkbox" >'+
											'<div class="item-media">'+
												'<i class="icon icon-form-checkbox"></i>'+
											'</div>'+
											'<div class="item-inner">'+
												'<div class="item-title peoDet">'+
													'<span class="name" eqId="'+eqId+'" RegCode="'+RegCode+'">'+InternalNum+'</span>'+
												'</div>'+
											'</div>'+
										'</label>'+
									'</li>';
						$("#newTask .equip").append(eqHtml)
					})
			}
		})
}
function checkTakTyp(dom){
	var tyId=$(dom).attr("tyId");
	$(dom).parent().hide();
	$(dom).parents(".proContent").find("span").text($(dom).find(".item-title").text()).attr("Id",tyId);
	$("#newTask .conTask").val("")
	if(tyId==1){
		$("#newTask .wbType").show();
		$("#newTask .fixItem").hide();
	};
	if(tyId==2){
		$("#newTask .wbType").hide();
		$("#newTask .fixItem").show();
	};
	if(tyId==0){
		$("#newTask .conTask").removeClass("disabled")
		$("#newTask .wbType").hide();
		$("#newTask .fixItem").hide();
	}

}
function checkWbTyp(dom){
	// 维保选项
	$(dom).parent().hide();
	$(dom).parents(".proContent").find("span").text($(dom).find(".item-title").text())
	$("#newTask .conTask").val($(dom).find(".item-title").text());
	$("#newTask .conTask").addClass("disabled")
}
function chenckFixItem(dom){
	//维修选项
	$(dom).parent().hide();
	$(dom).parents(".proContent").find("span").text($(dom).find(".item-title").text())
	$("#newTask .conTask").val($(dom).find(".item-title").text());
	$("#newTask .conTask").addClass("disabled")
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
function submitTsk(typ){
	var taskType=$("#taskType").val(),
		taskId=$("#taskId").val();

	if(taskId!=""){
		// 更新任务
		var MpId=$("#peoId").val(),//维保人序号
			MaintId=$("#compIdNe").val(),//维保公司序号
			PropId=$("#wyIdNe").val(),//物业公司序号
			EquipId=$("#eqpeoId").val(),//维保设备序号
			Type=$("#newTask .task .menu span").attr("id"),//任务类型
			Content=$("#newTask .conTask").val(),//任务内容
			Remark=$("#newTask .remark").val(),//任务备注
			CreateTime=createtime(),//创建时间
			PlanStart=$("#dateCho").val()+" "+$("#timeCho").val(),//计划开始时间
			CreatorId=$("#creatId").val(),//维保设备序号
			Status="0";//任务状态
			var data={
				sql:"update Dt_MaintTsk set  MpId='"+MpId+"',MaintId='"+MaintId+"',PropId='"+PropId+"',EquipId='"+EquipId+"',Type='"+Type+"',Content='"+Content+"',Remark='"+Remark+"',CreateTime='"+CreateTime+"',PlanStart='"+PlanStart+"',CreatorId='"+CreatorId+"',Status='"+Status+"'  where id='"+taskId+"'",
				userName:window.localStorage.userName
			}
			console.log(data.sql)
			JQajaxo("post","/GWService.asmx/ExecuteSQL",true,data,_sucSub)
	}else{
		//创建任务
		var MpId=$("#peoId").val(),//维保人序号
			MaintId=$("#compIdNe").val(),//维保公司序号
			PropId=$("#wyIdNe").val(),//物业公司序号
			EquipId=$("#eqpeoId").val(),//维保设备序号
			Type=$("#newTask .task .menu span").attr("id"),//任务类型
			Content=$("#newTask .conTask").val(),//任务内容
			Remark=$("#newTask .remark").val(),//任务备注
			CreateTime=createtime(),//创建时间
			PlanStart=$("#dateCho").val()+" "+$("#timeCho").val(),//计划开始时间
			CreatorId=$("#creatId").val(),//维保设备序号
			Status="0";//任务状态
			var data={
				sql:"insert into Dt_MaintTsk (MpId,MaintId,PropId,EquipId,Type,Content,Remark,CreateTime,PlanStart,CreatorId,Status) values ('"+MpId+"',"+"'"+MaintId+"',"+"'"+PropId+"',"+"'"+EquipId+"',"+"'"+Type+"',"+"'"+Content+"',"+"'"+Remark+"',"+"'"+CreateTime+"',"+"'"+PlanStart+"',"+"'"+CreatorId+"',"+"'"+Status+"'"+")",
				userName:window.localStorage.userName
			}
			var isChange=$(".task span").text()
			console.log(data)
			if(isChange=="巡查任务"){
				JQajaxo("post","/GWService.asmx/ExecuteSQL",true,data,_sucSub)
			}else{
				changeEquipStatus(EquipId)
				JQajaxo("post","/GWService.asmx/ExecuteSQL",true,data,_sucSub)
			}
			
	}
	
}
function changeEquipStatus(eqId){
	if(eqId!=""){
     	var EqId=eqId.split(",");
     	for(var i=0;i<EqId.length;i++){
     		$.ajax({
     			type:"post",
     			url:"/GWService.asmx/ExecuteSQL",
     			async:false,
     			data:{
     				sql:"update Dt_Equip set TskStatus=1 where RegCode='"+EqId[i]+"'",
     				userName:window.localStorage.userName
     			},
     			success:function(dt){
     				console.log("修改成功")
     			}
     		})
     	}
	}
}
function _sucSub(dt){
	 var res=$(dt).find("int").text();
	 if(res=="1"){
	 	myApp.alert("操作成功","温馨提示",function(){
	 		mainView.router.loadPage("taskList.html")
	 	});
	 }
}
// function changeEquipStatus(eqId){
// 	if(eqId!=""){
//      	var EqId=eqId.split(",");
//      	console.log(EqId)
//      	for(var i=0;i<EqId.length;i++){
//      		$.ajax({
//      			type:"post",
//      			url:"/GWService.asmx/ExecuteSQL",
//      			async:false,
//      			data:{
//      				sql:"update Dt_Equip set TskStatus=1 where id="+EqId[i],
//      				userName:window.localStorage.userName
//      			},
//      			success:function(dt){
//      				console.log("修改成功")
//      			}
//      		})
//      	}
// 	}
// }

// function changeEquipStatus0(eqId){
// 	if(eqId!=""){
//      	var EqId=eqId.split(",");
//      	console.log(EqId)
//      	for(var i=0;i<EqId.length;i++){
//      		$.ajax({
//      			type:"post",
//      			url:"/GWService.asmx/ExecuteSQL",
//      			async:false,
//      			data:{
//      				sql:"update Dt_Equip set TskStatus=0 where id="+EqId[i],
//      				userName:window.localStorage.userName
//      			},
//      			success:function(dt){
//      				console.log("修改成功")
//      			}
//      		})
//      	}
// 	}
// }
// $("#eqpeoId").val(equipId);
