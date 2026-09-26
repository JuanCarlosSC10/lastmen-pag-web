// Evento de carga: esperamos a que el HTML se cargue por completo
document.addEventListener('DOMContentLoaded', () => {

    // Ejecución de la estructura de control do...while
    verificarDisponibilidadCatalogo();

    actualizarContadorCarrito();

    const contenedorDestacados = document.querySelector('.grid-productos');
    const contenedorCatalogo = document.querySelector('.grid-productos-catalogo');
    const contenedorVistaCarrito = document.getElementById('contenedor-vista-carrito'); 
    const botonesFiltro = document.querySelectorAll('.filtro-btn');

    if(contenedorDestacados){
        const destacados = productosBD.filter(p => p.destacado === true);
        pintarProductos(destacados, contenedorDestacados);
    }
    
    if(contenedorCatalogo){
        pintarProductos(productosBD, contenedorCatalogo);
    }

    if(contenedorVistaCarrito){
        pintarPaginaCarrito();
    }

    if (botonesFiltro.length > 0 && contenedorCatalogo) {
        botonesFiltro.forEach(boton => {
            boton.addEventListener('click', (e) => {
                botonesFiltro.forEach(b => b.classList.remove('filtro-btn-activo'));
                e.target.classList.add('filtro-btn-activo');
                
                const categoriaSeleccionada = e.target.textContent.trim();

                if (categoriaSeleccionada === 'Todos') {
                    pintarProductos(productosBD, contenedorCatalogo);
                } else {
                    const productosFiltrados = productosBD.filter(p => p.categoria === categoriaSeleccionada);
                    pintarProductos(productosFiltrados, contenedorCatalogo);
                }
            });
        });
    }

    // EVENTOS DE FOCO Y TECLADO en el formulario de Contacto
    configurarEventosFormulario();
});

// Evento de desplazamiento: cambia la sombra del header al hacer SCROLL
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if(header) {
        if(window.scrollY > 50){
            header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    }
});

// FUNCIÓN PARA RENDERIZAR PRODUCTOS
function pintarProductos(arrayProductos, contenedor){

    contenedor.innerHTML = '';
    const fragmento = document.createDocumentFragment();

    arrayProductos.forEach(producto => {
        const article = document.createElement('article');
        article.classList.add('tarjeta-producto');

        const tagHtml = producto.tag ? `<span class="tarjeta-producto_tag">${producto.tag}</span>` : '<span></span>';
        const skuHtml = producto.sku ? `<span class="tarjeta-producto_sku">SKU: ${producto.sku}</span>` : '';

        article.innerHTML = `
            <div class="tarjeta-producto_header">
                ${tagHtml}
                ${skuHtml}
            </div>
            
            <div class="tarjeta-producto_img-contenedor">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="tarjeta-producto_imagen">
            </div>

            <div class="tarjeta-producto_contenido">
                <h4 class="tarjeta-producto_titulo">${producto.nombre}</h4>
                <p class="tarjeta-producto_descripcion">${producto.descripcion}</p>
            </div>

            <div class="tarjeta-producto_footer">
                <span class="tarjeta-producto_precio">${formatearPrecioCreciente(producto.precio)}</span>
                <button class="boton-primario boton-bloque btn-agregar" data-id="${producto.idProducto}">
                    Añadir al Carrito
                </button>
            </div>
        `;
        fragmento.appendChild(article);
    });

    contenedor.appendChild(fragmento);

    // DELEGACIÓN DE EVENTOS (Fase de Burbujeo)
    contenedor.addEventListener('click', (e) => {
        if(e.target.classList.contains('btn-agregar')) {
            e.stopPropagation();

            const idBoton = parseInt(e.target.getAttribute('data-id'));
            carritoGlobal.agregar(idBoton);
            
            actualizarContadorCarrito();
            mostrarMensajeAgregado(e.target);
        }
    });
}

// Función para actualizar el contador de items del carrito en el header
function actualizarContadorCarrito(){
    const spanContador = document.getElementById('contador-carrito');
    if(spanContador){
        spanContador.textContent = carritoGlobal.obtenerCantidadTotal();
    }
}

// Temporizador para feedback visual del botón
function mostrarMensajeAgregado(boton) {
    const textoOriginal = boton.textContent;
    boton.textContent = '¡Agregado!';
    boton.style.backgroundColor = '#1B4D2E'; 

    setTimeout(() => {
        boton.textContent = textoOriginal;
        boton.style.backgroundColor = ''; 
    }, 1500);
}

// Configuración de eventos de Formulario (Foco y Teclado)
function configurarEventosFormulario() {
    const formulario = document.querySelector('.formulario-contacto');
    const inputs = document.querySelectorAll('.campo-form_input, .campo-form_textarea');

    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault(); 
            alert('Mensaje simulado enviado con éxito. (Falta Backend)');
            formulario.reset();
        });

        inputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.style.backgroundColor = '#E8F5E9'; 
            });

            input.addEventListener('blur', (e) => {
                e.target.style.backgroundColor = ''; 
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.target.blur();
                }
            });
        });
    }
}

