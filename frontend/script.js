document.addEventListener("DOMContentLoaded", function() {

    const formulario = document.querySelector("#formulario");

    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const nombre = document.querySelector("#nombre").value.trim();
        const apellido = document.querySelector("#apellido").value.trim();
        const curso = document.querySelector("#curso").value;

        if (nombre === "") {
            alert("Por favor, ingresa tu nombre para poder enviar el formulario.");

        } else if (apellido === "") {
            alert("Por favor, ingresa tu apellido para poder enviar el formulario.");

        } else {
          if (curso !== "Ninguno") {
            alert(`¡Hola, ${nombre} ${apellido}! Hemos recibido tu solicitud para la clase de "${curso}". Nos pondremos en contacto contigo muy pronto vía WhatsApp o correo electrónico para validar al 100% la inscripcion.`);
          } else {
            alert(`¡Hola, ${nombre} ${apellido}! Hemos recibido tus datos y nos pondremos en contacto contigo muy pronto vía WhatsApp o correo electrónico.`);
          }
          formulario.reset();
        }
    });
});

function seleccionarClase(nombreClase) {
  const seleccionarCurso = document.getElementById("curso");
  if (seleccionarCurso) {
    seleccionarCurso.value = nombreClase;
  }
}