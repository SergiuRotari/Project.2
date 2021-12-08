var company;
var lang = "ro";
var cookiProducts = [];

window.onload = () => {
    getCookieLanguages();
    company = getCookie("company");
    getLanguages();
    getUrlParam();
    company = getCookie('projectCompany');
    console.log('company by cookie: ', company);
    getCompanyData();
    getCompany();
    getButton();
    getInfo();
    getButtonApetit();
    const searchValue = getUrlSearchParam('searchValue');
    const searchElement = document.getElementById('search-input');
    searchElement.value = searchValue;
    cookiProducts = JSON.parse(getCookie("cookiProducts"));
    console.log("cookiProducts", JSON.parse(getCookie("cookiProducts")));
}

function getUrlParam() {
    const url = new URL(window.location.href);
    let urlParams = url.pathname.split('/');
    urlParams = urlParams.filter(el => el !== null && el !== '')
    console.log('url: ', urlParams[urlParams.length - 1]);
    company = urlParams[urlParams.length - 1];
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getLanguages() {
    $.ajax({
        url: "http://api.coffeein.md/api/languages",
        type: 'GET',
        dataType: 'json', // added data type
        success: function (response) {
            const languagesElement = document.getElementById('languages');
            let html = '';
            for (let a = 0; a < response.docs.length; a++) {
                html += `<div class="single-language " onclick="setCookie('language','${response.docs[a].slug}',30)">${response.docs[a].slug}</div>`
                /* if (window.location.hash) {
                     if (window.location.hash === lang) {
                         languages.textContent = a.lang.slug
                     };
                 }*/

            }
            languagesElement.innerHTML = html;
        },
        error: function () {

        }
    });
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookieLanguages() {
    lang = getCookie('language');
}

function translateSerData(objectToTranslate) {
    let translateText = "";
    translateText = objectToTranslate.find(fiecareElement => {
        return fiecareElement.shortName === lang;
    })
    return translateText.content;
}

function updateURL() {
    if (history.pushState) {
        var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        var newUrl = baseUrl + '?tyapk=awesome';
        history.s(null, null, newUrl);
    }
    else {
        console.warn('History API не поддерживается');
    }
}


function getCompany() {
    $.ajax({
        type: "GET",
        url: 'http://api.coffeein.md/api/companies/slug/' + company,

        success: function (response) {
            const element = document.getElementById('header');
            let html = `<div class="header">
            <img class="photo" src="http://api.coffeein.md/api/${response.logo.path}">
            <div class="basket"> Cos </div>
            <div class="number">${response.phone}</div><div>
            `;
            element.innerHTML = html;
        },

        dataType: 'json'
    });
}



function getCompanyData() {
    $.ajax({
        type: "GET",
        url: 'http://api.coffeein.md/api/products/sorted?page=1&searchTerm=&productCategory=all&company=' + company,

        success: function (response) {
            productData = response;
            console.log('data:', productData)
        }
    })
}


var productData;
function getButton() {
    $.ajax({
        url: 'http://api.coffeein.md/api/products/sorted?page=1&searchTerm=&productCategory=all&company=' + company,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            productData = response;
            console.log('data:', productData)
            getProduse();
            categoryProdus();
        }
    })
}

function categoryProdus() {
    const categorii = document.getElementById('categoryButton')
    let html = `<div class="categories" onclick="getProduse()"> Toate</div>
            <div class="data" onclick="showBottonHot()"> ${translateSerData(productData.categories[0].name)}</div>
            <div class="data" onclick="showBottonCold()"> ${translateSerData(productData.categories[1].name)}</div>
            `
    categorii.innerHTML = html;
}
var drinkCold;
function showBottonCold() {
    $.ajax({
        url: 'http://api.coffeein.md/api/products/sorted?page=1&searchTerm=&productCategory=cold-drinks&company=' + company,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            drinkCold = response;
            coldDrink();
        }
    })
}

function coldDrink() {
    const producte = document.getElementById('products')
    let html = "";
    for (let a = 0; a < drinkCold.products.length; a++) {
        html += `<div class="category">${translateSerData(drinkCold.products[a].category.name)}</div>`

        for (let b = 0; b < drinkCold.products[a].products.length; b++) {
            html += `<div class="producte col-lg-4" style="position:relative;">
           <img class="photoCoffee" src="http://api.coffeein.md/api/${drinkCold.products[a].products[b].image.path}">
           <br>${translateSerData(drinkCold.products[a].products[b].title)}
           <br><span class="discriptiop">${translateSerData(drinkCold.products[a].products[b].mainDescription)} </span>
           <div class="description2">${translateSerData(drinkCold.products[a].products[b].description)}</div>
           <br><div class="button-green container">
           <div id="price">${drinkCold.products[a].products[b].price}  <sup><small>lei</small></sup></div>
           <div class="button-buy">În coș <img class="shop" src="images/shop.svg"></div></div>          
           </div>`
        }
    }
    producte.innerHTML = html;

}

var drinkHot;
function showBottonHot() {
    $.ajax({
        url: 'http://api.coffeein.md/api/products/sorted?page=1&searchTerm=&productCategory=hot-drinks&company=' + company,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            drinkHot = response;
            hotDrink();
        }
    })
}

