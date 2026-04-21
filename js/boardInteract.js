let holding;
let selecting;

function updateHolding(e) {
    if (!holding) return;
    holding.style.left = e.clientX - 75 / 2 + "px";
    holding.style.top = e.clientY - 75 / 2 + "px";
}

function hold(event) {
    selecting.setAttribute("piece", "holding");

    holding = selecting.cloneNode(true);
    holding.style.position = "fixed";
    holding.style.backgroundImage = 'url("assets/pieces.png")';

    holding.id = "holding";
    document.body.appendChild(holding);
    updateHolding(event);
}

function move() {
    console.log("Moved");
}

function showLegalMove() {
    const piece = selecting.className.slice(-1);
    const color = selecting.className[0];

    getMoveable[piece](selecting.id, color);
}

function select(square) {
    if (selecting) {
        selecting.removeAttribute("piece");
        selecting.removeAttribute("style");

        document.querySelectorAll("[square]").forEach((square, index) => {
            square.removeAttribute("square");
        });
    }

    selecting = square;
    selecting.style.setProperty(
        "--pos",
        window.getComputedStyle(selecting).backgroundPosition,
    );
}

document.querySelectorAll(".chessBoard > *").forEach((square) => {
    square.addEventListener("mousedown", (event) => {
        if (event.target.getAttribute("square")) {
            move();
        } else {
            select(square);
            if (square.className) {
                hold(event);
                showLegalMove();
            } else {
                selecting.setAttribute("piece", "selecting");
            }
        }
    });
});

document.body.addEventListener("mousemove", updateHolding);
document.body.addEventListener("mouseup", (e) => {
    if (!holding) return;
    selecting.setAttribute("piece", "selecting");
    document.body.removeChild(holding);
    holding = null;

    if (e.target.getAttribute("square")) {
        move();
    }
});
