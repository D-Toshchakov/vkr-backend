import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetAllProductsDto, ProductDto } from './dto';
import { PublicRoute } from 'src/common/decorators';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @PublicRoute()
  @Get()
  async getAll(@Query() dto: GetAllProductsDto) {
    return this.productService.getAll(dto);
  }

  @PublicRoute()
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne({ id })
  }

  @PublicRoute()
  @Get('similar/:id')
  async getSimilar(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getSimilar(id)
  }

  @PublicRoute()
  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.productService.findOne({ slug })
  }

  @PublicRoute()
  @Get('category/:categorySlug')
  async getByCategory(@Param('categorySlug') slug: string) {
    return this.productService.findByCategory(slug)
  }

  @Post()
  async createProduct() {
    return this.productService.createProduct()
  }

  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProductDto
  ) {
    return this.productService.updateProduct(id, dto)
  }
}
