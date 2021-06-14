const cartContainer = document.querySelector('.cart-container');
const productList = document.querySelector('.product-list');
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountInfo = document.getElementById('cart-count-info');
let cartItemID = 1;
eventListeners();
function eventListeners(){
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
        loadCart();
    });
   
    document.getElementById('cart-btn').addEventListener('click', () => {
        cartContainer.classList.toggle('show-cart-container');
     
       
    });

    productList.addEventListener('click', purchaseProduct);


    cartList.addEventListener('click', deleteProduct);
}

function updateCartInfo(){
    let cartInfo = findCartInfo();
    cartCountInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total;
}

function loadJSON(){
    fetch('products.json')
    .then(response => response.json())
    .then(data =>{
        let html = '';
        data.forEach(product => {
            html += `
                <div class = "product-item">
                    <div class = "product-img">
                        <img src = "${product.filename}" alt = "product image" width="${product.width}" height="${product.width}">
                        <button type = "button" onclick="test()" class = "add-to-cart-btn">
                            <i class = "fas fa-shopping-cart"></i>Add To Cart
                        </button>
                    </div>

                    <div class = "product-content">
                        <h3 class = "product-name">${product.title}</h3>
                        <small class = "product-name">${product.description}</small>
                        <br>
                        <h3><span class = "product-category">${product.type}</span></h3>
                        <p class = "product-price">₹${product.price}</p>
                        <strong><span class = "product-stock">Stock ${product.stock}</span></strong>
                    </div>
                </div>
            `;
        });
        productList.innerHTML = html;
    })
    .catch(error => {
        alert(`User live server or local server`);
    })
}
function test()
{
    document.query("add-to-cart-btn").onclick = function() {
        //disable
        this.disabled = true;
    
        //do some validation stuff
    }
}
function purchaseProduct(e){
    if(e.target.classList.contains('add-to-cart-btn')){
        let product = e.target.parentElement.parentElement;
        getProductInfo(product);
    }
}

function getProductInfo(product){
    let productInfo = {
        id: cartItemID,
        imgSrc: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        category: product.querySelector('.product-category').textContent,
        price: product.querySelector('.product-price').textContent,
        stock: product.querySelector('.product-price').textContent
    }
    cartItemID++;
  
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}

function addToCartList(product){
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML = `
        <img src = "${product.imgSrc}" alt = "product image">
        <div class = "cart-item-info">
            <h3 class = "cart-item-name">${product.name}</h3>
            <span class = "cart-item-category">${product.category}</span>
            <span class = "cart-item-price">${product.price}</span>
        </div>

        <button type = "button" class = "cart-item-del-btn">
            <i class = "fas fa-times"></i>
        </button>


        <div class="col-6">
        <ul class="pagination justify-content-end set_quantity">
        <li class="page-item">
        <button class="page-link " onclick="decreaseNumber('textbox','itemval')">
        <i class="fas fa-minus"></i> </button>
        </li>
        <li class="page-item"><input type="text" name="" class="page-link" value="0" id="textbox" >
        </li>
        <li class="page-item">
        <button class="page-link" onclick="increaseNumber('textbox','itemval')"> <i class="fas fa-plus"></i></button>
        </li>
        </ul>
        </div>
    `;
    cartList.appendChild(cartItem);
}

function saveProductInStorage(item){
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
    updateCartInfo();
}
function getProductFromStorage(){
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
   
}


function loadCart(){
    let products = getProductFromStorage();
    if(products.length < 1){
        cartItemID = 1; 
    } else {
        cartItemID = products[products.length - 1].id;
        cartItemID++;
        
    }
    products.forEach(product => addToCartList(product));

    updateCartInfo();
}

function findCartInfo(){
    let products = getProductFromStorage();
    let total = products.reduce((acc, product) => {
        let price = parseFloat(product.price.substr(1)); 
        return acc += price;
    }, 0); 

    return{
        total: total.toFixed(2),
        productCount: products.length
    }
}


function deleteProduct(e){
    let cartItem;
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement;
        cartItem.remove(); 
    } else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove(); 
    }

    let products = getProductFromStorage();
    let updatedProducts = products.filter(product => {
        return product.id !== parseInt(cartItem.dataset.id);
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts)); 
    updateCartInfo();
}

const decreaseNumber = (incdec, itemprice) => {
    var itemval = document.getElementById(incdec);
    var itemprice = document.getElementById(itemprice);
    console.log( itemprice.innerHTML);
    // console.log(itemval.value);
    if(itemval.value <= 0){
    itemval.value = 0;
    alert('Negative quantity not allowed');
    }else{
    itemval.value = parseInt(itemval.value) - 1;
    itemval.style.background = '#fff';
    itemval.style.color = '#000';
    itemprice.innerHTML  = parseInt(itemprice.innerHTML) - 15;
    product_total_amt.innerHTML  = parseInt(product_total_amt.innerHTML) - 15;
    total_cart_amt.innerHTML  = parseInt(product_total_amt.innerHTML) + parseInt(shipping_charge.innerHTML);
    }
    }
    const increaseNumber = (incdec, itemprice) => {
    var itemval = document.getElementById(incdec);
    var itemprice = document.getElementById(itemprice);
    // console.log(itemval.value);
    if(itemval.value >= 5){
    itemval.value = 5;
    alert('max 5 allowed');
    itemval.style.background = 'red';
    itemval.style.color = '#fff';
    }else{
    itemval.value = parseInt(itemval.value) + 1;
    itemprice.innerHTML  = parseInt(itemprice.innerHTML ) + 15;
    product_total_amt.innerHTML  = parseInt(product_total_amt.innerHTML) + 15;
    total_cart_amt.innerHTML  = parseInt(product_total_amt.innerHTML) + parseInt(shipping_charge.innerHTML);
    }
    }