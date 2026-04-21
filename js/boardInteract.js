let holding;
let selecting;

function updateHolding(e) {
    if (!holding) return;
    holding.style.left = e.clientX - 75 / 2 + "px";
    holding.style.top = e.clientY - 75 / 2 + "px";
}

function hold(event) {
    selecting.setAttribute("status", "holding");

    holding = selecting.cloneNode(true);
    holding.style.position = "fixed";
    holding.style.backgroundImage = 'url("assets/pieces.png")';

    holding.id = "holding";
    document.body.appendChild(holding);
    updateHolding(event);
}

function isMoveable(square) {
    if (square.getAttribute("move")) {
        square.className = selecting.className;

        const prevMove = document.querySelector('[moved*="now"]');
        if (prevMove) prevMove.setAttribute("moved", "ago");

        selecting.removeAttribute("piece");
        selecting.removeAttribute("class");
        selecting.removeAttribute("moved");
        square.setAttribute("moved", `${square.getAttribute("move")} now`);

        select();
        return true;
    } else return false;
}

function showLegalMove() {
    const piece = selecting.className.slice(-1);
    getMoveable[piece](selecting);
}

function select(square) {
    if (selecting) {
        selecting.removeAttribute("status");
        selecting.removeAttribute("style");

        document.querySelectorAll("[move]").forEach((square, index) => {
            square.removeAttribute("move");
        });
    }

    if (!square) return;
    selecting = square;
    selecting.style.setProperty(
        "--pos",
        window.getComputedStyle(selecting).backgroundPosition,
    );
}

document.querySelectorAll(".chessBoard > *").forEach((square) => {
    square.addEventListener("mousedown", (event) => {
        if (isMoveable(square)) return;

        select(square);
        if (square.className) {
            hold(event);
            showLegalMove();
        } else {
            selecting.setAttribute("status", "selecting");
        }
    });
});

document.body.addEventListener("mousemove", updateHolding);
document.body.addEventListener("mouseup", (event) => {
    if (!holding) return;
    selecting.setAttribute("status", "selecting");
    document.body.removeChild(holding);
    holding = null;

    isMoveable(event.target);
});
