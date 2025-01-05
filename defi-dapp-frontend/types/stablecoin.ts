export interface StableCoin {
    address: string;
    name: string;
    symbol: string;
    icon: string;
    targetCurrency: string;
    totalSupply: number;
    exchangeRate: number;
}
  
  export interface CreateStableCoinParams {
    name: string;
    symbol: string;
    icon: string;
    targetCurrency: string;
}
    