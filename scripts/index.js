let viewDisEles = document.getElementsByClassName("view-dis");
const loadMoreEle = document.getElementById("load-more");
const productsEle = document.getElementById("products");
const addToCartButtons = document.getElementsByClassName("add-to-cart");

console.log(viewDisEles);

for(let i = 0; i < viewDisEles.length; i++)
{
    const element = viewDisEles[i];

   addingViewListener(element);

   addingAddToCartListener(addToCartButtons[i]);
}

function addingViewListener(element){
    element.onclick = () =>{
        const productName = element.parentElement.children[0].innerHTML;
        // console.log(viewDisEle.parentElement.children[0].innerHTML);
        const xhttp = new XMLHttpRequest();    
        xhttp.open("POST", "/product-discription");
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({productName: productName}));
    
        xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const productDis = xhttp.responseText;
    
                    const disEle = document.createElement("h4");
                    disEle.innerHTML = productDis;
    
                    element.parentElement.appendChild(disEle);
    
                    element.disabled = true;
                }
            };
        }
}

function addingAddToCartListener(element)
{
    element.onclick = event =>{
        event.preventDefault();
        event.target.style.background = "red";
        
        addToCart(event.target.parentNode.getAttribute("id"));
        event.target.disabled = true;
    }

}

function addToCart(id)
{
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/cart");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({id: id}));

    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            console.log(xhttp.responseText);

        }else if(this.status === 401 && this.readyState == 4)
        {
            alert("Please login");
            window.location.href = "/auth";
        }
    }
}


loadMoreEle.onclick = () =>{

    let length = productsEle.children.length;

    const xhttp = new XMLHttpRequest();    
    xhttp.open("POST", "/load-more");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ length : length}));

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            let products = JSON.parse(xhttp.responseText);

            for(let i = 0; i < products.length; i++)
            {

                let productContainerEle = document.createElement("div");
                let productNameEle = document.createElement("h4");
                let productPriceEle = document.createElement("h4");
                let viewDisButton = document.createElement("button");
                let addToCartButton = document.createElement("button");

                const product = products[i];
                productContainerEle.setAttribute("id", product._id);
                productNameEle.innerHTML = product.name;
                productPriceEle.innerHTML = product.price;

                viewDisButton.innerHTML = "View Discription";
                addToCartButton.innerHTML = "Add to Cart";
                addingViewListener(viewDisButton);
                addingAddToCartListener(addToCartButton);

                productContainerEle.appendChild(productNameEle);
                productContainerEle.appendChild(productPriceEle);
                productContainerEle.appendChild(viewDisButton);
                productContainerEle.appendChild(addToCartButton);

                productsEle.appendChild(productContainerEle);
            }
        }
    };
    
}