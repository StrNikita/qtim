import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserPayload } from './payload/create-user.payload';
import { ErrorMessages } from 'src/shared/error-messages';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private repository: Repository<User>, 
	) {}

	public async findById(id: number): Promise<User> {
		const user = await this.repository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException(ErrorMessages.NOT_FOUND(User.name));
		}

		return user;
	}

	public create(body: CreateUserPayload): Promise<User> {
		const user = this.repository.create(body);

		return this.repository.save(user);
	}
}
