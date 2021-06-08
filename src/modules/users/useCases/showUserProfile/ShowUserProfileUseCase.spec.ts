import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to show an user profile by providing a JWT token.", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "test@email.com",
      password: "123test",
    });

    const userProfile = await showUserProfileUseCase.execute(user.id || "");

    expect(userProfile.email).toEqual(user.email);
    expect(userProfile.name).toEqual(user.name);
  });

  it("Should not be able to show an user profile to a nonexistent user.", async () => {
    await expect(
      showUserProfileUseCase.execute("invalidId")
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
