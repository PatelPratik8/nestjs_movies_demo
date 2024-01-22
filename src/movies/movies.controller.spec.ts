import { Test, TestingModule } from "@nestjs/testing";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { HttpException, HttpStatus, INestApplication } from "@nestjs/common";
import { CreateMoviesDto, searchAllFilterDTo } from "./dto/create-movies.dto";
import { JwtService } from "@nestjs/jwt";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

describe("MoviesController", () => {
  let controller: MoviesController;
  let service: MoviesService;

  const createMovieDto: CreateMoviesDto = {
    title: "TestMovie",
    genre: "Action",
    rating: 4,
    streamingLink: "Test",
  };

  const mockMovie = {
    title: "TestMovie",
    genre: "Action",
    rating: 4,
    streamingLink: "Test",
    _id: "a id",
  };

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
  const filter: searchAllFilterDTo = { limit: 10, skip: 0 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: MoviesService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn().mockResolvedValue(createMovieDto),
            update: jest.fn(),
            searchAll: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  describe("create()", () => {
    it("should create a new movie", async () => {
      const createSpy = jest
        .spyOn(service, "create")
        .mockResolvedValueOnce(mockMovie);

      await controller.create(createMovieDto);
      expect(createSpy).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe("update()", () => {
    it("should update movie", async () => {
      const mockUpdateMoviesDto: CreateMoviesDto = {
        title: "UpdatedMovie",
        genre: "Drama",
        rating: 5,
        streamingLink: "UpdatedLink",
      };

      const mockResult = {
        matchedCount: 1,
        acknowledged: true,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      };

      jest.spyOn(service, "update").mockResolvedValueOnce(mockResult);

      const result = await controller.update(mockUpdateMoviesDto, "a-id");

      expect(service.update).toHaveBeenCalledWith("a-id", mockUpdateMoviesDto);
      expect(result.massage).toEqual("update successfully");
    });

    it("should update movie", async () => {
      const mockUpdateMoviesDto: CreateMoviesDto = {
        title: "UpdatedMovie",
        genre: "Drama",
        rating: 5,
        streamingLink: "UpdatedLink",
      };

      const mockResult = {
        matchedCount: 0,
        acknowledged: true,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null,
      };

      jest.spyOn(service, "update").mockResolvedValueOnce(mockResult);

      await expect(
        controller.update(mockUpdateMoviesDto, "a-id")
      ).rejects.toThrow(
        new HttpException("movies not found.", HttpStatus.NOT_FOUND)
      );

      expect(service.update).toHaveBeenCalledWith("a-id", mockUpdateMoviesDto);
    });
  });

  describe("searchAll()", () => {
    it("should search the movie", async () => {
      jest.spyOn(service, "searchAll").mockResolvedValueOnce([movieArray, 2]);
      const result = await controller.searchAll(filter);
      expect(result).toEqual({
        data: movieArray,
        count: 2,
        totalPage: 1,
        limit: 10,
      });
    });
  });

  describe("findAll()", () => {
    it("should find all the movies", async () => {
      jest.spyOn(service, "findAll").mockResolvedValueOnce([movieArray, 2]);
      const result = await controller.findAll(filter);
      expect(result).toEqual({
        data: movieArray,
        count: 2,
        totalPage: 1,
        limit: 10,
      });
    });
  });

  describe("findOne()", () => {
    it("should return movie by id", async () => {
      jest.spyOn(service, "findOne").mockResolvedValueOnce(mockMovie);
      const result = await controller.findOne("a id");
      expect(result).toEqual(mockMovie);
      expect(service.findOne).toHaveBeenCalledWith("a id");
    });

    it("should throw error movie not found", async () => {
      jest.spyOn(service, "findOne").mockResolvedValueOnce(null);
      await expect(controller.findOne("a id")).rejects.toThrow(
        new HttpException("movies not found.", HttpStatus.NOT_FOUND)
      );
    });
  });

  describe("delete()", () => {
    it("should delete the movie by id", async () => {
      const deleteResult = {
        acknowledged: true,
        deletedCount: 1,
      };
      jest.spyOn(service, "delete").mockResolvedValueOnce(deleteResult);
      const result = await controller.delete("a id");
      expect(result.massage).toEqual("movie delete successfully");
      expect(service.delete).toHaveBeenCalledWith("a id");
    });
  });

  it("should throw error movie not found in delete", async () => {
    const deleteResult = {
      acknowledged: true,
      deletedCount: 0,
    };
    jest.spyOn(service, "delete").mockResolvedValueOnce(deleteResult);
    await expect(controller.delete("a id")).rejects.toThrow(
      new HttpException("movies not found.", HttpStatus.NOT_FOUND)
    );
  });
});
