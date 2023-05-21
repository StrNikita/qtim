import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(
		private userService: UserService,
	) {}

	@Get('/:id')
	public getUserById(@Param('id') id: number) {
		return this.userService.findById(id);
	}
}
