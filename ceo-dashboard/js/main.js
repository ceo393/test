// ========================================
// CEO 아침 브리핑 대시보드 - 메인 진입점
// ========================================

import {
    setState,
    getState,
    setSchedule,
    setAnnouncements,
    setNews,
    setLoading,
    onStateChange
} from './state.js';

import { loadData } from './data-loader.js';

import {
    renderKPICards,
    renderSchedule,
    renderAnnouncements,
    renderNews,
    showLoading,
    showError,
    updateDateTime,
    animateRefreshButton,
    escapeHtml
} from './ui-components.js';

import {
    fetchNewsSummary,
    getMockNews
} from './api-client.js';

// ========== DOM 요소 ==========
const kpiContainer = document.getElementById('kpi-container');
const scheduleContainer = document.getElementById('schedule-container');
const announcementsContainer = document.getElementById('announcements-container');
const newsContainer = document.getElementById('news-container');
const refreshNewsBtn = document.getElementById('refresh-news-btn');

// ========== 초기화 ==========
async function initialize() {
    console.log('Dashboard initializing...');

    // 1. 날짜/시간 업데이트 (매초)
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // 2. data.json 로드
    const data = await loadData();

    // 3. 상태에 데이터 적용
    setState({
        kpis: {
            revenue: {
                ...data.kpis.revenue,
                label: '오늘 매출'
            },
            visitors: {
                ...data.kpis.visitors,
                label: '방문자 수'
            },
            conversion: {
                ...data.kpis.conversion,
                label: '전환율'
            }
        }
    });
    setSchedule(data.schedule || []);
    setAnnouncements(data.announcements || []);

    // 4. 초기 렌더링
    render();

    // 5. 뉴스 로드 (비동기)
    loadNews();

    // 6. 새로고침 버튼 이벤트
    if (refreshNewsBtn) {
        refreshNewsBtn.addEventListener('click', handleRefreshNews);
    }

    // 7. 상태 변경 감지
    onStateChange(() => {
        render();
    });

    console.log('Dashboard initialized successfully');
}

// ========== 렌더링 ==========
function render() {
    const state = getState();

    // KPI 카드 렌더링
    renderKPICards(kpiContainer, state.kpis);

    // 일정 렌더링
    renderSchedule(scheduleContainer, state.schedule);

    // 공지사항 렌더링
    renderAnnouncements(announcementsContainer, state.announcements);

    // 뉴스 렌더링 (상태가 변경될 때만)
    if (state.news && state.news.length > 0) {
        renderNews(newsContainer, state.news);
    }
}

// ========== 뉴스 로드 ==========
async function loadNews() {
    setLoading('news', true);
    showLoading(newsContainer);

    try {
        // 로컬 개발 환경에서는 샘플 데이터 사용
        const isProduction = window.location.hostname !== 'localhost' &&
                           window.location.hostname !== '127.0.0.1';

        let news;
        if (isProduction) {
            // 프로덕션: Vercel API 호출
            news = await fetchNewsSummary();
        } else {
            // 로컬 개발: 샘플 데이터
            news = getMockNews();
        }

        if (news.error) {
            showError(newsContainer, news.error);
        } else {
            setNews(news);
        }
    } catch (error) {
        console.error('Failed to load news:', error);
        showError(newsContainer, '뉴스를 불러올 수 없습니다.');
    } finally {
        setLoading('news', false);
    }
}

// ========== 새로고침 핸들러 ==========
async function handleRefreshNews(event) {
    event.preventDefault();
    const removeAnimation = animateRefreshButton(refreshNewsBtn);
    await loadNews();
    removeAnimation();
}

// ========== DOM 로드 완료 후 실행 ==========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
