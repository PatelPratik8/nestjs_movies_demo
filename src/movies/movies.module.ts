import { Module } from "@nestjs/common";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Movies, MoviesSchema } from "./schemas/movies.schema";
import { AuthModule } from "auth/auth.module";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    CacheModule.register({
      ttl: 10, // seconds
    }),
    MongooseModule.forFeature([{ name: Movies.name, schema: MoviesSchema }]),
    AuthModule
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
