let normalizedXPos;
let normalizedYPos;

let maxSize = 500;
let minSize = 250;

let co2Max = 400;
let co2Min = 300;
let co2Xposition = 600;
let co2Yposition = window.innerHeight / 2;

let aboveMax = 500;
let aboveMin = 230;
let aboveXposition = window.innerWidth - 800;
let aboveYposition = 600;

let belowMax = 360;
let belowMin = 320;
let belowXposition = window.innerWidth - 800;
let belowYposition = window.innerHeight - 500;

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function listenToTokens() {
  const server = `ws://localhost:6050`;
  const ws = new WebSocket(server);

  ws.onopen = () => {
    console.log("Websocket connection established");
  };

  ws.onerror = (error) => {
    console.log(`WebSocket error: `, error);
  };

  ws.onmessage = (msg) => {
    console.log("msg: ", msg);
    if (!isJson(msg.data)) return;

    const json = JSON.parse(msg?.data);
    if (json?.type === "/tracker/update") {
      const data = json.args;
      console.log("data: ", data);

      // data.x and data.y are values between 0–1
      normalizedXPos = window.innerWidth * data.relativeX;
      normalizedYPos = window.innerHeight * data.relativeY;

      let HotspotValue;
      if (data.rotation > 180) {
        HotspotValue = mapValue(data.rotation, 180, 360, maxSize, minSize);
      } else {
        HotspotValue = mapValue(data.rotation, 0, 180, minSize, maxSize);
      }

      let co2Value;
      if (data.rotation < 180) {
        co2Value = mapValue(data.rotation, 180, 360, co2Max, co2Min);
      } else {
        co2Value = mapValue(data.rotation, 0, 180, co2Min, co2Max);
      }

      let aboveValue;
      if (data.rotation > 180) {
        aboveValue = mapValue(data.rotation, 180, 360, aboveMax, aboveMin);
      } else {
        aboveValue = mapValue(data.rotation, 0, 180, aboveMin, aboveMax);
      }

      let belowValue;
      if (data.rotation > 180) {
        belowValue = mapValue(data.rotation, 180, 360, belowMax, belowMin);
      } else {
        belowValue = mapValue(data.rotation, 0, 180, belowMin, belowMax);
      }

      moveSVG("#rainforest", normalizedXPos, normalizedYPos);
      scale("#scalerainforest circle", HotspotValue);

      scale("#co2indicator circle", co2Value);
      scale("#aboveindicator circle", aboveValue);
      scale("#belowindicator circle", belowValue);

      connectSVG("#dashyindicator1 line", normalizedXPos, normalizedYPos);
      connectSVG("#dashyindicator2 line", normalizedXPos, normalizedYPos);
      connectSVG("#dashyindicator3 line", normalizedXPos, normalizedYPos);

      rotateSVG("#rotatehot", HotspotValue);
    }
  };
}

