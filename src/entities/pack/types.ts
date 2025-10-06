export interface Pack {
  id: string;
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  accent: string;
  featured?: boolean;
  badge?: string;
}
