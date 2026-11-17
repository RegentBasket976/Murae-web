document.addEventListener("DOMContentLoaded", function() {

    // Formulario general de contacto //
    const formulario = document.querySelector("#formulario");

    formulario.addEventListener("submit", async function(evento) {
        evento.preventDefault();

        const nombre = document.querySelector("#nombre").value.trim();
        const apellido = document.querySelector("#apellido").value.trim();
        const ciudad = document.querySelector("#ciudad").value;
        const correo = document.querySelector("#correo").value.trim();
        const celular = document.querySelector("#celular").value.trim();
        const pregunta = document.querySelector("#pregunta").value.trim();

        if (nombre === "") {
            alert("Por favor, ingresa tu nombre para poder enviar el formulario.");

        } else if (apellido === "") {
            alert("Por favor, ingresa tu apellido para poder enviar el formulario.");

        } else if (correo === "") {
            alert("Por favor, ingresa tu correo para poder enviar el formulario.");

        } else if (!/^\d{10}$/.test(celular)) {
            alert("Por favor, ingresa un número de celular válido de 10 dígitos.");

        } else {
          const boton = formulario.querySelector("button");
          const textoOriginal = boton.textContent;
          boton.disabled = true;
          boton.textContent = "Enviando...";

          try {
            const respuesta = await fetch(API_CONTACTO, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    ciudad: ciudad === "Elige" ? "" : ciudad,
                    correo,
                    celular,
                    pregunta
                })
            });

            if (!respuesta.ok) {
                throw new Error("Respuesta del servidor: " + respuesta.status);
            }

            alert(`¡Hola, ${nombre} ${apellido}! Hemos recibido tus datos y nos pondremos en contacto contigo muy pronto vía WhatsApp o correo electrónico.`);
            formulario.reset();

          } catch (error) {
            console.error(error);
            alert("No pudimos enviar tus datos en este momento. Por favor, inténtalo de nuevo en unos minutos.");

          } finally {
            boton.disabled = false;
            boton.textContent = textoOriginal;
          }
        }
    });

    // Ventana emergente de inscripción //
    const modalClases = document.querySelector("#modalClases");

    document.querySelector("#cerrarModalClases").addEventListener("click", function() {
        modalClases.close();
    });

    modalClases.addEventListener("click", function(evento) {
        if (evento.target === modalClases) {
            modalClases.close();
        }
    });

    // Formulario de inscripción a clases (asíncrono) //
    const formularioClases = document.querySelector("#formularioClases");

    formularioClases.addEventListener("submit", async function(evento) {
        evento.preventDefault();

        const nombre = document.querySelector("#nombreClase").value.trim();
        const apellido = document.querySelector("#apellidoClase").value.trim();
        const correo = document.querySelector("#correoClase").value.trim();
        const celular = document.querySelector("#celularClase").value.trim();
        const curso = document.querySelector("#cursoClase").value;

        if (nombre === "") {
            alert("Por favor, ingresa tu nombre para poder inscribirte.");
            return;
        }
        if (apellido === "") {
            alert("Por favor, ingresa tu apellido para poder inscribirte.");
            return;
        }
        if (correo === "") {
            alert("Por favor, ingresa tu correo para poder inscribirte.");
            return;
        }
        if (!/^\d{10}$/.test(celular)) {
            alert("Por favor, ingresa un número de celular válido de 10 dígitos.");
            return;
        }
        if (curso === "") {
            alert("Por favor, elige la clase a la que deseas inscribirte.");
            return;
        }

        const boton = formularioClases.querySelector("button");
        const textoOriginal = boton.textContent;
        boton.disabled = true;
        boton.textContent = "Enviando...";

        try {
            const respuesta = await fetch(API_CLASES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, apellido, correo, celular, curso })
            });

            if (!respuesta.ok) {
                throw new Error("Respuesta del servidor: " + respuesta.status);
            }

            formularioClases.reset();
            modalClases.close();
            alert(`¡Hola, ${nombre} ${apellido}! Hemos recibido tu solicitud para la clase de "${curso}". Nos pondremos en contacto contigo muy pronto vía WhatsApp o correo electrónico para validar al 100% la inscripcion.`);

        } catch (error) {
            console.error(error);
            alert("No pudimos enviar tu inscripción en este momento. Por favor, inténtalo de nuevo en unos minutos.");

        } finally {
            boton.disabled = false;
            boton.textContent = textoOriginal;
        }
    });

    // Carrito de compras //
    const CLAVE_CARRITO = "carritoMurae";
    const MAX_POR_PRODUCTO = 20;

    const modalCarrito = document.querySelector("#modalCarrito");
    const botonCarrito = document.querySelector("#botonCarrito");
    const contadorCarrito = document.querySelector("#contadorCarrito");
    const listaCarrito = document.querySelector("#listaCarrito");
    const totalCarrito = document.querySelector("#totalCarrito");
    const carritoVacio = document.querySelector("#carritoVacio");
    const botonVaciar = document.querySelector("#vaciarCarrito");
    const formularioPedido = document.querySelector("#formularioPedido");

    let carrito = cargarCarrito();
    dibujarCarrito();

    // Lee el carrito guardado en el navegador (y descarta datos dañados)
    function cargarCarrito() {
        try {
            const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
            if (!Array.isArray(guardado)) {
                return [];
            }
            return guardado.filter(function(item) {
                return item
                    && typeof item.producto === "string"
                    && typeof item.nombre === "string"
                    && Number.isFinite(item.precio)
                    && Number.isInteger(item.cantidad)
                    && item.cantidad >= 1
                    && item.cantidad <= MAX_POR_PRODUCTO;
            });
        } catch (error) {
            return [];
        }
    }

    function guardarCarrito() {
        try {
            localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
        } catch (error) {
            console.error(error);
        }
    }

    function formatearPrecio(valor) {
        return "$ " + valor.toLocaleString("es-CO");
    }

    function agregarProducto(nuevo) {
        const existente = carrito.find(function(item) {
            return item.producto === nuevo.producto;
        });

        if (existente) {
            if (existente.cantidad >= MAX_POR_PRODUCTO) {
                alert(`Puedes llevar máximo ${MAX_POR_PRODUCTO} unidades de cada producto por pedido.`);
                return;
            }
            existente.cantidad++;
        } else {
            carrito.push({
                producto: nuevo.producto,
                nombre: nuevo.nombre,
                precio: nuevo.precio,
                cantidad: 1
            });
        }
        guardarCarrito();
        dibujarCarrito();
    }

    function cambiarCantidad(clave, cambio) {
        const item = carrito.find(function(i) {
            return i.producto === clave;
        });
        if (!item) {
            return;
        }
        item.cantidad += cambio;

        if (item.cantidad < 1) {
            carrito = carrito.filter(function(i) {
                return i.producto !== clave;
            });
        } else if (item.cantidad > MAX_POR_PRODUCTO) {
            item.cantidad = MAX_POR_PRODUCTO;
        }
    }

    function crearBotonCarrito(texto, accion, clave, etiqueta) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = texto;
        boton.dataset.accion = accion;
        boton.dataset.producto = clave;
        boton.setAttribute("aria-label", etiqueta);
        return boton;
    }

    // Vuelve a dibujar la lista, el total y el contador
    function dibujarCarrito() {
        const cantidadTotal = carrito.reduce(function(suma, item) {
            return suma + item.cantidad;
        }, 0);
        const total = carrito.reduce(function(suma, item) {
            return suma + item.precio * item.cantidad;
        }, 0);

        contadorCarrito.textContent = cantidadTotal;
        listaCarrito.innerHTML = "";

        carrito.forEach(function(item) {
            const li = document.createElement("li");
            li.className = "carrito-item";

            const info = document.createElement("div");
            info.className = "carrito-item-info";
            const nombre = document.createElement("strong");
            nombre.textContent = item.nombre;
            const unidad = document.createElement("span");
            unidad.textContent = formatearPrecio(item.precio) + " c/u";
            info.append(nombre, unidad);

            const cantidad = document.createElement("div");
            cantidad.className = "carrito-cantidad";
            const numero = document.createElement("span");
            numero.textContent = item.cantidad;
            cantidad.append(
                crearBotonCarrito("-", "restar", item.producto, "Quitar una unidad"),
                numero,
                crearBotonCarrito("+", "sumar", item.producto, "Agregar una unidad")
            );

            const subtotal = document.createElement("span");
            subtotal.className = "carrito-subtotal";
            subtotal.textContent = formatearPrecio(item.precio * item.cantidad);

            const quitar = crearBotonCarrito("Quitar", "quitar", item.producto, "Quitar " + item.nombre);
            quitar.className = "btn-quitar";

            li.append(info, cantidad, subtotal, quitar);
            listaCarrito.appendChild(li);
        });

        const hayProductos = carrito.length > 0;
        totalCarrito.textContent = hayProductos ? "Total: " + formatearPrecio(total) : "";
        carritoVacio.hidden = hayProductos;
        listaCarrito.hidden = !hayProductos;
        botonVaciar.hidden = !hayProductos;
        formularioPedido.hidden = !hayProductos;
    }

    // Botones "Comprar" del catálogo
    document.querySelectorAll(".btn-comprar").forEach(function(boton) {
        boton.addEventListener("click", function() {
            agregarProducto({
                producto: boton.dataset.producto,
                nombre: boton.dataset.nombre,
                precio: Number(boton.dataset.precio)
            });

            // Aviso breve en el mismo botón
            if (!boton.dataset.texto) {
                boton.dataset.texto = boton.textContent;
            }
            boton.textContent = "¡Agregado!";
            clearTimeout(boton.temporizador);
            boton.temporizador = setTimeout(function() {
                boton.textContent = boton.dataset.texto;
            }, 900);
        });
    });

    // Abrir y cerrar la ventana del carrito
    botonCarrito.addEventListener("click", function() {
        dibujarCarrito();
        modalCarrito.showModal();
    });

    document.querySelector("#cerrarModalCarrito").addEventListener("click", function() {
        modalCarrito.close();
    });

    modalCarrito.addEventListener("click", function(evento) {
        if (evento.target === modalCarrito) {
            modalCarrito.close();
        }
    });

    // Botones +, - y Quitar de cada producto
    listaCarrito.addEventListener("click", function(evento) {
        const boton = evento.target.closest("button[data-accion]");
        if (!boton) {
            return;
        }
        const clave = boton.dataset.producto;

        if (boton.dataset.accion === "sumar") {
            cambiarCantidad(clave, 1);
        } else if (boton.dataset.accion === "restar") {
            cambiarCantidad(clave, -1);
        } else if (boton.dataset.accion === "quitar") {
            carrito = carrito.filter(function(i) {
                return i.producto !== clave;
            });
        }
        guardarCarrito();
        dibujarCarrito();
    });

    botonVaciar.addEventListener("click", function() {
        if (confirm("¿Seguro que quieres vaciar el carrito?")) {
            carrito = [];
            guardarCarrito();
            dibujarCarrito();
        }
    });

    // Finalizar pedido: se envía al servidor
    formularioPedido.addEventListener("submit", async function(evento) {
        evento.preventDefault();

        if (carrito.length === 0) {
            alert("Tu carrito está vacío. Agrega algún producto antes de finalizar.");
            return;
        }

        const nombre = document.querySelector("#nombrePedido").value.trim();
        const apellido = document.querySelector("#apellidoPedido").value.trim();
        const correo = document.querySelector("#correoPedido").value.trim();
        const celular = document.querySelector("#celularPedido").value.trim();
        const ciudad = document.querySelector("#ciudadPedido").value;

        if (nombre === "") {
            alert("Por favor, ingresa tu nombre para poder finalizar el pedido.");
            return;
        }
        if (apellido === "") {
            alert("Por favor, ingresa tu apellido para poder finalizar el pedido.");
            return;
        }
        if (correo === "") {
            alert("Por favor, ingresa tu correo para poder finalizar el pedido.");
            return;
        }
        if (!/^\d{10}$/.test(celular)) {
            alert("Por favor, ingresa un número de celular válido de 10 dígitos.");
            return;
        }

        const boton = formularioPedido.querySelector("button");
        const textoOriginal = boton.textContent;
        boton.disabled = true;
        boton.textContent = "Enviando...";

        try {
            const respuesta = await fetch(API_PEDIDOS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    correo,
                    celular,
                    ciudad,
                    items: carrito.map(function(item) {
                        return { producto: item.producto, cantidad: item.cantidad };
                    })
                })
            });

            if (!respuesta.ok) {
                const datos = await respuesta.json().catch(function() {
                    return {};
                });
                if (respuesta.status === 400 || respuesta.status === 429) {
                    alert(datos.mensaje || "No pudimos procesar tu pedido. Revisa los datos e inténtalo de nuevo.");
                    return;
                }
                throw new Error("Respuesta del servidor: " + respuesta.status);
            }

            const datos = await respuesta.json();

            carrito = [];
            guardarCarrito();
            dibujarCarrito();
            formularioPedido.reset();
            modalCarrito.close();

            alert(`¡Gracias, ${nombre} ${apellido}! Hemos recibido tu pedido por un total de ${formatearPrecio(datos.total)}. Nos pondremos en contacto contigo muy pronto vía WhatsApp o correo electrónico para coordinar el pago y la entrega.`);

        } catch (error) {
            console.error(error);
            alert("No pudimos enviar tu pedido en este momento. Tu carrito sigue guardado, inténtalo de nuevo en unos minutos.");

        } finally {
            boton.disabled = false;
            boton.textContent = textoOriginal;
        }
    });
});

// Direcciones del servidor //
const API_CLASES = "/api/clases";

const API_CONTACTO = "/api/contacto";

const API_PEDIDOS = "/api/pedidos";

// Botones "Inscribirse" de las clases //
function seleccionarClase(nombreClase) {
  const seleccionarCurso = document.getElementById("cursoClase");
  if (seleccionarCurso) {
    seleccionarCurso.value = nombreClase;
  }
  const modal = document.getElementById("modalClases");
  if (modal) {
    modal.showModal();
  }
}