window.onscroll = () => scrollFunction();
document.getElementsByTagName("body")[0].onresize = () =>scrollFunction();
function scrollFunction() {
    let header = document.getElementById("header");
    let headerImage = document.getElementById("headerImage");
    console.log(document.body.clientHeight)
    if (document.body.clientHeight > 1250) {
        if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
            header.style.height = "0px";
            headerImage.style.height = "0px";
        } else {
            header.style.height = "200px";
            headerImage.style.height = "200px";
        }
    }else{
        if (header.style.height === "0px" && headerImage.style.height === "0px") {
            header.style.height = "200px";
            headerImage.style.height = "200px";
        }
    }
}