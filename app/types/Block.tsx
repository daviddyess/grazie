export type BlockInput = {
  id?: number;
  blockType: string;
  name: string;
  title: string;
  description?: string;
  content?: any;
  status: boolean;
  blocks?: number[];
};

export type Block = {
  id: number;
  blockType: string;
  name: string;
  title?: string;
  description?: string;
  content?: any;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
};
