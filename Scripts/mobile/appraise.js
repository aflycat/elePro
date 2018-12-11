function appraise(){
	
$("#appraise .rate i").each(function(i){
		var length=$("#appraise .rate i").length;
		var ind=null;
		$(this).click(function(){
			ind=$(this).index();
			addxi(ind)
		})		
	})
// $("#searchInpEq").bind("input",function(){
// 	$("#apraId").val($(this).val())
// })

$("#appraise .btn p").click(function(){
		var regCode=$("#aEquiNum").val(),
			taskId=$("#searchInpEq").val(),
			grase=$("#appraise .icon-iconfontxingxing").length,
			appraise=$("#appraise .messDetail").val(),
			SerialNum=PrefixInteger($("#searchInpEq").val(),10)+regCode,
			dataUrl=imgUpload(),
			acturTimeEnd=createtime();

		// console.log(SerialNum);
		var eqIdArr=[];
		var mainArr=[];
		$.ajax({
			type:"post",
			url:"/GWService.asmx/GetDataTableFromSQL",
			async:false,
			data:{
				sql:"select EquipId,PlcId from Dt_MaintTsk where id="+taskId,
				userName:window.localStorage.userName
			},success:function(dt){
				console.log(dt)
				var res=$(dt).find("DataTable");
				$(res).find("shen").each(function(){
					eqIdArr=$(this).find("EquipId").text().split(",");
					mainArr=$(this).find("PlcId").text().split(",");
				})
				
			}
		})
		var num=0;
		for(var i=0;i<mainArr.length;i++){
			if(mainArr[i]!=""&&mainArr[i]){
				num++;
			}
		}
		for(var i=0;i<eqIdArr.length;i++){
			if(eqIdArr[i]==$("#aEquiNum").val()){
				mainArr[i]=SerialNum;
			}
		}
		console.log(mainArr);
		//添加签名到该维保单
		$.ajax({
			type:"post",
			url:"/GWService.asmx/ExecuteSQL",
			// async:false,
			data:{
				sql:"update Dt_MaintPlc set PropSign='"+dataUrl+"'  where SerialNum='"+SerialNum+"'",
				userName:window.localStorage.userName
			},success:function(dt){
				console.log("修改签名成功");
			}
		})
		//更新电梯状态和添加15天
		
		$.ajax({
			type:"post",
			url:"/GWService.asmx/ExecuteSQL",
			// async:false,
			data:{
				sql:"update Dt_Equip set NextMaint=dateadd(day,15,NextMaint),TskStatus=0  where RegCode='"+regCode+"'",
				userName:window.localStorage.userName
			},success:function(dt){
				console.log("修改时间成功");
			}
		})




		// console.log(mainArr)
		// // if(id!=""&&grase<=100){
		var data=null,plcid=mainArr.toString();
		if(num==eqIdArr.length-1){//额外需要更新任务的状态和完成时间
			// $("#appraise .appra").show();
			data={
				sql:"update Dt_MaintTsk set PlcId='"+plcid+"',Comment='"+appraise+"',Score='"+grase+"',ActualEnd='"+acturTimeEnd+"',Status=2 where id='"+taskId+"'",
				userName:window.localStorage.userName
			};
		}else{
			data={
				sql:"update Dt_MaintTsk set PlcId='"+plcid+"',Comment='"+appraise+"',Score='"+grase+"'  where id='"+taskId+"'",
				userName:window.localStorage.userName
			};
		}
		// console.log(data)
		JQajaxo("post","/GWService.asmx/ExecuteSQL",false,data,_sucapp)

	})

}


function imgUpload(){
	var url;
	var appkeys;
	var blob = dataURItoBlob($('.js-signature').jqSignature('getDataURL')); 
	var canvas = document.createElement('canvas');
	var dataURL = canvas.toDataURL('image/jpeg', 0.5);
	var fd = new FormData(document.forms[0]);
	fd.append("the_file", blob, 'image'+getTimesStamp()+'.png');
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

function addxi(ind){
	$("#appraise .rate i").each(function(i,dom){
		if(i<=ind){
			$(dom).addClass('icon-iconfontxingxing')
		}else{
			$(dom).removeClass('icon-iconfontxingxing')
		}
	})
}

function _sucapp(dt){
	var int =$(dt).find("int").text();
	if(int!=0){
		mainView.router.loadPage("home.html")
	}
}
function letInput(){
	 myApp.pickerModal('.write');
	$(".page-content").css({"overflow":"hidden"})
	var wp = new WritingPad();
	 $('.js-signature').jqSignature('clearCanvas');
}
// 先获取该任务的维修设备,维修评价,维修评级
function getReCode(id){
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