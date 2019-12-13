window.onscroll = () => scrollFunction();

function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		document.getElementById("header").style.height = "0px";
	} else {
		document.getElementById("header").style.height = "200px";
	}
}