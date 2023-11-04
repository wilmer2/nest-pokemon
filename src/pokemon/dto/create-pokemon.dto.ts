import { IsString, IsInt, IsPositive, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  public readonly no: number;

  @IsString()
  @MinLength(1)
  public readonly name: string;
}
