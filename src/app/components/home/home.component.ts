import { ProductsService } from '@app/services/products.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '@app/common/feature/interfaces/product.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public id: any;

  public numberOfFlors = 3;
  public numberOfSections = 3;
  public numberOfProducts: number;

  public allProducts: Product[];
  public filterProducts: Product[];
  public floor: Product[];

  public query = '';

  public listOfFloors: string[];
  public listOfSections: string[];
  public selectedFloor: number;

  constructor(public productService: ProductsService, private router: Router) {}

  ngOnInit() {
    this.listOfFloors = Array(this.numberOfFlors)
      .fill(0)
      .map((x, i) => `Floor ${i + 1}`);
    this.listOfSections = Array(this.numberOfSections)
      .fill(0)
      .map((x, i) => `Section ${i + 1}`);

    this.getAllProducts();
  }

  public async getAllProducts() {
    console.log(this.filterProducts, 'filter');
    await this.productService
      .getProducts()
      .toPromise()
      .then(
        (data) => {
          this.filterProducts = this.allProducts = data;
        },
        (error) => {
          alert(error);
        }
      );
  }

  public goTo(id: number): void {
    this.router.navigate([`/edit/${id}`], { state: this.id });
  }

  public queryChange(e): void {
    this.query = e.target.value;
    if (this.query !== '') {
      this.filterByCode();
    }
  }

  clearSearch(): void {
    this.query = null;
  }

  public filterByCode(): void {
    this.filterProducts = this.allProducts.filter((p: Product) => {
      return p.code.match(this.query.toUpperCase());
    });
  }

  onFloorClick(floor: number): void {
    this.filterProducts = this.floor = this.allProducts.filter(
      (p: Product) => p?.floor === floor
    );
    this.selectedFloor = floor;
  }

  onSectionClick(section: number): void {
    if (!this.selectedFloor) {
      return;
    }
    this.filterProducts = this.allProducts.filter(
      (p: Product) => p?.section === section && this.selectedFloor === p?.floor
    );
  }
}
