document.getElementById('back-btn').addEventListener('click', function() {
    window.history.back(); // 뒤로 가기 버튼을 클릭하면 이전 페이지로 이동
});


// 센서 값을 받아온 후 해당 값을 업데이트하는 함수
// 온도 값을 업데이트하는 함수
function updateTemperatureDisplay(temperatures) {
    const socketElements = document.querySelectorAll('.socket');

    // 소켓이 3개라고 가정하고 각 소켓에 온도 값을 할당
    for (let i = 0; i < socketElements.length; i++) {
        const temperatureSpan = socketElements[i].querySelector('.temperature');
        const warningIcon = socketElements[i].querySelector('.warning');
        
        const temperature = temperatures[i];  // 각 소켓에 대한 온도 값을 가져옴

        // 온도 값 업데이트
        temperatureSpan.textContent = `${temperature}°C`;

        // 온도가 특정 값 이상일 경우 경고 아이콘 표시
        if (temperature >= 70) {
            temperatureSpan.classList.add('high');
            warningIcon.style.display = 'inline';
        } else {
            temperatureSpan.classList.remove('high');
            warningIcon.style.display = 'none';
        }
    }
}
