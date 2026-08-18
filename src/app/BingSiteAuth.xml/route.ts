import { NextResponse } from 'next/server';

export async function GET() {
  const xmlContent = `<?xml version="1.0"?>
<users>
	<user>E32C9DBE801FD164BDB911E7F8727742</user>
</users>`;

  return new NextResponse(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
