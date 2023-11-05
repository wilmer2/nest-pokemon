import { IsPositive, IsOptional, Min, IsNumber } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  public readonly limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public readonly offset?: number;
}
