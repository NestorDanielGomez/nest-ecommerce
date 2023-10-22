import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { ProductImage } from "./";
import { User } from "../../auth/entities/user.entity";

@Entity({ name: "products" })
export class Product {

    @ApiProperty({ example: "0f673db6-6d26-40c8-9d5d-9a0b009c67a3", description: "Product ID", uniqueItems: true })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: "Remera", description: "Product Title", uniqueItems: true })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({ example: 150, description: "Product price" })
    @Column('float', { default: 0 })
    price: number;

    @ApiProperty({ example: "descripción del producto", description: "Product Description", default: null })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiProperty({ example: "kids_racing_stripe_tee", description: "Product Slug", uniqueItems: true })
    @Column('text', { unique: true })
    slug: string;

    @ApiProperty({ example: 5, description: "Product Stock", default: 0 })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({ example: ["M", "L", "XL"], description: "Product Sizes" })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({ example: "woman", description: "Product Gender" })
    @Column('text')
    gender: string;


    @ApiProperty({ example: "[1740176-00 - A_0_2000.jpg, 1740176-00-A_0_2000.jpg]", description: "Array de imagenes del producto Tags" })
    @ApiProperty()
    @Column('text', { array: true, default: [] })
    tags: string[];

    //cascade borra directamente las imagenes asociadas cuando se borra su producto.
    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[]

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true })
    user: User



    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
        }
        this.slug = this.slug.toLowerCase().replaceAll(" ", "_").replaceAll("'", "")
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(" ", "_")
            .replaceAll("'", "")
    }

}
