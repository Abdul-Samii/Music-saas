import { IsNumber, IsDateString, IsOptional, Min } from 'class-validator';

export class RecordMetricDto {
  @IsDateString()
  date: string;

  @IsNumber()
  @Min(0)
  spend: number;

  @IsNumber()
  @Min(0)
  impressions: number;

  @IsNumber()
  @Min(0)
  clicks: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  streamsBefore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  streamsAfter?: number;
}
