export type Article = {
    id: string;
    title: string;
    content: string;
    date: string;
    lastEdited?: string;
    images: string[];
    embeds?: string[];
    visitors: {
      date: string;
      platform: string;
    }[];
    files?: {
      name: string;
      url: string;
    }[];
    genInfo?: boolean;
    archived?: {
      date: string;
      reason: string;
      isArchived: boolean;
    };
  };  