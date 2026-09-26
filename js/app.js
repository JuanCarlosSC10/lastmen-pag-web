// Variable global para mantener el estado de la categoría seleccionada (0 = Todas)
let idCategoriaSeleccionada = 0;

// Evento de carga: esperamos a que el HTML se cargue por completo
document.addEventListener('DOMContentLoaded', () => {

    verificarDisponibilidadCatalogo();

    actualizarContadorCarrito();

    const contenedorDestacados = document.querySelector('.grid-productos');
    const contenedorCatalogo = document.querySelector('.grid-productos-catalogo');
    const contenedorVistaCarrito = document.getElementById('contenedor-vista-carrito'); 

    // Renderizar productos destacados si existen en la página
    if(contenedorDestacados){
        const destacados = productosBD.filter(p => p.destacado === true);
        pintarProductos(destacados, contenedorDestacados);
    }
    
    // Renderizar productos, filtros por categoría, buscador y ordenamiento si estamos en el catálogo
    if(contenedorCatalogo){
        renderizarFiltrosCategorias(); 
        configurarBuscadorYOrden();
        procesarFiltrosYOrden();
    }

    if(contenedorVistaCarrito){
        pintarPaginaCarrito();
    }

    if(document.getElementById('asunto') || document.querySelector('.datos-contacto')){
        renderizarPaginaContacto();
    }

    // Eventos de foco y teclado en formulario de Contacto
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

// CONFIGURAR ESCUCHADORES PARA EL BUSCADOR Y SELECTOR DE PRECIO
function configurarBuscadorYOrden() {
    const inputBuscar = document.getElementById('input-buscar');
    const selectOrdenar = document.getElementById('select-ordenar');

    if (inputBuscar) {
        inputBuscar.addEventListener('input', procesarFiltrosYOrden);
    }

    if (selectOrdenar) {
        selectOrdenar.addEventListener('change', procesarFiltrosYOrden);
    }
}

// FUNCIÓN  QUE FILTRA POR CATEGORÍA, BUSCA Y ORDENA POR PRECIO
function procesarFiltrosYOrden() {
    const contenedorCatalogo = document.querySelector('.grid-productos-catalogo');
    if (!contenedorCatalogo || typeof productosBD === 'undefined') return;

    const inputBuscar = document.getElementById('input-buscar');
    const selectOrdenar = document.getElementById('select-ordenar');

    const texto = inputBuscar ? inputBuscar.value.toLowerCase().trim() : '';
    const orden = selectOrdenar ? selectOrdenar.value : 'defecto';

    //  Filtrar por categoría activa y texto de búsqueda
    let resultado = productosBD.filter(p => {
        const coincideCategoria = (idCategoriaSeleccionada === 0) || (p.idCategoria === idCategoriaSeleccionada);
        const coincideTexto = p.nombre.toLowerCase().includes(texto) || 
                             (p.descripcion && p.descripcion.toLowerCase().includes(texto));
        return coincideCategoria && coincideTexto;
    });

    //  Ordenar según opción seleccionad
    if (orden === 'precio-menor') {
        resultado.sort((a, b) => a.precio - b.precio);
    } else if (orden === 'precio-mayor') {
        resultado.sort((a, b) => b.precio - a.precio);
    } else if (orden === 'nombre-az') {
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    pintarProductos(resultado, contenedorCatalogo);
}

// FUNCIÓN PARA RENDERIZAR BOTONES DE CATEGORÍAS Y FILTRAR POR ID
function renderizarFiltrosCategorias() {
    const contenedorFiltros = document.getElementById('contenedor-filtros');

    if (!contenedorFiltros || typeof categorias === 'undefined') return;

    contenedorFiltros.innerHTML = '';

    categorias.forEach(cat => {
        const boton = document.createElement('button');
        boton.classList.add('filtro-btn');
        
        if (cat.idCategoria === 0) {
            boton.classList.add('filtro-btn-activo');
        }
        
        boton.dataset.idCategoria = cat.idCategoria;
        boton.textContent = cat.nombre;

        boton.addEventListener('click', (e) => {
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('filtro-btn-activo'));
            e.target.classList.add('filtro-btn-activo');

            // Actualizamos la categoría seleccionada y procesamos los filtros
            idCategoriaSeleccionada = parseInt(e.target.dataset.idCategoria);
            procesarFiltrosYOrden();
        });

        contenedorFiltros.appendChild(boton);
    });
}

// FUNCIÓN PARA RENDERIZAR PRODUCTOS EN LA GRILLA
function pintarProductos(arrayProductos, contenedor){

    contenedor.innerHTML = '';

    // Si no hay productos que coincidan con la búsqueda
    if (arrayProductos.length === 0) {
        contenedor.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: #666;">
                <i class="fas fa-search" style="font-size: 2.2rem; margin-bottom: 0.8rem; color: #1B4D2E;"></i>
                <p style="font-size: 1.05rem;">No se encontraron productos que coincidan con la búsqueda.</p>
            </div>
        `;
        return;
    }

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

        // Asignación de evento directa en cada botón del producto
        const btnAgregar = article.querySelector('.btn-agregar');
        btnAgregar.addEventListener('click', () => {
            carritoGlobal.agregar(producto.idProducto);
            actualizarContadorCarrito();
            mostrarMensajeAgregado(btnAgregar);
        });

        fragmento.appendChild(article);
    });

    contenedor.appendChild(fragmento);
}

// Actualizar contador del carrito en el header
function actualizarContadorCarrito(){
    const spanContador = document.getElementById('contador-carrito');
    if(spanContador){
        spanContador.textContent = carritoGlobal.obtenerCantidadTotal();
    }
}

// Temporizador feedback visual botón
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
            alert('Mensaje simulado enviado con éxito.');
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

    // BUCLE WHILE
    while (i < listaCarrito.length) {
        const itemCarrito = listaCarrito[i];
        
        const idBuscado = itemCarrito.id || itemCarrito.idProducto;
        const productoOriginal = productosBD.find(p => p.idProducto === idBuscado);
        
        const imagenUrl = productoOriginal ? productoOriginal.imagen : itemCarrito.imagen;
        const nombreProd = productoOriginal ? productoOriginal.nombre : itemCarrito.nombre;
        const precioProd = productoOriginal ? productoOriginal.precio : itemCarrito.precio;
        const tagProd = productoOriginal ? productoOriginal.tag : "";

        // SWITCH
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

// RENDERIZAR PÁGINA DE CONTACTO
function renderizarPaginaContacto() {
    const contenedorInfo = document.getElementById('contenedor-datos-contacto') || document.querySelector('.datos-contacto');
    const selectAsunto = document.getElementById('asunto');

    if (contenedorInfo && typeof contactosEmpresaBD !== 'undefined') {
        contenedorInfo.innerHTML = '<h3 class="seccion-contenedor_subtitulo">Información de Atención</h3>';

        contactosEmpresaBD.forEach(contacto => {
            const tarjeta = document.createElement('article');
            tarjeta.classList.add('tarjeta-info');
            
            const badgePrincipal = contacto.esPrincipal 
                ? '<small style="background:#1B4D2E; color:#fff; padding:2px 6px; border-radius:4px; font-size:0.7em; margin-left:6px;">Sede Principal</small>' 
                : '';

            tarjeta.innerHTML = `
                <h4 class="tarjeta-info_titulo">${contacto.departamento} ${badgePrincipal}</h4>
                <p class="tarjeta-info_texto"><strong>Encargado:</strong> ${contacto.cargoEncargado}</p>
                <p class="tarjeta-info_texto"><strong>Dirección:</strong> ${contacto.direccionSucursal}</p>
                <p class="tarjeta-info_texto"><strong>Teléfono:</strong> ${contacto.telefonoCorporativo}</p>
                <p class="tarjeta-info_texto"><strong>Correo:</strong> ${contacto.correoCorporativo}</p>
                <p class="tarjeta-info_texto"><strong>Horario:</strong> ${contacto.horarioAtencion}</p>
            `;
            contenedorInfo.appendChild(tarjeta);
        });
    }

    if (selectAsunto && typeof asuntosConsultaBD !== 'undefined') {
        selectAsunto.innerHTML = '';

        asuntosConsultaBD.forEach(asunto => {
            const option = document.createElement('option');
            option.value = asunto.valor;
            option.textContent = asunto.texto;
            selectAsunto.appendChild(option);
        });
    }
}

// ESTRUCTURA DE CONTROL DO WHILE
function verificarDisponibilidadCatalogo() {
    let index = 0;
    if (typeof productosBD === 'undefined' || productosBD.length === 0) return;
    
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