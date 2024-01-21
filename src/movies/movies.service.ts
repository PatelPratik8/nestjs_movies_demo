import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Movies } from "./schemas/movies.schema";
import { Model, Types } from "mongoose";
import { CreateMoviesDto, findAllFilterDTo, searchAllFilterDTo } from "./dto/create-movies.dto";

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movies.name) private readonly moviesModel: Model<Movies>
  ) {}

  async create(createMoviesDto: CreateMoviesDto): Promise<Movies> {
    const createdMovies = await this.moviesModel.create(createMoviesDto);
    return createdMovies;
  }

  async update(id:string,updateMoviesDto:CreateMoviesDto){
    const updateMovies = await this.moviesModel.updateOne({_id:new Types.ObjectId(id)},{$set:updateMoviesDto}).exec();
    return updateMovies;
  }
  async searchAll(queryData: searchAllFilterDTo): Promise<[Movies[], number]> {
    let filter = {};
    if (queryData.q)
      filter = { $or: [{ title: queryData.q }, { genre: queryData.q }] };
    const data = this.moviesModel
      .find(filter, {}, { limit: queryData.limit, skip: queryData.skip })
      .exec();
    const count = this.moviesModel.countDocuments(filter).exec();
    return Promise.all([data, count]);
  }

  async findAll(queryData: findAllFilterDTo
  ): Promise<[Movies[], number]> {
    const filter = {};
    const data = this.moviesModel.find(filter, {},  { limit: queryData.limit, skip: queryData.skip }).exec();
    const count = this.moviesModel.countDocuments(filter).exec();
    return Promise.all([data, count]);
  }

  async findOne(id: string): Promise<Movies|null> {
    return this.moviesModel.findOne({ _id: id }).exec();
  }

  async delete(id: string) {
    const deletedCat = await this.moviesModel
      .deleteOne({ _id: id })
      .exec();
    return deletedCat;
  }
}
