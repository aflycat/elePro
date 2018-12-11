var timer;
function wb_startTask(){
	clearInterval(timer);
	$("#Input").hide();
	var taskId=$("#taskIdS").val();
	$("#startTask .codeNum span").text(PrefixInteger(taskId, 10));
	// wb()
	//获取本次任务信息
	getTaskIn(taskId);

	$("#startTask .item .txt").each(function(){
		$(this).click(function(){
			var isShow=$(this).siblings("ul").css("display");
			if(isShow=="block"){
				$(this).removeClass("openRadious");
				$(this).siblings("ul").hide();
			}else{
				$(this).siblings("ul").show();
				$(this).addClass("openRadious");
			}
		})
	})

	$("#startTask .item ul li").each(function(){
		$(this).click(function(){
			$(this).parent().siblings(".txt").find("span").text($(this).text()).attr("res",$(this).attr("res"))
			$(this).parent().hide().siblings(".txt").removeClass("openRadious");
		})
	})
	//维护设备点击事件
	$("#startTask .equipLi ul").delegate("li","click",function(){
		$("#startTask .item .txt span").text("正常").attr("res","0")
		$(this).parent().hide();
		var text=$(this).text(),code=$(this).attr("id"),id=$(".codeNum span").text();
		$(this).parents(".equipLi").find("span").text(text);
		$("#nowFixEq").val($(this).attr("id"));
		$("#qrcode").html("");
		// 查询是否有维保单,有则加载
		loadMplc(id,code)

	});


}
function clearTimer(){
	console.log(2222);
	clearInterval(timer);
}
function loadMplc(id,code){
	console.log(id,code)
	$.ajax({
		url: '/GWService.asmx/GetDataTableFromSQL',
		type: 'post',
		data: {
			sql:"select * from Dt_MaintPlc where SerialNum='"+id+code+"'",
			userName:window.localStorage.userName
		},
		success:function(res){
			console.log(res)
			var dom=$(res).find("DataTable shen");
			var dt=$(res).find("DataTable shen SerialNum").text();

			console.log(dt);
			if(dt!=""){
				jQuery('#qrcode').qrcode({
					render:"canvas",
					width:100,
					height:100,
					text:id+"##"+code
				})
				var remark=$(dom).find("Remark").text(),
					fault=$(dom).find("Fault").text(),
					fixedResult=$(dom).find("FixedResult").text(),
					masinSign=$(dom).find("MaintSign").text();
				$("#messDetail").val(fault);
				$("#remark").val(remark);
				$("#myImg").html("<img src='../../FileUpload/"+masinSign+"' />");
				$("#bdNum span").text(id+code);
				$(".creatTable").hide()
				$("#messDetail").addClass('disabled')
				$("#remark").addClass('disabled')
				if(fixedResult!=""){
					$(".fixItem .item p").addClass('disabled')
					var arr=fixedResult.split(",")
					for(var i=0;i<arr.length;i++){
						if(arr[i]==0){
							$(".fixItem .item:eq("+i+")").find("span").text("确认正常")
						}else if(arr[i]==1){
							$(".fixItem .item:eq("+i+")").find("span").text("调整整备")
						}else if(arr[i]==2){
							$(".fixItem .item:eq("+i+")").find("span").text("要修理等")
						}else if(arr[i]==3){
							$(".fixItem .item:eq("+i+")").find("span").text("非本次检查")
						}else{
							$(".fixItem .item:eq("+i+")").find("span").text("无此项目")
						}
					}
				}else{
					$(".fixItem .item p").removeClass('disabled')
				}
					// clearInterval(timer);
					timer=setInterval(function(){
						getSure()
					},2000)
			}else{
				$(".fixItem .item p").removeClass('disabled');
				$(".messDetail").removeClass('disabled').val("");
				$("#bdNum span").text("尚未生成保单");
				$("#qrcode").html("");
				$("#myImg").html("");
				// console.log(!$("#taskKind").val()==0);
				if($("#taskKind").val()!=0){
					$(".creatTable").show();
				}
				

			}
		}
	})
	
	
}
function getTaskIn(taskId){
	var datas={
		sql:"select * from Dt_MaintTsk  where ID='"+taskId+"'",
		userName:window.localStorage.userName
	}
	JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,datas,loadInfor)

	
}
function loadInfor(dt){
		console.log(2222);
		var res=$(dt).find("DataTable shen");
		res.each(function(){
			var startTime=$(this).find("ActualStart").text(),
				createTime=$(this).find("CreateTime").text(),
				company=$(this).find("PropId").text(),
				type=$(this).find("Type").text(),
				equipId=$(this).find("EquipId").text(),
				content=$(this).find("Content").text(),
				remark=$(this).find("Remark").text();
			typeName(type,content)
			$("#startTime").val(timeSplit(startTime));

			$("#startTask .startTime span").text(timeSplit(startTime))

			$("#createTime").val(timeSplit(createTime));

			$("#company").val(company);
			$("#equipId").val(equipId);
			
			$("#taskKind").val(type);
			$("#startTask .fixEquip span").text(equipId);
			$("#startTask .remark span").text(remark);
			$(".content span").text(content)
			
			getName(equipId);
		})
}
function typeName(type,content){
	console.log(content,type);
	if(type==0){
		$(".taskType span").text("巡查任务")
		$("#startTask .fixItem .item").hide();
		$("#startTask .line").hide();
		$("#startTask .conDev").hide();
		$("#startTask .remtit").hide();
		$("#startTask .submitConfig").hide();
		$("#bdNum").hide();
		$("#messDetail").hide();
		$("#remark").hide();
		$("#startTask .fixPro").hide();
		$("#startTask .creatTable").hide();
		$("#startTask .finished").show();
	}else if(type==1){
		$(".taskType span").text("定期维保");
		if(content=="半月维保"){
			$("#startTask .item").hide();
			$("#startTask .halfMon").show();
			$("#fixId").val(1)
		}else if(content=="季度维保"){
			$("#startTask .item").hide();
			$("#startTask .halfMon").show();
			$("#startTask .quarter").show();
			$("#fixId").val(2)
		}else if(content=="半年维保"){
			$("#startTask .item").hide();
			$("#startTask .halfMon").show();
			$("#startTask .quarter").show();
			$("#startTask .halfYear").show();
			$("#fixId").val(3)
		}else{
			$("#startTask .item").show();
			$("#fixId").val(4)
		}

	}else{
		$(".taskType span").text("维修任务");
		$("#startTask .proContent").show();
		$("#startTask .line").hide();
		$("#startTask .proContent").hide();
		$("#startTask .equipLi").show();
		$("#startTask .fixPro").hide();
		$("#startTask .creatTable").show();
		$("#startTask .saveBtn").hide()
		$("#startTask .fixItem  .item").hide();
		$("#startTask .finished").show();
		$(".finished").hide();
		// loadFix() 
	}

}
function getName(equipIdStr){
	var arr=equipIdStr.split(",");
	var name="";
	for(var i=0;i<arr.length;i++){
		$.ajax({
			type:"post",
			async:false,
			url:"/GWService.asmx/GetDataTableFromSQL",
			data:{
				sql:"select InternalNum from Dt_Equip where RegCode='"+arr[i]+"'",
				userName:window.localStorage.userName
			},success:function(dt){
				var res=$(dt).find("DataTable");
				$(res).find("shen").each(function(){
					var na=$(this).find("InternalNum").text();
					var html='<li ind="'+i+'" id="'+arr[i]+'">'+na+'</li>';
					name+=na+"  ";
					$("#startTask .equipLi ul").append(html);
				})
				
			}
		})
	}
	if(arr.length>1){
		$("#startTask .equipLi").show();
	}
	$("#startTask .internalNum span").text(name)
	$("#startTask .equipLi span").text(getNameOne(arr[0]));
	$("#nowFixEq").val(arr[0])
	var id=$(".codeNum span").text();
	loadMplc(id,arr[0])
	 
}
function getNameOne(equipId){
	var name="";
	$.ajax({
			type:"post",
			async:false,
			url:"/GWService.asmx/GetDataTableFromSQL",
			data:{
				sql:"select InternalNum from Dt_Equip where RegCode='"+equipId+"'",
				userName:window.localStorage.userName
			},success:function(dt){
				var res=$(dt).find("DataTable");
				$(res).find("shen").each(function(){
					var na=$(this).find("InternalNum").text();
					name=na;
				})
			}
		})
	return name;
}



