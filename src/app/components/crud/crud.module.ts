import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrudRoutingModule } from './crud-routing.module';
import { CrudComponent } from './crud.component';
import { ProductListComponent } from './product-list/product-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CrudComponent, ProductListComponent],
  imports: [CommonModule, CrudRoutingModule, SharedModule],
})
export class CrudModule {}
