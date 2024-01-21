import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type MoviesDocument = HydratedDocument<Movies>;

@Schema()
export class Movies {
  @Prop()
  title: string;

  @Prop()
  genre: string;

  @Prop()
  rating: number;

  @Prop()
  streamingLink: string;

}

export const MoviesSchema = SchemaFactory.createForClass(Movies);
