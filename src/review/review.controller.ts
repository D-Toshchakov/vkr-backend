import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewDto } from './dto';
import { GetUser } from 'src/common/decorators';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Get('average/:productId')
  async getAllReviews(
    @Param("productId") prodId: string
  ) {
    return this.reviewService.getAverageRatingByProductId(+prodId);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.reviewService.findOne(+id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createReview(
    @Body() dto: ReviewDto,
    @GetUser('id') id: string
  ) {
    return this.reviewService.createReview(dto, +id)
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async updateReview(
    @Body() dto: ReviewDto,
    @Param('id') id: string
  ) {
    return this.reviewService.updateReview(+id, dto)
  }
}