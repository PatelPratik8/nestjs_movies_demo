import { Test, TestingModule } from "@nestjs/testing";
import { MoviesService } from "./movies.service";
import { Movies } from "./schemas/movies.schema";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateMoviesDto, findAllFilterDTo } from "./dto/create-movies.dto";

const mockMovie = {
  title: "Inception",
  genre: "Action",
  rating: 4,
  streamingLink: "Test",
  _id: "65abcea80cab8a7bcdb65e3c",
};

describe("MoviesService", () => {
  let service: MoviesService;
  let model: Model<Movies>;

  const movieArray = [
    {
      title: "TestMovie1",
      genre: "Action",
      rating: 4,
      streamingLink: "Test",
    },
    {
      title: "TestMovie",
      genre: "Action",
      rating: 4,
      streamingLink: "Test",
    },
  ];

  const queryData = {
    limit: 10,
    skip: 0,
  };

  const searchData = {
    limit: 10,
    skip: 0,
    q:"abc"  
  }

  const createMovies: CreateMoviesDto = {
    title: "Inception",
    genre: "Action",
    rating: 5,
    streamingLink: "Test"
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getModelToken("Movies"),
          useValue: {
            new: jest.fn().mockResolvedValue(mockMovie),
            constructor: jest.fn().mockResolvedValue(mockMovie),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            countDocuments: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(42),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    model = module.get<Model<Movies>>(getModelToken("Movies"));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all movies", async () => {
    jest.spyOn(model, "find").mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(movieArray),
    } as any);
    const movies = await service.findAll(queryData);
    expect(movies).toEqual([movieArray, 42]);
  });

  it("should return filter movies", async () => {
    jest.spyOn(model, "find").mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(movieArray),
    } as any);
    jest.spyOn(model, "countDocuments").mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(10),
    } as any);
    const movies = await service.searchAll(searchData);
    expect(movies).toEqual([movieArray, 10]);
  });

  it("should return one movie", async () => {
    
    let id = "65abcea80cab8a7bcdb65e3c";
    jest.spyOn(model, "findOne").mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(movieArray[0]),
    } as any);

    const movies = await service.findOne(id);
    expect(movies).toEqual(movieArray[0]);
  });

  it("should create movies", async() => {
    jest.spyOn(model, "create").mockImplementationOnce(() =>
      Promise.resolve({
        _id: "65abcea80cab8a7bcdb65e3c",
        title: "Inception",
        genre: "Action",
        rating: 4,
        streamingLink: "Test",
      } as any)
    );
    const newMovie = await service.create(createMovies)
    expect(newMovie).toEqual(mockMovie)
  });

  it("should update movies", async() => {
    let updateData= { 
    title: "abc",
    genre: "Action",
    rating: 4,
    streamingLink: "Test"}
    let id = "65abcea80cab8a7bcdb65e3c";
    jest.spyOn(model, "updateOne").mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({matchedCount:1}),
    } as any);
    const movies = await service.update(id,updateData);
    expect(movies).toEqual({matchedCount:1});
  });

  it("should Delete movies", async() => {
    let id = "65abcea80cab8a7bcdb65e3c";
    jest.spyOn(model, "deleteOne").mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({deletedCount:1}),
    } as any);
    const movies = await service.delete(id);
    expect(movies).toEqual({deletedCount:1});
  });
});
