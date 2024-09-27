let tabCount = 1; // 초기 멀티탭 개수

// + 버튼 클릭 시 메뉴 표시/숨김 전환
document.getElementById('add-tab-btn').addEventListener('click', function() {
    const menu = document.getElementById('floating-menu');
    
    // 메뉴가 숨겨져 있으면 보여주고, 보여져 있으면 숨김
    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
});

// 멀티탭 추가
document.getElementById('add-tab').addEventListener('click', function() {
    tabCount++;
    const tabList = document.getElementById('tab-list');
    const newTab = document.createElement('div');
    newTab.classList.add('tab-item');
    newTab.innerHTML = `멀티탭 ${tabCount}`;
    newTab.setAttribute('data-page', `page${tabCount}.html`); // 새로운 페이지로 이동 설정
    tabList.appendChild(newTab);

    // 탭 클릭 시 새로운 페이지로 이동하는 이벤트 추가
    newTab.addEventListener('click', function() {
        const page = newTab.getAttribute('data-page');
        window.location.href = page;
    });

    // 메뉴 닫기
    const menu = document.getElementById('floating-menu');
    menu.style.display = 'none';
});

// 멀티탭 삭제
document.getElementById('delete-tab').addEventListener('click', function() {
    const tabList = document.getElementById('tab-list');
    
    if (tabList.children.length > 1) {
        tabList.removeChild(tabList.lastElementChild); // 마지막 탭 삭제
        tabCount--;
    }
    
    // 메뉴 닫기
    const menu = document.getElementById('floating-menu');
    menu.style.display = 'none';
});

// 첫 번째 탭에 대한 클릭 이벤트 추가
document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', function() {
        const page = tab.getAttribute('data-page');
        window.location.href = page;
    });
});


