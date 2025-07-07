let montos = [];
    let marcados = [];

    function generarCasillas() {
      const grid = document.getElementById("grid");
      grid.innerHTML = "";

      const total = parseFloat(document.getElementById("goal").value);
      const metaTexto = document.getElementById("meta").value;
      const numCasillas = parseInt(document.getElementById("numCasillas").value);

      if(numCasillas < 1 || numCasillas > 72){
        alert("Por favor, ingresa un número de casillas entre 1 y 72.");
        return;
      }

      if(total < 1){
        alert("Por favor, ingresa un monto total mayor o igual a 1.");
        return;
      }

      document.getElementById("metaTexto").innerText = "Meta: " + metaTexto;

      const columnas = 9;
      const filas = Math.ceil(numCasillas / columnas);

      const seleccionados = Array.from(document.querySelectorAll(".monto:checked")).map(cb => parseInt(cb.value));
      if (seleccionados.length === 0) {
        alert("Selecciona al menos un monto para usar.");
        return;
      }

      montos = distribuirMontos(total, numCasillas, seleccionados);
      marcados = Array(numCasillas).fill(false);

      const headerRow = document.createElement("tr");
      const emptyTh = document.createElement("th");
      headerRow.appendChild(emptyTh);
      for (let c = 0; c < columnas; c++) {
        const th = document.createElement("th");
        th.innerText = String.fromCharCode(65 + c);
        headerRow.appendChild(th);
      }
      grid.appendChild(headerRow);

      for (let r = 0; r < filas; r++) {
        const row = document.createElement("tr");
        const th = document.createElement("th");
        th.innerText = r + 1;
        row.appendChild(th);

        for (let c = 0; c < columnas; c++) {
          const index = r * columnas + c;
          const td = document.createElement("td");
          if (index < numCasillas) {
            td.className = "cell";
            td.innerText = montos[index];
            td.onclick = () => toggle(index, td);
          } else {
            td.innerText = "";
          }
          row.appendChild(td);
        }
        grid.appendChild(row);
      }

      actualizarResumen();
    }

    function distribuirMontos(total, cantidad, valoresPosibles) {
      let montos = [];
      let suma = 0;

      while (montos.length < cantidad) {
        let restante = total - suma;
        let minValor = Math.min(...valoresPosibles);
        let posibles = valoresPosibles.filter(v => v <= restante && (restante - v) >= (cantidad - montos.length - 1) * minValor);

        if (montos.length === cantidad - 1) {
          if (valoresPosibles.includes(restante)) {
            montos.push(restante);
            suma += restante;
          }
          break;
        }
        if (posibles.length === 0) break;

        let val = posibles[Math.floor(Math.random() * posibles.length)];
        montos.push(val);
        suma += val;
      }

      if (montos.length !== cantidad || suma !== total) {
        return distribuirMontos(total, cantidad, valoresPosibles);
      }

      return montos.sort(() => Math.random() - 0.5);
    }

    function toggle(index, td) {
      if (marcados[index]) {
        const confirmar = confirm("¿Desea desmarcar la cantidad?");
        if (!confirmar) return;
      }
      marcados[index] = !marcados[index];
      td.classList.toggle("saved");
      actualizarResumen();
    }

    function actualizarResumen() {
      const total = montos.reduce((acc, val, i) => acc + (marcados[i] ? val : 0), 0);
      const objetivo = parseFloat(document.getElementById("goal").value);
      document.getElementById("ahorrado").innerText = total;
      document.getElementById("progreso").innerText = Math.round(100 * total / objetivo) + "%";
    }