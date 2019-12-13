window.onscroll = () => scrollFunction();
document.getElementsByTagName("body")[0].onresize = () =>scrollFunction();
function scrollFunction() {
    let header = document.getElementById("header");
    let headerImage = document.getElementById("headerImage");

    if (window.innerHeight < 800) {
        document.getElementById("contact").style.marginTop = "52px";
        if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
            header.style.height = "0px";
            headerImage.style.height = "0px";
        } else {
            header.style.height = "200px";
            headerImage.style.height = "200px";
        }
    }else{
        document.getElementById("contact").style.marginTop = "0px";
        if (header.style.height === "0px" && headerImage.style.height === "0px") {
            header.style.height = "200px";
            headerImage.style.height = "200px";
        }
    }
}