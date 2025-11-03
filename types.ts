export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  maps?: {
      uri?: string;
      title?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: GroundingChunk[];
}

export interface UserProfile {
  name: string;
  rollNumber: string;
  email: string;
  major: string;
  yearOfStudy: string;
  contact: string;
  avatarUrl: string; // Using a simple letter avatar
}

export type DocumentType = 'pdf' | 'docx' | 'png' | 'jpg' | 'txt' | 'other';
export type DocumentTag = string;

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  uploadDate: string; // ISO 8601 format
  tags: DocumentTag[];
  url: string; // URL to view/download the file
  file?: File; // To hold the actual file object on upload
}
