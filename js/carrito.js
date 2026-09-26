/* Carrito de compras */

class ElementoCarrito {
    constructor(productoBD, cantidad = 1) { 
        this.idProducto = productoBD.idProducto;
        this.nombre = productoBD.nombre;
        this.precio = productoBD.precio;
        this.cantidad = cantidad;
    }

    calcularSubtotal() {
        return this.precio * this.cantidad;
    }
}


class ElementoOferta extends ElementoCarrito {
    constructor(productoBD, cantidad = 1, descuento = 0.10) {
        super(productoBD, cantidad);
        this.descuento = descuento;
    }

    calcularSubtotal() {
        const subtotalNormal = this.precio * this.cantidad;
        return subtotalNormal - (subtotalNormal * this.descuento);
    }
}

class CarritoCompra {
    #productosMap

    constructor(){
        this.#productosMap = new Map();
        this.cargarDesdeStorage();
    }

    agregar(idProducto){
        if(this.#productosMap.has(idProducto)){
            let item = this.#productosMap.get(idProducto);
            item.cantidad = item.cantidad + 1;
            this.#productosMap.set(idProducto, item);
        } else {
            const productoFiltro = productosBD.find(p => p.idProducto === idProducto);

            if(productoFiltro){
                let nuevoElemento;
                if(productoFiltro.tag === "Oferta"){
                    nuevoElemento = new ElementoOferta(productoFiltro);

                } else {
                    nuevoElemento = new ElementoCarrito(productoFiltro);
                }
                this.#productosMap.set(idProducto, nuevoElemento);
            }
        }
        this.guardarEnStorage();
    }

    // FUncion Recursiva parta sumar los subtotales del array de productos
    calcularTotalRecursivo(itemsArray, indice = 0){
        if(indice === itemsArray.length){
            return 0;
        }

        const subtotal = itemsArray[indice].calcularSubtotal();
        return subtotal + this.calcularTotalRecursivo(itemsArray, indice + 1 );
    }

    // Metodo para preparar los datos usando la funcion recursiva
    obtenerTotal(){
        const arrayProductos = Array.from(this.#productosMap.values());
        return this.calcularTotalRecursivo(arrayProductos);
    }

    // Metodo para contar el total de items del carrito
    obtenerCantidadTotal(){
        let total = 0;
        for(let [id, item] of this.#productosMap){
            total = total + item.cantidad;
        }
        return total;
    }

    // Guardamos la seleccion  del usuario en la memoria del navegador
    guardarEnStorage(){
        const arrayDelMap = Array.from(this.#productosMap.entries());
        localStorage.setItem('carrito_lastmen', JSON.stringify(arrayDelMap));
    }

    // Recupera los dato del localStorage para recuperar los objetos para no perder el carrito al recargar la pagina
    cargarDesdeStorage(){
        const datosGuardados = localStorage.getItem('carrito_lastmen');
        if(datosGuardados){
            const arrayParseado = JSON.parse(datosGuardados);
            arrayParseado.forEach(([id, itemData]) => {
                let elemetoReconstruido = itemData.descuento !== undefined
                    ? new ElementoOferta(itemData, itemData.cantidad, itemData.descuento)
                    : new ElementoCarrito(itemData, itemData.cantidad);

                this.#productosMap.set(id, elemetoReconstruido);
            });

        }
    }

    // Metodo para eliminar un producto del carrito
    eliminar(idProducto) {
        if(this.#productosMap.has(idProducto)) {
            let item = this.#productosMap.get(idProducto);
            if(item.cantidad > 1) {
                item.cantidad--; 
                this.#productosMap.set(idProducto, item);
            } else {
                this.#productosMap.delete(idProducto); 
            }
            this.guardarEnStorage();
        }
    }

}



const carritoGlobal  = new CarritoCompra();
