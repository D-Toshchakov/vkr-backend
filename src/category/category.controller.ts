import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get('all')
  async getAllCategories() {
    return this.categoryService.getAll();
  }

  @HttpCode(HttpStatus.CREATED)
  @Put()
  async createCategory(
  ) {
    return this.categoryService.createCategory()
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async updateCategory(
    @Body() dto: UpdateCategoryDto,
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
