

import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PagintationDto } from '../common/dtos/pagination.dto';
import { isUUID } from 'class-validator';



@Injectable()
export class ProductsService {

    private readonly logger = new Logger("ProductsService")

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

    ) { }


    async create(createProductDto: CreateProductDto) {
        try {
            const product = this.productRepository.create(createProductDto);
            await this.productRepository.save(product);
            return product;
        } catch (error) {
            this.handleDbExceptions(error)
        }
    }

    async findAll(paginationDto: PagintationDto) {
        const { limit = 10, offset = 0 } = paginationDto
        const products = await this.productRepository.find({
            take: limit,
            skip: offset
        })
        return products;
    }

    async findOne(term: string) {

        let product: Product
        if (isUUID(term)) {

            product = await this.productRepository.findOneBy({ id: term })
        } else {
            product = await this.productRepository.findOneBy({ slug: term })
        }




        //const product = await this.productRepository.findOneBy({ id })
        if (!product)
            throw new NotFoundException(`Producto con el id:${term} no existe`)
        return product
    }

    update(id: number, updateProductDto: UpdateProductDto) {
        return `This action updates a #${id} product`;
    }

    async remove(id: string) {
        const product = await this.findOne(id)
        await this.productRepository.remove(product)
        return `Producto con el title:${product.title} borrado`;
    }

    private handleDbExceptions(error: any) {
        if (error.code === "23505") throw new BadRequestException(error.detail)
        this.logger.error(error)
        throw new InternalServerErrorException(`Unexpected error, check server logs`)



    }
}
