import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get('all')
  async getAllCategories() {
    return this.categoryService.getAll();
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.categoryService.findOne({ slug })
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.categoryService.findOne({ id: +id });
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
    @Param('id') id: number
  ) {
    return this.categoryService.updateCategory(+id, dto)
  }

  // @HttpCode(HttpStatus.OK)
  // @Delete(':id')
  // async deleteCategory(
  //   @Param('id') id: number
  // ) {
  //   return this.categoryService.deleteCategory(+id)
  // }
}
