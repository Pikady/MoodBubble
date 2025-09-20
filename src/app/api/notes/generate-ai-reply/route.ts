import { NextRequest, NextResponse } from 'next/server';
import { generateAIReplyForNote } from '@/app/actions/notes-with-ai';

export async function POST(request: NextRequest) {
  try {
    const { noteId } = await request.json();

    if (!noteId) {
      return NextResponse.json(
        { error: '笔记ID不能为空' },
        { status: 400 }
      );
    }

    const result = await generateAIReplyForNote(noteId);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('生成笔记AI回复失败:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}