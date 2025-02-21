export type BlockGroupInput = {
  id?: number;
  name: string;
  title: string;
  description: string;
  status: boolean;
  options?: string | null;
  blocks?: number[];
};

export type BlockGroup = {
  id: number;
  status: boolean;
  name: string;
  description: string | null;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  options: string | null;
};
