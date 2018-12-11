/*================================管理=========================================*/
$(document).on("pageBeforeInit", ".page[data-page='manage']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('manage', '');
	}

});

$(document).on("pageBeforeInit", ".page[data-page='manage_detail']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('manage_detail', '/Scripts/mobile/manage/');
	}

});

$(document).on("pageBeforeInit", ".page[data-page='manage_mapInfo']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('manage_mapInfo', '/Scripts/mobile/manage/');
	}

});

$(document).on("pageBeforeInit", ".page[data-page='manage_basicInfo']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('manage_basicInfo', '/Scripts/mobile/manage/');
	}
});

/*================================记录查询=========================================*/
$(document).on("pageBeforeInit", ".page[data-page='record']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('record', '');
	}

});
$(document).on("pageBeforeInit", ".page[data-page='record_maintTask']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('record_maintTask', '/Scripts/mobile/record/');
	}

});
$(document).on("pageBeforeInit", ".page[data-page='record_patrolTask']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('record_patrolTask', '/Scripts/mobile/record/');
	}

});
$(document).on("pageBeforeInit", ".page[data-page='record_warn']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('record_warn', '/Scripts/mobile/record/');
	}

});
$(document).on("pageBeforeInit", ".page[data-page='record_complain']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('record_complain', '/Scripts/mobile/record/');
	}

});
$(document).on("pageBeforeInit", ".page[data-page='record_complain_detail']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('record_complain_detail', '/Scripts/mobile/record/');
	}

});
$(document).on("pageBeforeInit", ".page[data-page='record_complain_map']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('record_complain_map', '/Scripts/mobile/record/');
	}

});
$(document).on("pageBeforeInit", ".page[data-page='record_warn_map']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('record_warn_map', '/Scripts/mobile/record/');
	}

});
$(document).on("pageBeforeInit", ".page[data-page='record_maintTask_map']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('record_maintTask_map', '/Scripts/mobile/record/');
	}

});

/*================================地图管理=========================================*/
$(document).on("pageBeforeInit", ".page[data-page='map']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('map', '/Scripts/mobile/map/');
	}
});
$(document).on("pageBeforeInit", ".page[data-page='map_elevator']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('map_elevator', '/Scripts/mobile/map/');
	}
});
$(document).on("pageBeforeInit", ".page[data-page='map_person']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('map_person', '/Scripts/mobile/map/');
	}
});
$(document).on("pageBeforeInit", ".page[data-page='map_company']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('map_company', '/Scripts/mobile/map/');
	}
});
$(document).on("pageBeforeInit", ".page[data-page='statistic']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('statistic', '');
	}
});
$(document).on("pageBeforeInit", ".page[data-page='statistic_warning']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('statistic_warning', '/Scripts/mobile/statistic/');
	}
});
$(document).on("pageBeforeInit", ".page[data-page='statistic_elevator']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('statistic_elevator', '/Scripts/mobile/statistic/');
	}
});
$(document).on("pageBeforeInit", ".page[data-page='statistic_elevator_map']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('statistic_elevator_map', '/Scripts/mobile/statistic/');
	}
});
$(document).on("pageBeforeInit", ".page[data-page='statistic_elevator_detail']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('statistic_elevator_detail', '/Scripts/mobile/statistic/');
	}
});
$(document).on("pageBeforeInit", ".page[data-page='statistic_elevator_info']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('statistic_elevator_info', '/Scripts/mobile/statistic/');
	}
});
$(document).on("pageBeforeInit", ".page[data-page='knowledge']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('knowledge', '');
	}
});

/*================================我的信息=========================================*/
$(document).on("pageBeforeInit", ".page[data-page='mine']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('mine', '');
	}
});

//界面跳转demo
//投诉
$(document).on("pageBeforeInit", ".page[data-page='PostMes']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "PostMes") {
			toolbarActive('RealTimeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('PostMessage', '');
	}
});
//报障
$(document).on("pageBeforeInit", ".page[data-page='PostPro']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "PostPro") {
			toolbarActive('RealTimeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('PostProblem', '');
	}
});
//我的
$(document).on("pageBeforeInit", ".page[data-page='myInfor']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "myInfor") {
			toolbarActive('RealTimeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('myInfor', '');
	}
});
//编辑资料
$(document).on("pageBeforeInit", ".page[data-page='EdictInfor']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('EdictInfor', '');
	}

});
//报事确认
$(document).on("pageBeforeInit", ".page[data-page='postSubmit']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('postSubmit', '');
	}
});
//报事
$(document).on("pageBeforeInit", ".page[data-page='PostThing']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('PostThing', '');
	}
});
//报事处理
$$(document).on("pageBeforeInit", ".page[data-page='postDeal']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "myInfor") {
			toolbarActive('RealTimeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		var url = e.detail.page.url;
		// postDeal.html?tabId=14&equId=1
		if(url.indexOf("?") > -1) {
			var url = e.detail.page.url.split("?")[1];
			var tabId = getQueryVariable('tabId', e);
			var equId = getQueryVariable('equId', e);
			var task_cl=getQueryVariable('taskClass',e);
			$("#task_cl").val(task_cl);
			$("#tabId").val(tabId);
			$("#equId").val(equId);
			$("#postDeal .euipId").text(equId)
		}
		date();
		time();
		initPageJS('postDeal', '');
	}

});

