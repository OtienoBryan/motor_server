import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        products: Product[];
        total: number;
    }>;
    update(id: number, updateProductDto: Partial<Product>): Promise<Product>;
}
