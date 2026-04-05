// ========================================
// data.json 로더
// ========================================

/**
 * data.json 파일 로드
 */
export async function loadData() {
    try {
        const response = await fetch('./public/data.json', {
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to load data: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
        // 기본값 반환
        return getDefaultData();
    }
}

/**
 * 기본 데이터 (data.json 로드 실패 시)
 */
function getDefaultData() {
    return {
        lastUpdated: new Date().toISOString(),
        kpis: {
            revenue: {
                label: '오늘 매출',
                value: '₩2.5M',
                change: '+12%',
                changeType: 'positive'
            },
            visitors: {
                label: '방문자 수',
                value: '145K',
                change: '+8%',
                changeType: 'positive'
            },
            conversion: {
                label: '전환율',
                value: '3.2%',
                change: '+0.5%',
                changeType: 'positive'
            }
        },
        schedule: [
            {
                time: '09:00',
                title: '경영진 회의',
                attendees: 'CEO, CFO, CTO'
            },
            {
                time: '10:30',
                title: '마케팅 팀 보고',
                attendees: 'CEO, Marketing Lead'
            },
            {
                time: '14:00',
                title: '제품 리뷰',
                attendees: 'Product Team'
            }
        ],
        announcements: [
            {
                title: 'Q2 분기별 목표 달성 현황',
                content: 'Q2 분기가 시작되었습니다. 모든 팀은 분기별 목표를 재확인하고 진행상황을 추적해주시기 바랍니다.',
                time: '2026-04-04 18:30'
            },
            {
                title: '신사무실 이전 안내',
                content: '4월 15일 신사무실로 이전합니다. 자세한 일정은 HR팀에 문의해주세요.',
                time: '2026-04-03 14:00'
            },
            {
                title: '팀 빌딩 이벤트 개최',
                content: '4월 20일 팀 빌딩 이벤트가 개최됩니다. 모두 참석 부탁드립니다.',
                time: '2026-04-02 10:00'
            }
        ]
    };
}

/**
 * 데이터 파일 경로 (배포 환경에서는 상대 경로 조정 필요)
 */
export function getDataPath() {
    return './public/data.json';
}
