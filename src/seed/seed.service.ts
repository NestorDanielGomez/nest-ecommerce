import { Injectable, Delete } from '@nestjs/common';

import { initialData } from './data/seed-data';
import { ProductsService } from 'src/products/products.service';


@Injectable()
export class SeedService {

  constructor(private readonly productsService: ProductsService) {

  }



  async runSeed() {
    await this.insertNewProducts()
    return 'This action adds a new seed';
  }
  private async insertNewProducts() {

    await this.productsService.deleteAllProducts()
    console.log("hola")
    const seedProducts = initialData.products
    const insertPromises = []
    seedProducts.forEach(product => {
      insertPromises.push(this.productsService.create(product))
    })
    await Promise.all(insertPromises)
    return true
  }

}
