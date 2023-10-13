

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
            const queryBuilder = this.productRepository.createQueryBuilder()

            product = await queryBuilder
                .where(`UPPER(title) =:title or slug =:slug`, {
                    title: term.toUpperCase(),
                    slug: term.toLowerCase()
                }).getOne()
        }


        if (!product)
            throw new NotFoundException(`Producto con el id:${term} no existe`)
        return product
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const product = await this.productRepository.preload({
            id: id,
            ...updateProductDto
        })

        if (!product) throw new NotFoundException(`Producto con el id:${id} no existe`)

        try {
            await this.productRepository.save(product)
            return product
        } catch (error) {
            this.handleDbExceptions(error)
        }


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
