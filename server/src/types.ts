export interface IEstatesResponse {
  _embedded: {
    estates: {
      name: string;
      _links: {
        images: {
          href: string;
        }[];
      };
    }[];
  };
}

export interface IEstate {
  title: string;
  image: string;
}
