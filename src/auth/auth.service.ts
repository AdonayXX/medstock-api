import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const user = this.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, 10),
      roles: ['user'],
    });
    try {
      await this.userRepository.save(user);
      //Yo sé que _password no se usa, pero lo pongo para dejar claro que se excluye
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...userResponse } = user; // Exclude password
      return {
        user: userResponse as UserResponseDto,
        token: this.jwtService.sign({ id: user.id }),
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return {
      user: { id: user.id, email: user.email } as UserResponseDto,
      token: this.getJwt(<JwtPayload>{ id: user.id }),
    };
  }

  private getJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    //I don't that the users roles to be updated here the admin will use updateRoles method
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { roles, ...updateData } = updateUserDto;
    const user = await this.userRepository.preload({
      id: id,
      ...updateData,
    });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const user = await this.userRepository.preload({
      id: id,
    });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    try {
      await this.userRepository.softDelete(id);
      return { message: `User with id ${id} has been removed` };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateRoles(id: string, updateUserDto: UpdateUserDto) {
    const toUpdate = { ...updateUserDto };
    const user = await this.userRepository.preload({
      id: id,
      ...toUpdate,
    });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
  private handleDBExceptions(error: any): never {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error?.code === '23505') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
      throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
    }
    console.log(error);
    throw new HttpException(
      'Unexpected error, check server logs',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
