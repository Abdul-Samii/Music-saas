import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EarlyAccessDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  source?: string;
}
