import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
  }

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("Should be able to return an user statement balance.", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "test@email.com",
      password: "123test",
    });

    await inMemoryStatementsRepository.create({
      amount: 500,
      description: "Test Description Deposit",
      type: "deposit" as OperationType,
      user_id: user.id as string,
    });

    await inMemoryStatementsRepository.create({
      amount: 100,
      description: "Test Description Withdraw",
      type: "withdraw" as OperationType,
      user_id: user.id as string,
    });

    const response = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(response.balance).toBe(400);
  });

  it("Should not be able to return a balance statement for a nonexistent user.", async () => {
    await expect(
      getBalanceUseCase.execute({
        user_id: "invalidId",
      })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
