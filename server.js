const express = require("express");
const admin = require("firebase-admin");
const path = require("path");

// Firebase Admin SDK 초기화
const serviceAccount = require("./ijihajo-firebase-adminsdk-ergiv-0f81c2dd27.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ijihajo-default-rtdb.firebaseio.com", 
});

const db = admin.database(); // Realtime Database 사용
const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// Firebase에서 데이터를 가져오는 API 엔드포인트
app.get("/get-data", (req, res) => {
    try {
        const ref = db.ref("sensor"); // 'sensor' 경로에서 데이터 가져오기
        ref.once("value", (snapshot) => {
            const data = snapshot.val();
            res.status(200).json(data); // 클라이언트로 데이터 응답
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Failed to fetch data from Firebase." });
    }
});

// 기본 HTML 파일 제공
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "main.html"));
});

app.get("/main", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "main.html"));
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
