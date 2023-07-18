import fetch from "node-fetch";
import { IEstate, IEstatesResponse } from "./types.js";

const FETCH_COUNT = 500;
const FETCH_API_URL = `https://www.sreality.cz/api/en/v2/estates?category_main_cb=1&category_type_cb=1&per_page=${FETCH_COUNT}`;

export const fetchEstates = async (): Promise<IEstate[]> => {
  const rawResponse = await fetch(FETCH_API_URL);

  const estatesResponse = (await rawResponse.json()) as IEstatesResponse;

  console.log("Fetched estates from:", FETCH_API_URL);

  return estatesResponse._embedded.estates.map((estate) => {
    return { title: estate.name, image: estate._links.images[0].href };
  });
};
