// Funciones calculo simple 1 //
function configurarBotonesCompra() {
  const botonesComprar = document.querySelectorAll('#Productos button');

  botonesComprar.forEach(function(boton) {
    boton.addEventListener('click', function(evento) {
      
      const articulo = evento.target.closest('article');
      const nombreProducto = articulo.querySelector('h3').textContent;

      let precioFijo = 25000; 
      let cantidadTexto = prompt("Elegiste: " + nombreProducto + ".\n¿Cuántas unidades deseas llevar?");

      if (cantidadTexto !== null && cantidadTexto !== "") {
        let cantidad = parseInt(cantidadTexto);

        if (cantidad > 0) {
          let totalPagar = precioFijo * cantidad;
          alert("El total a pagar por " + cantidad + " unidades es de $" + totalPagar);
        } else {
          alert("Por favor ingresa un número válido mayor a 0.");
        }
      }
    });
  });
}

// Funciones calculo simple 2 //
function configurarCiudadEnvio() {
  let listaCiudades = document.querySelector("select");

  listaCiudades.addEventListener("change", function() {
    
    let ciudadSeleccionada = listaCiudades.value;
    let costoEnvio = 0;

    if (ciudadSeleccionada === "Barranquilla" || ciudadSeleccionada === "Soledad") {
      costoEnvio = 5000;
    } else {
      costoEnvio = 15000;
    }

    alert("Como seleccionaste " + ciudadSeleccionada + ", el costo extra de envío será de $" + costoEnvio);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  configurarBotonesCompra();
  configurarCiudadEnvio();
});