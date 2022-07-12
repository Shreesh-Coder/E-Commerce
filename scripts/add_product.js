const productsEle = document.getElementById("products");


function productFetcher()
{
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", "product/product-view");
    xhttp.send();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            
            let products = JSON.parse(xhttp.responseText);

            for(let i = 0; i < products.length; i++)
            {

                let productContainerEle = document.createElement("div");
                let productImg =  document.createElement("img");
                let productNameEle = document.createElement("input");
                let productPriceEle = document.createElement("input");
                let viewDisEle = document.createElement("input");
                let productQuantity = document.createElement("input");
                let updateButton = document.createElement("button");
                let deleteButton =  document.createElement("button");

                const product = products[i];
                productContainerEle.setAttribute("id", product._id);

                productImg.src = "../" + product.image;
                productNameEle.value = product.title;
                productPriceEle.value = product.price;                
                viewDisEle.value = product.description;
                productQuantity.value = product.stock;

                updateButton.innerHTML = "Update";
                deleteButton.innerHTML = "Delete";
                addingUpdateListener(updateButton);
                addingDeleteListener(deleteButton);

                productContainerEle.appendChild(productImg);                
                productContainerEle.appendChild(productNameEle);
                productContainerEle.appendChild(productPriceEle);
                productContainerEle.appendChild(viewDisEle);
                productContainerEle.appendChild(productQuantity);

                productContainerEle.appendChild(updateButton);
                productContainerEle.appendChild(deleteButton);

                productsEle.appendChild(productContainerEle);
            }
        }
    }
}

window.onload = productFetcher;

function addingDeleteListener(button){
    button.onclick = deleteEventListener;
}

function addingUpdateListener(button)
{
    button.onclick = updateEventListener;
}

let updateEventListener = event =>{
    event.preventDefault();
    
    const xhttp = new XMLHttpRequest();
    
    xhttp.open("POST", "product/product-update");
    console.log(event.target);
    xhttp.setRequestHeader("Content-type", "application/json");
    let product_id = event.target.parentNode.getAttribute("id");    
    let productAttributs = event.target.parentNode.children;
    
    let name = productAttributs[1].value;
    let price = productAttributs[2].value;
    let description = productAttributs[3].value;
    let quantity = productAttributs[4].value;

    xhttp.send(JSON.stringify({
        product_id: product_id,
        name: name,
        price: price,
        description: description,
        quantity: quantity
    }));
    
    xhttp.onreadystatechange = function()
    {
        if(this.status === 200 && this.readyState === 4)
        {
            
            console.log(xhttp.responseText);
        }
    }

}


let deleteEventListener = event =>{
    event.preventDefault();
    
    const xhttp = new XMLHttpRequest();
    
    xhttp.open("POST", "product/product-delete");
    console.log(event.target);
    xhttp.setRequestHeader("Content-type", "application/json");
    let product_id = event.target.parentNode.getAttribute("id");    
    xhttp.send(JSON.stringify({product_id: product_id}));
    
    xhttp.onreadystatechange = function()
    {
        if(this.status === 200 && this.readyState === 4)
        {
            
            event.target.parentNode.remove();
        }
    }

}