function finishedTask(){
	var time=createtime();
	var id=$("#taskIdS").val();
	var task=$("#taskKind").val();
	if(task==0){
		console.log(2)
		$.ajax({
			url: '/GWService.asmx/ExecuteSQL',
			type: 'post',
			data: {
				sql: "update Dt_MaintTsk set Status=2,ActualEnd='"+time+"' where id="+id,
				userName:window.localStorage.userName
			},
			success:function(dt){
				var res=$(dt).find("int").text();
				if(res!=0){
					myApp.alert("操作成功","温馨提示");
					mainView.router.loadPage("taskList.html")
				}
			}
		})
	}
}
function taskFinished(){
		$("#qrcode").html("")
		var id=$("#taskIdS").val();
		var	taskKind=$("#taskKind").val();

		var serial=$(".codeNum span").text().toString();
		console.log(serial);
		var num=$("#nowFixEq").val();
		console.log(num);
		var typs=null;
			if(taskKind==1){
				typs=0
			}else if(taskKind==2){
				typs=1
			}else{
				typs=2
			}
			//没有维保单
		// if(taskKind!=0){
			//有维保单
			console.log(taskKind+num) 
			var serialNum=serial+num,// 保单编号
			maintTime=createDate(),// 维保日期
			fixedResult=saveFixItem(),// 定期保养项目结果
			endTime=createtime(),// 结束时间
			fault=$("#messDetail").val(),// 维修故障现象
			remark=$("#remark").val(),// 其它记录或备注
			type=typs,// 服务性质
		    propCo=$("#company").val(),// 使用公司
		 	notTime=$("#createTime").val(),//通知时间
			startTime=$("#startTime").val(),//开始时间
			// MaintSign=123;
			MaintSign=imgUpload(serialNum);// 维保人签名;

			var eqNum=$("#nowFixEq").val();
			$("#serialNum").val(serialNum);
			$("#bdNum span").text(serialNum)
			jQuery('#qrcode').qrcode({
				render:"canvas",
				width:100,
				height:100,
				text:id+"##"+eqNum
			})
			console.log(id+"##"+eqNum)
			var data={
				sql:"insert into Dt_MaintPlc (SerialNum,MaintTime,PropCo,NotTime,StartTime,EndTime,Type,FixedResult,Fault,Remark,MaintSign) values ('"+serialNum+"','"+maintTime+"','"+propCo+"','"+notTime+"','"+startTime+"','"+endTime+"','"+type+"','"+fixedResult+"','"+fault+"','"+remark+"','"+MaintSign+"')",
				userName:window.localStorage.userName
			}
			
			console.log(data.sql);
			JQajaxo("post","/GWService.asmx/ExecuteSQL",false,data,sucSub);
			timer=setInterval(function(){
				getSure()
			},2000)
			
}
function saveFixItem(){

	var length=$("#startTask .item").length;
	var fixId=$("#fixId").val();
	console.log(fixId)
	var fixedItem=[];
		if(fixId==4){//年度维护
			console.log(4);
			for(var i=0;i<length;i++){
				var res=$("#startTask .item").eq(i).find("span").attr("res");
				fixedItem.push(res)
			}
			// console.log(fixedItem.toString());
		}else if(fixId==3){//半年
			console.log(2);
			var fixedItemResult=-1;
			var indexLength=$("#startTask .item.halfYear").length;
			var index=$("#startTask .item.halfYear").eq(indexLength-1).index();
			for(var i=0;i<length;i++){
				if(i<=index){
					var res=$("#startTask .item").eq(i).find("span").attr("res");
					// console.log();
					fixedItem.push(res)
				}
				// else{
				// 	fixedItem.push(fixedItemResult)
				// }
			}
			// console.log(fixedItem.toString());
		}else if(fixId==2){//季度
			console.log(1);
			var fixedItemResult=-1;
			var indexLength=$("#startTask .item.quarter").length;
			var index=$("#startTask .item.quarter").eq(indexLength-1).index();
			for(var i=0;i<length;i++){
				if(i<=index){
					var res=$("#startTask .item").eq(i).find("span").attr("res");
					fixedItem.push(res)
				}
				// else{
				// 	fixedItem.push(fixedItemResult)
				// }
			}
			// console.log(fixedItem.toString());
		}else if(fixId==1){
			console.log(0);
			var fixedItemResult=-1;
			var indexLength=$("#startTask .item.halfMon").length;
			var index=$("#startTask .item.halfMon").eq(indexLength-1).index();
			// console.log(index);
			for(var i=0;i<length;i++){
				if(i<=index){
					var res=$("#startTask .item").eq(i).find("span").attr("res");
					fixedItem.push(res)
				}
				// else{
				// 	fixedItem.push(fixedItemResult)
				// }
			}
		}
		return fixedItem;
}
function sucSub(dt){
	console.log(dt);
	var res=$(dt).find("int").text();
	if(res!=0){
		$("#startTask .item").each(function(){
				$(this).addClass("disabled");
		})
		$(".submitConfig").addClass("disabled");
		$(".creatTable").hide();
		myApp.alert("此电梯保单生成,请安全人员确认","温馨提示");
		
	}
}
function getSure(){
	var id=$("#taskIdS").val();
	var equ=$("#equipId").val();
	var nowEqu=$("#nowFixEq").val();
	var serNum=$("#bdNum span").text();
	console.log(serNum);
	$.ajax({
		type:"post",
		url:"/GWService.asmx/GetDataTableFromSQL",
		data:{
			sql:"select EquipId,PlcId from Dt_MaintTsk where id="+id,
			userName:window.localStorage.userName
		},success:function(dt){
			console.log(dt)
			// var equiId=[];
			var wbd="";
			var res=$(dt).find("DataTable");
			$(res).find("shen").each(function(){
					// equiId=$(this).find('EquipId').text().split(",");
					wbd=$(this).find("PlcId").text();
					console.log(wbd);
					if(wbd!=""&&wbd.indexOf(serNum)!=-1){
							myApp.alert("此电梯维保单已经确认","温馨提示")
							clearInterval(timer);
					}
			})
			// if(wbd!=0){
			// 	for(var i=0;i<equiId.length;i++){
			// 		if(equiId[i]==nowEqu&&wbd[i]!=""){
			// 			myApp.alert("安全人员已经确认","温馨提示")
			// 			clearInterval(timer);
			// 		}
			// 	}
			// }
			
		}

	})
}

