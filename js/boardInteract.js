let holding;
let selecting;
let selectId;

function updateHolding(e) {
    if (!holding) return;
    holding.style.left = e.clientX - 75 / 2 + "px";
    holding.style.top = e.clientY - 75 / 2 + "px";
}

function hold(piece, event) {
    piece.id = "holding";

    holding = piece.cloneNode(true);
    holding.style.position = "fixed";
    holding.style.backgroundImage = 'url("../assets/pieces.png")';

    holding.id = "holding";
    document.body.appendChild(holding);
    updateHolding(event);
}

function select(square) {
    if (selecting) {
        selecting.removeAttribute("style");
        selecting.id = selectId;
    }

    selectId = square.id;
    selecting = square;
    selecting.style.setProperty(
        "--pos",
        window.getComputedStyle(selecting).backgroundPosition,
    );
}

document.querySelectorAll(".chessBoard > *").forEach((square) => {
    square.addEventListener("mousedown", (event) => {
        select(square);
        if (square.className) {
            hold(square, event);
        } else {
            selecting.id = "selecting";
        }
    });
});

document.body.addEventListener("mousemove", updateHolding);
document.body.addEventListener("mouseup", () => {
    if (!holding) return;
    document.body.removeChild(holding);
    holding = null;

    selecting.id = "selecting";
});
