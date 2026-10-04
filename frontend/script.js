document.addEventListener("DOMContentLoaded", function() {

    const formulario = document.querySelector("#formulario");

    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const nombre = document.querySelector("#nombre").value.trim();
        const apellido = document.querySelector("#apellido").value.trim();

        if (nombre === "") {
            alert("Por favor, ingresa tu nombre para poder enviar el formulario.");

        } else if (apellido === "") {
            alert("Por favor, ingresa tu apellido para poder enviar el formulario.");

        } else {
          alert(`¡Hola, ${nombre} ${apellido}! Hemos recibido tus datos y nos pondremos en contacto contigo muy pronto vía WhatsApp o correo electrónico.`);
          formulario.reset();
        }
    });

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

            alert(`¡Hola, ${nombre} ${apellido}! Hemos recibido tu solicitud para la clase de "${curso}". Nos pondremos en contacto contigo muy pronto vía WhatsApp o correo electrónico para validar al 100% la inscripcion.`);
            formularioClases.reset();

        } catch (error) {
            console.error(error);
            alert("No pudimos enviar tu inscripción en este momento. Por favor, inténtalo de nuevo en unos minutos.");

        } finally {
            boton.disabled = false;
            boton.textContent = textoOriginal;
        }
    });
});

const API_CLASES = "/api/clases";

function seleccionarClase(nombreClase) {
  const seleccionarCurso = document.getElementById("cursoClase");
  if (seleccionarCurso) {
    seleccionarCurso.value = nombreClase;
  }
}