function dataURItoBlob(base64Data) {
	var byteString;
	if (base64Data.split(',')[0].indexOf('base64') >= 0)
	byteString = atob(base64Data.split(',')[1]);
	else
	byteString = unescape(base64Data.split(',')[1]);
	var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
	ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ia], {type:mimeString});
}
function imgUpload(serialNum){
	var url;
	var appkeys;
	var blob = dataURItoBlob($('.js-signature').jqSignature('getDataURL')); 
	var canvas = document.createElement('canvas');
	var dataURL = canvas.toDataURL('image/jpeg', 0.5);
	var fd = new FormData(document.forms[0]);
	fd.append("the_file", blob, 'image'+serialNum+'.png');
     $.ajax({
		type:"POST",
	    url:"/api/server/getkey",
	    async:false,
	    timeout:5000,
	    data:{
	        username:"admin",
	        userpwd:"admin"
	    },
	    success:function(dt){
	    	appkeys=dt.HttpData.data.appkey+"-"+dt.HttpData.data.infokey
	    }
	});
	$.ajax({
            type: 'post',
            url: '/api/other/upload',
            headers: {
               Authorization:appkeys
            },
            async:false,
            data:fd,
            cache: false,
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false, // 不设置Content-type请求头
            success: function (dt) {
            	if(dt.HttpData.code=200&&dt!=""){
            		url=dt.HttpData.data[0]
            
            	}

            }
         });
	return url;

}
function letInput(){
	// $("body").css({"background":"red"})
	$(".page-content").css({"overflow":"hidden"})
	// $("html").css({"overflow":"hidden"})
	myApp.pickerModal('.write')

	var wp = new WritingPad();
	 $('.js-signature').jqSignature('clearCanvas');

}















