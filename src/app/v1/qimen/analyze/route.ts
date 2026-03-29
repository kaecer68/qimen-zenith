import { NextRequest, NextResponse } from 'next/server';
import { qimenClient } from '@/lib/grpc-client';
import {
  parseContractDatetime,
  toContractAnalyzeResponse,
} from '@/lib/openapi-qimen';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (typeof body?.question !== 'string' || body.question.trim() === '') {
      return NextResponse.json(
        { error: 'question 為必填欄位' },
        { status: 400 }
      );
    }

    if (typeof body?.datetime !== 'string' || body.datetime.trim() === '') {
      return NextResponse.json(
        {
          error: 'datetime 為必填欄位，請使用 ISO 8601 date-time',
          code: 'INVALID_DATETIME',
        },
        { status: 400 }
      );
    }

    const dateHour = parseContractDatetime(body.datetime);

    const response = await qimenClient.analyzePlate(dateHour);
    if (!response.success) {
      return NextResponse.json(
        { error: response.error || '分析失敗', code: response.error_code || 'ANALYZE_FAILED' },
        { status: response.error_code?.includes('LUNAR') ? 503 : 500 }
      );
    }

    return NextResponse.json(toContractAnalyzeResponse(response));
  } catch (error) {
    const message = error instanceof Error ? error.message : '分析失敗';
    const status = message.includes('datetime') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
