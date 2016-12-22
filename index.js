require('impress.js');
impress().init();
// https://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=123
var frame = document.createElement('iframe');
frame.height=0;
frame.width=0;
frame.scrolling='no';
frame.frameborder='0';
frame.src='https://tts.baidu.com/text2audio?lan=en&ie=UTF-8&text=we are awesome';
document.body.appendChild(frame);

var rootElement = document.getElementById( "impress" );
rootElement.addEventListener( "impress:stepenter", function(event) {
	var currentStep = event.target;
	var curDom = document.getElementById(currentStep.id);
	console.log(curDom)
});