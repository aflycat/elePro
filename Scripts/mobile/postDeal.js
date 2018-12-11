function postDeal(){
	InitEnsure();


	var Id=$("#tabId").val(),compId=null,taskType=$("#task_cl").val(),_data;
	console.log(taskType)
	
	if(taskType==0){
		_data={
			sql:"select * from Dt_Fault where id='"+Id+"'",
			userName:window.localStorage.userName
		}
	}else{
		_data={
			sql:"select * from Dt_Complaint where id='"+Id+"'",
			userName:window.localStorage.userName
		}
	}

	$("#postDeal .proContent").hide();
	$("#postDeal .proContent.backIn").show();
	$("#postDeal .creatTask").click(function(){
		var check=$(this).siblings("input").prop("checked");
		// console.log(check);
		if(!check){
			$("#postDeal .proContent").show();
		}else{
			$("#postDeal .proContent").hide();
			$("#postDeal .proContent.backIn").show();
		}
	})

	var idArr=[],nameArr=[];
	var num=0,name="",ppid="";
	$("#postDeal .peo").delegate("li","click",function(){
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
			// console.log(num);
			$(this).parent().siblings(".menu").find("span").text(nameArr.toString());
			$("#fixPeo").val(idArr.toString())
	})
	JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,_data,_succDeal)
	$.ajax({
		type:"post",
		url:"/GWService.asmx/GetDataTableFromSQL",
		async:false,
		data:{
			sql:"select a.CompId,b.PpId from Dt_MaintPpl a left join Dt_Account b on b.PpId=a.Id where b.Username='"+window.localStorage.userName+"'",
			userName:window.localStorage.userName
		},
		success:function(dt){
			// console.log(dt);
			var res=$(dt).find("DataTable")
			$(res).find("shen").each(function(){
				compId=$(this).find("CompId").text();
				creator=$(this).find("PpId").text();
				$("#compId").val(compId);
				$("#creatorId").val(creator);
			})
			// console.log(compId);
		}
	})
	var _dats={
 		sql:"select Id,Name from Dt_MaintPpl where Type='1' and CompId='"+compId+"'" ,
 		userName:window.localStorage.userName
 	}
 	JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,_dats,_sucMem);

}
function checkpeo(dom){
	$(dom).siblings(".proList").toggle();
	$(dom).parent().siblings(".proContent").find(".proList").hide();
	$(dom).parent().siblings(".proContent").find("i").removeClass("icon-web-triangle-top").addClass("icon-web-triangle-bottom");
	var isDown=$(dom).siblings(".proList").css("display");
	if(isDown=="block"){
		$(dom).find("i").removeClass("icon-web-triangle-bottom").addClass("icon-web-triangle-top");
	}else{
		$(dom).find("i").removeClass("icon-web-triangle-top").addClass("icon-web-triangle-bottom");
	}
}
function _succDeal(dt){
	// console.log(dt);
	var res=$(dt).find("DataTable");
	$(res).find("shen").each(function(){
		var dates=$(this).find("SubmitTime").text();
		var name=$(this).find("Submitter").text(),
			tel=$(this).find("Tel").text(),
			con=$(this).find("Content").text(),
			rem=$(this).find("Remark").text(),
			pic=$(this).find("Pic").text(),
			Equ=$(this).find("EquipId").text(),
			result=$(this).find("Result").text(),
			feedBack=$(this).find("FeedBack").text();
		if(result==1){
			$("#postDeal .creatTask").parents("li").hide();
			$("#postDeal .backIn").hide();
			$("#postDeal .btn").hide();
			$("#postDeal .dealMess").text(feedBack);
		}else{
			$("#postDeal .dealMess").parents("li").hide();
		}
		getWtCom(Equ);
		$("#postDeal .subTime").html(timeSplit(dates))
		$("#postDeal .name").text(name);
		$("#postDeal .tel").text(tel);
		$("#postDeal .con").text(con);
		$("#postDeal .remark").text(rem);
		if(pic){
			$("#postDeal .imgBoxs img").attr("src",pic)
		}else{
			$("#postDeal .imgBoxs").hide();
		}

		$("#postDeal .euipId").text( getRegCode(Equ));
	})
}
function  _sucMem(dt){
	var res=$(dt).find("DataTable");
	// console.log(dt);
	$(res).find("shen").each(function(){
		var peoHtml="",num="0",data
		name=$(this).find("Name").text(),
		ppid=$(this).find("Id").text();
		$.ajax({
			type:"post",
			url:"/GWService.asmx/GetDataTableFromSQL",
			async:false,
			data:{
				sql:"select count(id) as num from Dt_MaintTsk where Status<>'2' and   MpId like('%"+ppid+"%')" ,
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
		$("#postDeal .peo").append(peoHtml)
	})
}
function getWtCom(id){
	$.ajax({
		type:"post",
		url:"/GWService.asmx/GetDataTableFromSQL",
		data:{
			sql:"select PropId from Dt_Equip where id='"+id+"'",
			userName:window.localStorage.userName
		},
		success:function(dt){
			var res=$(dt).find("DataTable");
				$(res).find("shen").each(function(){
					var idCom= $(this).find("PropId").text();
					$("#wyId").val(idCom)
				})
		}
	})
}
function submitTsk(){
	//修改保障表状态
	var id=$("#tabId").val();
	var feedback=$("#postDeal .feedback").val();
	var check=$("#postDeal .createInput").prop("checked");
	// console.log(check);
	var creator=$("#creatorId").val();
	// console.log($("#postDeal .remark").val());
	var taskType=$("#task_cl").val();
	if(check){

		var MpId=$("#fixPeo").val() ,//维保人序号
			MaintId=$("#compId").val(),//维保公司序号
			PropId =$("#wyId").val(),//物业公司序号
			CreatorId=creator,//任务创建人序号
			EquipId=$("#postDeal .euipId").text() ,//EquipId
			Type="2" ,//任务类型
			Content=$("#postDeal .conTask").val() ,//任务内容
			Remark=$("#postDeal .remarkV").val() ,//任务备注
			CreateTime=createtime() ,//创建时间
			PlanStart=$("#dateCho").val()+" "+ $("#timeCho").val(),//计划开始时间
			Status="0" ;//任务状态
			
			var _data={
				sql:"insert into Dt_MaintTsk (MpId,MaintId,PropId,CreatorId,EquipId,Type,Content,Remark,CreateTime,PlanStart,Status) values ('"+MpId+"','"+MaintId+"','"+PropId+"','"+CreatorId+"','"+EquipId+"','"+Type+"','"+Content+"','"+Remark+"','"+CreateTime+"','"+PlanStart+"','"+Status+"'"+")",
				userName:window.localStorage.userName
			}

			JQajaxo("post","/GWService.asmx/ExecuteSQL",true,_data)
			if(taskType==0){
				changeTskStatus(EquipId)
			}
			
			

	}
	if(taskType==0){
				//报障
		$.ajax({
			type:"post",
			url:"/GWService.asmx/ExecuteSQL",
			async:false,
			data:{
				sql:"update Dt_Fault set Result=1,Handler='"+creator+"',FeedBack='"+feedback+"',HandlingTime='"+createtime() +"' where id='"+id+"'",
				userName:window.localStorage.userName
			},
			success:function(dt){
				var int=$(dt).find("int").text();
				if(int!=0){
					mainView.router.loadPage("postSubmit.html")
				}
			}
		})
	}else{
		$.ajax({
			type:"post",
			url:"/GWService.asmx/ExecuteSQL",
			async:false,
			data:{
				sql:"update Dt_Complaint set Result=1,Handler='"+creator+"',FeedBack='"+feedback+"',HandlingTime='"+createtime() +"' where id='"+id+"'",
				userName:window.localStorage.userName
			},
			success:function(dt){
				var int=$(dt).find("int").text();
				if(int!=0){
					mainView.router.loadPage("postSubmit.html")
				}
			}
		})
	}

	

	//添加新任务
		
	// console.log(_data.sql);
}
function changeTskStatus(EquipId){
	$.ajax({
			type:"post",
			url:"/GWService.asmx/ExecuteSQL",
			// async:false,
			data:{
				sql:"update Dt_Equip set TskStatus=1 where Id="+EquipId,
				userName:window.localStorage.userName
			},
			success:function(dt){
				var int=$(dt).find("int").text();
				if(int!=0){
					console.log("修改成功")
				}
			}
		})
}

function getRegCode(id){
	var regCode=""
	$.ajax({
		url: '/GWService.asmx/GetDataTableFromSQL',
		type: 'post',
		async:false,
		data: {
			sql:"select RegCode from Dt_Equip where id='"+id+"'",
			userName:window.localStorage.userName
		},success:function(res){
			console.log(res);
			regCode=$(res).find("DataTable").find("shen RegCode").text()
		}
	})
	return regCode
}