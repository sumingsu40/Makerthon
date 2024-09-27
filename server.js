const express = require("express");
const nodemailer = require('nodemailer');
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

// JSON 데이터를 처리하는 미들웨어 추가
app.use(express.json());

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

// Nodemailer 설정
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'omgfire119@gmail.com', // 발신자 이메일
        pass: 'rrme unbt hdum nbwu'   // 발신자 이메일 비밀번호 (또는 앱 비밀번호)
    }
});

// POST 요청을 받아 이메일을 전송하는 엔드포인트
app.post('/send-email', (req, res) => {
    console.log("Request body:", req.body); // 여기서 req.body를 확인해보세요.
    const { flameDetected } = req.body;  // req.body에서 flameDetected를 추출

    if (flameDetected) {
        const mailOptions = {
            from: 'omgfire119@gmail.com',
            to: 'anonymous40@dgu.ac.kr',
            subject: 'Flame Detected!',
            text: `A flame has been detected! Please take immediate action.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).json({ message: 'Failed to send email', error: error.message });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ message: 'Email sent successfully' });
            }
        });
    } else {
        return res.status(400).json({ message: 'No flame detected' });
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