// RENDERIZAR PÁGINA DEL CARRITO
function pintarPaginaCarrito() {
    const contenedor = document.getElementById('contenedor-vista-carrito');
    const spanTotal = document.getElementById('total-pagar');
    
    if (!contenedor) return;

    contenedor.innerHTML = ''; 
    
    const datosGuardados = localStorage.getItem('carrito_lastmen');
    const listaCarrito = datosGuardados ? JSON.parse(datosGuardados).map(item => item[1]) : [];

    if (listaCarrito.length === 0) {
        contenedor.innerHTML = '<p class="carrito-vacio-texto">Tu carrito está vacío. ¡Anímate a llevar algo natural!</p>';
        spanTotal.textContent = formatearPrecioCreciente(0);
        return;
    }

    let total = 0;
    let i = 0;

    // USO DE BUCLE WHILE
    while (i < listaCarrito.length) {
        const itemCarrito = listaCarrito[i];
        
        const idBuscado = itemCarrito.id || itemCarrito.idProducto;
        const productoOriginal = productosBD.find(p => p.idProducto === idBuscado);
        
        const imagenUrl = productoOriginal ? productoOriginal.imagen : itemCarrito.imagen;
        const nombreProd = productoOriginal ? productoOriginal.nombre : itemCarrito.nombre;
        const precioProd = productoOriginal ? productoOriginal.precio : itemCarrito.precio;
        const tagProd = productoOriginal ? productoOriginal.tag : "";

        // USO DE SWITCH
        let badgeTag = "";
        switch(tagProd) {
            case "Oferta":
                badgeTag = `<span style="color: #e74c3c; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; margin-left: 8px;">¡Oferta!</span>`;
                break;
            case "Top Ventas":
                badgeTag = `<span style="color: #f39c12; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; margin-left: 8px;">Top Ventas</span>`;
                break;
            case "Nuevo":
                badgeTag = `<span style="color: #27ae60; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; margin-left: 8px;">Nuevo</span>`;
                break;
            default:
                badgeTag = ""; 
                break;
        }

        const subtotal = precioProd * itemCarrito.cantidad;
        total += subtotal;
        
        const article = document.createElement('article');
        article.classList.add('carrito-item');
        
        article.innerHTML = `
            <div class="carrito-item_info">
                <img src="${imagenUrl}" alt="${nombreProd}" class="carrito-item_img">
                <div>
                    <h4 class="carrito-item_titulo">${nombreProd} ${badgeTag}</h4>
                    <small>Precio unitario: ${formatearPrecioCreciente(precioProd)}</small>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap: 15px;">
                <div style="text-align: right;">
                    <strong>Cant: ${itemCarrito.cantidad}</strong>
                    <p class="carrito-item_precio-subtotal">${formatearPrecioCreciente(subtotal)}</p>
                </div>
                <button class="boton-secundario btn-eliminar" data-id="${idBuscado}" style="padding: 0.3rem 0.6rem; margin-top:0;" title="Eliminar producto">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        contenedor.appendChild(article);
        i++;
    }

    spanTotal.textContent = formatearPrecioCreciente(total);
}

// PROPAGACIÓN DE EVENTOS EN FASE DE CAPTURA 
const contenedorVistaCarrito = document.getElementById('contenedor-vista-carrito');
if (contenedorVistaCarrito) {
    contenedorVistaCarrito.addEventListener('click', (e) => {
        const botonEliminar = e.target.closest('.btn-eliminar');
        if (botonEliminar) {
            e.stopPropagation(); 
            const idProducto = parseInt(botonEliminar.getAttribute('data-id'));
            carritoGlobal.eliminar(idProducto); 
            actualizarContadorCarrito();
            pintarPaginaCarrito(); 
        }
    }, { capture: true }); 
}

// ENVÍO DE PEDIDOS POR WHATSAPP
document.addEventListener('DOMContentLoaded', () => {
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    if(btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            if(carritoGlobal.obtenerCantidadTotal() === 0) {
                alert("Tu carrito está vacío. Agrega productos antes de continuar.");
                return;
            }

            const datosGuardados = JSON.parse(localStorage.getItem('carrito_lastmen'));
            let mensaje = "Hola Lastmen, deseo realizar el siguiente pedido:%0A%0A";
            
            datosGuardados.forEach(item => {
                const prod = item[1];
                const idBuscado = prod.id || prod.idProducto;
                
                const productoOriginal = productosBD.find(p => p.idProducto === idBuscado);
                const skuTexto = (productoOriginal && productoOriginal.sku) ? ` (SKU: ${productoOriginal.sku})` : "";
                
                mensaje += `- ${prod.cantidad}x ${prod.nombre}${skuTexto}%0A`;
            });
            
            const total = document.getElementById('total-pagar').textContent;
            mensaje += `%0A*Total a Pagar: ${total}*%0A%0A¡Quedo a la espera de sus datos para el pago!`;


            const contactoPrincipal = contactosEmpresaBD.find(c => c.esPrincipal === true);
            const numeroWhatsApp = contactoPrincipal ? contactoPrincipal.telefonoCorporativo.replace(/\D/g, '') : "51912059868";
                        
            const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
            
            localStorage.removeItem('carrito_lastmen');
            window.open(url, '_blank');
            setTimeout(() => { location.reload(); }, 1000);
        });
    }
});



// ESTRUCTURA DE CONTROL DO WHILE
function verificarDisponibilidadCatalogo() {
    let index = 0;
    if (typeof productosBD === 'undefined' || productosBD.length === 0) return;
    
    // Recorremos el arreglo de productos al menos una vez usando do...while
    do {
        console.log(`[Sistema Lastmen] Producto verificado en catálogo: ${productosBD[index].nombre}`);
        index++;
    } while (index < productosBD.length);
}

// FUNCIÓN CRECIENTE PARA DAR FORMATO AL PRECIO
function formatearPrecioCreciente(monto, simbolo = 'S/', incluirDecimales = true) {
    if (typeof monto !== 'number' || isNaN(monto)) return `${simbolo} 0.00`;
    
    let montoFormateado = incluirDecimales ? monto.toFixed(2) : Math.round(monto).toString();
    return `${simbolo} ${montoFormateado}`;
}