function wb(){
	$("#startTask .item").hide();
	$("#startTask .halfMon").show();
	// 选项下拉
	$("#startTask .item .txt").each(function(){
		$(this).click(function(){
			var isShow=$(this).siblings("ul").css("display");
			if(isShow=="block"){
				$(this).removeClass("openRadious");
				$(this).siblings("ul").hide();
			}else{
				$(this).siblings("ul").show();
				$(this).addClass("openRadious");
			}
		})
	})
	$("#startTask .item ul li").each(function(){
		$(this).click(function(){
			$(this).parent().siblings(".txt").find("span").text($(this).text()).attr("res",$(this).attr("res"))
			$(this).parent().hide().siblings(".txt").removeClass("openRadious");
		})
	})
	// 获取开始时间和使用公司,维保
	var id=$("#taskIdS").val();
	$("#startTask .codeNum span").text(PrefixInteger(id, 10));

	var datas={
		sql:"select CreateTime,PropId,ActualStart,Type,EquipId,Content,Remark from Dt_MaintTsk where ID='"+id+"'",
		userName:window.localStorage.userName
	}
	JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,datas,_sucInfor)


	// hakfakjfk
	$("#startTask .equipLi ul").delegate("li","click",function(){
		$("#startTask .item .txt span").text("正常").attr("res","0")
		$(this).parent().hide();
		var text=$(this).text();
		var ind=$(this).attr("ind");
		$(this).parents(".equipLi").find("span").text(text).attr("ind",ind);

		$("#nowFixEq").val($(this).attr("id"));
			//加载当前的维保单
		getPlcDetail(text);
	})
}
function getPlcDetail(text){
	$("#messDetail").val("");
	$("#remark").val("");
	$("#bdNumHas").hide();
	$("#startTask .item").each(function(){
		$(this).removeClass("disabled");
	})
	$("#myImg").html("");
	$("#qrcode").html("");
	$("#bdNum").show();
	$("#messDetail").removeClass("disabled");
	$("#remark").removeClass("disabled");
	$(".submitConfig").removeClass("disabled");
	$(".creatTable").removeClass("disabled");
	var id=$("#taskIdS").val();
	var eqIdArr=[];
	var mainArr=[];
		$.ajax({
			type:"post",
			url:"/GWService.asmx/GetDataTableFromSQL",
			async:false,
			data:{
				sql:"select EquipId,PlcId from Dt_MaintTsk where id="+id,
				userName:window.localStorage.userName
			},success:function(dt){
				var res=$(dt).find("DataTable");
				$(res).find("shen").each(function(){
					eqIdArr=$(this).find("EquipId").text().split(",");
					mainArr=$(this).find("PlcId").text().split(",");
				})
			}
		})
	for(var i=0;i<eqIdArr.length;i++){
		if(eqIdArr[i]==text&&mainArr[i]!=""&&mainArr[i]){
			console.log(mainArr[i])
			$("#bdNumHas").show();
			$("#bdNumHas span").text(mainArr[i])
			$("#startTask .item").each(function(){
				$(this).addClass("disabled");
			})
			// $("#startTask .menu").addClass("disabled");
			$("#messDetail").addClass("disabled");
			$("#remark").addClass("disabled");
			$(".submitConfig").addClass("disabled");
			$(".creatTable").addClass("disabled");
			$("#bdNum").hide();
			// creatTable
			loadMain(mainArr[i])
		}
	}
	//加载当前已有保单

}
function loadMain(bdNumHas){
	$.ajax({
		type:"post",
		url:"/GWService.asmx/GetDataTableFromSQL",
		data:{
			sql:"select Fault,Remark,MaintSign from Dt_MaintPlc where SerialNum='"+bdNumHas+"'",
			userName:window.localStorage.userName
		},success:function(dt){
			console.log(dt)
			var res=$(dt).find("DataTable");
			$(res).each(function(){
				var Fault=$(this).find("Fault").text(),
					Remark=$(this).find("Remark").text(),
					MaintSign=$(this).find("MaintSign").text();
				$("#messDetail").val(Fault);
				$("#remark").val(Remark);
				$("#myImg").html('<img src="/FileUpload/' +MaintSign+'" />')
				
			})
		}
	})
}

