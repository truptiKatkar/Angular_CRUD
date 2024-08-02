import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  // Product Form
  pName!: string;
  pImage!: string;
  pDetails!: string;
  pPrice!: number;
  pQuantity!: number;
  pTotalPrice!: number;
  pDate: Date = new Date() || null;

  // Product List
  allProducts: any = [];
  productsOnPage: any = [];
  isEdit: boolean = false;
  editedProduct: any;
  editedProductIndex: any = null;
  pageSize = 3;
  collectionSize = 0;

  // pagination
  page: number = 1;

  isAddProduct: boolean = false;

  products: any = localStorage.getItem('products');
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    let products: any = localStorage.getItem('products');
    this.allProducts = JSON.parse(products);
    this.collectionSize = this.allProducts.length;
    this.productsOnPage = JSON.parse(products).splice(
      this.pageSize * (this.page - 1),
      this.pageSize
    );
  }

  handleFileChange(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      this.pImage = e.target.result;
    };
    fileReader.readAsDataURL(file);
  }

  handleAddProduct() {
    let products: any = this.allProducts || [];
    let product = {
      id: !this.isEdit ? this.allProducts?.length || 0 : this.editedProduct.id,
      name: this.pName,
      image: this.pImage,
      details: this.pDetails,
      price: this.pPrice,
      quantity: this.pQuantity,
      totalPrice: this.pTotalPrice,
      createAt: this.pDate,
    };
    if (this.isEdit) {
      products.splice(this.editedProductIndex, 1, product);
    } else {
      products.push(product);
    }
    localStorage.setItem('products', JSON.stringify(products));
    this.clearValues();
    this.getProducts();
  }

  clearValues() {
    this.cdr.detectChanges();
    this.isEdit = false;
    this.isAddProduct = false;
    this.pName = '';
    this.pImage = '';
    this.pDetails = '';
    this.pPrice = 0;
    this.pQuantity = 0;
    this.pTotalPrice = 0;
    this.pDate = new Date();
    this.editedProductIndex = null;
    this.editedProduct = null;
    this.cdr.detectChanges();
  }

  handleEditProduct(item: any, index: number) {
    this.isEdit = !this.isEdit;
    this.editedProduct = item;
    this.editedProductIndex = index;
    if (this.isEdit) {
      this.pName = item.name;
      this.pImage = item.image;
      this.pDetails = item.details;
      this.pPrice = item.price;
      this.pQuantity = item.quantity;
      this.pTotalPrice = item.totalPrice;
      this.pDate = item.createAt;
    }
  }

  handleDeleteProduct(item: any, index: number) {
    this.allProducts.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(this.allProducts));
  }

  handlePageChange(event: any) {
    this.page = event;
    this.productsOnPage = JSON.parse(this.products).splice(
      this.pageSize * (this.page - 1),
      this.pageSize
    );
  }

  handleFilter(event: any, value: string) {
    const productsArray: any[] = JSON.parse(this.products);
    const searchValue = event.target.value.toLowerCase();

    const filteredProducts = this.filterProducts(
      productsArray,
      value,
      searchValue
    );

    this.collectionSize = filteredProducts.length;
    this.productsOnPage = this.paginate(filteredProducts);
  }

  private filterProducts(
    products: any[],
    key: string,
    searchValue: string
  ): any[] {
    return products.filter((product) => {
      const productValue = product[key]?.toString().toLowerCase() || '';
      return productValue.includes(searchValue);
    });
  }

  private paginate(products: any[]): any[] {
    const startIndex = this.pageSize * (this.page - 1);
    return products.slice(startIndex, startIndex + this.pageSize);
  }
}
