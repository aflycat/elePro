function postSubmit(){
		InitEnsure()
	// postSubmit()
	var _data={
		sql:"select * from Dt_Account where username='"+window.localStorage.userName+"'",
		userName:window.localStorage.userName
	}
	// console.log(_data);
	JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",false,_data,_sucDeal)
}
function _sucDeal(dt){
	// console.log(dt);
	var res=$(dt).find("DataTable");
	$(res).find("shen").each(function(){
		// 1.根据用户名查询用户id
		var Ppid=$(this).find("PpId").text();
		var _data={
				sql:"select * from Dt_MaintPpl where Id='"+Ppid+"'",
				userName:window.localStorage.userName
		}
		JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,_data,_sucInfors)
	})
}
function _sucInfors(dt){
// console.log(dt);
	var res=$(dt).find("DataTable");
	$(res).find("shen").each(function(){
		// 2.根据用户id查询公司id
		var Ppid=$(this).find("CompId").text();

		//3.查询该公司下的故障电梯
		// var _datas={
		// 	sql:"select * from dt_fault where equipid in (select id from dt_equip where maintid ='"+Ppid+"')",
		// 	userName:window.localStorage.userName
		// }
		var _datas={
			sql:"select *,'Complaint' as type from Dt_Complaint where equipid in (select id from dt_equip where maintid ='"+Ppid+"') union  select *,'falut' as type from dt_fault where equipid in (select id from dt_equip where maintid ='"+Ppid+"')",
			userName:window.localStorage.userName
		}
		// console.log(_datas)
		JQajaxo("post","/GWService.asmx/GetDataTableFromSQL",true,_datas,_sucprodt)

	})
}
function _sucprodt(dt){
	console.log(dt);
	$("#postSubmit .page-content").html("")
	var res=$(dt).find("DataTable");
	
	$(res).find("shen").each(function(){
		
		var html="",timeHtm="",dateHtml="",result="",btnHtml="",titHtml="",iconHtml="",addr=1;
		var time=$(this).find("SubmitTime").text();
		var equipId=$(this).find("EquipId").text();
		var id=$(this).find("Id").text();
		var thingType=$(this).find("type").text();
		$.ajax({
			type:"post",
			url:"/GWService.asmx/GetDataTableFromSQL",
			async:false,
			data:{
				sql:"select InstallAddr from Dt_Equip where Id='"+equipId+"'",
				userName:window.localStorage.userName
			},
			success:function(dts){
			
				addr=$(dts).find("DataTable").find("InstallAddr").text();
			}
		})
		
		var stats=$(this).find("Result").text();
		dateHtml=time.split("T")[0];
		if(thingType=="falut"){
			
			iconHtml='icon-weixiugongju';
			titHtml='<span>电梯报障</span>';
			taskClass=0;
		}else{
			iconHtml='icon-web-support';
			titHtml='<span>电梯投诉</span>';
			taskClass=1;
		}
		if(stats=="0"){
			timeHtm='<span class="redColor">'+time.split("T")[1].split("+")[0]+'</span>';
			resultHtm='<p class="res redColor" >未处理</p>';
			btnHtml='<p class="btnWrap">'+
							'<a href="postDeal.html?tabId='+id+'&equId='+equipId+'&taskClass='+taskClass+'" class="btn">去处理</a>'+
						'</p>';
		}else{
			timeHtm='<span class="huiColor">'+time.split("T")[1].split("+")[0]+'</span>'
			resultHtm='<p class="res greenColor" >已处理</p>';
			btnHtml='<a href="postDeal.html?tabId='+id+'&equId='+equipId+'&taskClass='+taskClass+'" class="btn">去查看</a>'
		}
		
			html='<div class="card">'+
						'<div class="card-footer">'+
							'<a href="#" class="kind">'+
								'<i class="icon iconfont '+iconHtml+'"></i>'+
								titHtml+
							'</a>'+
							'<a href="#" class="time">'+
								timeHtm+
								'&nbsp;<span class="huiColor">'+dateHtml+'</span>'+
							'</a>'+
						'</div>'+
						'<div class="card-content">'+
							'<div class="card-content-inner">'+
								'<div class="leftCon">'+
									'<p>电梯设备号:<span>'+getRegCode(equipId)+'</span></p>'+
									'<p>地址:<span>'+addr+'</span></p>'+
								'</div>'+
								'<div class="rightSta">'+
									resultHtm+
									btnHtml+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>';
			stats=="0"?$("#postSubmit .page-content").prepend(html):$("#postSubmit .page-content").append(html)
	})
}
function onlySub(id,dom){
	$.ajax({
		type:"post",
		url:"/GWService.asmx/ExecuteSQL",
		data:{
			sql:"update Dt_Fault set Result='1' where id='"+id+"'",
			userName:window.localStorage.userName
		},
		success:function(dt){
			// console.log(dt);
			var res=$(dt).find("int").text();
			if(res!=0){
				$(dom).hide().parent().siblings(".res").addClass("greenColor").text("已处理");
				$(dom).siblings().text("去查看");
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