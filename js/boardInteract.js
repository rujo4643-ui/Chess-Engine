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

        document.querySelectorAll('[moved*="now"]').forEach((e) => {
            e.setAttribute("moved", "ago");
        });

        const moveInfo = square.getAttribute("move").split(" ");
        square.setAttribute("moved", `${moveInfo[0]} now`);

        if (moveInfo[0] == "enpassant") {
            const pawn = document.getElementById(moveInfo[1]);
            pawn.removeAttribute("moved");
            pawn.removeAttribute("class");
        } else if (moveInfo[0] == "castle") {
            const rook = document.getElementById(moveInfo[2]);
            rook.removeAttribute("moved");
            rook.removeAttribute("class");

            const rookSquare = document.getElementById(moveInfo[1]);
            rookSquare.className = `${square.className.slice(0, 2)} r`;
            rookSquare.setAttribute("moved", "castle now");
        }

        selecting.removeAttribute("class");
        selecting.removeAttribute("moved");

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
