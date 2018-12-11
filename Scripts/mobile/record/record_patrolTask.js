function record_patrolTask(){
	var calendarRange = myApp.calendar({
		input: '#calendar-range',
		dateFormat: 'yyyy-mm-dd',
		rangePicker: true,
		monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
		dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
		onClose:function(){
			getPatrolTaskList();
		}
	});
}

//根据时间周期查询任务记录
function getPatrolTaskList(){
	var calendarValue=$("#calendar-range").val();
	if(calendarValue!=""){
		var calendarValueArr=calendarValue.split(" - ");
		var _ComplainData = {
			tableData: 'Dt_Fault',
			beginTime: calendarValueArr[0],
			endTime: calendarValueArr[1]
		}
		//根据时间周期查询任务记录
		JQajaxo("post", "/api/Elevator/get_dtComplainList", true, _ComplainData, _ComplainSuccess);
		function _ComplainSuccess(dt){
			console.log(dt);
			if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
				var result=dt.HttpData.data;
				var strData="";
				for(var i=0;i<result.length;i++){
					var SubmitTime=getTimeFormat(result[i].SubmitTime);
					strData+="<li><div class='complain-list-header'>"
							+"<div class='header-title'>故障："+result[i].Content+"</div>"
	            			+"<div class='header-after'>"+SubmitTime+"</div>"
							+"</div>"
							+"<div class='complain-list-content'>"
							+"<div class='equip-desc'>电梯设备号："+result[i].DeviceId+"</div>";
					if(result[i].Result=="1"){
						strData+="<div class='equip-status color-green'>已处理</div></div>";
					}else {
						strData+="<div class='equip-status color-red'>未处理</div></div>";
					}
					if(result[i].LngLat!=""&&result[i].LngLat!=null){
						strData+="<div class='complain-list-info'>"
							+"<div class='equip-address'>地址："+result[i].InstallAddr+"</div>"
							+"<div class='equip-mapinfo'><span onclick='checkPositionInfo(\""+result[i].LngLat+"\")'>查看地图</span></div>"
							+"</div>"
							+"</li>";
					}else{
						strData+="<div class='complain-list-info'>"
							+"<div class='equip-address'>地址："+result[i].InstallAddr+"</div>"
							+"<div class='equip-mapinfo'></div>"
							+"</div>"
							+"</li>";
					}
				}
				$("#complainListId ul").html(strData);
			}else{
				$("#complainListId ul").html("<p style='text-align:center;color:#C2C2C2'>查无记录</p>");
			}
		}
	}
}

//根据经纬度显示当前位置
function checkPositionInfo(position){
	$("#recordPoitionLng").val(position);
	mainView.router.loadPage("record/record_position.html");
}

//时间格式化 HH:mm yyyy/MM-dd
function getTimeFormat(myTime){
	if(myTime!=null){
		var myTimeArr=myTime.split("T");
		var timeDate=myTimeArr[0].split('-').join('/');
		var newTime=myTimeArr[1].substring(0,5)
		return "<span>"+newTime+"</span>"+timeDate;
	}else{
		return "";
	}
}