function _sucInfor(dt){
	console.log(dt);
	var res=$(dt).find("DataTable shen");
	res.each(function(){
		var startTime=$(this).find("ActualStart").text(),
			createTime=$(this).find("CreateTime").text(),
			company=$(this).find("PropId").text(),
			type=$(this).find("Type").text(),
			equipId=$(this).find("EquipId").text(),
			content=$(this).find("Content").text(),
			remark=$(this).find("Remark").text();
			// window.localStorage.setItem("equipId",equipId);
		$("#startTime").val(timeSplit(startTime));
		$("#startTask .startTime span").text(timeSplit(startTime))
		$("#createTime").val(timeSplit(createTime));
		$("#company").val(company);
		$("#equipId").val(equipId);
		if(content=="半月维保"){
			$("#fixId").val(1);
		}else if(content=="季度维保"){
			$("#fixId").val(2);
		}else if(content=="半年维保"){
			$("#fixId").val(3);
		}else if(content=="年度维保"){
			$("#fixId").val(4);
		}
		$("#taskKind").val(type);
		$("#startTask .fixEquip span").text(getRegCode(equipId));
		// equipId
		$("#startTask .content span").text(content);
		$("#startTask .remark span").text(remark);
		var equipArr=equipId.split(",")
		// $("#startTask .equipLi span").text(equipArr[0]);
		$("#startTask .equipLi span").text(getRegCode(equipArr[0]));
		$("#nowFixEq").val(equipArr[0]);
		getPlcDetail(equipArr[0]);
		// var arr=[];
		for(var i=0;i<equipArr.length;i++){
			var html='<li ind="'+i+'" id="'+equipArr[i]+'">'+getRegCode(equipArr[i])+'</li>';
			// +equipArr[i]
			$("#startTask .equipLi ul").append(html);
			// arr.push("")
		}
		// window.localStorage.setItem("resArr",arr);
		taskLoad(type,content);
		getName(equipId);
	})
	//加载设备的内部编号

}


