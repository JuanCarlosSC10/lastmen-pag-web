const categorias = [
    { idCategoria: 0, nombre: 'Todos' },
    { idCategoria: 1, nombre: 'Suplementos' },
    { idCategoria: 2, nombre: 'Bebidas y Tés' },
    { idCategoria: 3, nombre: 'Cuidado Personal' }
];

const productosBD = [
    {
        idProducto: 1,
        sku: "SUP-MAC-500",
        nombre: "Maca Negra Orgánica 500g",
        descripcion: "Energizante natural y revitalizante concentrado.",
        precio: 39.90,
        imagen: "https://tikafarma.com/cdn/shop/products/maca-negra-capsulas-amazon-andes-1.jpg?v=1658515243&width=1000",
        idCategoria: 1, 
        tag: "Oferta",
        destacado: true
    },
    {
        idProducto: 2,
        sku: "BEB-VIN-500",
        nombre: "Vinagre de Manzana Orgánico 500ml",
        descripcion: "Estimula la producción de enzimas digestivas y promueve el equilibrio intestinal.",
        precio: 84.90,
        imagen: "https://tikafarma.com/cdn/shop/products/Vinagre-manzana-1.jpg?v=1626645644&width=1100",
        idCategoria: 2, 
        tag: "Top Ventas",
        destacado: true
    },
    {
        idProducto: 3,
        sku: "CUI-ACE-030",
        nombre: "Aceite Anticaída para Cabello Graso x 30ml",
        descripcion: "Nutren, fortalecen y favorecen el crecimiento del cabello evitando su caída.",
        precio: 45.00,
        imagen: "https://tikafarma.com/cdn/shop/products/aceite-anticaida-cabello-graso.jpg?v=1643236644&width=1100",
        idCategoria: 3, 
        tag: "Nuevo",
        destacado: true
    },
    {
        idProducto: 4,
        sku: "SUP-COL-500",
        nombre: "Colágeno Hidrolizado 500g",
        descripcion: "Reforzado con Camu Camu para favorecer la salud articular, piel y cabello.",
        precio: 84.90,
        imagen: "https://tikafarma.com/cdn/shop/files/colageno-hidrolizado-capsulas-inkanat.jpg?v=1697317289&width=1100",
        idCategoria: 1, 
        tag: "Top Ventas",
        destacado: false
    },
    {
        idProducto: 5,
        sku: "BEB-MAT-100",
        nombre: "Té Verde Matcha Ceremonial",
        descripcion: "Potente antioxidante vegetal en polvo, ideal para mañanas llenas de energía.",
        precio: 45.00,
        imagen: "https://tikafarma.com/cdn/shop/files/te-matcha-sachets-real-food-1_6fcd2304-2335-4d61-99e1-b19432d62343.jpg?v=1733976932&width=1100",
        idCategoria: 2, 
        tag: "Nuevo",
        destacado: false
    },
    {
        idProducto: 6,
        sku: "CAP-PIM-100",
        nombre: "Cúrcuma + Pimienta Negra",
        descripcion: "60 cápsulas vegetales para reforzar el sistema inmunológico y digestivo.",
        precio: 49.90,
        imagen: "https://tikafarma.com/cdn/shop/products/curcuma-polvo.jpg?v=1643237205&width=1100",
        idCategoria: 1,
        tag: "Especial",
        destacado: false
    }
];

const contactosEmpresaBD = [
    {
        idContacto: 1,
        departamento: "Gerencia y Ventas Principales",
        cargoEncargado: "Dirección General",
        telefonoCorporativo: "+51 912 059 868",
        correoCorporativo: "73361189@lastmen.pe",
        direccionSucursal: "Jr. José Prado 252, Tingo Maria - Perú",
        horarioAtencion: "Lunes a Sábado: 8:00 am - 7:00 pm",
        esPrincipal: true
    },
    {
        idContacto: 2,
        departamento: "Asesoría de Productos Naturales",
        cargoEncargado: "Atención al Cliente",
        telefonoCorporativo: "+51 987 654 321",
        correoCorporativo: "ventas@lastmen.pe",
        direccionSucursal: "Tingo Maria - Perú",
        horarioAtencion: "Lunes a Sábado: 9:00 am - 6:00 pm",
        esPrincipal: false
    }
];

const asuntosConsultaBD = [
    { valor: "productos", texto: "Consulta de Productos" },
    { valor: "ventas", texto: "Pedidos al Por Mayor" },
    { valor: "envios", texto: "Estado de Mi Envío" },
    { valor: "otro", texto: "Otro Motivo" }
];