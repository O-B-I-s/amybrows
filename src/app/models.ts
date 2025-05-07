export interface ServiceDescription {
  id: number;
  title: string;
  item: string;
}

export interface Service {
  id: number;
  title: string;
  subhead: string;
  imageUrl: string;
  descriptions: ServiceDescription[];
}

export interface GalleryItem {
  id: number;
  beforeImageUrl: string;
  afterImageUrl: string;
}

export interface ServiceCreateInput {
  title: string;
  subhead: string;
  image?: File;
  descriptionIds: number[];
}
