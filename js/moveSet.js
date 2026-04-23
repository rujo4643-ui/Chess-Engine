const fixedOffset = (pos, color, moveOffsets, isChecking) => {
    for (i in moveOffsets) {
        const x = parseInt(pos[0]) + moveOffsets[i][0];
        const y = parseInt(pos[1]) + moveOffsets[i][1];
        const square = document.getElementById(`${x}${y}`);

        if (!square) continue;
        if (!square.className) {
            if (isChecking) continue;
            square.setAttribute("move", "normal");
        } else if (square.className[0] != color) {
            if (isChecking) {
                if (isChecking.includes(square.className.slice(-1))) {
                    return true;
                } else {
                    continue;
                }
            }

            square.setAttribute("move", "capture");
        }
    }
};

const longOffset = (pos, color, moveDirections, isChecking) => {
    for (i in moveDirections) {
        let offset = 0;

        while (true) {
            offset++;
            const x = parseInt(pos[0]) + moveDirections[i][0] * offset;
            const y = parseInt(pos[1]) + moveDirections[i][1] * offset;
            const square = document.getElementById(`${x}${y}`);

            if (!square) break;
            if (!square.className) {
                if (isChecking) continue;
                square.setAttribute("move", "normal");
            } else if (square.className[0] != color) {
                if (isChecking) {
                    if (isChecking.includes(square.className.slice(-1))) {
                        return true;
                    } else {
                        break;
                    }
                }

                square.setAttribute("move", "capture");
                break;
            } else if (isChecking && square.className.slice(-1) == "k") {
                continue;
            } else break;
        }
    }
};

const isAttacked = (pos, color) => {
    return (
        longOffset(pos, color, bishop, "q b") ||
        longOffset(pos, color, rook, "q r") ||
        fixedOffset(pos, color, knight, "n") ||
        fixedOffset(pos, color, king, "k")
    );
};

const getMoveable = {
    p: (piece) => {
        const pos = piece.id;
        const color = piece.className[0];
        const moved = piece.getAttribute("moved");
        let moveable = false;

        const moveOffsets = color == "w" ? whitePawn : blackPawn;

        for (i in moveOffsets) {
            const x = parseInt(pos[0]) + moveOffsets[i][0];
            const y = parseInt(pos[1]) + moveOffsets[i][1];
            const square = document.getElementById(`${x}${y}`);
            const nextSquare = document.getElementById(`${x}${pos[1]}`);

            if (!square) continue;
            if (moveOffsets[i][0] != 0) {
                if (square.className && square.className[0] != color) {
                    square.setAttribute("move", "capture");
                } else if (
                    nextSquare &&
                    nextSquare.className &&
                    nextSquare.className[0] != color &&
                    nextSquare.getAttribute("moved") == "double now"
                ) {
                    square.setAttribute("move", `enpassant ${nextSquare.id}`);
                }
            } else if (!square.className) {
                if (i != 3) {
                    square.setAttribute("move", "normal");
                    moveable = true;
                } else if (moveable && !piece.getAttribute("moved")) {
                    square.setAttribute("move", "double");
                }
            }

            if (
                square.getAttribute("move") &&
                (color == "w" ? y == 1 : y == 8)
            ) {
                square.setAttribute(
                    "move",
                    "promote " + square.getAttribute("move"),
                );
            }
        }
    },
    k: (piece) => {
        const pos = piece.id;
        const color = piece.className[0];

        fixedOffset(pos, color, king);
        document.querySelectorAll("[move]").forEach((e) => {
            if (isAttacked(e.id, color)) e.removeAttribute("move");
        });

        if (piece.getAttribute("moved")) return;
        const castle = [
            [2, 0],
            [-2, 0],
        ];

        for (i in castle) {
            const x = parseInt(pos[0]) + castle[i][0];
            const square = document.getElementById(`${x}${pos[1]}`);

            const rookX = castle[i][0] > 0 ? 8 : 1;
            const rook = document.getElementById(`${rookX}${pos[1]}`);

            if (
                !rook ||
                rook.className.slice(-1) != "r" ||
                rook.getAttribute("moved")
            )
                continue;

            let castlable = true;

            for (
                let xCheck = pos[0];
                rookX == 8 ? xCheck < 8 : xCheck > 1;
                rookX == 8 ? xCheck++ : xCheck--
            ) {
                if (xCheck == pos[0]) continue;
                const castleSquare = document.getElementById(
                    `${xCheck}${pos[1]}`,
                );
                if (
                    castleSquare &&
                    (castleSquare.className ||
                        isAttacked(xCheck + pos[1], color))
                ) {
                    castlable = false;
                }
            }

            if (!castlable) continue;
            square.setAttribute(
                "move",
                `castle ${x + (rookX == 8 ? -1 : 1)}${pos[1]} ${rookX}${pos[1]}`,
            );
        }
    },
    n: (piece) => {
        const pos = piece.id;
        const color = piece.className[0];
        fixedOffset(pos, color, knight);
    },
    b: (piece) => {
        const pos = piece.id;
        const color = piece.className[0];
        longOffset(pos, color, bishop);
    },
    r: (piece) => {
        const pos = piece.id;
        const color = piece.className[0];
        longOffset(pos, color, rook);
    },
    q: (piece) => {
        getMoveable["b"](piece);
        getMoveable["r"](piece);
    },
};

const king = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
];

const whitePawn = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [0, -2],
];

const blackPawn = [
    [-1, 1],
    [0, 1],
    [1, 1],
    [0, 2],
];

const bishop = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
];

const rook = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
];

const knight = [
    [-1, -2],
    [1, -2],
    [2, -1],
    [2, 1],
    [-1, 2],
    [1, 2],
    [-2, -1],
    [-2, 1],
];
