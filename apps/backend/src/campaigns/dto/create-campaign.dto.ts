import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(5)
  budget: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  pixelId?: string;

  @IsOptional()
  @IsString()
  audienceTier?: string;

  @IsOptional()
  @IsString()
  placement?: string;

  @IsOptional()
  @IsString()
  landingPageUrl?: string;

  @IsOptional()
  @IsString()
  adTitle?: string;

  @IsOptional()
  @IsString()
  adDescription?: string;
}
