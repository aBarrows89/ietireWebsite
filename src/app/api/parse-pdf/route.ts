import { NextRequest, NextResponse } from 'next/server';
import { extractText } from 'unpdf';
import mammoth from 'mammoth';
import WordExtractor from 'word-extractor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name.toLowerCase();
    let text: string;

    // Determine file type and parse accordingly
    if (fileName.endsWith('.pdf')) {
      // Parse PDF using unpdf
      const result = await extractText(arrayBuffer);

      if (typeof result === 'string') {
        text = result;
      } else if (result && typeof result.text === 'string') {
        text = result.text;
      } else if (result && Array.isArray(result.text)) {
        text = result.text.join('\n');
      } else if (result && result.totalPages) {
        text = JSON.stringify(result);
      } else {
        text = String(result || '');
      }
    } else if (fileName.endsWith('.docx')) {
      // Parse DOCX using mammoth
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (fileName.endsWith('.doc')) {
      // Parse older DOC format using word-extractor
      const extractor = new WordExtractor();
      const doc = await extractor.extract(buffer);
      text = doc.getBody();
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload a PDF, DOC, or DOCX file.' },
        { status: 400 }
      );
    }

    console.log(`File parsed (${fileName}), text length: ${text.length}`);
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('File parsing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse file' },
      { status: 500 }
    );
  }
}
