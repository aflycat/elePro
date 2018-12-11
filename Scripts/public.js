
function createtime() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + date.getHours() + seperator2 + date.getMinutes() +
		seperator2 + date.getSeconds();
	return currentdate;

}
function createDate(){
	var date = new Date();
	var seperator1 = "-";
	var month = date.getMonth() + 1;
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	var strDate = date.getDate();
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate= date.getFullYear() + seperator1 + month + seperator1 + strDate;
	return currentdate;
}
function timeSplit(str){
	if(str!=""){
		var arr=null;
		var date=str.split("T")[0];
		var time=str.split("T")[1].split("+")[0];
		arr=date+" "+time
		return arr;
	}
	
}
function JQajaxo(_type, _url, _asycn, _data, _success) {
    $.ajax({
        type: _type,
        url: _url,
      	headers: {
				Authorization: window.localStorage.ac_appkey + '-' + window.localStorage.ac_infokey
			},
        timeout: 10000,
        async: _asycn,
        data: _data,
        success: _success
    });
}
Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
	}
	return -1;
};
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};
// 补零操作
function PrefixInteger(num, length) {
 	return (Array(length).join('0') + num).slice(-length);

}
//获取时间戳
function getTimesStamp(){
	return Date.parse(new Date());
}