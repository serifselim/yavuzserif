export const SKILL_LOGOS = Object.freeze([
  "vue",
  "react",
  "typescript",
  "javascript",
  "nestjs",
  "dotnet",
  "postgresql",
  "expo",
  "figma",
  "git",
]);

const SIZE = 256;
const C = SIZE / 2;

function canvas() {
  const el = document.createElement("canvas");
  el.width = SIZE;
  el.height = SIZE;
  return el;
}

function disc(ctx, fill) {
  ctx.beginPath();
  ctx.arc(C, C, 112, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = fill === "#ffffff" ? "#e2e8f0" : "rgba(15, 23, 42, 0.12)";
  ctx.stroke();
}

function word(ctx, text, color) {
  ctx.fillStyle = color;
  ctx.font = "700 72px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, C, C + 4);
}

function vue(ctx) {
  disc(ctx, "#ffffff");
  ctx.fillStyle = "#42b883";
  ctx.beginPath();
  ctx.moveTo(C, 58);
  ctx.lineTo(188, 186);
  ctx.lineTo(C, 150);
  ctx.lineTo(68, 186);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#35495e";
  ctx.beginPath();
  ctx.moveTo(C, 86);
  ctx.lineTo(164, 176);
  ctx.lineTo(C, 146);
  ctx.lineTo(92, 176);
  ctx.closePath();
  ctx.fill();
}

function react(ctx) {
  disc(ctx, "#ffffff");
  ctx.strokeStyle = "#61dafb";
  ctx.lineWidth = 8;
  for (const tilt of [0, Math.PI / 3, -Math.PI / 3]) {
    ctx.beginPath();
    ctx.ellipse(C, C, 62, 22, tilt, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(C, C, 12, 0, Math.PI * 2);
  ctx.fillStyle = "#61dafb";
  ctx.fill();
}

function typescript(ctx) {
  disc(ctx, "#3178c4");
  word(ctx, "TS", "#ffffff");
}

function javascript(ctx) {
  disc(ctx, "#f7df1e");
  word(ctx, "JS", "#0f172a");
}

function nestjs(ctx) {
  disc(ctx, "#e0234e");
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(C, 148, 46, Math.PI * 1.08, Math.PI * 1.92);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(C, 118, 24, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(C, 86, 10, 0, Math.PI * 2);
  ctx.fill();
}

function dotnet(ctx) {
  disc(ctx, "#512bd4");
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 52px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(".NET", C, C + 2);
}

function postgresql(ctx) {
  disc(ctx, "#ffffff");
  ctx.fillStyle = "#336791";
  ctx.beginPath();
  ctx.ellipse(118, 118, 34, 40, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(150, 128, 48, 40, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#336791";
  ctx.beginPath();
  ctx.moveTo(186, 136);
  ctx.quadraticCurveTo(214, 168, 188, 196);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(162, 118, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#336791";
  ctx.beginPath();
  ctx.arc(164, 118, 3, 0, Math.PI * 2);
  ctx.fill();
}

function expo(ctx) {
  disc(ctx, "#0f172a");
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(92, 78);
  ctx.lineTo(156, 128);
  ctx.lineTo(92, 178);
  ctx.stroke();
}

function figma(ctx) {
  disc(ctx, "#ffffff");
  const r = 22;
  const spots = [
    [96, 86, "#f24e1e"],
    [148, 86, "#a259ff"],
    [96, 132, "#ff7262"],
    [148, 132, "#1abcfe"],
    [96, 178, "#0acf83"],
  ];
  for (const [x, y, color] of spots) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function git(ctx) {
  disc(ctx, "#ffffff");
  ctx.strokeStyle = "#f05032";
  ctx.fillStyle = "#f05032";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(C, 78);
  ctx.lineTo(C, 150);
  ctx.moveTo(C, 118);
  ctx.lineTo(168, 168);
  ctx.moveTo(C, 150);
  ctx.lineTo(88, 186);
  ctx.stroke();
  for (const [x, y] of [
    [C, 70],
    [168, 176],
    [84, 192],
  ]) {
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();
  }
}

const DRAW = {
  vue,
  react,
  typescript,
  javascript,
  nestjs,
  dotnet,
  postgresql,
  expo,
  figma,
  git,
};

export function skillTexture(three, id) {
  const el = canvas();
  DRAW[id](el.getContext("2d"));
  const texture = new three.CanvasTexture(el);
  texture.encoding = three.sRGBEncoding;
  return texture;
}
