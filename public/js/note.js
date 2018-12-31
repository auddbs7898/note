var log = console.log;
var config = {
    apiKey: "AIzaSyD5Ey8AT8GOrNZ2WZDLcUS1T4c9-kQcS40",
    authDomain: "auddbs7898-noteapp.firebaseapp.com",
    databaseURL: "https://auddbs7898-noteapp.firebaseio.com",
    projectId: "auddbs7898-noteapp",
    storageBucket: "auddbs7898-noteapp.appspot.com",
    messagingSenderId: "141304025094"
  };
  firebase.initializeApp(config);


  var db = firebase.database(); //파이어베이스의 데이터베이스 가져와라
  var auth = firebase.auth(); //파이어베이스의 auth를 가져와라
  var google = new firebase.auth.GoogleAuthProvider(); //구글인증을 쓸수 있음
  var user = null;
  var li = $(".navs")
  var ta = $("#content");

//signIn 되면 실행되는 함수
function init(){
	li.empty();//li안에 있는 모든걸 삭제해달라는 명령
	ref = db.ref("root/note/"+user.uid);
	ref.on("child_added", callbackAdd);
	ref.on("child_changed", callbackChg);
	ref.on("child_removed", callbackRev);
}//로그인 하자마자 데이더가 삭제,수정,추가된거를 알려주는 행위

//데이터베이스 콜백함수들
function callbackAdd(data) {
	log("추가", data.key, data.val());
	var html = `
	<ul id="${data.key}">
	 <li>${data.val().content.substr(0, 16)}</li>
	 <li>${timeConverter(data.val().saveTime)}</li>
	 <li onclick="delData(this)" class="hand">X</li>/* onclick하고 따옴표를 열면 그 안은 자바스크립트 영역이다, this는 클릭당한 li이다 66번쨋줄이란 연결 */
	</ul>
	`;
	li.append(html)
}
function callbackChg(data) {
	log("수정", data.key, data.val());
}
function callbackRev(data) {
	//log("삭제", data.key, data.val());
	$("#"+data.key).remove()
}


//데이터베이스 구현
$("#bt_add").click(function(){
	
});
$("#bt_save").click(function(){
	var content = ta.val();
	if(content == '') {
		alert("내용을 입력하세요.");
		ta.focus();
	}
	else {
		ref = db.ref("root/note/"+user.uid);
		ref.push({
			content: content,
			saveTime: new Date().getTime()//getTime은 timestamp값으로 저장시키는 메서드, 프로그램에서 절댓값을 가져올때 좋다
		}).key;
	}
});
$("#bt_cancel").click(function(){
	ta.val('');
});
function delData(obj){
	if(confirm("정말로 삭제하시겠습니까?")){
	var id = $(obj).parent().attr("id");
	ref = db.ref("root/note/"+user.uid+"/"+id);
	ref.remove();
	}
}
//인증구현
$("#bt_google_login").click(function(){
	auth.signInWithPopup(google);
	//auth.signInWithRedirect(google);
});
$("#bt_google_logout").click(function(){
	auth.signOut();
});
auth.onAuthStateChanged(function(data){
	if(data) {
		//signIn 상태
		user = data;
		$("#bt_google_login").hide();
		$("#bt_google_logout").show();
		$(".email").html(user.email);
		$(".symbol").show();
		$(".symbol > img").attr("src", user.photoURL);
		init();
	}
	else {
		//signOut 상태
		user = null;
		$("#bt_google_login").show();
		$("#bt_google_logout").hide();
		$(".email").html("");
		$(".symbol").hide();
		$(".symbol > img").attr("src", "");
	}
});


/***** Timestamp 값을 GMT표기로 바꾸는 함수 *****/
function timeConverter(ts){
	var a = new Date(ts);
	//var months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
	var year = a.getFullYear();
	//var month = months[a.getMonth()];
	var month = addZero(a.getMonth() + 1);
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	//var str = String(year).substr(2)+"년 "+month+" "+date+"일 "+amPm(addZero(hour))+"시 "+addZero(min)+"분 "+addZero(sec) +"초";
	//var str = year+"년 "+month+" "+date+"일 "+amPm(hour)+"시 "+addZero(min)+"분 "+addZero(sec) +"초";
	var str = year+"-"+month+"-"+date+" "+hour+":"+addZero(min)+":"+addZero(sec);
	return str;
}

/***** 0~9까지의 숫자의 앞에 0을 붙이는 함수 *****/
function addZero(n) {
	if(n<10) return "0"+n;
	else return n;
}

/***** 오전/오후 붙여주는 함수 *****/
function amPm(h) {
	if(h<12) return "오전 "+addZero(h);
	else if(h>12) return "오후 "+addZero(h-12);
	else return "오후 12";
}


// 옛스러운 방식
/*
$("#bt_google_login").on("click", function(){
	auth.signInWithPopup(google).then(function(data){
		$("#bt_google_login").hide();
		$("#bt_google_logout").show();
		user = data.user;
		$(".email").html(user.email);
		$(".symbol").show();
		$(".symbol > img").attr("src", user.photoURL);
	});
});
$("#bt_google_logout").on("click", function(){
	auth.signOut().then(function(data){
		$(this).hide();
		$("#bt_google_login").show();
		$("#bt_google_logout").hide();
		user = null;
		$(".email").html("");
		$(".symbol").hide();
		$(".symbol > img").attr("src", "");
	});
});
*/