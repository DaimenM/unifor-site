export type Article = {
    id: string;
    title: string;
    content: string;
    images: string[];
    embeds?: string[];
    date: string;
    visitors: {
      date: string;
      platform: string;
    }[];
    files?: {
      name: string;
      url: string;
    }[];
  };  