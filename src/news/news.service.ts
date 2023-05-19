import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './news.entity';
import { CreateNewsPayload } from './payload/create-news.payload';
import { UpdateNewsPayload } from './payload/update-news.payload';
import { ErrorMessages } from 'src/shared/error-messages';

@Injectable()
export class NewsService {
	constructor(
		@InjectRepository(News) private repository: Repository<News>,
	) {}

	public findAll(): Promise<News[]> {
		return this.repository.find();
	}

	public async findById(id: number): Promise<News> {
		const news = await this.repository.findOne({ where: { id } });
		if (!news) {
			throw new NotFoundException(ErrorMessages.NOT_FOUND(News.name));
		}

		return news;
	}

	public create(body: CreateNewsPayload): Promise<News> {
		const news = this.repository.create(body);

		return this.repository.save(news);
	}

	public async update(id: number, body: UpdateNewsPayload): Promise<News> {
		const news = await this.findById(id);

		return this.repository.save({ ...news, ...body });
	}

	public async delete(id: number): Promise<News> {
		const news = await this.findById(id);

		return this.repository.remove(news);
	}
}
