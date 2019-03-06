function buscar(){

    while(Object.keys(abierta).length > 0){
            listaAbierta = Object.values(abierta).sort(function(a,b){return b.f - a.f})

            // Coger el primer nodo de abierta que tiene la menor f.

            var currentNode = listaAbierta.pop();
            delete abierta["x" + currentNode.posicion.data("x") + "y" + currentNode.posicion.data("y")];

            currentNode.posicion.css("background-color", "yellow");

            // Caso Final
            if(currentNode.posicion === fin.posicion) {
                var curr = currentNode;
                var ret = [];
                while(curr.padre) {
                    ret.push(curr);
                    curr = curr.padre;
                }
                ret.push(curr);

                return ret.reverse();
            }

            // Caso normal
            currentNode.cerrado = true;
            
            // Encontrar todos los vecinos 
            var vecinos = verVecinos(currentNode);

            for(var i=0, il = vecinos.length; i < il; i++) {
                var vecino = vecinos[i];

                if(!vecino.cerrado) {

                    // El valor de g es la distancia mas corta desde la entrada al nodo actual
                    // Comprobamos tambien si es la distancia mas pequeña que hemos encontrado
                    var gScore = currentNode.g + distancia({x: vecino.posicion.data("x"), y: vecino.posicion.data("y")}, {x: currentNode.posicion.data("x"), y: currentNode.posicion.data("y")})
                    var beenVisited = vecino.visitado;

                    if(!beenVisited || gScore < vecino.g) {


                        // Se ha encontrado un camino optimo, hasta el momento, hacia el vecino
                        vecino.visitado = true;
                        vecino.padre = currentNode;
                        vecino.h = distancia({x: vecino.posicion.data("x"), y: vecino.posicion.data("y")}, {x: fin.posicion.data("x"), y: fin.posicion.data("y")})
                        vecino.g = gScore;
                        vecino.f = vecino.g + vecino.h + vecino.coste;

                        abierta["x" + vecino.posicion.data("x") + "y" + vecino.posicion.data("y")] = vecino;

                    }
                }
            
            }

        }
        
        return [];

}

function verVecinos(node) {
    var ret = [];
    var x = node.posicion.data("x")
    var y = node.posicion.data("y")
    
    if(grid[x-1] && grid[x-1][y]) {
        ret.push(grid[x-1][y]);
    }

    if(grid[x+1] && grid[x+1][y]) {
        ret.push(grid[x+1][y]);
    }

    if(grid[x][y-1] && grid[x][y-1]) {
        ret.push(grid[x][y-1]);
    }

    if(grid[x][y+1] && grid[x][y+1]) {
        ret.push(grid[x][y+1]);
    }

    // Southwest
    if(grid[x-1] && grid[x-1][y-1]) {
        ret.push(grid[x-1][y-1]);
    }

    // Southeast
    if(grid[x+1] && grid[x+1][y-1]) {
        ret.push(grid[x+1][y-1]);
    }

    // Northwest
    if(grid[x-1] && grid[x-1][y+1]) {
        ret.push(grid[x-1][y+1]);
    }

    // Northeast
    if(grid[x+1] && grid[x+1][y+1]) {
        ret.push(grid[x+1][y+1]);
    }
    return ret;
}

function distancia(pos0, pos1) {
    var d1 = Math.pow((pos1.x - pos0.x), 2);
    var d2 = Math.pow((pos1.y - pos0.y), 2);
    return Math.sqrt(d1 + d2);
}

function duplicarGrid(grid){
    var x
    var y
    var duplicado = new Array(grid.length);

    for (x = 0; x < grid.length; x++){
        duplicado[x] = new Array(grid[x].length);
        for (y = 0; y < grid[x].length; y++){
            duplicado[x][y] = { ...grid[x][y]}
        }
    }

    return duplicado;
}