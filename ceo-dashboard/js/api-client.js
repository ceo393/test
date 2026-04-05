// ========================================
// Vercel Functions API 클라이언트
// ========================================

// API 기본 URL 결정 (로컬 개발 vs 프로덕션)
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocalhost
    ? 'http://localhost:3000/api'  // 로컬 개발
    : 'https://your-vercel-project.vercel.app/api';  // Vercel 배포 후 수정

/**
 * AI 뉴스 요약 API 호출
 */
export async function fetchNewsSummary() {
    try {
        const response = await fetch(`${API_BASE_URL}/news-summary`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.news || [];
    } catch (error) {
        console.error('Error fetching news summary:', error);
        return {
            error: '뉴스를 불러올 수 없습니다. 나중에 다시 시도해주세요.'
        };
    }
}

/**
 * 로컬 개발 모드에서 샘플 뉴스 반환
 */
export function getMockNews() {
    return [
        {
            title: 'AI 시장 성장세 지속',
            summary: '2026년 AI 시장이 전년 대비 45% 성장하며 높은 관심을 끌고 있습니다. 특히 생성형 AI 분야에서 기업들의 투자가 급증하고 있습니다.',
            source: 'Tech News Daily'
        },
        {
            title: '클라우드 컴퓨팅 트렌드',
            summary: '엣지 컴퓨팅과 하이브리드 클라우드 아키텍처가 새로운 표준으로 자리잡고 있습니다. 기업들은 보안과 성능 향상을 위해 이러한 기술 도입을 추진 중입니다.',
            source: 'Cloud Magazine'
        },
        {
            title: '사이버 보안 위협 증가',
            summary: '금년도 사이버 공격 사건이 급증하고 있으며, 기업들은 보안 전문가 채용에 적극적입니다. 제로 트러스트 보안 모델 채택이 확산되고 있습니다.',
            source: 'Security Report'
        }
    ];
}
