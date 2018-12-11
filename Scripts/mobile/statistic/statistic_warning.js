function statistic_warning() {

	var _UserData = {
		Id: window.localStorage.PpId,
		Type: window.localStorage.Type
	}
	JQajaxo("post", "/api/Elevator/get_dtPinfor", true, _UserData, _UserSuccessStatus);
	//获取登录用户详细信息
	function _UserSuccessStatus(dt) {
		if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
			var result = dt.HttpData.data[0];
			var _ReportData = {};
			var _ElevatorWeekData = {};
			if(window.localStorage.Type == "0") {
				var CompId = result.CompId;
				_ReportData = {
					MaintId: CompId,
					PropId: null,
					accountType: window.localStorage.Type
				};
				_ElevatorWeekData = {
					MaintId: CompId,
					PropId: null,
					accountType: window.localStorage.Type
				}
			} else if(window.localStorage.Type == "1") {
				var CompId = result.CompId;
				_ReportData = {
					MaintId: null,
					PropId: CompId,
					accountType: window.localStorage.Type
				};
				_ElevatorWeekData = {
					MaintId: null,
					PropId: CompId,
					accountType: window.localStorage.Type
				};
			} else if(window.localStorage.Type == "2") {
				_ReportData = {
					MaintId: null,
					PropId: null,
					accountType: window.localStorage.Type
				};
				_ElevatorWeekData = {
					MaintId: null,
					PropId: null,
					accountType: window.localStorage.Type
				};
			}
			JQajaxo("post", "/api/Elevator/get_dtReportData", true, _ReportData, _ReportDataSuccess);

			function _ReportDataSuccess(dt) {
				if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
					var result = dt.HttpData.data;
					var realEquipArr = [];
					var equipNum = 0;
					for(var i = 0; i < result.length; i++) {
						var Id = result[i].Id;
						var EquipId = result[i].EquipId;
						var EquipIdArr = EquipId.split(",");
						for(var n = 0; n < EquipIdArr.length; n++) {
							if(EquipIdArr[n].indexOf(Id) > -1) {
								realEquipArr.push(Id);
							}
						}
						if(i == 0) {
							equipNum = result[i].equipNum;
						}
					}
					realEquipArr = arrDistinct(realEquipArr);
					$("#elevatorNumId").html(equipNum);
					$("#elevatorHealthId").html(equipNum - realEquipArr.length);
					$("#healthRateId").html(getMathNum((equipNum - realEquipArr.length) / equipNum * 100) + "%");
					$("#elevatorDealId").html(realEquipArr.length);

				}
			}

			JQajaxo("post", "/api/Elevator//get_dtReportMonthData", true, _ElevatorWeekData, getChartsData);
		}
	}
}

function getChartsData(dt) {
	var timeData = [getDay(-28) + "-" + getDay(-21), getDay(-21) + "-" + getDay(-14), getDay(-14) + "-" + getDay(-7), getDay(-7) + "-" + getDay(0)];
	var resultData = [];
	var one_num = 0;
	var two_num = 0;
	var three_num = 0;
	var four_num = 0;
	if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
		var result = dt.HttpData.data;
		for(var i = 0; i < result.length; i++) {
			if(result[i].one_num != null && result[i].one_num != "") {
				one_num += parseInt(result[i].one_num);
			}
			if(result[i].two_num != null && result[i].two_num != "") {
				two_num += parseInt(result[i].two_num);
			}
			if(result[i].three_num != null && result[i].three_num != "") {
				three_num += parseInt(result[i].three_num);
			}
			if(result[i].four_num != null && result[i].four_num != "") {
				four_num += parseInt(result[i].four_num);
			}
		}

	}
	resultData = [one_num, two_num, three_num, four_num];
	var myChart = echarts.init(document.getElementById("warnChartsId"));
	//设置图表的配置项和数据
	var option = {
		title: { //图表标题
			text: "近一个月报事数量", //图表标题内容
			x: 'center'
		},
		xAxis: { //直角坐标系中横轴数组
			axisLine: {
				show: true,
				lineStyle: {
					width: 1,
					color: '#E0E0E0'
				}
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				show: true,
				interval: 0,
				textStyle: {
					color: '#333',
					fontSize: 10,
				}
			},
			data: timeData
		},
		yAxis: {
			axisLine: {
				show: true,
				lineStyle: {
					width: 1,
					color: '#E0E0E0'
				}
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				show: true,
				textStyle: {
					color: '#333'
				}
			},
			splitLine: {
				show: true,
				lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
					color: ['#E5E3E4'],
					type: 'dashed'
				}
			},
		},
		grid: {
			left: '3%',
			right: '5%',
			bottom: '3%',
			containLabel: true
		},
		series: [{
			name: "",
			type: "bar",
			barWidth: 40,
			label: {
				normal: {
					show: true,
					position: 'top'
				}
			},
			itemStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: 'rgba(73, 200, 253, 1)'
					}, {
						offset: 0.95,
						color: 'rgba(79, 74, 255, 1)'
					}], false),
				}
			},
			data: resultData //图表数据
		}]
	};
	//使用option中的配置项和数据显示图表。
	myChart.setOption(option);
}

function arrDistinct(arr) {
	var result = []
	for(var i = 0; i < arr.length; i++) {
		if(result.indexOf(arr[i]) == -1) {
			result.push(arr[i])
		}
	}
	return result;
}

function getMathNum(num) {
	var index = num.toString().indexOf(".");
	if(index > 0) {
		return parseFloat(num).toFixed(1);
	} else {
		return num;
	}
}

//获取最近n天日期  
function getDay(day) {
	var today = new Date();

	var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

	today.setTime(targetday_milliseconds); //注意，这行是关键代码  

	var tYear = today.getFullYear();
	var tMonth = today.getMonth();
	var tDate = today.getDate();
	tMonth = doHandleMonth(tMonth + 1);
	tDate = doHandleMonth(tDate);
	return tMonth + "/" + tDate;
}

function doHandleMonth(month) {
	var m = month;
	if(month.toString().length == 1) {
		m = "0" + month;
	}
	return m;
}