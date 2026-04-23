let holding;
let selecting;
let promoting;

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

document.querySelectorAll(".pieceList *").forEach((e) => {
    e.addEventListener("mousedown", () => {
        if (!promoting) return;
        promoting.className = e.className;
        promoting = null;

        document.querySelector(".pieceList").style.display = "none";
        document.querySelector(".chessBoard").classList.remove("disable");

        new Audio("assets/promote.mp3").play();
    });
});

function promote(square) {
    promoting = square;
    document.querySelector(".chessBoard").classList.add("disable");

    document.querySelector(".pieceList").style.display = "flex";
    document.querySelectorAll(".pieceList *").forEach((e) => {
        e.className =
            square.className.slice(0, 2) + " " + e.className.slice(-1);
    });
}

function isMoveable(square) {
    if (square.getAttribute("move")) {
        square.className = selecting.className;
        document.querySelector(".chessBoard").style.flexWrap =
            selecting.className[0] == "w" ? "wrap-reverse" : "wrap";
        document.querySelector(".chessBoard").style.direction =
            selecting.className[0] == "w" ? "rtl" : "ltr";

        document.querySelectorAll('[moved*="now"]').forEach((e) => {
            e.setAttribute("moved", "ago");
        });

        const moveInfo = square.getAttribute("move").split(" ");
        square.setAttribute("moved", `${moveInfo[0]} now`);

        if (moveInfo[0] == "normal" || moveInfo[0] == "double") {
            new Audio("assets/move-self.mp3").play();
        } else if (moveInfo[0] == "capture" || moveInfo[0] == "enpassant") {
            new Audio("assets/capture.mp3").play();
        }

        if (moveInfo[0] == "enpassant") {
            const pawn = document.getElementById(moveInfo[1]);
            pawn.removeAttribute("moved");
            pawn.removeAttribute("class");

            new Audio("assets/move-self.mp3").play();
        } else if (moveInfo[0] == "castle") {
            const rook = document.getElementById(moveInfo[2]);
            rook.removeAttribute("moved");
            rook.removeAttribute("class");

            const rookSquare = document.getElementById(moveInfo[1]);
            rookSquare.className = `${square.className.slice(0, 2)} r`;
            rookSquare.setAttribute("moved", "castle now");

            new Audio("assets/castle.mp3").play();
        } else if (moveInfo[0] == "promote") {
            new Audio("assets/move-self.mp3");
            promote(square);
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

        document.querySelectorAll("[move]").forEach((square) => {
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
