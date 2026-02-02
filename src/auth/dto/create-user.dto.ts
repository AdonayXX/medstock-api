import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  name: string;
  @IsString()
  @MinLength(1, { message: 'Last name must be at least 1 character long' })
  lastName: string;
  @IsEmail()
  @IsString()
  email: string;
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  password: string;

  // Nota: Los roles se asignan automáticamente como ['user'] al crear un usuario.
  // Solo un administrador puede modificar roles mediante el endpoint updateRoles.
}
