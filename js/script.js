//Global variables
var canvas, context, algorithm;
var grid = [];
var gridSize;

//Eventlistener
window.addEventListener('load', () => {
    Graphics.initCanvas();

    var start = document.getElementById("start");
    var stop = document.getElementById("stop");
    var reload = document.getElementById("reload");

    window.addEventListener('resize', Graphics.resizeCanvas)

    canvas.addEventListener('mousemove', Graphics.onMouseMove);
    canvas.addEventListener('click', Graphics.onMouseClick);
    canvas.addEventListener('mousedown', Graphics.onMouseDown)
    canvas.addEventListener('mouseup', Graphics.onMouseUp);

    start.addEventListener('click', Graphics.onStart);
    stop.addEventListener('click', Graphics.onStop);
    reload.addEventListener('click', Graphics.onReload);
});