import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    const createdData = {
      ...createPokemonDto,
      name: createPokemonDto.name.toLowerCase(),
    };

    let pokemon: Pokemon;

    try {
      pokemon = await this.pokemonModel.create(createdData);
    } catch (error) {
      this.handleError(error);
    }

    return pokemon;
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string): Promise<Pokemon> {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // Si todavia no se ha encontrado un pokemon buscar por nombre
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name, or no "${term}" not found`,
      );
    }

    return pokemon;
  }

  async update(
    term: string,
    updatePokemonDto: UpdatePokemonDto,
  ): Promise<Pokemon> {
    const pokemon: Pokemon = await this.findOne(term);
    const updatedData = { ...updatePokemonDto };

    if (updatedData.name) {
      updatedData.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatedData);
    } catch (error) {
      this.handleError(error);
    }

    return { ...pokemon.toJSON(), ...updatedData };
  }

  async remove(id: string): Promise<void> {
    const { deletedCount } = await this.pokemonModel.deleteOne({
      _id: id,
    });

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }
  }

  private handleError(error: any): void {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }

    console.error(error);

    throw new InternalServerErrorException(
      `Can't  update pokemon - Check server log`,
    );
  }
}
