const express = require("express");
const admin = require("firebase-admin");
const path = require("path");

// Firebase Admin SDK 초기화 (서비스 계정 키 파일 경로를 지정)
const serviceAccount = require("./ijihajo-firebase-adminsdk-ergiv-0f81c2dd27.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ijihajo.firebaseio.com", // 자신의 Firebase Realtime Database URL로 대체
});

const db = admin.database(); // Realtime Database 사용
const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 제공 (HTML 파일을 제공하려면)
app.use(express.static(path.join(__dirname, 'public')));

// Firebase Realtime Database에서 데이터 가져오는 API 엔드포인트
app.get("/get-data", async (req, res) => {
    const postId = req.query.postId || "your-post-id"; // 쿼리로 postId를 받음 (또는 기본값 설정)

    try {
        const ref = db.ref("posts/" + postId + "/starCount"); // 데이터 경로 설정
        ref.once("value", (snapshot) => {
            const data = snapshot.val();
            res.status(200).json({ starCount: data }); // 클라이언트로 데이터 응답
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Failed to fetch data from Firebase." });
    }
});

// 기본 HTML 파일 제공 (예시)
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


// const temperatureRef = ref(database, 'sensors/temperature'); // 'sensors/temperature' 경로에 있는 데이터를 참조
// onValue(temperatureRef, (snapshot) => {
//     const data = snapshot.val();
//     updateTemperatureDisplay(data);  // 데이터를 받아오면 업데이트하는 함수 호출
// });