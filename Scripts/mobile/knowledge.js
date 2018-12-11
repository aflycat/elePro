var Path,strFileName;
function knowledge() {
	$("#sharePicIconId").unbind().bind('click', function() {
		divShareToWX();
	});

	var knowledgeListId = $("#knowledgeListId").val();
	var _DocumentDetailData = {
		Id: knowledgeListId
	};
	JQajaxo("post", "/api/Elevator/get_dtDocumentDetail", true, _DocumentDetailData, _DocumentDetailSuccess);
	//获取知识库信息
	function _DocumentDetailSuccess(dt) {
		if(dt.HttpStatus == 200 && dt.HttpData.data != "") {
			var result = dt.HttpData.data[0];
			var Title = result.Title;
			Path = result.Path;
			var PathArr=Path==null?[]:Path.toString().split(";");
			var UploadTime = result.UploadTime;
			var Upper = result.Upper;
			var KeyWord = result.KeyWord;
			var Pic = result.Pic;

			$(".knowledge-header>h2").html(Title);
			$("#UpperId").html(Upper);
//			$("#KeyWordId").html("关键字：" + KeyWord);
			$("#UploadTimeId").html(getTimeFormatMDHM(UploadTime));

			var iFrameWidth = $(".mainKnowledgeBox").width()-10;
			var iFrameHeight = $(".mainKnowledgeBox").height();
			var headerHeight = $(".knowledge-header").height() + $(".knowledge-author").height();
			strFileName = filePathName(PathArr[1]);
			var strFileFormat = "";
			if(strFileName.indexOf(".") > -1) {
				strFileFormat = strFileName.split(".").splice(-1);
			}

			$(".mainKnowledgeBox>object").remove();
			var strData = "";console.log(Path,strFileName)
			if(strFileFormat == "" || "doc;ppt;xls;docx;pptx;xlsx;rar".indexOf(strFileFormat) > -1) {
				strData = '<object data="" width="' + iFrameWidth + '" height="' + (iFrameHeight - headerHeight) + '">' +
					'	<embed id="myEmbedId" class="myEmbed" src="/Image/elevator/download1.png" onclick="myEmbedDownload()" height="128" width="128"></embed>' +
					'</object>';
			} else {
				strData = '<object data="' + PathArr[0] + '" width="' + iFrameWidth + '" height="' + (iFrameHeight - headerHeight) + '" style="margin-left:5px;">' +
					//'	<embed id="myEmbedId" class="myEmbed" src="/Image/elevator/download1.png" onclick="myEmbedDownload()" height="128" width="128"></embed>' +
					'</object>';
			}

			$('.mainKnowledgeBox').append(strData);

			$("#KeyWordId").unbind().bind('click', function() {
				var canvas = document.createElement('canvas');
				canvas.toBlob(function(blob) {
					// 使用 createObjectURL 生成地址，格式为 blob:null/fd95b806-db11-4f98-b2ce-5eb16b38ba36
					var url = URL.createObjectURL(blob);
					var a = document.createElement('a');
					a.download = strFileName;
					a.href = PathArr[1];
					// 模拟a标签点击进行下载
					a.click();
					// 下载后告诉浏览器不再需要保持这个文件的引用了
					URL.revokeObjectURL(url);
				});
			});
		}
	}
}

function myEmbedDownload() {
	var canvas = document.createElement('canvas');
	canvas.toBlob(function(blob) {
		// 使用 createObjectURL 生成地址，格式为 blob:null/fd95b806-db11-4f98-b2ce-5eb16b38ba36
		var url = URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.download = strFileName;
		a.href = Path;
		// 模拟a标签点击进行下载
		a.click();
		// 下载后告诉浏览器不再需要保持这个文件的引用了
		URL.revokeObjectURL(url);
	});
}
//根据路径获取文件名
function filePathName(fileName) {
	var strFileName = fileName.substring(fileName.lastIndexOf("\/") + 1);
	return strFileName;
}

//div分享到微信
function divShareToWX() {
	var wxShareStr = "wxd2a573967e43f6c6";
	var oldViewHeight = $('.views').height();
	var newViewHeight = $('.mainKnowledgeBox')[0].scrollHeight + 162;
	$(".views").height(newViewHeight);
	console.log($('.mainKnowledgeBox').height(), $('.mainKnowledgeBox')[0].scrollHeight)
	html2canvas($(".views"), {
		onrendered: function(canvas) {
			$(".views").height(oldViewHeight);
			var url = canvas.toDataURL("image/png").split(',')[1];
			console.log(url)
			myJavaFun.AppShare(url, wxShareStr);
		}
	});
}

//时间格式化 MM-dd HH:mm
function getTimeFormatMDHM(myTime) {
	if(myTime != null) {
		var myTimeArr = myTime.split("T");
		var timeDate = myTimeArr[0].substring(5, 10);
		var newTime = myTimeArr[1].substring(0, 5)
		return newTime + " " + timeDate;
	} else {
		return "";
	}
}