export type ResourceSummary = {
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

export type ResourceDetail = ResourceSummary & {
  description: string;
};

export type SystemSummary = ResourceSummary;
export type SystemDetail = ResourceDetail;
