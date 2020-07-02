if (window.location.href.includes('login')) {
	document.querySelector("input[type=text]").value = 13553550634;
	document.querySelector("input[type=password]").value = "bqy19971130";
	document.querySelector('.tb-logo').innerHTML = '<h1 style="font-size: 50px;"> 奶牛达人 </h1>';

	document.querySelector("input[type=text]").value = 13553550634;
	document.querySelector("input[type=password]").value = "bqy19971130";
	document.querySelector('.tb-logo').innerHTML = '<h1 style="font-size: 50px;"> 奶牛达人 </h1>';
}


//准备执行uniapp  
document.addEventListener('UniAppJSBridgeReady', function() {
	fetch('https://we.taobao.com/account/getAccountSettingInfo.json?__version__=3.0').then(res => res.json()).then(res => {
		uni.postMessage({
			data: {
				action: res.data
			}
		});
	})
});
