export type SystemSummary = {
  id: string;
  name: string;
  shortDescription: string;
  link: string | null;
  creatorName: string;
  tags: string[];
  images: string[];
  heartCount: number;
  heartedByMe: boolean;
};

export type SystemDetail = SystemSummary & {
  description: string;
};
