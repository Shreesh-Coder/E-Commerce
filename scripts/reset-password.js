const passEle = document.getElementById("pass");
const conpassEle = document.getElementById("con-pass");
const formEle = document.getElementById("pass-reset")

let valadation = event =>{

    event.preventDefault();
    const regEx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$");
    
    const pass = passEle.value;
    const conPass = conpassEle.value;

    if(pass.match(conPass))
    {
        if(pass.match(regEx))
        {
            alert("password are not following rules.")
            return false;
        }
        else
        {
            return true;
        }
    }
    else{
        alert("password is mismatched")
        return false;
    }
}