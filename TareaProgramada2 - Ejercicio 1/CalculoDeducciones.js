function calculate(){
    const salarioBruto = parseFloat(document.getElementById("salarioBruto").value);
    let cargasSociales = 0;
    let impuestoRenta = 0;
    let salarioNeto = 0;

    let porcentajeDeduccionCS = 10.67 / 100;
    let porcentajeDeduccionIRvariable1 = 10 / 100;
    let porcentajeDeduccionIRvariable2 = 15 / 100;
    let porcentajeDeduccionIRvariable3 = 20 / 100;
    let porcentajeDeduccionIRvariable4 = 25 / 100;
 
    if(isNaN(salarioBruto)){
        alert("Por favor, ingrese numeros validos");
        return;
    }

    let deduccionCS = salarioBruto * porcentajeDeduccionCS;
    document.getElementById("cargasSociales").innerText = deduccionCS;

    let salarioConDeduccionCS = salarioBruto - deduccionCS;

    //Rentas de hasta ₡929.000,00
    if(salarioBruto <= 929000){
        salarioNeto = salarioConDeduccionCS;
        document.getElementById("salarioNeto").innerText = salarioNeto;

        //sobre el exceso de ₡929.000,00 y hasta ₡1.363.00,00
    }else if(salarioBruto > 929001 && salarioBruto <= 1363000){
        let deduccionIR = salarioBruto * porcentajeDeduccionIRvariable1;
        document.getElementById("impuestoRenta").innerText = deduccionIR;
        let salarioNeto = salarioConDeduccionCS - deduccionIR;
        document.getElementById("salarioNeto").innerText = salarioNeto;

        //sobre el exceso de ₡1.363.00,00 y hasta ₡2.392.00,00
    }else if(salarioBruto > 1363001 && salarioBruto <= 2392000){
        let deduccionIR = salarioBruto * porcentajeDeduccionIRvariable2;
        document.getElementById("impuestoRenta").innerText = deduccionIR;
        let salarioNeto = salarioConDeduccionCS - deduccionIR;
        document.getElementById("salarioNeto").innerText = salarioNeto;

        //sobre el exceso de ₡2.392.00,00 y hasta ₡4.783.00,00
    }else if(salarioBruto > 2392001 && salarioBruto <= 4783000){
        let deduccionIR = salarioBruto * porcentajeDeduccionIRvariable3;
        document.getElementById("impuestoRenta").innerText = deduccionIR;
        let salarioNeto = salarioConDeduccionCS - deduccionIR;
        document.getElementById("salarioNeto").innerText = salarioNeto;

        //Sobre el exceso de ₡4.783.00,00
    }else if(salarioBruto > 4783001){
        let deduccionIR = salarioBruto * porcentajeDeduccionIRvariable4;
        document.getElementById("impuestoRenta").innerText = deduccionIR;
        let salarioNeto = salarioConDeduccionCS - deduccionIR;
        document.getElementById("salarioNeto").innerText = salarioNeto;
    }

    
 
}