function taskLoad(type,content){
	if(type==0){//巡查任务
		$("#startTask .taskType span").text("巡查任务");
		$("#startTask .fixItem .item").hide();
		$("#startTask .line").hide();
		$("#startTask .conDev").hide();
		$("#startTask .remtit").hide();
		$("#messDetail").hide();
		$("#remark").hide();
		$("#startTask .fixPro").hide();
		$("#startTask .creatTable").hide();
		$("#startTask .finished").show();
	};
	if(type==1){
		$("#startTask .taskType span").text("定期维保");
		$("#startTask .proContent").show();
		if(content=="半月维保"){
			$("#startTask .item").hide();
			$("#startTask .halfMon").show();
		}else if(content=="季度维保"){
			$("#startTask .item").hide();
			$("#startTask .halfMon").show();
			$("#startTask .quarter").show();
		}else if(content=="半年维保"){
			$("#startTask .item").hide();
			$("#startTask .halfMon").show();
			$("#startTask .quarter").show();
			$("#startTask .halfYear").show();
		}else{
			$("#startTask .item").show();
		}
	};
	if(type==2){
		$("#startTask .taskType span").text("维修任务");
		$("#startTask .proContent").show();
		// $("#startTask .line").hide();
		
		$("#startTask .proContent").hide();
		$("#startTask .equipLi").show();
		$("#startTask .fixPro").hide();
		$("#startTask .creatTable").show();
		$("#startTask .saveBtn").hide()
		$("#startTask .fixItem  .item").hide();
		// $("#startTask .finished").show();
	}

}
//维修项结果类型选择
function checkPro(dom){
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





// function finishedTask(){
// 	var id=$("#taskIdS").val();
// 	var type=$("#taskTypeS").val();
// 	var taskKind=$("#taskKind").val();
// 	// var img=$("#startTask .imgBox img").attr("src");,Pic='"+img+"'
// 	//判断安全员是否扫描确认任务
// 	var data;
// 	// console.log()
// 	if(type=0){//维保
// 		var time=createtime();
// 		data={
// 			sql:"update Dt_MaintTsk set Status=2,ActualEnd='"+time+"' where id="+id,
// 			userName:window.localStorage.userName
// 		}

// 	}else{//物业
// 		var time=createtime();
// 		data={
// 			sql:"update Dt_PatrolTsk set Status=2,ActualEnd='"+time+"' where id="+id,
// 			userName:window.localStorage.userName
// 		}

// 	}
// 	JQajaxo("post","/GWService.asmx/ExecuteSQL",true,data,sucXc)
// }
function sucXc(dt){
	var res=$(dt).find("int").text();
	if(res!=0){
		myApp.alert("操作成功","温馨提示");
		mainView.router.loadPage("taskList.html")
		
	}
}





// 1521623544000
