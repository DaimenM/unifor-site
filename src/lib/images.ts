export async function deleteImage(imageUrl: string) {
  try {
    const response = await fetch('/api/upload', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: imageUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete image');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to delete image:', error);
    throw error;
  }
}