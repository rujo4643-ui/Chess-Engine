const fixedOffset = (pos, color, moveOffsets) => {
    for (i in moveOffsets) {
        const x = parseInt(pos[0]) + moveOffsets[i][0];
        const y = parseInt(pos[1]) + moveOffsets[i][1];
        const square = document.getElementById(`${x}${y}`);

        if (!square) continue;
        if (!square.className) {
            square.setAttribute("square", "moveable");
        } else if (square.className[0] != color) {
            square.setAttribute("square", "capturable");
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
                square.setAttribute("square", "moveable");
            } else if (square.className[0] != color) {
                square.setAttribute("square", "capturable");
                break;
            } else {
                break;
            }
        }
    }
};

const getMoveable = {
    p: (pos, color) => {
        const moveOffsets =
            color == "w"
                ? [
                      [-1, -1],
                      [0, -1],
                      [1, -1],
                  ]
                : [
                      [-1, 1],
                      [0, 1],
                      [1, 1],
                  ];

        for (i in moveOffsets) {
            const x = parseInt(pos[0]) + moveOffsets[i][0];
            const y = parseInt(pos[1]) + moveOffsets[i][1];
            const square = document.getElementById(`${x}${y}`);

            if (!square) continue;
            if (!square.className) {
                square.setAttribute("square", "moveable");
            } else if (square.className[0] != color && moveOffsets[i][0] != 0) {
                square.setAttribute("square", "capturable");
            }
        }
    },
    k: (pos, color) => {
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
    n: (pos, color) => {
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
    b: (pos, color) => {
        longOffset(pos, color, [
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
        ]);
    },
    r: (pos, color) => {
        longOffset(pos, color, [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ]);
    },
    q: (pos, color) => {
        getMoveable["b"](pos, color);
        getMoveable["r"](pos, color);
    },
};
