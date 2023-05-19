import { IsOptional, IsString } from 'class-validator';

export class UpdateNewsDto {
	@IsString()
	@IsOptional()
	title: string;

	@IsOptional()
	@IsString()
	text: string;
}
