$(function() {
	$('body').height($('body')[0].clientHeight);
	initHomePages();
	// mainView.router.loadPage("newTask.html")
	// mainView.router.loadPage("taskDetail.html")
	// mainView.router.loadPage("taskList.html")
	// mainView.router.loadPage('startTask.html')
	// mainView.router.loadPage('newTask.html')
	// mainView.router.loadPage("appraise.html")
	// mainView.router.loadPage("wb_startTask.html")
	// mainView.router.loadPage("postSubmit.html")
	// mainView.router.loadPage("lookMplc.html")
	$("#knowledgeSearchId").unbind().bind('click', function() {
		//		$(".knowledge-icon").hide();
		var searchStatus = $('#searchKnowledgeBoxId').css('display');
		if(searchStatus == "none") {
			$("#knowledgeSearchId").removeClass("icon-web-search");
			$("#knowledgeSearchId").addClass("icon-web-cancel");
			$("#searchKnowledgeBoxId").show();
		} else {
			$("#knowledgeSearchId").removeClass("icon-web-cancel");
			$("#knowledgeSearchId").addClass("icon-web-search");
			$("#searchKnowledgeBoxId").hide();
		}

	})

});

//设置用户cookie key值
function getServerKey() {
	window.location.href = "/Views/login.html";
}

//初始化判断是否登录
function initHomePages() {
	var userName = window.localStorage.userName;
	if(userName != '' && userName != undefined && userName != null) {
		$(".task-list,.toolbar").show();
		$(".toolbar-through .page-content").css("padding-bottom", "50px");
		$(".knowledge-content").css("height", "80%");
		$('.knowledge-list').css('height','88%');
		
		$(".sureLoginBtn span").html(window.localStorage.userName + "," + getTodayHour());
		$(".sureLoginBtn").unbind();

	} else {
		$(".task-list,.toolbar").hide();
		$(".toolbar-through .page-content").css("padding-bottom", "0px");
		$(".knowledge-content").css("height", "90%");
		$(".sureLoginBtn span").html("点击登录");
		$('.knowledge-list').css('height','92%');
		$(".sureLoginBtn").unbind().bind('click', function() {
			getServerKey();
		});
	}

	//获取key
	$.ajax({
		type: 'post',
		url: '/api/server/getkey',
		dataType: "json",
		data: {
			username: "admin",
			userpwd: "admin"
		},
		success: function(dt) {
			if(dt.HttpStatus == 200) {
				var dts = dt.HttpData;
				if(dts.code == 200) {
					var getkeys = dts.data;
					window.localStorage.ac_appkey = getkeys.appkey;
					window.localStorage.ac_infokey = getkeys.infokey;

					var _DocumentData = {
						num: 9999
					}
					JQajaxo("post", "/api/Elevator/get_dtDocument", true, _DocumentData, _DocumentSuccess);
					//获取知识库信息
					function _DocumentSuccess(dt) {
						if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
							var result = dt.HttpData.data;
							var strData = "";
							if(result != null && result.length > 0) {
								for(var i = 0; i < result.length; i++) {
									var knowledgeListId = result[i].Id;
									strData += "<li onclick='getKnowledgeDetailById(\"" + knowledgeListId + "\")'>" +
										"<div class='knowledge-box'>" +
										"<div class='knowledge-desc'>" +
										"<div class='knowledge-title'>" +
										"<span class='item-title'>" + result[i].Title + "</span>" +
										"</div>" +
										"<div class='knowledge-way'>" + result[i].Remark + "</div>" +
										"<div class='knowledge-img'><img src='" + result[i].Pic + "'/></div>" +
										"</div>" +
										"</div>" +
										"</li>";
								}
								$("#documentListId ul").html(strData);
							}

						}
					}

					if(window.localStorage.userName != null && window.localStorage.userName != "") {

						var _getAccountData = {
							userName: window.localStorage.userName
						}
						//根据用户名获取账号关系信息
						JQajaxo("post", "/api/Elevator/get_dtAccount", true, _getAccountData, _getAccountSuccess);

						function _getAccountSuccess(dt) {
							
							if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
								var _UserData = {
									Id: dt.HttpData.data[0].PpId,
									Type: dt.HttpData.data[0].Type
								}
								window.localStorage.PpId = dt.HttpData.data[0].PpId;
								window.localStorage.Type = dt.HttpData.data[0].Type;
								if(dt.HttpData.data[0].Type != 2) {
									$("#taskListId").show();
									var _TaskData = {
										MpId: dt.HttpData.data[0].PpId,
										PpId: dt.HttpData.data[0].PpId,
										accountType: dt.HttpData.data[0].Type
									}
									JQajaxo("post", "/api/Elevator/get_dtTaskSituation", true, _TaskData, _TaskSuccess);
									//获取用户任务信息

									function _TaskSuccess(dt) {
										if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
											var resultData = dt.HttpData.data[0];
											$("#needTaskNumId").html(resultData.needNum);
											$("#dealTaskNumId").html(resultData.dealNum);
											$("#finishTaskNumId").html(resultData.finishNum);
										}
									}
								} else {
									$("#taskListId").hide();
									$(".toolbar-through .page-content").css("padding-bottom", "40px");
									$(".knowledge-content").css("height", "90%");
									$(".knowledge-list ul li").css("height", "16.6%");
								}

								checkUserPermissions();
							}
						}
					} else {
						if(window.localStorage.Type == 2) {
							$("#taskListId").hide();
							$(".toolbar-through .page-content").css("padding-bottom", "40px");
							$(".knowledge-content").css("height", "90%");
							$(".knowledge-list ul li").css("height", "16.6%");
						}
					}

				}
			}
		}
	});
}

