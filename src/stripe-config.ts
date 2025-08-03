export interface Product {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  interval?: 'month' | 'year';
  features: string[];
}

export const products: Product[] = [
  {
    priceId: 'price_1RsAAzSF6B1rdSVvX22KmfWY',
    name: 'Brandie Subscription',
    description: 'Complete AI-powered branding platform with unlimited brand creation, advanced AI features, and comprehensive brand guidelines.',
    mode: 'subscription',
    price: 49.00,
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited brand identities',
      'AI-powered brand strategy',
      'Advanced logo generation',
      'Color psychology analysis',
      'Typography recommendations',
      'Brand voice development',
      'Comprehensive guidelines',
      'Brand consistency tools',
      'Priority support'
    ]
  }
];

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};