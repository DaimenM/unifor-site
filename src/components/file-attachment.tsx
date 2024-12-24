'use client';

type FileAttachmentProps = {
  file: {
    name: string;
    url: string;
  };
};

export function FileAttachment({ file }: FileAttachmentProps) {
  if (file.url.toLowerCase().endsWith('.pdf')) {
    return (
      <div className="aspect-[16/9] w-full">
        <object
          data={file.url}
          type="application/pdf"
          className="w-full h-full"
          onError={(e) => {
            const target = e.target as HTMLObjectElement;
            target.innerHTML = '<p class="text-red-600">This file is no longer available.</p>';
          }}
        >
          <p>
            Your browser doesn&apos;t support PDF preview.{' '}
            <a href={file.url} className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Download PDF
            </a>
          </p>
        </object>
      </div>
    );
  }

  return (
    <a 
      href={file.url} 
      className="text-red-600 hover:underline" 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(file.url, { method: 'HEAD' });
          if (response.ok) {
            window.open(file.url, '_blank');
          } else {
            e.currentTarget.innerHTML = 'This file is no longer available.';
            e.currentTarget.className = 'text-red-600';
            e.currentTarget.style.pointerEvents = 'none';
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
          e.currentTarget.innerHTML = 'This file is no longer available.';
          e.currentTarget.className = 'text-red-600';
          e.currentTarget.style.pointerEvents = 'none';
        }
      }}
    >
      Download {file.name}
    </a>
  );
} 