//根据知识库编码获取知识库文档内容
function getKnowledgeDetailById(kId) {
	$("#knowledgeListId").val(kId);
	mainView.router.loadPage("knowledge.html");
}

//判断用户权限
function checkUserPermissions() {
	var _UserData = {
		Id: window.localStorage.PpId,
		Type: window.localStorage.Type
	}
	JQajaxo("post", "/api/Elevator/get_dtPinfor", true, _UserData, _UserSuccessStatus);
	//获取登录用户详细信息
	function _UserSuccessStatus(dt) {
		if(dt.HttpStatus == 200 && dt.HttpData.data != null) {
			var result = dt.HttpData.data[0];
			if(window.localStorage.Type == "0") {
				if(result.Type == "0") {
					console.log("管理人员");
					$("#toolbarListId").html("<a href='home.html' class='link active no-animation' id='homeTool'><i class='iconfont icon-web-home-fill' cls='home'></i><span class='tabbar-label'>首页</span></a>" +
						"<a href='taskList.html' class='link no-animation' id='taskTool'><i class='iconfont icon-web-location' cls='baoshi'></i><span class='tabbar-label'>任务</span></a>" +
						"<a href='manage/manage_detail.html' class='link no-animation' id='recordTool'><i class='iconfont icon-web-message' cls='manage'></i><span class='tabbar-label'>管理</span></a>" +
						"<a href='map.html' class='link no-animation' id='mapTool'><i class='iconfont icon-web-record' cls='record'></i><span class='tabbar-label'>地图</span></a>" +
						"<a href='myInfor.html' class='link no-animation' id='mineTool'><i class='iconfont icon-web-mine' cls='wode'></i><span class='tabbar-label'>我的</span></a>");
				} else {
					console.log("维保人员");
					$("#toolbarListId").html("<a href='home.html' class='link active no-animation' id='homeTool'><i class='iconfont icon-web-home-fill' cls='home'></i><span class='tabbar-label'>首页</span></a>" +
						"<a href='taskList.html' class='link no-animation' id='taskTool'><i class='iconfont icon-web-report' cls='baoshi'></i><span class='tabbar-label'>任务</span></a>" +
						"<a href='PostThing.html' class='link no-animation' id='PostThingTool'><i class='iconfont icon-web-message' cls='baoshi'></i><span class='tabbar-label'>报事</span></a>" +
						"<a href='record.html' class='link no-animation' id='recordTool'><i class='iconfont icon-web-report' cls='baoshi'></i><span class='tabbar-label'>记录</span></a>" +
						"<a href='myInfor.html' class='link no-animation' id='mineTool'><i class='iconfont icon-web-mine' cls='wode'></i><span class='tabbar-label'>我的</span></a>");
				}
			} else if(window.localStorage.Type == "1") {
				if(result.Type == "0") {
					console.log("管理人员");
					$("#toolbarListId").html("<a href='home.html' class='link active no-animation' id='homeTool'><i class='iconfont icon-web-home-fill' cls='home'></i><span class='tabbar-label'>首页</span></a>" +
						"<a href='taskList.html' class='link no-animation' id='taskTool'><i class='iconfont icon-web-report' cls='baoshi'></i><span class='tabbar-label'>任务</span></a>" +
						"<a href='PostThing.html' class='link no-animation' id='PostThingTool'><i class='iconfont icon-web-message' cls='baoshi'></i><span class='tabbar-label'>报事</span></a>" +
						"<a href='manage/manage_detail.html' class='link no-animation' id='recordTool'><i class='iconfont icon-web-message' cls='manage'></i><span class='tabbar-label'>管理</span></a>" +
						"<a href='myInfor.html' class='link no-animation' id='mineTool'><i class='iconfont icon-web-mine' cls='wode'></i><span class='tabbar-label'>我的</span></a>");
				} else {
					console.log("巡查人员");
					$("#toolbarListId").html("<a href='home.html' class='link active no-animation' id='homeTool'><i class='iconfont icon-web-home-fill' cls='home'></i><span class='tabbar-label'>首页</span></a>" +
						"<a href='taskList.html' class='link no-animation' id='taskTool'><i class='iconfont icon-web-report' cls='baoshi'></i><span class='tabbar-label'>任务</span></a>" +
						"<a href='PostThing.html' class='link no-animation' id='PostThingTool'><i class='iconfont icon-web-message' cls='baoshi'></i><span class='tabbar-label'>报事</span></a>" +
						"<a href='record.html' class='link no-animation' id='recordTool'><i class='iconfont icon-web-report' cls='baoshi'></i><span class='tabbar-label'>记录</span></a>" +
						"<a href='myInfor.html' class='link no-animation' id='mineTool'><i class='iconfont icon-web-mine' cls='wode'></i><span class='tabbar-label'>我的</span></a>");
					$("#taskAppraise").show();
				}
			} else if(window.localStorage.Type == "2") {
				console.log("政府人员");
				$("#toolbarListId").html("<a href='home.html' class='link active no-animation' id='homeTool'><i class='iconfont icon-web-home-fill' cls='home'></i><span class='tabbar-label'>首页</span></a>" +
					"<a href='PostThing.html' class='link no-animation' id='PostThingTool'><i class='iconfont icon-web-message' cls='baoshi'></i><span class='tabbar-label'>报事</span></a>" +
					"<a href='map.html' class='link no-animation' id='mapTool'><i class='iconfont icon-web-message' cls='baoshi'></i><span class='tabbar-label'>地图</span></a>" +
					"<a href='statistic.html' class='link no-animation' id='statisticTool'><i class='iconfont icon-web-message' cls='manage'></i><span class='tabbar-label'>统计</span></a>" +
					"<a href='myInfor.html' class='link no-animation' id='mineTool'><i class='iconfont icon-web-mine' cls='wode'></i><span class='tabbar-label'>我的</span></a>");
			}
			$("#toolbarListId").show();
			//调用百度地图GPS定位
			myJavaFun.OpenLocationBD();
			setInterval(function() {
				myJavaFun.OpenLocationBD();
			}, 300000);
		}
	}
}

