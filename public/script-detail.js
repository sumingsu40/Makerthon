// Firebase 설정 및 초기화

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// 전역 변수로 선언
let database;

document.addEventListener('DOMContentLoaded', () => {

    // Firebase 설정 정보
    const firebaseConfig = {
        apiKey: "your-api-key",
        authDomain: "your-auth-domain",
        databaseURL: "https://ijihajo-default-rtdb.firebaseio.com",
        projectId: "your-project-id",
        storageBucket: "your-storage-bucket",
        messagingSenderId: "your-messaging-sender-id",
        appId: "your-app-id"
    };

    // Firebase 초기화
    const app = initializeApp(firebaseConfig);
    database = getDatabase(app);  // 전역 변수로 선언된 `database`에 할당

    // Firebase에서 스위치 상태를 불러와 토글 스위치에 동기화
    const switchPaths = ['switch/status1', 'switch/status2', 'switch/status3'];
    switchPaths.forEach((path, index) => {
        const switchRef = ref(database, path);
        onValue(switchRef, (snapshot) => {
            const isChecked = snapshot.val();
            const switchElement = document.getElementById(`switch${index + 1}`);
            if (switchElement) {
                switchElement.checked = isChecked; // 불러온 값을 토글 스위치에 동기화
            }
        });
    });

    // Firebase에서 실시간으로 센서 데이터 및 확인 상태 가져오기
    const sensorRef = ref(database, 'sensor');  // 'sensor' 경로에 있는 데이터를 참조
    onValue(sensorRef, (snapshot) => {
        const data = snapshot.val();
        updateTemperatureDisplay(data);  // 데이터를 받아오면 업데이트하는 함수 호출
    });

    // 온도 값을 업데이트하는 함수
    function updateTemperatureDisplay(data) {
        console.log("Received data:", data);  // 콘솔에서 데이터를 확인
        const socketElements = document.querySelectorAll('.socket');

        if (socketElements.length === 0) {
            console.error("No socket elements found.");
            return;
        }

        // 첫 번째 노드에 첫 번째 온도와 습도 표시, 플레임이 있으면 불꽃 아이콘 표시
        const temp1 = data.temp1;
        const hum1 = data.hum1;
        const flame1 = data.flame1;
        const userNotAcknowledged1 = data.userNotAcknowledged1;

        // 두 번째 노드에 두 번째 온도와 습도 표시, 플레임이 있으면 불꽃 아이콘 표시
        const temp2 = data.temp2;
        const hum2 = data.hum2;
        const flame2 = data.flame2;
        const userNotAcknowledged2 = data.userNotAcknowledged2;

        // 세 번째 노드에 첫 번째와 두 번째의 평균 온도와 습도 표시
        const avgTemp = ((temp1 + temp2) / 2).toFixed(1);
        const avgHum = ((hum1 + hum2) / 2).toFixed(1);
        const flameAvg = flame1 && flame2 ? true : false; // 둘 다 플레임이면 불꽃 표시

        // 플레임 경고가 발생하면 Firebase에 '사용자가확인하지 않음' 상태 저장
        if (flame1 === 1 && !userNotAcknowledged1) {  // 사용자가 확인하지 않았을 때만
            sendFlameAlertEmail();
            set(ref(database, 'sensor/userNotAcknowledged1'), true);  // 이메일 전송 후 상태를 true로 변경
        }
        
        if (flame2 === 1 && !userNotAcknowledged2) {  // 사용자가 확인하지 않았을 때만
            sendFlameAlertEmail();
            set(ref(database, 'sensor/userNotAcknowledged2'), true);  // 이메일 전송 후 상태를 true로 변경
        }
        

        // 첫 번째 소켓 데이터 업데이트
        updateSocket(socketElements[0], temp1, hum1, flame1, userNotAcknowledged1, 0);

        // 두 번째 소켓 데이터 업데이트
        updateSocket(socketElements[1], temp2, hum2, flame2, userNotAcknowledged2, 1);

        // 세 번째 소켓 데이터 업데이트 (평균 값)
        updateSocket(socketElements[2], avgTemp, avgHum, flameAvg, false, 2);
    }

    // 소켓 업데이트 함수
    function updateSocket(socketElement, temperature, humidity, flame, userNotAcknowledged, index) {
        const temperatureSpan = socketElement.querySelector('.temperature');
        const warningIcon = socketElement.querySelector('.warning');

        if (temperatureSpan && warningIcon) {
            temperatureSpan.textContent = `${temperature}°C, ${humidity}%`;

            // '사용자가확인하지 않음'이 true일 때는 항상 불꽃 아이콘 표시
            if (userNotAcknowledged) {
                warningIcon.style.display = 'inline'; // 불꽃 아이콘 표시
            } else {
                warningIcon.style.display = 'none'; // 불꽃 아이콘 숨김
            }

            // 사용자가 경고 아이콘을 클릭하면 Firebase에 확인 상태를 false로 업데이트
            warningIcon.addEventListener('click', () => {
                set(ref(database, `sensor/userNotAcknowledged${index + 1}`), false); // Firebase에 확인 상태 저장
                warningIcon.style.display = 'none'; // 아이콘 숨기기
            });
        } else {
            console.error("Temperature or warning element not found.");
        }
    }
});

document.getElementById('back-btn').addEventListener('click', function () {
    window.history.back(); // 뒤로 가기 버튼을 클릭하면 이전 페이지로 이동
});

// 스위치 변경 시 Firebase 업데이트
function setupSwitchListener(switchId, switchPath) {
    document.getElementById(switchId).addEventListener("change", function (event) {
        const isChecked = event.target.checked; // 스위치가 켜졌는지 여부 확인

        // Firebase 경로 설정 및 데이터 저장
        const switchRef = ref(database, switchPath); // 'switch/status1' 등의 경로에 값을 저장

        // Firebase에 스위치 상태 저장
        set(switchRef, isChecked)
            .then(() => {
                console.log(`${switchId} updated to:`, isChecked);
            })
            .catch((error) => {
                console.error(`Error updating ${switchId}:`, error);
            });
    });
}

// 각 스위치에 대해 Firebase 상태 변경 리스너 설정
setupSwitchListener("switch1", 'switch/status1');
setupSwitchListener("switch2", 'switch/status2');
setupSwitchListener("switch3", 'switch/status3');

// 이메일 전송
function sendFlameAlertEmail() {
    fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            flameDetected: true  // 플레임이 감지되었음을 표시
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Email sent successfully');
        } else {
            console.log('Failed to send email');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
