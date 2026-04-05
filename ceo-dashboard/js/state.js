// ========================================
// 전역 상태 관리 (기존 store-state.js 패턴 계승)
// ========================================

export let state = {
    kpis: {
        revenue: {
            label: '오늘 매출',
            value: '₩0',
            change: '+0%',
            changeType: 'neutral'
        },
        visitors: {
            label: '방문자 수',
            value: '0',
            change: '+0%',
            changeType: 'neutral'
        },
        conversion: {
            label: '전환율',
            value: '0%',
            change: '+0%',
            changeType: 'neutral'
        }
    },
    schedule: [],
    announcements: [],
    news: [],
    lastUpdated: new Date().toISOString(),
    loading: {
        kpi: false,
        schedule: false,
        announcements: false,
        news: false
    }
};

/**
 * 상태 업데이트 (얕은 병합)
 */
export function setState(updates) {
    state = deepMerge(state, updates);
    notifyListeners();
}

/**
 * 깊은 병합 헬퍼
 */
function deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                result[key] = deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
    }

    return result;
}

/**
 * 상태 조회
 */
export function getState() {
    return state;
}

/**
 * 특정 상태만 조회
 */
export function getStateField(field) {
    return state[field];
}

/**
 * 상태 리스너 등록/호출
 */
const listeners = new Set();

export function onStateChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

function notifyListeners() {
    listeners.forEach(listener => {
        try {
            listener(state);
        } catch (error) {
            console.error('State listener error:', error);
        }
    });
}

/**
 * KPI 업데이트
 */
export function updateKPI(key, data) {
    setState({
        kpis: {
            ...state.kpis,
            [key]: {
                ...state.kpis[key],
                ...data
            }
        }
    });
}

/**
 * 일정 업데이트
 */
export function setSchedule(schedule) {
    setState({ schedule });
}

/**
 * 공지사항 업데이트
 */
export function setAnnouncements(announcements) {
    setState({ announcements });
}

/**
 * 뉴스 업데이트
 */
export function setNews(news) {
    setState({ news, lastUpdated: new Date().toISOString() });
}

/**
 * 로딩 상태 업데이트
 */
export function setLoading(field, isLoading) {
    setState({
        loading: {
            ...state.loading,
            [field]: isLoading
        }
    });
}

export function isLoading(field) {
    return state.loading[field];
}
