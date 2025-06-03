import exportToPptx from '@/utils/pptxUtils';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { elements, background } = await req.json();

    const pptxBuffer = await exportToPptx(elements, { type:'color', value:background });

    return new Response(pptxBuffer, {
      headers: {
        'Content-Disposition': 'attachment; filename="presentation.pptx"',
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to generate PPTX' }, { status: 500 });
  }
}

