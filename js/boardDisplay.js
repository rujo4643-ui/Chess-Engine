const FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1".split(" ");

const piecePlacement = FEN[0];
const activeColor = FEN[1];
const castling = FEN[2];
const enPassant = FEN[3];
const halfMove = FEN[4];
const fullMove = FEN[5];

for (let i = 0; i < 64; i++) {
    const div = document.createElement("div");
    div.id = `${i % 8 + 1}${Math.floor(i / 8) + 1}`;
    document.querySelector(".chessBoard").appendChild(div);
}

const rows = piecePlacement.split("/");
for (let y = 0; y < 8; y++) {
    let x = 1;

    for (let index = 0; index < rows[y].length; index++) {
        let placement = rows[y][index];
        let empty = parseInt(placement);

        if (isNaN(empty)) {
            const squareElement = document.getElementById(`${x}${y + 1}`);
            squareElement.classList.add(
                placement === placement.toUpperCase() ? "wh" : "bl"
            );

            squareElement.classList.add(placement.toLowerCase());
        } else while (--empty > 0) x++;
        x++;
    }
}