function drawSVG() {
  const svg = d3
    .select("#d3")
    .append("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);

  const hotspot = svg.append("g").attr("id", "rainforest");
  const currentHotspot = hotspot.append("g").attr("id", "scalerainforest");
  const rotateHot = hotspot.append("g").attr("id", "rotatehot");

  const co2Circle = svg.append("g").attr("id", "co2indicator");
  const carbonAbove = svg.append("g").attr("id", "aboveindicator");
  const carbonBelow = svg.append("g").attr("id", "belowindicator");

  const dashedline1 = svg.append("g").attr("id", "dashyindicator1");
  const dashedline2 = svg.append("g").attr("id", "dashyindicator2");
  const dashedline3 = svg.append("g").attr("id", "dashyindicator3");

  let strokeDash = "5, 10";
  let strokeThickness = 2;

  dashedline1
    .append("line")
    .style("stroke", "white")
    .style("stroke-width", strokeThickness)
    .attr("stroke-dasharray", strokeDash)
    .attr("stroke-linecap", "round")
    .attr("stroke-opacity", "40%")
    .attr("x1", co2Xposition)
    .attr("y1", co2Yposition)
    .attr("x2", 0)
    .attr("y2", 0);
  dashedline2
    .append("line")
    .style("stroke", "white")
    .style("stroke-width", strokeThickness)
    .attr("stroke-dasharray", strokeDash)
    .attr("stroke-linecap", "round")
    .attr("stroke-opacity", "40%")
    .attr("x1", aboveXposition)
    .attr("y1", aboveYposition)
    .attr("x2", 0)
    .attr("y2", 0);
  dashedline3
    .append("line")
    .style("stroke", "white")
    .style("stroke-width", strokeThickness)
    .attr("stroke-dasharray", strokeDash)
    .attr("stroke-linecap", "round")
    .attr("stroke-opacity", "40%")
    .attr("x1", belowXposition)
    .attr("y1", belowYposition)
    .attr("x2", 0)
    .attr("y2", 0);

  hotspot
    .append("circle")
    .style("fill", "black")
    .attr("opacity", "40%")
    .attr("r", 150)
    .attr("cx", 0)
    .attr("cy", 0);
  hotspot
    .append("text")
    .attr("font-size", 30)
    .attr("text-anchor", "middle")
    .attr("x", 0)
    .attr("y", +10)
    .attr("fill", "white")
    .text("Place Token");

  currentHotspot
    .append("circle")
    .style("stroke", "white")
    .style("stroke-width", 3)
    .style("fill", "url(#hotspot-gradient)")
    .attr("r", minSize)
    .attr("cx", 0)
    .attr("cy", 0);
  rotateHot
    .append("circle")
    .style("stroke", "white")
    .style("stroke-width", 4)
    .style("fill", "transparent")
    .attr("stroke-dasharray", "30, 80")
    .attr("stroke-linecap", "round")
    .attr("stroke-dashoffset", "38%")
    .attr("r", maxSize)
    .attr("cx", 0)
    .attr("cy", 0);

  co2Circle
    .append("circle")
    .style("stroke", "white")
    .style("stroke-width", 3)
    .style("fill", "url(#void-gradient)")
    .attr("r", 100)
    .attr("cx", co2Xposition)
    .attr("cy", co2Yposition);
  co2Circle
    .append("text")
    .attr("font-size", 30)
    .attr("text-anchor", "middle")
    .attr("x", co2Xposition)
    .attr("y", co2Yposition - 40)
    .attr("fill", "white")
    .text("CO2");
  co2Circle
    .append("text")
    .attr("font-size", 30)
    .attr("text-anchor", "middle")
    .attr("x", co2Xposition)
    .attr("y", co2Yposition)
    .attr("fill", "white")
    .text("in the air");

  carbonAbove
    .append("circle")
    .style("stroke", "white")
    .style("stroke-width", 3)
    .style("fill", "url(#void-gradient)")
    .attr("r", 100)
    .attr("cx", aboveXposition)
    .attr("cy", aboveYposition);
  carbonAbove
    .append("text")
    .attr("font-size", 30)
    .attr("text-anchor", "middle")
    .attr("x", aboveXposition)
    .attr("y", aboveYposition - 40)
    .attr("fill", "white")
    .text("CO2 Storage");
  carbonAbove
    .append("text")
    .attr("font-size", 30)
    .attr("text-anchor", "middle")
    .attr("x", aboveXposition)
    .attr("y", aboveYposition)
    .attr("fill", "white")
    .text("above ground");

  carbonBelow
    .append("circle")
    .style("stroke", "white")
    .style("stroke-width", 3)
    .style("fill", "url(#void-gradient)")
    .attr("r", 100)
    .attr("cx", belowXposition)
    .attr("cy", belowYposition);
  carbonBelow
    .append("text")
    .attr("font-size", 30)
    .attr("text-anchor", "middle")
    .attr("x", belowXposition)
    .attr("y", belowYposition - 40)
    .attr("fill", "white")
    .text("Carbon Storage");
  carbonBelow
    .append("text")
    .attr("font-size", 30)
    .attr("text-anchor", "middle")
    .attr("x", belowXposition)
    .attr("y", belowYposition)
    .attr("fill", "white")
    .text("below ground");

  var hotspotbubble = hotspot.append("defs");
  hotspotbubble
    .append("radialGradient")
    .attr("id", "hotspot-gradient")
    .attr("cx", "50%")
    .attr("cy", "50%")
    .attr("r", "50%")
    .selectAll("stop")
    .data([
      { offset: "60%", color: "#2B6D2F" },
      { offset: "75%", color: "#2B6D2F" },
      { offset: "98%", color: "#1A331C" },
      { offset: "100%", color: "#04001e" },
    ])
    .enter()
    .append("stop")
    .attr("offset", function (d) {
      return d.offset;
    })
    .attr("stop-color", function (d) {
      return d.color;
    });

  var voidbubble = hotspot.append("defs");
  voidbubble
    .append("radialGradient")
    .attr("id", "void-gradient")
    .attr("cx", "50%")
    .attr("cy", "50%")
    .attr("r", "50%")
    .selectAll("stop")
    .data([
      { offset: "60%", color: "#04001e" },
      { offset: "80%", color: "#191930" },
      { offset: "98%", color: "#9491BF" },
      { offset: "100%", color: "white" },
    ])
    .enter()
    .append("stop")
    .attr("offset", function (d) {
      return d.offset;
    })
    .attr("stop-color", function (d) {
      return d.color;
    });
}

///////////////////INTERACTIONS///////////////////////////////////

function moveSVG(selector, x, y) {
  const movement = d3
    .select(selector)
    .transition()
    .duration(50)
    .ease(d3.easeLinear)
    .attr("transform", () => `translate(${x}, ${y})`);
}

function connectSVG(selector, x, y) {
  const connect = d3
    .select(selector)
    .transition()
    .duration(50)
    .ease(d3.easeLinear)
    .attr("x2", x)
    .attr("y2", y);
}

function scale(selector, rotation) {
  const scaleGroup = d3
    .select(selector)
    .transition()
    .duration(50)
    .ease(d3.easeLinear)
    .attr("r", rotation);
}

function rotateSVG(selector, degrees) {
  const rotator = d3
    .select(selector)
    .transition()
    .duration(300)
    .ease(d3.easeLinear)
    .attr("transform", () => `rotate(${degrees})`);
}

function mapValue(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

listenToTokens();
drawSVG();
