import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new user.", async () => {
    const user = {
      name: "User Test",
      email: "test@email.com",
      password: "123test",
    };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const createdUser = await inMemoryUsersRepository.findByEmail(user.email);

    expect(createdUser).toHaveProperty("id");
    expect(createdUser.name).toEqual("User Test");
  });

  it("Should not be able to create a new user with an existing email.", async () => {
    expect(async () => {
      const user = {
        name: "User Test",
        email: "test@email.com",
        password: "123test",
      };

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      });
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
