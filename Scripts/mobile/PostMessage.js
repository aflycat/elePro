function PostMessage(){

	InitEnsure();
	$("#PostMes .proList li").each(function(){
		$(this).off().click(function(){
			$(this).parent().hide();
			$(this).parent().siblings(".menu").find("span").text($(this).text());
			$(this).parent().siblings(".menu").find("i").removeClass("icon-web-triangle-top").addClass("icon-web-triangle-bottom");
		})
	});

	$("#imgUp").change(function(event){
		var appkeys=null;
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
		var imgUrl=null;
		var files = $("#imgUp")[0].files;
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
           var name=files[i].name;
            formData.append('file', files[i],getTimesStamp()+name);
        }
	$.ajax({
            type: 'post',
            url: '/api/other/upload',
            headers: {
               Authorization:appkeys
            },
            async:false,
            data: formData,
            cache: false,
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false, // 不设置Content-type请求头
            success: function (dt) {
            	if(dt.HttpData.code=200&&dt!=""){
            		var imgHtm='<img src="/FileUpload/'+dt.HttpData.data[0]+'" style="width:100%;height:100%;position:absolute;display: block;left: 0;top: 0;z-index: 3;" />'
            		$("#PostMes .imgBox").append(imgHtm)
            	}

            }
         });

})
}
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
	// var objUrl = getObjectURL(this.files[0]) ;
	// 	if (objUrl) {

	// 		$("#upImg").attr("src", objUrl) ;
			
	// 	}

	// })
// function getObjectURL(file) {
// 	var url = null ;
// 	if (window.createObjectURL!=undefined) { // basic
// 		url = window.createObjectURL(file) ;
// 	} else if (window.URL!=undefined) { // mozilla(firefox)
// 		url = window.URL.createObjectURL(file) ;
// 	} else if (window.webkitURL!=undefined) { // webkit or chrome
// 		url = window.webkitURL.createObjectURL(file) ;
// 	}
// 	return url
// }

function upLoadMes(){
	
		var time=createtime();
 		var submitter=$("#PostMes  .nameVal").val() ,
 			content=$("#PostMes .menu span").text(),
 			remark=$("#messDetail").val(),
 			tel=$("#PostMes  .telVal").val(),
 			equipId=$("#trueId").val() ,
 			inputId=$("#searchInp").val(),
 			pic=$("#PostMes .imgBox img").attr("src");

 		if(equipId!=""){//扫描识别
 			var _data={
				sql:"insert into Dt_Complaint (SubmitTime,Submitter,Content,Remark,EquipId,Tel,Pic) values('"+time+"',"+"'"+submitter+"',"+"'"+content+"',"+"'"+remark+"',"+"'"+equipId+"',"+"'"+tel+"',"+"'"+pic+"'"+ ")",
				userName:window.localStorage.userName
			}
			JQajaxo("post","/GWService.asmx/ExecuteSQL",false,_data,_successmes);
 		}else{//手动输入
 			// myApp.alert("电梯识别码不能为空","温馨提示")
 			var shou=getEqID(inputId);
 			console.log(shou)
 			if(shou){
 				var _data={
					sql:"insert into Dt_Complaint (SubmitTime,Submitter,Content,Remark,EquipId,Tel,Pic) values('"+time+"',"+"'"+submitter+"',"+"'"+content+"',"+"'"+remark+"',"+"'"+shou+"',"+"'"+tel+"',"+"'"+pic+"'"+ ")",
					userName:window.localStorage.userName
				}
				JQajaxo("post","/GWService.asmx/ExecuteSQL",false,_data,_successmes);
 			}else{
 				myApp.alert("电梯识别码不正确","温馨提示")
 			}

 		// 	var _data={
			// 	sql:"insert into Dt_Complaint (SubmitTime,Submitter,Content,Remark,EquipId,Tel,Pic) values('"+time+"',"+"'"+submitter+"',"+"'"+content+"',"+"'"+remark+"',"+"'"+equipId+"',"+"'"+tel+"',"+"'"+pic+"'"+ ")",
			// 	userName:window.localStorage.userName
			// }
			// JQajaxo("post","/GWService.asmx/ExecuteSQL",false,_data,_successmes);
 		}
		

	
}
function getEqID(DT){
	var trueId;
	console.log(DT)
     $.ajax({
        type:"post",
        url:"/GWService.asmx/GetDataTableFromSQL",
        async:false,
        data:{
            sql:"select top 1 Id from Dt_Equip where RegCode='"+DT+"'",
            userName:window.localStorage.userName
        },success:function(dt){
            var res=$(dt).find("DataTable");
            $(res).find("shen").each(function(){
                console.log(dt)
                var id=$(this).find("Id").text();
                trueId=id
                // myApp.alert(id)
            })
        }
        
    })
     return trueId;
}

function _successmes(dt){
		var res=$(dt).find("int").text();
		if(res=="1"){
			$("#PostMes .postBtn").addClass("disabled");
			myApp.alert("提交成功","温馨提示")
			mainView.router.loadPage("PostThing.html")
		}else{
			myApp.alert("提交失败","温馨提示")

		}
}
