import { Injectable } from '@angular/core';
import { products } from '@app/common/feature/const/const-products';
import { Product } from '@app/common/feature/interfaces/product.interface';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor() {}

  getProducts(): Observable<Product[]> {
    const allProducts = of(products);
    return allProducts;
  }

  getProductById(id: number): Observable<Product> {
    const product = products?.find((entry) => entry.id === id);
    return of(product);
  }

  addProduct(product: Product): Observable<Product> {
    const index = products?.findIndex((entry) => entry.code === product.code);

    if (index === -1) {
      const maxId = products.reduce((acc, current) => {
        return acc.id > current.id ? acc : current;
      }).id;
      product.id = maxId + 1;
      product.code = product.code.toUpperCase();
      const newProduct = products.push(
        JSON.parse(JSON.stringify({ ...product }))
      );

      return of(products[newProduct]);
    }
    return throwError('You can not add product with that code');
  }

  updateProduct(id: number, p: Product): Observable<Product> {
    const index = products?.findIndex((entry) => entry.id === id);
    p.id = id;
    products[index] = p;
    return of(products[index]);
  }
}
