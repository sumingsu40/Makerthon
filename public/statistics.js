document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('powerChart').getContext('2d');
    const powerChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['5월', '6월', '7월', '8월', '9월', '10월', '11월'],
            datasets: [{
                label: '(Kwh)',
                data: [14.0, 17.8, 20.0, 22.0, 17.6, 11.2, 80.0],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,  // 반응형 차트
            maintainAspectRatio: false,  // 고정된 비율을 사용하지 않도록 설정
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

document.getElementById('back-btn').addEventListener('click', function () {
    window.location.href = 'page1.html';
});

document.getElementById('homeicon').addEventListener('click', function() {
    window.location.href = 'index.html';
});

document.getElementById('girdicon').addEventListener('click', function() {
    window.location.href = 'grid.html';
});
