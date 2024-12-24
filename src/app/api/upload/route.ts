import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Only allow image uploads
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // You can perform additional actions after upload is complete
        // For example, logging or tracking uploads
        console.log(`Upload completed: ${blob.url}`);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();

    // Extract pathname from the blob URL
    const blobUrlPattern = /https:\/\/[^/]+\/(.*)/;
    const match = url.match(blobUrlPattern);
    
    if (!match) {
      console.error('Invalid blob URL format:', url);
      return NextResponse.json(
        { error: 'Invalid blob URL format' },
        { status: 400 }
      );
    }

    const pathname = match[1];
    
    try {
      await del(pathname);
    } catch (delError) {
      console.error('Failed to delete blob:', pathname, delError);
      throw delError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}