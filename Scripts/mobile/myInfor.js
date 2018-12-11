
function myInfor() {
	toolbarActive('mineTool');
	InitEnsure();
	// 获取人员关系
	var id=null,type=null,ppId=null;
	$.ajax({
		type:"post",
		url:"/GWService.asmx/GetDataTableFromSQL",
		async:false,
		data:{
			sql:"select * from Dt_Account where Username='"+window.localStorage.userName+"'",
			userName:window.localStorage.userName
		},
		success:function(dt){
			console.log(dt);
			var res=$(dt).find("DataTable");
			$(res).find("shen").each(function(){
				type=$(this).find("Type").text();
				ppId=$(this).find("PpId").text();
				id=$(this).find("Id").text()
			})
		}
	})
	var sql="";
	if(type==0){
		sql="select a.Name,a.Photo,a.BonusPoint,a.Type,b.CompName from Dt_MaintPpl a left join Dt_MaintCo b on a.CompId=b.Id where a.ID='"+ppId+"'";
	}else if(type==1){
		sql="select a.Name,a.Photo,a.BonusPoint,a.Type,b.CompName from Dt_PropertyPpl a left join Dt_PropertyCo b on a.CompId=b.Id where a.ID='"+ppId+"'";
	}else{
		sql="select * from Dt_GovPpl where id='"+ppId+"'";
		
	}
	var data={
		sql:sql,
		userName:window.localStorage.userName
	}
	$.ajax({
		type:"post",
		url:"/GWService.asmx/GetDataTableFromSQL",
		async:false,
		data:data,
		success:function(dt){
			var res = $(dt).find('DataTable'); 
				$(res).find("shen").each(function() {
					var photo=$(this).find("Photo").text();
					if(photo!=""){
						$("#myInfor .headImg img").attr("src",photo);
					}
					var name=$(this).find("Name").text();
					var comp=$(this).find("CompName").text();
					var score=$(this).find("BonusPoint").text();
					var typ=$(this).find("Type").text();
					var juridic=$(this).find("Juridic").text();
					$("#myInfor .name").text(name);
					
					$("#myInfor .comp").text(comp);
					$("#myInfor .grade span").text(score)
					if(type==0){
						if(typ==0){
							$("#myInfor .rol").text("维保管理");
						}else{
							$("#myInfor .rol").text("维保人员");
						}
					}else if(type==1){
						if(typ==0){
							$("#myInfor .rol").text("物业管理");
						}else{
							$("#myInfor .rol").text("物业人员");
						}
					}else{
						$("#myInfor .rol").text("政府人员");
						$("#myInfor .comp").text(juridic);
						$("#myInfor .grade").hide()
					}
				})
			}
	})

}


