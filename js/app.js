const graf = d3.select("#graf")
const tooltip = d3.select("#tooltip")
const country = d3.select("#country")
const type = d3.select("#type")

const margins = { left: 75, top: 40, right: 10, bottom: 50 }
const anchoTotal = +graf.style("width").slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16
const ancho = anchoTotal - margins.left - margins.right
const alto = altoTotal - margins.top - margins.bottom


const svg = graf
  .append("svg")
  .attr("width", anchoTotal)
  .attr("height", altoTotal)
  .attr("class", "fig")

const g = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

g.append("rect")
  .attr("x", "0")
  .attr("y", "0")
  .attr("width", ancho)
  .attr("height", alto)
  .attr("class", "grupo")

const x = d3.scaleLinear().range([0, ancho])
const y = d3.scaleLinear().range([alto, 0])

const xAxis = d3.axisBottom(x).tickSize(-alto)
const yAxis = d3.axisLeft(y).tickSize(-ancho)

const load = async () => {
  data = await d3.csv("data/data_inegi.csv", d3.autoType)

  x.domain([2000,2022])
  y.domain([0, d3.max(data, (d) => d.cantidad) * 1.1])

  g.append("g")
    .attr("transform", `translate(0, ${alto})`)
    .attr("class", "ejes")
    .call(xAxis)
  g.append("g").attr("class", "ejes").call(yAxis)

  g.append("text")
    .attr("x", ancho / 2)
    .attr("y", alto + 40)
    .attr("text-anchor", "middle")
    .attr("class", "labels")
    .text("Años")

  render(data)
}


const render = (data) => {
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
 }

 const showTooltip = (d) => {
  tooltip.style("display", "block")
  tooltip
    .style("left", x(d.anio) - 30 + "px")
    .style("top", y(d.cantidad) - 30 + "px")

  country.text(d.cantidad.toLocaleString("en-US"))
  type.text(d.tipo)
  showT = d.country
}

const hideTooltip = () => {
  tooltip.style("display", "none")
}


function color(tipo) {
  if(tipo == "compu"){
    return "#FF000080"
  }
  if(tipo == "net"){
    return "#00859880"
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
  return "#00FF0080"
}

load();