//任务
$$(document).on("pageBeforeInit", ".page[data-page='newTask']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		if($(this).hasClass("page-on-left")) {
			var ids = $(this).next().attr("id");
			if(ids == "home") {
				toolbarActive('homeTool');
			} else {
				initPageJS(ids, '');
			}
		} else {
			date();
			time();
			var id = getQueryVariable('id', e);
			var taskType = getQueryVariable('type', e);
			$("#taskId").val(id)
			$("#taskType").val(taskType)
			initPageJS('newTask', '');
			// time()
		}
	}

});
//wb任务
$$(document).on("pageBeforeInit", ".page[data-page='wb_newTask']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		if($(this).hasClass("page-on-left")) {
			var ids = $(this).next().attr("id");
			if(ids == "home") {
				toolbarActive('homeTool');
			} else {
				initPageJS(ids, '');
			}
		} else {
			date();
			time();
			// var url=e.detail.page.url;
			var id = getQueryVariable('id', e);
			var taskType = getQueryVariable('type', e);
			$("#taskId").val(id)
			$("#taskType").val(taskType)
			//  $("#taskId").val(10)
			// $("#taskType").val(0)
			initPageJS('wb_newTask', '');
			// time()
		}
	}

});
//任务列表
$$(document).on("pageBeforeInit", ".page[data-page='taskList']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		date2();
		initPageJS('taskList', '');
		var ptrContent = $$('.pull-to-refresh-content');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				var date = $("#dateCho2").val();
				console.log(date);
				if(date != "请选择日期") {
					var orderBy = "and a.PlanStart='" + date + "'";
					loadInform(orderBy)
				} else {
					loadInform(" Order By a.PlanStart  Desc")
				}
				myApp.pullToRefreshDone();
			}, 2000);
		});
	}

});

//任务详情
$$(document).on("pageBeforeInit", ".page[data-page='taskDetail']", function(e) {
	
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		//taskDetail.html?type=1&id=2
		// var url=e.detail.page.url;
		var taskId = getQueryVariable('id', e);
		var taskType = getQueryVariable('type', e);
		// $("#taskIdDe").val(66)
		// $("#taskType").val(0)
		$("#taskIdDe").val(taskId)
		$("#taskTypeDe").val(taskType)
		// console.log(taskId,taskType);
		initPageJS('taskDetail', '');
	}

});
//任务详情
$$(document).on("pageBeforeInit", ".page[data-page='wb_taskDetail']", function(e) {
	
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		//taskDetail.html?type=1&id=2
		// var url=e.detail.page.url;
		var taskId = getQueryVariable('id', e);
		var taskType = getQueryVariable('type', e);
		// $("#taskIdDe").val(66)
		// $("#taskType").val(0)
		$("#taskIdDe").val(taskId)
		$("#taskTypeDe").val(taskType)
		// console.log(taskId,taskType);
		initPageJS('wb_taskDetail', '');
	}

});
$$(document).on("pageBeforeInit", ".page[data-page='startTask']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		$$(".backTop").click(function(event) {
			event.stopPropagation();
			event.preventDefault();
			var pageContent = $$('.page-content', e.el);
			pageContent.scrollTop(0, Math.round(pageContent.scrollTop() / 4));
		});

		$$(".page-content", e.el).scroll(function(event) {
			var e = $$(event.target).scrollTop();
			if(e > 300) $(".backTop").show();
			else $$(".backTop").hide();
		});

		var url = e.detail.page.url;
		var taskId = getQueryVariable('Id', e);
		// $("#taskIdS").val(66)
		// $("#taskTypeS").val(0)
		$("#taskIdS").val(taskId);
		// console.log(taskId,taskType);
		initPageJS('startTask', '');
		// taskType
		// taskId
	}
});
//wb
$$(document).on("pageBeforeInit", ".page[data-page='wb_startTask']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		//taskDetail.html?type=1&id=2
		$$(".backTop").click(function(event) {
			event.stopPropagation();
			event.preventDefault();
			var pageContent = $$('.page-content', e.el);
			pageContent.scrollTop(0, Math.round(pageContent.scrollTop() / 4));
		});

		$$(".page-content", e.el).scroll(function(event) {
			var e = $$(event.target).scrollTop();
			if(e > 300) $(".backTop").show();
			else $$(".backTop").hide();
		});

		var url = e.detail.page.url;
		console.log(url);
		var taskId = getQueryVariable('Id', e);
		var taskType = getQueryVariable('type', e);
		console.log(taskId, taskType);
		// $("#taskIdS").val(66)
		// $("#taskTypeS").val(0)
		$("#taskIdS").val(taskId);
		$("#taskTypeS").val(taskType);
		// console.log(taskId,taskType);
		initPageJS('wb_startTask', '');
		// taskType
		// taskId
	}
});



