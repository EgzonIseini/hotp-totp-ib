import { UserService } from "./user.service";
import { Controller, Get } from "@nestjs/common";
import { User } from "./user.entity";

@Controller('/users')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers()
  }

}