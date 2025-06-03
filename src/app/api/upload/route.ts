import { NextResponse } from 'next/server';
import * as fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Get original filename or fallback to timestamped name
  // 'file' is a File object, which extends Blob and has 'name' property
  const originalName = (file as File).name || `upload_${Date.now()}.bin`;

  const buffer = await file.arrayBuffer();

  const uploadDir = path.join(process.cwd(), '/public/uploads');
  await fs.promises.mkdir(uploadDir, { recursive: true });

  const filepath = path.join(uploadDir, originalName);

  await fs.promises.writeFile(filepath, Buffer.from(buffer));

  return NextResponse.json({
    message: 'File uploaded successfully',
    filename: originalName,
    filepath: `/uploads/${originalName}`,
  });
}

