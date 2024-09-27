document.addEventListener('DOMContentLoaded', () => {
    const newsCard = document.getElementById('news-card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    const newsContent = [
        "첫 번째 뉴스 내용입니다.",
        "두 번째 뉴스 내용입니다.",
        "세 번째 뉴스 내용입니다.",
        "네 번째 뉴스 내용입니다."
    ];

    let currentIndex = 0;

    // 초기 뉴스 내용 설정
    newsCard.querySelector('p').textContent = newsContent[currentIndex];

    // 이전 버튼 클릭 시
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            newsCard.querySelector('p').textContent = newsContent[currentIndex];
        } else {
            // 첫 번째 뉴스에서 더 이상 이전 뉴스가 없을 때
            alert("이전 뉴스가 없습니다.");
        }
    });

    // 다음 버튼 클릭 시
    nextBtn.addEventListener('click', () => {
        if (currentIndex < newsContent.length - 1) {
            currentIndex++;
            newsCard.querySelector('p').textContent = newsContent[currentIndex];
        } else {
            // 마지막 뉴스에서 더 이상 다음 뉴스가 없을 때
            alert("더 이상 뉴스가 없습니다.");
        }
    });
});
