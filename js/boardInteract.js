let holding;
let square;

function hold(e) {
    if (!holding) return;
    holding.style.left = e.clientX - 75 / 2 + "px";
    holding.style.top = e.clientY - 75 / 2 + "px";
}

document.querySelectorAll(".chessBoard > *").forEach((e) => {
    if (e.classList.length == 0) return;

    e.addEventListener("mousedown", (event) => {
        holding = e.cloneNode(true);
        holding.id = "holding";
        document.body.appendChild(holding);
        hold(event);

        e.className = "";
        square = e;
    });
});

document.body.addEventListener("mousemove", hold);
document.body.addEventListener("mouseup", () => {
    if (!holding) return;
    square.className = holding.className;
    document.body.removeChild(holding);
    holding = null;
});