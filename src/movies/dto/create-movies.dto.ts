import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
export class CreateMoviesDto {
  @ApiProperty()
  readonly title: string;
  @ApiProperty()
  readonly genre: string;
  @ApiProperty()
  readonly rating: number;
  @ApiProperty()
  readonly streamingLink: string;
  // constructor(movies: Movies){
  //   // super(movies)
  //   this.title = movies.title
  //   this.genre = movies.genre
  //   this.rating = movies.rating
  //   this.streamingLink = movies.streamingLink
  // }
}

export class MoviesObj {
  // @ApiProperty()
  // _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  genre: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  streamingLink: string;

  // constructor(data) {
  //     // this._id = data._id
  //     this.genre = data.genre
  //     this.rating = data.rating
  //     this.streamingLink = data.streamingLink
  // }
}

export class findAllFilterDTo {
  @ApiPropertyOptional()
  limit?: number = 10;
  @ApiPropertyOptional()
  skip?: number = 0;
}

export class searchAllFilterDTo extends findAllFilterDTo {
  @ApiPropertyOptional()
  q?: string;
}

export class PaginateResponse{
  data: any
  count: number
  totalPage: number
  limit:number
}