$$(document).on("pageBeforeInit", ".page[data-page='lookMplc']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		var url = e.detail.page.url;
		var loTaskId = getQueryVariable('Id', e);

		$("#loTaskId").val(loTaskId);
		// $("#loTaskId").val(67);
		initPageJS('lookMplc', '');
	}

});
//评价
$$(document).on("pageBeforeInit", ".page[data-page='appraise']", function(e) {
	if($(this).hasClass("page-on-left")) {
		var ids = $(this).next().attr("id");
		if(ids == "home") {
			toolbarActive('homeTool');
		} else {
			initPageJS(ids, '');
		}
	} else {
		initPageJS('appraise', '');
	}

});

function date() {
	var today = new Date();
	var pickerDescribe = myApp.picker({
		input: '#dateCho',
		rotateEffect: true,
		toolbarTemplate: '<div class="toolbar">' +
			'<div class="toolbar-inner">' +
			'<div class="left">' +
			'<a href="#" class="link close-picker">取消</a>' +
			'</div>' +
			'<div class="right">' +
			'<a href="#" class="link close-picker" onclick="searchDate()">确定</a>' +
			'</div>' +
			'</div>' +
			'</div>',
		value: [today.getFullYear(), today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1, today.getDate() < 10 ? '0' + today.getDate() : today.getDate()],
		formatValue: function(p, values) {
			return values[0] + '-' + values[1] + '-' + values[2];
		},
		cols: [{
				values: (function() {
					var arr = [];
					for(var i = 2010; i <= 2030; i++) {
						arr.push(i);
					}
					return arr;
				})(),
			},
			{
				values: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' '),
				// displayValues: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' '),

			},
			// Days
			{
				values: ('01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31').split(","),
			},
		]
	});
}

function date2() {
	var today = new Date();
	var pickerDescribe = myApp.picker({
		input: '#dateCho2',
		rotateEffect: true,
		toolbarTemplate: '<div class="toolbar">' +
			'<div class="toolbar-inner">' +
			'<div class="left">' +
			'<a href="#" class="link close-picker">取消</a>' +
			'</div>' +
			'<div class="right">' +
			'<a href="#" class="link close-picker" onclick="searchDate()">确定</a>' +
			'</div>' +
			'</div>' +
			'</div>',
		// /value: [ today.getFullYear(),today.getMonth()+1<10?'0'+(today.getMonth()+1):today.getMonth()+1, today.getDate()<10?'0'+today.getDate():today.getDate()],
		formatValue: function(p, values) {
			return values[0] + '-' + values[1] + '-' + values[2];
		},
		cols: [{
				values: (function() {
					var arr = [];
					for(var i = 2015; i <= 2130; i++) {
						arr.push(i);
					}
					return arr;
				})(),
			},
			{
				values: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' '),
				// displayValues: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' '),

			},
			// Days
			{
				values: ('01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31').split(","),
			},
		]
	});
}

function time() {
	var today = new Date();

	var pickerDescribe = myApp.picker({
		input: '#timeCho',
		rotateEffect: true,
		toolbarTemplate: '<div class="toolbar">' +
			'<div class="toolbar-inner">' +
			'<div class="left">' +
			'<a href="#" class="link close-picker">取消</a>' +
			'</div>' +
			'<div class="right">' +
			'<a href="#" class="link close-picker">确定</a>' +
			'</div>' +
			'</div>' +
			'</div>',
		value: [today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],
		formatValue: function(p, values, displayValues) {
			return values[0] + ':' + values[1];
		},
		cols: [{
				textAlign: 'left',
				values: (function() {
					var arr = [];
					for(var i = 1; i <= 24; i++) {
						arr.push(i < 10 ? '0' + i : i);
					}
					return arr;
				})(),
			},
			{
				divider: true,
				content: ":"
			},
			{
				values: (function() {
					var arr = [];
					for(var i = 0; i <= 59; i++) {
						arr.push(i < 10 ? '0' + i : i);
					}
					return arr;
				})(),
			},
		]
	});
}
//获取参数
function getQueryVariable(variable, e) {
	var query = e.detail.page.url.split("?")[1];

	if(query) {
		var vars = query.split("&");
		for(var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if(pair[0] == variable) {
				return pair[1];
			}
		}
		return(false);
	}

}