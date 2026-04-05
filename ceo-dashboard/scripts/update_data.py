#!/usr/bin/env python3
# ========================================
# GitHub Actions용 데이터 업데이트 스크립트
# 매일 자정에 KPI, 일정, 공지사항을 업데이트
# ========================================

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path


def get_sample_kpis():
    """오늘의 KPI 데이터 생성 (실제로는 API에서 가져옴)"""
    import random

    # 랜덤 변동값으로 리얼한 KPI 생성
    base_revenue = 2500000
    base_visitors = 145000
    base_conversion = 3.2

    revenue = base_revenue + random.randint(-500000, 500000)
    visitors = base_visitors + random.randint(-20000, 20000)
    conversion = base_conversion + random.uniform(-0.5, 0.5)

    revenue_change = round(random.uniform(-15, 20), 1)
    visitors_change = round(random.uniform(-10, 15), 1)
    conversion_change = round(random.uniform(-0.5, 1.0), 1)

    return {
        "revenue": {
            "value": f"₩{revenue:,.0f}",
            "change": f"{revenue_change:+.1f}%",
            "changeType": "positive" if revenue_change > 0 else "negative"
        },
        "visitors": {
            "value": f"{visitors:,.0f}",
            "change": f"{visitors_change:+.1f}%",
            "changeType": "positive" if visitors_change > 0 else "negative"
        },
        "conversion": {
            "value": f"{conversion:.2f}%",
            "change": f"{conversion_change:+.2f}%",
            "changeType": "positive" if conversion_change > 0 else "negative"
        }
    }


def get_sample_schedule():
    """오늘의 일정 생성 (실제로는 캘린더 API에서 가져옴)"""
    today = datetime.now()

    return [
        {
            "time": "09:00",
            "title": "경영진 회의 (주간 계획)",
            "attendees": "CEO, CFO, CTO"
        },
        {
            "time": "10:30",
            "title": "마케팅 팀 분기별 보고",
            "attendees": "CEO, Marketing Director"
        },
        {
            "time": "14:00",
            "title": "제품 로드맵 리뷰",
            "attendees": "Product & Engineering Team"
        },
        {
            "time": "16:00",
            "title": "전사 타운홀 미팅",
            "attendees": "All Staff"
        }
    ]


def get_sample_announcements():
    """공지사항 목록 (실제로는 인트라넷에서 가져옴)"""
    today = datetime.now()
    yesterday = (today - timedelta(days=1)).isoformat() + "Z"

    return [
        {
            "title": "Q2 분기별 목표 달성 현황",
            "content": f"Q2 분기가 진행 중입니다. 각 팀은 분기별 목표를 추적하고 주간 진행상황을 보고해주시기 바랍니다.",
            "time": yesterday
        },
        {
            "title": "보안 업데이트 안내",
            "content": "회사 보안 정책이 개정되었습니다. 모든 임직원은 새로운 비밀번호 정책을 준수해주시기 바랍니다.",
            "time": yesterday
        },
        {
            "title": "팀 빌딩 이벤트 개최",
            "content": "4월 20일 팀 빌딩 이벤트가 개최됩니다. 모든 임직원의 참석을 부탁드립니다.",
            "time": yesterday
        }
    ]


def update_data_json():
    """data.json 파일 업데이트"""
    try:
        # 파일 경로 결정
        script_dir = Path(__file__).parent.resolve()
        project_root = script_dir.parent
        data_file = project_root / "public" / "data.json"

        # 데이터 생성
        data = {
            "lastUpdated": datetime.now().isoformat() + "Z",
            "kpis": get_sample_kpis(),
            "schedule": get_sample_schedule(),
            "announcements": get_sample_announcements()
        }

        # 파일 쓰기
        data_file.parent.mkdir(parents=True, exist_ok=True)
        with open(data_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"✅ Data updated successfully: {data_file}")
        print(f"   - KPIs: {list(data['kpis'].keys())}")
        print(f"   - Schedule items: {len(data['schedule'])}")
        print(f"   - Announcements: {len(data['announcements'])}")

        return True

    except Exception as e:
        print(f"❌ Error updating data: {e}", file=sys.stderr)
        return False


def fetch_and_summarize_news():
    """
    (선택사항) News API에서 뉴스를 가져오고 Claude로 요약
    API 키가 설정된 경우에만 실행
    """
    claude_api_key = os.getenv('CLAUDE_API_KEY')

    if not claude_api_key:
        print("⚠️  CLAUDE_API_KEY not set - skipping news summarization")
        return None

    try:
        from anthropic import Anthropic

        client = Anthropic(api_key=claude_api_key)

        # 샘플 뉴스 (실제로는 News API에서 가져옴)
        sample_news = [
            "AI 기술이 기업 생산성을 30% 향상시킨다는 새로운 연구 결과 발표",
            "클라우드 컴퓨팅 시장, 2026년 50% 성장 예상",
            "사이버 보안 위협 증가로 기업들의 보안 투자 확대"
        ]

        # Claude 요약 요청
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=500,
            messages=[
                {
                    "role": "user",
                    "content": f"""다음 기술/비즈니스 뉴스들을 CEO 대상으로 간단히 요약해주세요.
각 항목당 1-2문장, 비즈니스 임팩트를 중심으로 정리해주세요.

{json.dumps(sample_news, ensure_ascii=False)}"""
                }
            ]
        )

        print("✅ News summarization completed")
        return message.content[0].text

    except ImportError:
        print("⚠️  anthropic library not installed - skipping news summarization")
        return None
    except Exception as e:
        print(f"⚠️  Error summarizing news: {e}")
        return None


def main():
    """메인 함수"""
    print("🚀 Starting dashboard data update...")
    print(f"   Current time: {datetime.now().isoformat()}")

    # 1. data.json 업데이트
    success = update_data_json()

    if not success:
        sys.exit(1)

    # 2. (선택사항) 뉴스 요약
    fetch_and_summarize_news()

    print("\n✨ Dashboard data update completed successfully!")


if __name__ == "__main__":
    main()
