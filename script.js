var slider123;

window.onload = function () {
    generateSlider();
    goToCompanyPageBySlug(slug);
}

$(document).ready(function () {
    generateSlider();
    
});


function generateSlider() {
    $.ajax({
        url: "http://api.coffeein.md/api/slider-info",
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            slider123 = response;
            console.log('data:', slider123)
            diseneazaSlider1();
            setTimeout(()=>{
                $('#slide').slick({
                    dots: true,
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 300,
                    autoplay: false,
                    autoplaySpeed: 500,
                })
            },100)
         
            comp();
        }
    })
}


function diseneazaSlider1() {
    const categories = document.getElementById('slide')
    let html = "";

    for (let a = 0; a < slider123.docs.length; a++) {
        console.log('documente', slider123.docs[a])
        html += `<div class="container">
        <div class="row slide1">
        <div class="imagini col-lg-6">
            <img class="imagini" src="http://api.coffeein.md/api/${slider123.docs[a].image.path}">
        </div>
        <div class="content col-lg-6 ">
            <div class="title">${slider123.docs[a].title[0].content}</div>
            <div class="description">${slider123.docs[a].description[0].content}</div>
            <img src="http://api.coffeein.md/api/${slider123.docs[a].company.logo.path}">

        </div>
        </div>
    </div>`
    
    }

    categories.innerHTML = html;
}

function comp(){
    const company = document.getElementById('companii')
    let html = "";
    for (let a = 0; a < slider123.docs.length; a++) {
        html += 
        `<div class="single-company">
        <img class="companii" src="http://api.coffeein.md/api/${slider123.docs[a].company.logo.path}"></div>`
    }
    company.innerHTML = html;
}

function goToCompanyPageBySlug(slug) {
    setCookie('projectCompany', slug, 30);
    window.location.href = 'company/index.html';
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}