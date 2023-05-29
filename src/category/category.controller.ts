import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto';
import { PublicRoute } from 'src/common/decorators';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @PublicRoute()
  @Get('all')
  async getAllCategories() {
    return this.categoryService.getAll();
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.categoryService.findOne({ slug })
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne({ id });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCategory() {
    return this.categoryService.createCategory()
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async updateCategory(
    @Body() dto: CategoryDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.categoryService.updateCategory(id, dto)
  }
}
