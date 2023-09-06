import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  password: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  recipients: string[];

  @IsString()
  @IsNotEmpty()
  fullname: string;
}
