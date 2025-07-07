let montos = [];
let marcados = [];

function aplicarTema(tema) {
  const estiloMujer = { fondo: "#fff5fa", borde: "#fbb8d2", celdas: "#ffccdd" };
  const estiloVaron = { fondo: "#f0f7ff", borde: "#a3c9ff", celdas: "#cce0ff" };
  let colores = {};
  if (tema === "mujer") colores = estiloMujer;
  else if (tema === "varon") colores = estiloVaron;
  else return;
  document.body.style.background = colores.fondo;
  const cartilla = document.getElementById("cartilla");
  cartilla.style.borderColor = colores.borde;
  document.querySelectorAll("td.cell").forEach(td => td.style.background = colores.celdas);
}

function aplicarClaseCartilla(tema) {
  const cartilla = document.getElementById("cartilla");
  cartilla.classList.remove("mujer", "varon");
  if (tema === "mujer") cartilla.classList.add("mujer");
  if (tema === "varon") cartilla.classList.add("varon");
}

function generarCasillas() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  const total = parseFloat(document.getElementById("goal").value);
  const metaTexto = document.getElementById("meta").value;
  const numCasillas = parseInt(document.getElementById("numCasillas").value);
  if (numCasillas < 1 || numCasillas > 150) return;

  document.getElementById("metaTexto").innerText = "Meta: " + metaTexto;
  document.getElementById("montoMeta").innerText = "Monto: " + total;

  const columnas = 15;
  const filas = Math.ceil(numCasillas / columnas);
  const seleccionados = Array.from(document.querySelectorAll(".monto:checked")).map(cb => parseInt(cb.value));
  if (seleccionados.length === 0) return;

  montos = distribuirMontos(total, numCasillas, seleccionados);

  // Si no pudo generar combinación exacta, llena aleatoriamente
  if (montos.length === 0) {
    for (let i = 0; i < numCasillas; i++) {
      montos.push(seleccionados[Math.floor(Math.random() * seleccionados.length)]);
    }
  }

  marcados = Array(numCasillas).fill(false);

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

  const tema = document.getElementById("tema").value;
  aplicarTema(tema);
  aplicarClaseCartilla(tema);

  const frase = document.getElementById("fraseAhorro");
  frase.innerText = numCasillas <= 120 ? "¡Cada moneda cuenta, tu futuro lo agradecerá!" : "";

  const img = document.getElementById("imagenAhorro");
  img.style.display = numCasillas < 75 ? "block" : "none";

  actualizarResumen();
}

function distribuirMontos(total, cantidad, valoresPosibles) {
  let montos = [], suma = 0;
  let intentos = 0;
  while (montos.length < cantidad && intentos < 1000) {
    intentos++;
    let restante = total - suma;
    let min = Math.min(...valoresPosibles);
    let posibles = valoresPosibles.filter(v => v <= restante && (restante - v) >= (cantidad - montos.length - 1) * min);
    if (montos.length === cantidad - 1 && valoresPosibles.includes(restante)) {
      montos.push(restante); break;
    }
    if (posibles.length === 0) {
      montos = [];
      suma = 0;
      continue;
    }
    let val = posibles[Math.floor(Math.random() * posibles.length)];
    montos.push(val); suma += val;
  }
  if (montos.length !== cantidad || suma !== total) return [];
  return montos.sort(() => Math.random() - 0.5);
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
  const element = document.getElementById("cartilla");

  const opt = {
    margin:       [10, 3, 5, 3], // top, left, bottom, right en mm
    filename:     'cartilla_ahorro.pdf',
    image:        { type: 'png', quality: 1 },
    html2canvas:  { scale: 2, scrollY: -window.scrollY },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}
