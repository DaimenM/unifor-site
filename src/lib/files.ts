export async function deleteFile(fileUrl: string) {
  try {
    const response = await fetch('/api/upload', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: fileUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete file');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
}