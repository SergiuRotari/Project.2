var cookiProducts = [];
var cartPageProducts = [];
var company;
window.onload = () => {
    
    company = getCookie("company");
    company = getCookie('projectCompany');
    console.log('company by cookie: ', company);
    getCompany();
    cookiProducts = JSON.parse(getCookie("cookiProducts"));
    for (let index = 0; index < cookiProducts.length; index++) {
        const element = cookiProducts[index];   
        getProductById(element.id, element);
    };
    
    getInfo();

};



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

function getProductById(id, product){
    $.ajax({
        url: `http://api.coffeein.md/api/products/` + id,
        type: 'GET',
        dataType: 'json', // added data type
        success: function (response) {
            getCartPageProducts(product, response);

          
        },
        error: function () {

        }
    });
}

function  getCartPageProducts(cookiProducts, serverProducts){
const newProduct =  serverProducts;
newProduct.count = cookiProducts.count;
cartPageProducts.push(newProduct);
generateCartProducts(newProduct);

}

function generateCartProducts(product) {
    
   const element= document.getElementById('cartProducts')
   const uniqueId = generateRandomId(8);
   let html=`<div id='${uniqueId}' class='cartProduct'>`
   console.log("product",product)
   html+=`<img class="cartPhoto col-lg-4" src="http://api.coffeein.md/api/${product.image.path}">`
   
   html+=`<div class="titlu col-lg-4">${product.title[0].content}</div>`
   html+=`<div class="ingredients ">${product.mainDescription[0].content.slice(0,3)}</div>`
   html+=`<img onclick="decreaseProductCount('${product._id}','${uniqueId}')" class="minus" src="../images/minus.png">`
   html+=`<div class="count">${product.count}</div>`
   html+=`<img onclick="increaseProductCount('${product._id}','${uniqueId}')" class="plus" src="../images/plus.png">`
   html+=`<div class="price col-lg-1">${product.price}<sup><small>lei</small></sup></div>`
   html+=`<img onclick="removeCookieProduct('${product._id}')" class="remove" src="../images/sterge.png">`
   html+="</div>"
   element.insertAdjacentHTML("beforeend", html);
}
function generateRandomId(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

function decreaseProductCount(id, htmlElementId){
    let newProductCount = 1;
    let newProductPrice = 0;
  const localCookieProduct = JSON.parse(getCookie("cookiProducts"));
  const cookieById = localCookieProduct.find(element => element.id === id)
  for (let index = 0; index < localCookieProduct.length; index++) {
      const element = localCookieProduct[index];
      if(element.id === id && localCookieProduct[index].count>1){ 
          localCookieProduct[index].count--
        newProductCount = localCookieProduct[index].count;
        newProductPrice = localCookieProduct[index].price;
      }
     
  }
setCookie("cookiProducts", JSON.stringify(localCookieProduct), 30); 
console.log("decreaseProductCount",cookieById);
cookiProducts = localCookieProduct;
const element = document.getElementById(htmlElementId);
element.querySelectorAll('.count')[0].innerHTML = newProductCount;
console.log("element", element);
element.querySelectorAll('.price')[0].innerHTML = newProductCount * newProductPrice;
}
function increaseProductCount(id, htmlElementId){
    let newProductCount = 1;
    let newProductPrice = 0;
  const localCookieProduct = JSON.parse(getCookie("cookiProducts"));
  const cookieById = localCookieProduct.find(element => element.id === id)
  for (let index = 0; index < localCookieProduct.length; index++) {
      const element = localCookieProduct[index];
      if(element.id === id && localCookieProduct[index].count>0){ 
          localCookieProduct[index].count++
        newProductCount = localCookieProduct[index].count;
        newProductPrice = localCookieProduct[index].price;
      }
     
  }
setCookie("cookiProducts", JSON.stringify(localCookieProduct), 30); 
console.log("increaseProductCount",cookieById);
cookiProducts = localCookieProduct;
const element = document.getElementById(htmlElementId);
element.querySelectorAll('.count')[0].innerHTML = newProductCount;
console.log("element", element);
element.querySelectorAll('.price')[0].innerHTML = newProductCount * newProductPrice;
}

/*function plus(id){  
  const localCookieProduct = JSON.parse(getCookie("cookiProducts"));
  const cookieById = localCookieProduct.find(element => element.id === id)
  for (let index = 0; index < localCookieProduct.length; index++) {
      const element = localCookieProduct[index];
      if(element.id === id && localCookieProduct[index].count>1){ 
          localCookieProduct[index].count++
        
      }
     
  }
setCookie("cookiProducts", JSON.stringify(localCookieProduct), 30); 

console.log("plus",cookieById);
}*/


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/*function removeCookieProduct(id){
    
    cookiProducts = cookiProducts.filter(element => element.id !== id);
    setCookie("cookiProducts", JSON.stringify(cookiProducts), 30); 

};*/
function removeCookieProduct(id){
    cookiProducts = JSON.parse(getCookie("cookiProducts"));
    const element1= document.getElementById('cartProducts')
    element1.innerHTML = "";
    cookiProducts = cookiProducts.filter(element => element.id !== id);
    setCookie("cookiProducts", JSON.stringify(cookiProducts), 30); 
cookiProducts = JSON.parse(getCookie("cookiProducts"));
    for (let index = 0; index < cookiProducts.length; index++) {
        const element = cookiProducts[index];   
        getProductById(element.id, element);
    };
};



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
var map = L.map('map').setView([48.15659, 28.28489], 13);
L.tileLayer(`https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=iO5GtvMVduOknX8eERCy`, {
    attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`,

}).addTo(map);
var marker = L.marker([48.161956163872695, 28.30490089381367]).addTo(map);
marker.bindTooltip("Coffeein", { permanent: true, className: "my-label", offset: [0, 0] });
marker.addTo(map);

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
            <div class="phoneFooter"><img class="phone" src="..company/images/phone.png">${response.phone}
            </div>
            <div class="mailFooter"><img class="mail" src="../company/images/maail.png">${response.mail}</div>
            </div>
            `;
            elementt.innerHTML = html;
        },
        error: function () {

        }
    });
}