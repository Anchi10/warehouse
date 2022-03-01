import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductsService } from '@app/services/products.service';
import { Product } from '@app/common/feature/interfaces/product.interface';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
})
export class AddEditComponent implements OnInit, OnDestroy {
  id!: number;
  isAddMode!: boolean;
  submitted = false;
  minValue = 1;
  maxValue = 3;
  product: Product;

  form = this.formBuilder.group({
    code: [
      '',
      Validators.compose([
        Validators.pattern('[a-zA-Z]{2,4} [0-9]{4,6}'),
        Validators.min(6),
        Validators.max(10),
        Validators.required,
      ]),
    ],
    quantity: ['', [Validators.min(this.minValue), Validators.required]],
    floor: [
      '',
      [
        Validators.min(this.minValue),
        Validators.max(this.maxValue),
        Validators.required,
      ],
    ],
    section: [
      '',
      [
        Validators.min(this.minValue),
        Validators.max(this.maxValue),
        Validators.required,
      ],
    ],
  });
  private destroyed$ = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductsService
  ) {}

  ngOnInit() {
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');

    this.isAddMode = !this.id;

    this.productService
      .getProductById(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((product) => {
        this.form.patchValue(product);
        console.log(product, 'user x');
        console.log(this.form.value, 'value form');
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  get f() {
    return this.form.controls;
  }

  public onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.isAddMode ? this.createProduct() : this.updateProduct();
  }

  private createProduct(): void {
    const formData = this.form.value;
    this.productService
      .addProduct(formData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (data) => {
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        },
        (err) => {
          alert(err);
        }
      );
  }

  private updateProduct(): void {
    this.productService
      .updateProduct(this.id, this.form.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      });
  }
}
