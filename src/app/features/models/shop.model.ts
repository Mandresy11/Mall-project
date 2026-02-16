export interface Shop {
  _id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  logo?: string;
  coverPhoto?: string;
}

export enum ShopCategory {
  MODE = 'Mode & Vêtements',
  ELECTRONIQUE = 'Électronique',
  RESTAURATION = 'Restauration',
  BEAUTE = 'Beauté & Cosmétiques',
  SPORT = 'Sports & Loisirs',
  AUTRE = 'Autre'
}
