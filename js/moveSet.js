const fixedOffset = (pos, color, moveOffsets) => {
    for (i in moveOffsets) {
        const x = parseInt(pos[0]) + moveOffsets[i][0];
        const y = parseInt(pos[1]) + moveOffsets[i][1];
        const square = document.getElementById(`${x}${y}`);

        if (!square) continue;
        if (!square.className) {
            square.setAttribute("move", "normal");
        } else if (square.className[0] != color) {
            square.setAttribute("move", "capture");
        }
    }
};

const longOffset = (pos, color, moveDirections) => {
    for (i in moveDirections) {
        let offset = 0;

        while (true) {
            offset++;
            const x = parseInt(pos[0]) + moveDirections[i][0] * offset;
            const y = parseInt(pos[1]) + moveDirections[i][1] * offset;
            const square = document.getElementById(`${x}${y}`);

            if (!square) break;
            if (!square.className) {
                square.setAttribute("move", "normal");
            } else if (square.className[0] != color) {
                square.setAttribute("move", "capture");
                break;
            } else {
                break;
            }
        }
    }
};

const getMoveable = {
    p: (piece) => {
        const pos = piece.id;
        const color = piece.className[0];
        const moved = piece.getAttribute("moved");
        let moveable = false;

        const moveOffsets =
            color == "w"
                ? [
                      [-1, -1],
                      [0, -1],
                      [1, -1],
                      [0, -2],
                  ]
                : [
                      [-1, 1],
                      [0, 1],
                      [1, 1],
                      [0, 2],
                  ];

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
                    square.setAttribute("move", "en passant");
                }
            } else if (!square.className) {
                if (i != 3) {
                    square.setAttribute("move", "normal");
                    moveable = true;
                } else if (moveable && !piece.getAttribute("moved")) {
                    square.setAttribute("move", "double");
                }
            }
        }
    },
    k: (piece) => {
        const pos = piece.id;
        const color = piece.className[0];
        fixedOffset(pos, color, [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1],
        ]);
    },
    n: (piece) => {
        const pos = piece.id;
        const color = piece.className[0];
        fixedOffset(pos, color, [
            [-1, -2],
            [1, -2],
            [2, -1],
            [2, 1],
            [-1, 2],
            [1, 2],
            [-2, -1],
            [-2, 1],
        ]);
    },
    b: (piece) => {
        const pos = piece.id;
        const color = piece.className[0];
        longOffset(pos, color, [
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
        ]);
    },
    r: (piece) => {
        const pos = piece.id;
        const color = piece.className[0];
        longOffset(pos, color, [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ]);
    },
    q: (piece) => {
        getMoveable["b"](piece);
        getMoveable["r"](piece);
    },
};
