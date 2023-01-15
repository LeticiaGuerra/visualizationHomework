/**ELEMENTOS DE LA PRIMERA GRÁFICA */
const graf = d3.select("#graf")
const tooltip = d3.select("#tooltip")
const country = d3.select("#country")
const type = d3.select("#type")

/**ELEMENTOS DE LA SEGUNDA  */
const grafica = d3.select("#grafica")

/**e
 * Elementos generales
 */
const margins = { left: 75, top: 40, right: 10, bottom: 50 }
const anchoTotal = +graf.style("width").slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16
const ancho = anchoTotal - margins.left - margins.right
const alto = altoTotal - margins.top - margins.bottom

/**Variables para manejar la visibilidad de los campos */
var types = "compunetTelevisorcabletelefonoradioluz"

/**Construcción de la primera gráfica */
const svg = graf
  .append("svg")
  .attr("width", anchoTotal)
  .attr("height", altoTotal)
  .attr("class", "fig")

const g = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

  /**Se crea rectángulo principal */
g.append("rect")
  .attr("x", "0")
  .attr("y", "0")
  .attr("width", ancho)
  .attr("height", alto)
  .attr("class", "grupo")

  /**Construcción de la segunda gráfica */
  const svg2 = grafica
  .append("svg")
  .attr("width", anchoTotal)
  .attr("height", altoTotal)
  .attr("class", "fig")

const g2 = svg2
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

  /**Se crea rectángulo principal */
g2.append("rect")
  .attr("x", "0")
  .attr("y", "0")
  .attr("width", ancho)
  .attr("height", alto)
  .attr("class", "grupo")

  /**Declaración de lo que usaremos como bordes */
const x = d3.scaleLinear().range([0, ancho])
const y = d3.scaleLinear().range([alto, 0])

const xAxis = d3.axisBottom(x).tickSize(-alto)
const yAxis = d3.axisLeft(y).tickSize(-ancho)

const x2 = d3.scaleLinear().range([0, ancho])
const y2 = d3.scaleLinear().range([alto, 0])


const load = async () => {
  /**Se descargan los datos de la primera base de datos */
  data = await d3.csv("data/data_inegi.csv", d3.autoType)
  //data = d3.filter(data, (d) => d.tipo == "luz")

  /**Se pone el dominio de x y y */
  x.domain([2000,2022])
  y.domain([0, d3.max(data, (d) => d.cantidad) * 1.1])

  /**Definimos el cuadro principal */
  g.append("g")
    .attr("transform", `translate(0, ${alto})`)
    .attr("class", "ejes")
    .call(xAxis)
  g.append("g").attr("class", "ejes").call(yAxis)

  /**Agregamos la descripción de los ejes */
  g.append("text")
    .attr("x", -40)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .attr("class", "labels")
    .text("Hogares")
    .attr("fill","#fff")

  g.append("text")
    .attr("x", ancho / 2)
    .attr("y", alto + 40)
    .attr("text-anchor", "middle")
    .attr("class", "labels")
    .text("Años")
    .attr("fill","#fff")

    /**Mandamos la data para crear los puntos en la gráfica */
  render(data)

  /**Se descarga segunda base de datos */
  data2 = await d3.csv("data/data.csv", d3.autoType)
  console.log(data2)

  /**Se agrega el dominio */
  x2.domain([0, d3.max(data2, (d) => d.Computadora) * 1.1])
  y2.domain([0, d3.max(data2, (d) => d.Internet) * 1.1])

  /**Se agrega visualización de ejes */
  g2.append("g")
    .attr("transform", `translate(0, ${alto})`)
    .attr("class", "ejes")
    .call(xAxis)
  g2.append("g").attr("class", "ejes").call(yAxis)

  g2.append("text")
    .attr("x", ancho / 2)
    .attr("y", alto + 40)
    .attr("text-anchor", "middle")
    .attr("class", "labels")
    .text("Computadoras")
    .attr("fill","#fff")

    g2.append("text")
    .attr("x", -40)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .attr("class", "labels")
    .text("Internet")
    .attr("fill","#fff")

    /**Se manda la data */
  render2(data2)

  }

/**Función para creación de gráfica */
const render = (data) => {
  /**Se crean los círculos que, dependiendo del tipo, es el color. Con función de mostrar tooltips cuando se pasa el mouse encima */
  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.anio))
    .attr("cy", (d) => y(d.cantidad))
    .attr("r", 8)
    .attr("fill", (d) => color(d.tipo))
    .on("mouseover", (e, d) => showTooltip(d))
    .on("mouseout", hideTooltip)
    .exit()
    .transition()
    .duration(200)
    .attr("r", 0)
    .attr("fill", "#ff000088")
    .remove()
 }

 /**Función para creación de segunda gráfica */
 const render2 = (data2) => {
  g2.selectAll("circle")
    .data(data2)
    .enter()
    .append("circle")
    .attr("cx", (d) => x2(d.Computadora))
    .attr("cy", (d) => y2(d.Internet))
    .attr("r", 10)
    .attr("fill", "#0000FF")
}

 /**Función para mostrar el tooltip del primer gráfico */
 const showTooltip = (d) => {
  tooltip.style("display", "block")
  tooltip
    .style("left", x(d.anio) - 30 + "px")
    .style("top", y(d.cantidad) - 30 + "px")

  /**Se le pone formato a los números */
  country.text(d.cantidad.toLocaleString("en-US"))
  /**Se le asigna nombre de acuerdo al tipo */
  if(d.tipo == "compu"){
    type.text("Computadora")
  }
  if(d.tipo == "net"){
    type.text("Internet")
  }
  if(d.tipo == "Televisor"){
    type.text("Televisor")
  }
  if(d.tipo == "cable"){
    type.text("TV de paga")
  }
  if(d.tipo == "telefono"){
    type.text("Teléfono")
  }
  if(d.tipo == "radio"){
    type.text("Radio")
  }if(d.tipo == "luz"){
    type.text("Electricidad")
  }
  showT = d.country
}

/**Función para ocultar el tooltip */
const hideTooltip = () => {
  tooltip.style("display", "none")
}

/**Función para agregar los colores a los círculos de la primera gráfica */
function color(tipo) {
  if(tipo == "compu"){
    return "#FF000080"
  }
  if(tipo == "net"){
    return "#00000080"
  }
  if(tipo == "Televisor"){
    return "#57236480"
  }
  if(tipo == "cable"){
    return "#80008080"
  }
  if(tipo == "telefono"){
    return "#0000FF80"
  }
  if(tipo == "radio"){
    return "#00800080"
  }
  if(tipo == "luz"){
    return "#00FF0080"
  }
}

/**Función para los botones */
const search = (type) => {
  /**Se quita o pone la palabra clave */
  if(types.includes(type)){
    types = types.replace(type,"")
  }else{
    types = types + type
  }
  /**Se filtra de acuerdo a las opciones */
  datum = d3.filter(data, (d) => types.includes(d.tipo))
  
  /**Se eliminan los círculos actuales */
  g.selectAll("circle")
  .remove()

  /**Cargan los nuevos datos */
  render(datum)
}

load();