import { NextRequest, NextResponse } from 'next/server';
import { qimenClient } from '@/lib/grpc-client';
import {
  parseContractDatetime,
  resolveMatterType,
  toContractCalculateResponse,
} from '@/lib/openapi-qimen';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (typeof body?.datetime !== 'string' || body.datetime.trim() === '') {
      return NextResponse.json(
        { error: 'datetime 為必填欄位，請使用 ISO 8601 date-time' },
        { status: 400 }
      );
    }

    const { date, hour } = parseContractDatetime(body.datetime);
    const matterType = resolveMatterType(body.purpose);

    const response = await qimenClient.calculatePlate({
      date,
      hour,
      matter_type: matterType,
    });

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || '排盤失敗', code: response.error_code || 'CALCULATION_FAILED' },
        { status: response.error_code?.includes('LUNAR') ? 503 : 500 }
      );
    }

    return NextResponse.json(toContractCalculateResponse(response));
  } catch (error) {
    const message = error instanceof Error ? error.message : '排盤失敗';
    const status = message.includes('datetime') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
