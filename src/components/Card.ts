import { CategoryStatus } from "../types";

class ProductBasket {
    constructor(
      protected id: string,
      protected title: string,
      protected price: number
    ) {}
}
  
class CatalogProduct extends ProductBasket {
    constructor(
      id: string,
      title: string,
      price: number,
      protected image: string,
      protected category: CategoryStatus
    ) {
      super(id, title, price);
    }
}
  

class PreviewProduct extends CatalogProduct {
    constructor(
      id: string,
      title: string,
      price: number,
      image: string,
      category: CategoryStatus,
      protected description: string,
    ) {
      super(id, title, price, image, category);
    }
}