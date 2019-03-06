var inicio = {};
var fin = {};

var grid = [];
var duplicateGrid = [];
var originalGrid = [];

var listaAbierta = [];
var abierta = {};
var waypoints = [];

var camino;
var caminoFinal = [];

var pintarC
var ctrl = false;
var shift = false;

$(document).ready(function() {
    $("#generar").on("click", function(event){
        $("#formulario").toggleClass("oculto");
        $("#texto").toggleClass("oculto");
        $("#avisos").toggleClass("oculto");
        $("#tablero").toggleClass("oculto");
        $("#botones").toggleClass("oculto");
        $("#buscar").toggleClass("disabled")

        generarMatriz();

        pedirInicio();

        $("#nuevo").on("click", function(){
            location.reload();
        })

    })
})

function clickBuscar(){
            
    $("#buscar").off();
    $("#buscar").toggleClass("disabled")
    $(".celda").off("click");
    comprobarPesoMax();
    waypoints.push(fin);
    waypoints = waypoints.reverse();
    duplicateGrid = duplicarGrid(grid)

    
    while (waypoints.length > 0){

        fin = waypoints.pop()
        camino = buscar()
        if (camino.length == 0){
            break;
        } else {
            caminoFinal = caminoFinal.concat(camino);
        }

        grid = duplicarGrid(duplicateGrid)

        inicio = { ...fin};

        inicio.cerrada = true;
        inicio.f = 0;
        inicio.g = 0;
        inicio.h = 0;
        inicio.padre = null;
        inicio.coste = 0;
        inicio.visitado = false;
        inicio.cerrado = false;
        abierta = {};
        listaAbierta = []
        abierta["x" + inicio.posicion.data("x") + "y" + inicio.posicion.data("y")] = inicio;

        
    }

    if (caminoFinal.length != 0){

        pintarCamino(function(){
            clearInterval(pintarC)
        })

    } else {

        alert("No existe ningun camino");

    }
   
}

function generarMatriz(){

    for(x = 0; x < $("#alto").val(); x++){

        grid.push([]);
        $("#tablero").append("<div id='fila" + x + "' class='fila'>");

        for(y = 0; y < $("#ancho").val(); y++){

            $("#fila" + x).append("<div id='columna" + y + "fila" + x + "' class='celda'>")

            var nodo = {};
            nodo.f = 0;
            nodo.g = 0;
            nodo.h = 0;
            nodo.padre = null;
            nodo.coste = 0;
            nodo.visitado = false;
            nodo.cerrado = false;
            nodo.posicion = $("#fila" + x).children().last();

            nodo.posicion.data({x: x, y: y});

            grid[x].push(nodo);

        }
    }

}

function pedirInicio(){

    $("#avisos").children().remove();
    $("#avisos").append("<h3 class='aviso'>Hacer click para marcar el inicio</h3>")

    $(".celda").off("click");

    $(".celda").on("click", function(event){
        $(event.target).append("<img src='resources/ini.png'>");
        $(".celda").off("click");
        $(event.target).off("click");

        inicio = grid[$(event.target).data("x")][$(event.target).data("y")]
        
        //abierta.push(inicio);

        abierta["x" + $(event.target).data("x") + "y" + $(event.target).data("y")] = inicio;

        pedirFin();

    })

}

function pedirFin(){

    $("#avisos").children().remove();
    $("#avisos").append("<h3 class='aviso'>Hacer click para marcar el final</h3>")

    $(".celda").on("click", function(event){
        $(event.target).append("<img src='resources/fin.png'>");
        $(".celda").off("click");
        $(event.target).off("click");

        fin = grid[$(event.target).data("x")][$(event.target).data("y")]

        pedirObstaculos();
    })

}

function pedirObstaculos(){

    $("#avisos").children().remove();
    $("#avisos").append("<h3 class='aviso'>Hacer click para marcar obstaculos</h3>")
    $("#buscar").on("click", clickBuscar);
    $("#buscar").toggleClass("disabled")

    $(document).keydown(function(event){
        if (event.which=="17"){
            ctrl = true;
            shift = false;
            $("#avisos").children().remove();
            $("#avisos").append("<h3 class='aviso'>Hacer click para marcar waypoints</h3>")
        } else if (event.which=="16"){ 
            ctrl = false;
            shift = true;
            $("#avisos").children().remove();
            $("#avisos").append("<h3 class='aviso'>Hacer click para marcar peso indicado</h3>")
        }

    })

    $(document).keyup(function(event){
        if (event.which=="17"){
            ctrl = false;
            $("#avisos").children().remove();
            $("#avisos").append("<h3 class='aviso'>Hacer click para marcar obstaculos</h3>")
        } else if (event.which=="16"){
            shift = false;
            $("#avisos").children().remove();
            $("#avisos").append("<h3 class='aviso'>Hacer click para marcar obstaculos</h3>")
        }
        
    })

    $(".celda").on("click", function(event){
        $(event.target).off("click");
        if (!ctrl && !shift){
            $(event.target).append("<img src='resources/obst.png'>"); 

            grid[$(event.target).data("x")][$(event.target).data("y")]
            grid[$(event.target).data("x")][$(event.target).data("y")].cerrado = true;
        } else if (ctrl && !shift){
            $(event.target).append("<img src='resources/wp.png'>"); 

            waypoints.push(grid[$(event.target).data("x")][$(event.target).data("y")]);
        } else if (!ctrl && shift){
            $(event.target).css("background-color", "RGB(96,96,96," + (Number($("#peso").val()) / 100) + ")");
       
            grid[$(event.target).data("x")][$(event.target).data("y")].coste = Number($("#peso").val());
        }
             
    })

}

function pintarCamino(callback){
    var contador = 1;

    pintarC = setInterval(function(){

        if (contador == caminoFinal.length - 1){
            callback();
        }

        if (contador > 1){
            caminoFinal[contador - 1].posicion.children("#huella").remove();
        } else {
            caminoFinal[contador - 1].posicion.css("background-color", "green")
        }

        caminoFinal[contador].posicion.css("background-color", "green")
        caminoFinal[contador].posicion.append("<img id='huella' src='resources/cam.png'>");
        
        contador++;
    }, 500)
}

function comprobarPesoMax(){
    for(x = 0; x < grid.length; x++){

        for(y = 0; y < grid[x].length; y++){

            if (grid[x][y].coste > Number($("#max").val())){
                grid[x][y].cerrado = true;
                grid[x][y].posicion.append("<img src='resources/obst.png'>"); 
            }

        }
    }
}

function hoverCelda(event){
    
}