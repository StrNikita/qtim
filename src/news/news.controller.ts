import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './news.entity';

@Controller('news')
export class NewsController {
	constructor(
		private newsService: NewsService,
	) {}

	@Get('/')
	public getNews(): Promise<News[]> {
		return this.newsService.findAll();
	}

	@Get('/:id')
	public getNewsById(@Param('id') id: number): Promise<News> {
		return this.newsService.findById(id);
	}

	@Post('/')
	public createNews(@Body() body: CreateNewsDto): Promise<News> {
		return this.newsService.create(body);
	}

	@Patch('/:id')
	public updateNews(
		@Param('id') id: number,
		@Body() body: UpdateNewsDto,
	): Promise<News>  {
		return this.newsService.update(id, body)
	}

	@Delete('/:id')
	public deleteNews(@Param('id') id: number): Promise<News> {
		return this.newsService.delete(id);
	}
}
