<?php

$transacciones = array(
    array("id" => 1, "descripcion" => "Compra del diario", "monto" => 85000),
);

$sumaMonto = 0;

function registrarTransaccion($id, $descripcion, $monto) {
    global $transacciones;
    $transaccion = array(
        "id" => $id,
        "descripcion" => $descripcion,
        "monto" => $monto
    );
    array_push($transacciones, $transaccion);
    echo "Transacción terminada\n";
}

registrarTransaccion(2, "Microondas", 145000);
registrarTransaccion(3, "Entradas partido de Futbol", 50000);
registrarTransaccion(4, "Netflix", 8500);

function generarEstadoDeCuenta(){
    $archivo = fopen("estado_cuenta.txt", "w");
    global $transacciones;
    global $sumaMonto;
    $NumTransaccion = 1;

    if($archivo){
    foreach($transacciones as $recorrerMonto){
        $datostxt = "Transaccion Numero " . $NumTransaccion . " es de: " . $recorrerMonto["monto"] . " colones\n";
        echo $datostxt;
        fwrite($archivo, $datostxt);
        $sumaMonto += $recorrerMonto["monto"];
        $NumTransaccion++;
        

}
    

$montototaltxt = "La suma total de todos los montos de las transacciones es de: ".$sumaMonto . " colones \n";
echo $montototaltxt;
fwrite($archivo, $montototaltxt);

$montoTotalIntereses = $sumaMonto * 1.026;


$interesestxt = "Incluyendo Intereses seria de: ".$montoTotalIntereses . " colones \n";
echo $interesestxt;
fwrite($archivo, $interesestxt);

$cashback = $sumaMonto * 0.001;

$cashbacktxt =  "El cashback es de ".$cashback . " colones \n";
echo $cashbacktxt;
fwrite($archivo, $cashbacktxt);

$MontoPagar = $montoTotalIntereses - $cashback;

$montopagartxt = "El MONTO TOTAL a pagar es de ".$MontoPagar . " colones \n";
echo $montopagartxt;
fwrite($archivo, $montopagartxt);

 }
}

generarEstadoDeCuenta();



?>


