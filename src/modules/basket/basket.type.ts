export type FoodItemInBasket = {
  foodId: number;
  name: string;
  description?: string;
  count: number;
  image?: string;
  price: number;
  total_amount: number;
  discount: number;
  payment_amount: number;
  discountCode?: string;
  supplierId: number;
  supplierName?: string;
  supplierImage?: string;
};

export type BasketType = {
  total_amount: number;
  payment_amount: number;
  total_discount: number;
  general_discount: any;
  foods: FoodItemInBasket[];
};
