export interface Lawyer {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  experience: number; // years
  fee: number; // BDT
  unit: '30 min' | '1 hour' | 'consult';
  languages: string[];
  rating: number;
  available: boolean;
}

export interface IssueCategory {
  id: string;
  title: string;
  description: string;
  examples: string[];
  avgTime: string;
  startPrice: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export enum ScrollyState {
  INPUT = 'input',
  MATCH = 'match',
  BOOK = 'book'
}