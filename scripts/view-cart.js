const quantityIncButtons = document.getElementsByClassName("quantity-inc");
const quantityDecButtons = document.getElementsByClassName("quantity-dec");
const deleteButtons = document.getElementsByClassName("delete-product");
let viewDisEles = document.getElementsByClassName("view-dis");



let deleteEventListener = event =>{
    event.preventDefault();
    
    const xhttp = new XMLHttpRequest();
    
    xhttp.open("POST", "/delete-product");
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

for(let i = 0; i < quantityIncButtons.length; i++)
{
    quantityIncButtons[i].onclick = event =>{
        changeQuantity("/quantity-inc", event);
    }
}


for(let i = 0; i < quantityDecButtons.length; i++)
{
    quantityDecButtons[i].onclick = event =>{
        changeQuantity("/quantity-dec", event);
    }
}


function changeQuantity(endPoint, event)
{

    let product_id = event.target.parentNode.getAttribute("id");    
    let quantity = event.target.parentNode.children[4].quantity;
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", endPoint);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({product_id: product_id}));

    xhttp.onreadystatechange = function()
    {
        if(this.status === 200 && this.readyState === 4)
        {
            event.target.parentNode.children[4].innerHTML = xhttp.responseText;            
        }
    }
}

for(let i = 0; i < deleteButtons.length; i++)
{
    deleteButtons[i].onclick = deleteEventListener;
    
}


for(let i = 0; i < viewDisEles.length; i++)
{
    const element = viewDisEles[i];

   addingViewListener(element);   
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