//判断当前时辰状态
function getTodayHour() {
	var now = new Date();
	var hour = now.getHours();
	var str = "";
	if(hour < 6) {
		str = "凌晨好";
	} else if(hour < 9) {
		str = "早上好";
	} else if(hour < 12) {
		str = "上午好";
	} else if(hour < 14) {
		str = "中午好";
	} else if(hour < 17) {
		str = "下午好";
	} else if(hour < 19) {
		str = "傍晚好";
	} else if(hour < 22) {
		str = "晚上好";
	} else {
		str = "夜里好";
	}
	return str;
}

//时间格式化 剔除T
function getFormatDate(time) {
	if(time != null) {
		return time.replace("T", " ").substring(0, 16);
	} else {
		return "";
	}
}

//首页事件
function onHomePage() {
	$('.homeToolBar').find('a').removeClass('active');
	$('#homeTool').addClass('active');
	$(".views").height($(window).height());
	$('html').removeClass('with-statusbar-overlay');
}

//首页未登录显示信息
function sureLoginBtn() {
	if(window.localStorage.userName != "" && window.localStorage.userName != null) {
		$("#userInfoBtnId span").html(window.localStorage.userName + "," + getTodayHour());
	}
}

//界面尺寸变化事件
function onResizeCustomized() {
	if($(".view-main").attr("data-page") == "Voice") {
		var heightWindow = $(".page-content").height();
		if(heightWindow < 500) {
			$(".voiceDivs").css("height", "100%");
			$(".voiceDivs").css("bottom", "40px");
			$(".voiceDivs").css("position", "relative");
		} else {
			$(".voiceDivs").css("height", "300px");
			$(".voiceDivs").css("bottom", "60px");
			$(".voiceDivs").css("position", "absolute");
		}
	}
}

//实时更新坐标 5分钟调用一次
function gpsBack(dt) {
	//判断是否获取维保人员定位信息
	if(dt != null && dt != "" && dt != undefined) {
		var result = JSON.parse(dt);
		var myLatitude = result.latitude;
		var myLongitude = result.longitude;
		var _GPSBackData = {
			Id: window.localStorage.PpId,
			myLongitude: myLongitude,
			myLatitude: myLatitude,
			accountType: window.localStorage.Type
		}

		JQajaxo("post", "/api/Elevator/get_dtUserPoistion", true, _GPSBackData, _GPSBackSuccess);

		function _GPSBackSuccess(dt) {
			console.log(dt);
			if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
				var resultData = dt.HttpData.data;
				//				myApp.alert(resultData);
			}
		}
		//关闭百度地图GPS定位功能
		myJavaFun.StopLocationBD();
	}
}