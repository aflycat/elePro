function lookMplc(){

	var id=$("#loTaskId").val();
	var eqIdArr=[];
		var mainArr=[];
		$.ajax({
			type:"post",
			url:"/GWService.asmx/GetDataTableFromSQL",
			async:false,
			data:{
				sql:"select EquipId,PlcId,Type from Dt_MaintTsk where id="+id,
				userName:window.localStorage.userName
			},success:function(dt){
				console.log(dt)
				var res=$(dt).find("DataTable");
				$(res).find("shen").each(function(){
					eqIdArr=$(this).find("EquipId").text().split(",");
					mainArr=$(this).find("PlcId").text().split(",");
					var Type=$(this).find("Type").text();
					if(Type==2){
						$("#lookMplc .fixItem").hide();
						$("#lookMplc .fixPro").hide();
					}
					$("#lookMplc .fixEquip span").text($(this).find("EquipId").text() )
					var str=eqIdArr.toString();
					getName(eqIdArr)
				})
				for(var i=0;i<eqIdArr.length;i++){
				var html='<li ind="'+i+'">'+eqIdArr[i]+'</li>';
					$("#lookMplc .proList").append(html);	
				}
				$("#lookMplc .equipLi span").text(eqIdArr[0]);
				// console.log(eqIdArr[0]);
				getPlcDetail(mainArr[0])
			}
		})

	$("#lookMplc .equipLi ul").delegate("li","click",function(){
		$("#lookMplc .item .txt span").text("确认正常").attr("res","0")
		$(this).parent().hide();
		var text=$(this).text();
		$(this).parents(".equipLi").find("span").text(text)
		$("#nowFixEq").val($(this).text());
		for(var i=0;i<eqIdArr.length;i++){
			if(eqIdArr[i]==text){
				 getPlcDetail(mainArr[i]);			//加载当前的维保单
			}

		}
	})

}


function getName(arr){
	
	var name="";
	for(var i=0;i<arr.length;i++){
		$.ajax({
			type:"post",
			url:"/GWService.asmx/GetDataTableFromSQL",
			async:false,
			data:{
				sql:"select a.InternalNum,b.CompName from Dt_Equip a left join Dt_PropertyCo b on a.PropId=b.Id  where a.RegCode='"+arr[i]+"'",
				userName:window.localStorage.userName
			},success:function(dt){
				console.log(dt);
				var res=$(dt).find("DataTable");
				$(res).find("shen").each(function(){
					name+=$(this).find("InternalNum").text()+" ";

					$("#lookMplc .wyCom span").text($(this).find("CompName").text())
				})
			
				// console.log(dt)
			}
		})
	}
	$("#lookMplc .sbCode span").text(name)	
	
}
function getPlcDetail(id){
	console.log(id)
	id!=""&&id?$("#lookMplc .codeNum span").text(id):$("#lookMplc .codeNum span").text("");
	$("#lookMplc .falutIn  span").text("");
	$("#lookMplc .remarkIn  span").text("");
	$("#propSign img").attr("src","");
	$("#maintSign img").attr("src","");
	// var id=$("#taskIdS").val();
	var fixItemArr=[];
	// var mainArr=[];
		$.ajax({
			type:"post",
			url:"/GWService.asmx/GetDataTableFromSQL",
			async:false,
			data:{
				sql:"select * from Dt_MaintPlc where SerialNum='"+id+"'",
				userName:window.localStorage.userName
			},success:function(dt){
				console.log(dt)
				var res=$(dt).find("DataTable");
				$(res).find("shen").each(function(){
					fixItemArr=$(this).find("FixedResult").text().split(",");
					var  	PropSign=$(this).find("PropSign").text(),
						MaintSign=$(this).find("MaintSign").text(),
						Fault=$(this).find("Fault").text(),
						Remark=$(this).find("Remark").text();
						$("#lookMplc .falutIn  span").text(Fault);
						$("#lookMplc .remarkIn  span").text(Remark);
						$("#propSign img").attr("src","/FileUpload/"+PropSign);
						$("#maintSign img").attr("src","/FileUpload/"+MaintSign);

				})
				$("#lookMplc .fixItem .item").each(function(i){

					if(fixItemArr[i]=="0"){
						$(this).find(".txt span").text("确认正常")
					}else if(fixItemArr[i]=="1"){
						$(this).find(".txt span").text("调整整备")
					}else if(fixItemArr[i]=="2"){
						$(this).find(".txt span").text("要修理等")
					}else if(fixItemArr[i]=="3"){
						$(this).find(".txt span").text("非本次检查")
					}else if(fixItemArr[i]=="4"){
						$(this).find(".txt span").text("无此项目")
					}
					
					
				})
				// console.log(dt)
			}
		})


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
function sharMplc(){
	var mplcNum=$("#lookMplc .codeNum span").text();
	console.log()
	if(mplcNum!=""){
		$.ajax({
			url: '/api/valex/exportplc?code='+mplcNum,
			type: 'get',
			success:function(dt){
				console.log(dt)
				if(dt.HttpStatus==200&&dt.HttpData!=""){
					var imgUrl=JSON.parse(dt.HttpData).Message;
					url = window.location.host;
					$("#srcStr").text(url+imgUrl)
					myApp.pickerModal('.picker-info');
				} 
				
			}
		})
		
	}else{
		myApp.alert("该任务未完成,不能分享","温馨提示")		
	}

}
