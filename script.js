let montos = [];
let marcados = [];

function aplicarTema(tema) {
  const cartilla = document.getElementById("cartilla");
  cartilla.classList.remove("mujer", "varon");
  if (tema === "mujer") cartilla.classList.add("mujer");
  else if (tema === "varon") cartilla.classList.add("varon");
}

function generarCasillas() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  const total = parseFloat(document.getElementById("goal").value);
  const metaTexto = document.getElementById("meta").value.trim();
  const numCasillas = parseInt(document.getElementById("numCasillas").value);

  const seleccionados = Array.from(document.querySelectorAll(".monto:checked")).map(cb => parseInt(cb.value));
  if (seleccionados.length === 0) {
    alert("Selecciona al menos un monto.");
    return;
  }

  document.getElementById("metaTexto").innerText = "Meta: " + metaTexto;
  document.getElementById("montoMeta").innerText = "Monto: " + total;

  montos = [];
  for (let i = 0; i < numCasillas; i++) {
    let random = seleccionados[Math.floor(Math.random() * seleccionados.length)];
    montos.push(random);
  }

  marcados = Array(numCasillas).fill(false);

  const columnas = 15;
  const filas = Math.ceil(numCasillas / columnas);

  const headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th"));
  for (let c = 0; c < columnas; c++) {
    const th = document.createElement("th");
    th.innerText = String.fromCharCode(65 + (c % 26));
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
      }
      row.appendChild(td);
    }
    grid.appendChild(row);
  }

  document.getElementById("fraseAhorro").innerText = numCasillas <= 120 ? "¡Cada moneda cuenta, tu futuro lo agradecerá!" : "";

  const imagen = document.getElementById("imagenAhorro");
  if (numCasillas < 75) {
    imagen.src = "https://img.freepik.com/premium-vector/happy-kids-saving-money_179970-1480.jpg";
    imagen.style.display = "block";
  } else {
    imagen.style.display = "none";
  }

  aplicarTema(document.getElementById("tema").value);
  actualizarResumen();
}

function toggle(index, td) {
  if (marcados[index]) {
    if (!confirm("¿Deseas desmarcar esta casilla?")) return;
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

function descargarPDF() {
  window.print(); // usa print como forma básica de exportación
}
