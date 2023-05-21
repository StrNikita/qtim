import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
	) {}

	@Get('/:id')
	public getUserById(@Param('id') id: number) {
		return this.userService.findById(id);
	}

	@Post('/')
	public createUser(@Body() body: CreateUserDto) {
		return this.userService.create(body);
	}
}
