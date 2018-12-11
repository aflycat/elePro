function EdictInfor(){
	InitEnsure();
	// 获取人员关系
	var _data={
		sql:"select * from Dt_Account where Username='"+window.localStorage.userName+"'",
		userName:window.localStorage.userName
	}
	JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,_data,_sucAccount)
	function _sucAccount(data){
		console.log(data);
		var Typ=null,PpId=null;
 		var dt = $(data).find('DataTable'); 
		$(dt).find("shen").each(function() {
			PpId=$(this).find('PpId').text();
			Typ=$(this).find('Type').text();
		})
	//获取人员信息
	var Sql=null;
	if(Typ=="0"){
		Sql="select * from Dt_MaintPpl where Id='"+PpId+"'"//维保
	}else if(Typ=="1"){
		Sql="select * from Dt_PropertyPpl where Id='"+PpId+"'"//物业
	}else if(Typ=="2"){
		Sql="select * from Dt_GovPpl where Id='"+PpId+"'"//政府
	}

    var data={
      	sql:Sql,
		userName:window.localStorage.userName
    }

    JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,data,_sucInfor)
    function _sucInfor(dt){
    	console.log(dt);
    	var res= $(dt).find('DataTable');
    	$(res).find("shen").each(function() {
    		$("#EdictInfor .name").text($(this).find('Name').text());//姓名
    		var Sex=$(this).find('Sex').text()
    		if(Sex=="1"){
				$("#EdictInfor .sex").text("女")
			}else{
				$("#EdictInfor .sex").text("男")

			}
			$("#EdictInfor .age").text($(this).find('Age').text());
			$("#EdictInfor .idCard").text($(this).find('IdCard').text());
			$("#EdictInfor .tel").text($(this).find('Tel').text());
    		var type=$(this).find('Type').text();//人员类型
    		comId= $(this).find('CompId').text();//公司id
			var Sql2=null;
			if(Typ=="0"){
				Sql2="select * from Dt_MaintCo where Id='"+comId+"'"//维保
			}else if(Typ=="1"){
				Sql2="select * from Dt_PropertyCo where Id='"+comId+"'"//物业
			}else if(Typ=="2"){
				Sql2="select * from Dt_GovPpl where Id='"+comId+"'"//政府
			}
			var datas={
					sql:Sql2,
					userName:window.localStorage.userName
			}
		   	if(Typ=="0"){
				if(type=="1"){
					$("#EdictInfor .type").text("维保人员");
				}else{
					$("#EdictInfor .type").text("管理人员");
				}
				$("#EdictInfor .compCard").text($(this).find('CompId').text());
				$("#EdictInfor .grade").text($(this).find('BonusPoint').text());
				JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,datas,_sucComInfor)
			}else if(Typ=="1"){
				if(type=="1"){
					$("#EdictInfor .type").text("巡查人员");
				}else{
					$("#EdictInfor .type").text("管理人员");
				}
				$("#EdictInfor .compCard").text($(this).find('CompId').text());
				
				$("#EdictInfor .compCard").text($(this).find('BonusPoint').text());
				$("#EdictInfor .grade").text($(this).find('BonusPoint').text());
				JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,datas,_sucComInfor)
			}else if(Typ=="2"){
				$("#EdictInfor .type").text("政府人员");
				$("#EdictInfor .comp").text($(this).find('Juridic').text())
				$("#EdictInfor .comp").siblings(".itemHead").text("管辖范围")
				$("#EdictInfor .grade").parents("ul").hide();
				$("#EdictInfor .compCard").parents("li").hide();
			}
		})
    }
	}


	

}
function _sucComInfor(dt){

	var res = $(dt).find('DataTable'); 
	$(res).find("shen").each(function() {
		$("#EdictInfor .comp").text($(this).find('CompName').text());
		
	})
}

