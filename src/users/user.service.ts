import { Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {

  private readonly logger = new Logger(UserService.name);

  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {
  }

  async findAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findUserById(id: number): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ id })
  }

  async findUserByIdOrFail(id: number): Promise<User> {
    return await this.usersRepository.findOneOrFail({
      where: {
        id
      }
    })
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ username })
  }

  async createNewUser(username: string, password: string, salt: string): Promise<User> {
    const user = new User(username, password, salt)

    return await this.usersRepository.save(user)
  }

}
