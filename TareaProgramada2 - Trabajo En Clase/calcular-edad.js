function calculate(){
    const num1 = parseFloat(document.getElementById("num1").value);
    let mayor = "Usted es mayor de edad";
    let menor = "Usted es menor de edad";
 
    if(isNaN(num1)){
        alert("Por favor, ingrese numeros validos");
        return;
        
    }else if(num1 >= 18){
        result = mayor;
        document.getElementById("result").innerText = result;
    }else if(num1 < 18){
        result = menor;
        document.getElementById("result").innerText = result;
    }
 
}