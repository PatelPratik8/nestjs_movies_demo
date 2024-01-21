import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { CreateMoviesDto, MoviesObj, PaginateResponse, findAllFilterDTo, searchAllFilterDTo } from "./dto/create-movies.dto";
import { Movies } from "./schemas/movies.schema";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";
import { AuthGuard } from "@app/auth/auth.guard";
import { RolesGuard } from "@app/auth/role.guard";
import { Roles } from "@app/auth/decorators/role.decorator";
import { UserRole } from "@app/auth/schemas/user.schema";
import { paginateResponse } from "@app/helper/commonFun";


@ApiTags("movies")
@ApiBearerAuth()
@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({type:MoviesObj,description:"movies created"})
  async create(@Body() createMoviesDto: CreateMoviesDto) : Promise <MoviesObj>{
    const result = await this.moviesService.create(createMoviesDto);
    return result
  }

  @Put(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Body() updateMoviesDto: CreateMoviesDto,@Param("id") id: string) {
    // let movies = await this.moviesService.findOne(id)
    const result = await this.moviesService.update(id,updateMoviesDto);
    if(result.matchedCount === 0)   throw new HttpException('movies not found.', HttpStatus.NOT_FOUND)
    return "update successfully"
  }
  
  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchAll(
    @Query() filter:searchAllFilterDTo
  ): Promise<PaginateResponse> {    
    const data = await this.moviesService.searchAll(filter);
    return paginateResponse(data,filter.limit);
  }

  @Get()
  @CacheKey('moviesList')
  @UseInterceptors(CacheInterceptor)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query() filter:findAllFilterDTo
  ): Promise<PaginateResponse> {    
    const data = await this.moviesService.findAll(filter);
    return paginateResponse(data,filter.limit);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Movies> {
    const result = await this.moviesService.findOne(id);
    if(result) return result;
    throw new HttpException('movies not found.', HttpStatus.NOT_FOUND)
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  async delete(@Param("id") id: string) {
    const result = await this.moviesService.delete(id);
    if(result.deletedCount === 0)  throw new HttpException('movies not found.', HttpStatus.NOT_FOUND)
    return "movie delete successfully"
  }
}
