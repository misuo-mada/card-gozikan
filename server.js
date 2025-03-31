const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); // サーバーの作成
const io = new Server(server); // Socket.IO サーバーの作成
const PORT = process.env.PORT || 3000;

let cards = [
    { id: 1, info: "カード1の秘密情報" },
    { id: 2, info: "カード2の秘密情報" },
    { id: 3, info: "カード3の秘密情報" },
    { id: 4, info: "カード4の秘密情報" },
    { id: 5, info: "カード5の秘密情報" },
    { id: 6, info: "カード6の秘密情報" },
];

let drawnCardsCount = 0;

// Socket.IO サーバーの設定
io.on('connection', (socket) => {
    console.log('プレイヤーが接続しました:', socket.id);

    // 初期化リクエスト
    socket.on('initGame', () => {
        socket.emit('initCards', cards); // 初期カードをクライアントに送信
    });

    // カードを引くリクエスト
    socket.on('drawCard', (index) => {
        if (drawnCardsCount < 3 && cards[index]) {
            const card = cards[index];
            cards[index] = null; // カードを引いたことにする
            drawnCardsCount++;
            socket.emit('cardInfo', { index, info: card.info }); // カード情報を送信
        }
    });

    // ゲームリセット
    socket.on('resetGame', () => {
        cards = [
            { id: 1, info: "最近、あなたのスマホには無言電話が頻繁にかかっている。" },
            { id: 2, info: "あなたのポストには、正体不明の髪の毛が入っている。" },
            { id: 3, info: "被害者である「堤　晴美」は、会ったことはないはずだが、どこか見覚えがある。" },
            { id: 4, info: "あなたは、ここ数日、何者かにつけられている気がした。" },
            { id: 5, info: "あなたのポストには、正体不明のラブレターが届いていた。" },
            { id: 6, info: "あなたの部屋に、見覚えのない女性の髪の毛が落ちていた。" },
        ];
        drawnCardsCount = 0;
        socket.emit('gameReset', { cards }); // 初期化カードを送信
    });
});

// 静的ファイルの提供
app.use(express.static(__dirname + '/public'));

// サーバーの起動 (server.listen を使用)
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
