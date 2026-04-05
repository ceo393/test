// ========================================
// Vercel Serverless Function - AI 뉴스 요약
// ========================================

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY
});

/**
 * 샘플 뉴스 데이터 (실제로는 뉴스 API에서 가져옴)
 */
function getSampleNews() {
    return [
        {
            title: "OpenAI, GPT-4 Turbo 성능 대폭 향상",
            content: "OpenAI가 최신 GPT-4 Turbo 모델의 성능을 30% 개선했다고 발표했습니다. 새로운 모델은 더 빠른 응답 속도와 향상된 정확도를 제공합니다."
        },
        {
            title: "Microsoft, AI 개발에 100억 달러 투자",
            content: "Microsoft가 AI 기술 개발에 100억 달러를 투자하겠다고 발표했습니다. 이는 OpenAI와의 협력을 강화하고 엔터프라이즈 AI 솔루션을 확대하기 위한 것입니다."
        },
        {
            title: "Google DeepMind, 생물학 AI 모델 공개",
            content: "Google DeepMind가 단백질 구조 예측 분야에서 획기적인 성과를 냈습니다. 새로운 AI 모델은 약물 개발 과정을 크게 가속화할 수 있을 것으로 기대됩니다."
        }
    ];
}

/**
 * 뉴스를 Claude로 요약
 */
async function summarizeNews(newsItems) {
    try {
        const newsText = newsItems
            .map((item, idx) => `[${idx + 1}] ${item.title}\n${item.content}`)
            .join("\n\n");

        const message = await client.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            system: "당신은 업계 뉴스를 분석하고 CEO를 위해 핵심 내용을 간결하게 요약하는 전문가입니다. 각 뉴스의 요약은 2-3문장 이내로 작성해주세요.",
            messages: [
                {
                    role: "user",
                    content: `다음 뉴스들을 분석하고, 각 뉴스마다 핵심 내용을 2-3문장으로 요약해주세요. JSON 형식으로 응답해주세요: [{"title": "...", "summary": "...", "source": "..."}]\n\n${newsText}`
                }
            ]
        });

        // Claude 응답 파싱
        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

        try {
            // JSON 블록 추출
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return parsed.map(item => ({
                    title: item.title,
                    summary: item.summary,
                    source: item.source || "업계 뉴스"
                }));
            }
        } catch (parseError) {
            console.warn('Failed to parse JSON response, returning structured summary');
        }

        // 파싱 실패 시 기본 형식 반환
        return newsItems.map(item => ({
            title: item.title,
            summary: item.content.substring(0, 150) + '...',
            source: "업계 뉴스"
        }));
    } catch (error) {
        console.error('Error summarizing news:', error);
        // 에러 발생 시 원본 뉴스 반환
        return newsItems.map(item => ({
            title: item.title,
            summary: item.content.substring(0, 150) + '...',
            source: "업계 뉴스"
        }));
    }
}

/**
 * Handler 함수
 */
export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS 요청 처리
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET 요청만 허용
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 뉴스 데이터 가져오기
        const newsItems = getSampleNews();

        // Claude로 요약
        const summarizedNews = await summarizeNews(newsItems);

        return res.status(200).json({
            success: true,
            news: summarizedNews,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            error: '뉴스를 처리하는 중 오류가 발생했습니다.',
            message: error.message
        });
    }
}
