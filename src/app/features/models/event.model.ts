export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: string;
  price?: number;
  isFree: boolean;
}

export enum EventCategory {
  CONCERT = 'Concert',
  EXPOSITION = 'Exposition',
  FASHION = 'Défilé de mode',
  VENTE_PRIVEE = 'Vente privée',
  ANIMATION = 'Animation',
  SPECTACLE = 'Spectacle',
  AUTRE = 'Autre'
}