function hotDrink() {
    const producte = document.getElementById('products')
    let html = "";
    for (let a = 0; a < drinkHot.products.length; a++) {
        console.log(drinkHot.products[a])
        html += `<div class="category">${translateSerData(drinkHot.products[a].category.name)}</div>`

        for (let b = 0; b < drinkHot.products[a].products.length; b++) {
            html += `<div class="producte col-lg-4" style="position:relative;">
           <img class="photoCoffee" src="http://api.coffeein.md/api/${drinkHot.products[a].products[b].image.path}"> 
           <br>${translateSerData(drinkHot.products[a].products[b].title)}
           <br><span class="discriptiop">${translateSerData(drinkHot.products[a].products[b].mainDescription)} </span>
           <div class="description2">${translateSerData(drinkHot.products[a].products[b].description)}</div>
           <br><div class="button-green container">
           <div id="price">${drinkHot.products[a].products[b].price}  <sup><small>lei</small></sup></div>
           <div class="button-buy">În coș <img class="shop" src="images/shop.svg"></div></div>          
           </div>`
        }
    }
    producte.innerHTML = html;

}
function getButtonApetit() {
    $.ajax({
        url: 'http://api.coffeein.md/api/products/sorted?page=1&searchTerm=&productCategory=patisserie&company=' + company,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            productPatiserie = response;
            console.log('apetit', productPatiserie)
            categoryProdusApetit()
        }
    })
}

function categoryProdusApetit() {
    const categorii = document.getElementById('categoryButton')
    let html = `<div class="categories" onclick="getProduse()"> Toate</div>
            <div class="data" onclick="getProduse()"> ${translateSerData(productPatiserie.categories[0].name)}</div>        
            `
    categorii.innerHTML = html;
}



function getProduse() {
    const products = document.getElementById('products')
    let html = "";
    for (let a = 0; a < productData.products.length; a++) {
        console.log(productData.products[a])
        html += `<div class="product-category">${translateSerData(productData.products[a].category.name)}</div>`

        for (let b = 0; b < productData.products[a].products.length; b++) {
            html += `<div class="product col-lg-4">
           <img class="photoCoffee"src="http://api.coffeein.md/api/${productData.products[a].products[b].image.path}">
           <br><div class="product-name">${translateSerData(productData.products[a].products[b].title)}</div>
           <span class="discriptiop">${translateSerData(productData.products[a].products[b].mainDescription)} </span>
           <div class="description2">${translateSerData(productData.products[a].products[b].description)}</div>
           <br><div class="button-green container">
           <div id="price">${productData.products[a].products[b].price}  <sup><small>lei</small></sup></div>
           <div class="button-buy" onclick="addProductToCard('${productData.products[a].products[b]._id}','${productData.products[a].products[b].price}','#basket')">În coș <img class="shop" src="images/shop.svg"></div></div>   
           </div>`
        }
    }
    products.innerHTML = html;
}
function addProductToCard(productId, price) {
    console.log("by", productId);
    const cookieProductData = {
        id: "",
        price: "",
        count: 1,
    }

    cookieProductData.id = productId;
    cookieProductData.price = price;
    cookiProducts.push(cookieProductData);
    cookiProducts = getUniqueArrayData(cookiProducts);
    setCookie('cookiProducts', JSON.stringify(cookiProducts));

}

function getUniqueArrayData(array) {
    console.log("array", array)
    var filterArray = [];
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        let elementuDejaAdaugat = false;
        for (let index1 = 0; index1 < filterArray.length; index1++) {
            const element1 = filterArray[index1];
            console.log("element",element, element1)
            if (element.id === element1.id) {
                elementuDejaAdaugat = true;
                element1.count++;
            };
            var productCount =0;
            var totalPrice =0;
            console.log("filter",filterArray)
            for (var w in filterArray ){
                productCount += filterArray[w].count;
                totalPrice += calculateProductPrice(filterArray[w].price, filterArray[w].count);
                document.getElementById("pricee").innerHTML = totalPrice;               
            }
            $('#count').html(productCount); 
        };
        if (!elementuDejaAdaugat) {
            filterArray.push(element);
        }        
    }
    return filterArray;
} 
   function calculateProductPrice(price, count) {
       console.log("price",price, count)
      return parseInt(price) * count;
    };

function getInfo() {
    $.ajax({
        url: 'http://api.coffeein.md/api/companies/slug/' + company,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            const elementt = document.getElementById('footerFoto');
            let html = `
            <img class="photto" src="http://api.coffeein.md/api/${response.logo.path}">
            <div class="information">
            <div class="phoneFooter"><img class="phone" src="images/phone.png">${response.phone}
            </div>
            <div class="mailFooter"><img class="mail" src="images/maail.png">${response.mail}</div>
            </div>
            `;
            elementt.innerHTML = html;
        },
        error: function () {

        }
    });
}
var map = L.map('map').setView([48.15659, 28.28489], 13);
L.tileLayer(`https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=iO5GtvMVduOknX8eERCy`, {
    attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`,

}).addTo(map);
var marker = L.marker([48.161956163872695, 28.30490089381367]).addTo(map);
marker.bindTooltip("Coffeein", { permanent: true, className: "my-label", offset: [0, 0] });
marker.addTo(map);

function setUrlSearchParam(name, value) {
    console.log("nameValue", name);
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.location.href = url.href;
}

function getUrlSearchParam(name) {
    const url = new URL(window.location.href);
    const paramValue = url.searchParams.get(name);
    console.log('paramValue: ', paramValue);
    return paramValue;
}

let input = document.querySelector('#search-input');

input.oninput = function () {
    let value = this.value.trim();
    let list = document.querySelectorAll('.product');


    if (value) {
        list.forEach(elem => {
            if (elem.innerText.search(value) == -1) {
                elem.classList.add('hide');
            }
        });
    } else {
        list.forEach(elem => {
            elem.classList.remove('hide');
        });
    }


};

