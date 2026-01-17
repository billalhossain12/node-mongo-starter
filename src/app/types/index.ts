export interface TCity {
  name: string;
  currency: string;
  contributors12months: number;
  monthLastUpdate: number;
  contributors: number;
  yearLastUpdate: number;
  prices: Price[];
  city_id: number;
}

export interface Price {
  data_points: number;
  item_id: number;
  lowest_price?: number;
  average_price: number;
  highest_price?: number;
  item_name: string;
}

export interface TPriceItem {
  items: Item[];
}

export interface Item {
  rent_factor: number;
  cpi_factor: number;
  item_id: number;
  name: string;
  category: string;
}

export type TExchangeRates = TExchangeItem[];

export interface TExchangeItem {
  one_usd_to_currency: number;
  currency: string;
  one_eur_to_currency: number;
}
