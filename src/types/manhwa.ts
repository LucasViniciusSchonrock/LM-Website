export type ManhwaStatus = 'ongoing' | 'completed' | 'hiatus' | 'cancelled';

export interface Manhwa {
  id: string;
  mangadexId?: string;
  title: string;
  originalTitle?: string;
  alternativeTitles?: string[];
  coverUrl: string;
  synopsis: string;
  status: ManhwaStatus;
  releaseYear?: number | string;
  author?: string;
  artist?: string;
  genres: string[];
  rating?: number; // 0 a 10
  totalChapters?: string | number;
  isFeatured?: boolean; // Apresentado em destaque no banner Hero do Luke
  lukeRecommended?: boolean; // Selo de Escolha do Luke
  lukeReview?: string; // Comentário pessoal do Luke
  lukeVideoUrl?: string; // Link para vídeo de análise no YouTube/TikTok
  mangadexUrl?: string;
  readingUrl?: string; // Onde ler ou link oficial
  createdAt: string;
  updatedAt: string;
}

export interface SubscriberSupporter {
  user: string;
  avatar?: string;
  isMember?: boolean;
  memberTier?: string;
  votedAt?: number;
}

export interface SubscriberRecommendation {
  id: string;
  title: string;
  suggestedBy: string;
  suggestedAvatar?: string;
  isMember?: boolean;
  memberTier?: string;
  hasMemberSupport?: boolean;
  supporters?: (string | SubscriberSupporter)[];
  count?: number;
  points?: number;
  status?: string;
  createdAt?: number;
  lastSuggestedAt?: number;
  coverUrl?: string;
  notes?: string;
  genre?: string;
  mangadexTitle?: string;
  readUrl?: string;
}
