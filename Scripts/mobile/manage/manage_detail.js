function manage_detail() {
	toolbarActive('recordTool');
	var _AccountData = {
		userName: window.localStorage.userName
	}
	
	var userType=window.localStorage.Type;
	if(userType==0){
		$(".contentlist .postSubmit").show();
		$(".contentlist .PostThing").show();
	}else{
		$(".contentlist .postSubmit").hide();
		$(".contentlist .PostThing").hide();
	}
	
}