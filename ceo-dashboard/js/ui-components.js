// ========================================
// UI 컴포넌트 및 렌더링 함수
// ========================================

/**
 * KPI 카드 렌더링
 */
export function renderKPICards(container, kpis) {
    container.innerHTML = '';

    const kpiArray = [
        { key: 'revenue', ...kpis.revenue },
        { key: 'visitors', ...kpis.visitors },
        { key: 'conversion', ...kpis.conversion }
    ];

    kpiArray.forEach(kpi => {
        const card = document.createElement('div');
        card.className = 'kpi-card';
        card.innerHTML = `
            <div class="kpi-label">${kpi.label}</div>
            <div class="kpi-value">${kpi.value}</div>
            <div class="kpi-change ${kpi.changeType === 'positive' ? 'positive' : kpi.changeType === 'negative' ? 'negative' : ''}">${kpi.change}</div>
        `;
        container.appendChild(card);
    });
}

/**
 * 일정 목록 렌더링
 */
export function renderSchedule(container, schedule) {
    container.innerHTML = '';

    if (!schedule || schedule.length === 0) {
        container.innerHTML = '<p class="loading">등록된 일정이 없습니다.</p>';
        return;
    }

    schedule.forEach(item => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.innerHTML = `
            <div class="schedule-time">${item.time}</div>
            <div class="schedule-details">
                <div class="schedule-title">${escapeHtml(item.title)}</div>
                <div class="schedule-attendees">${escapeHtml(item.attendees || '참석자 미지정')}</div>
            </div>
        `;
        container.appendChild(scheduleItem);
    });
}

/**
 * 공지사항 목록 렌더링
 */
export function renderAnnouncements(container, announcements) {
    container.innerHTML = '';

    if (!announcements || announcements.length === 0) {
        container.innerHTML = '<p class="loading">공지사항이 없습니다.</p>';
        return;
    }

    announcements.forEach(item => {
        const announcementItem = document.createElement('div');
        announcementItem.className = 'announcement-item';
        announcementItem.innerHTML = `
            <div class="announcement-title">${escapeHtml(item.title)}</div>
            <div class="announcement-content">${escapeHtml(item.content)}</div>
            <div class="announcement-time">${formatTime(item.time)}</div>
        `;
        container.appendChild(announcementItem);
    });
}

/**
 * 뉴스 목록 렌더링
 */
export function renderNews(container, news) {
    container.innerHTML = '';

    if (!news || news.length === 0) {
        container.innerHTML = '<p class="loading">뉴스를 불러올 수 없습니다.</p>';
        return;
    }

    if (news.error) {
        container.innerHTML = `<p class="error">${escapeHtml(news.error)}</p>`;
        return;
    }

    news.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <div class="news-title">${escapeHtml(item.title)}</div>
            <div class="news-summary">${escapeHtml(item.summary)}</div>
            <div class="news-source">${escapeHtml(item.source || 'Unknown Source')}</div>
        `;
        container.appendChild(newsItem);
    });
}

/**
 * 로딩 상태 표시
 */
export function showLoading(container) {
    container.innerHTML = '<p class="loading">로딩 중...</p>';
}

/**
 * 에러 표시
 */
export function showError(container, message) {
    container.innerHTML = `<p class="error">${escapeHtml(message)}</p>`;
}

/**
 * 현재 날짜/시간 업데이트
 */
export function updateDateTime() {
    const now = new Date();

    // 날짜
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        dateElement.textContent = now.toLocaleDateString('ko-KR', options);
    }

    // 시간
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }

    // 마지막 업데이트
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        lastUpdateElement.textContent = now.toLocaleDateString('ko-KR', options);
    }
}

/**
 * 시간 포맷팅 (상대 시간)
 */
export function formatTime(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    // 밀리초 단위
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    // 날짜로 포맷
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('ko-KR', options);
}

/**
 * HTML 이스케이프
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 새로고침 버튼 애니메이션
 */
export function animateRefreshButton(button) {
    button.classList.add('loading');
    return () => {
        button.classList.remove('loading');
    };
}
