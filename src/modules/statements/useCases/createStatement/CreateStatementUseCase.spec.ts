import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
  }

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to do a deposit statement.", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "test@email.com",
      password: "123test",
    });

    const statement = await createStatementUseCase.execute({
      amount: 500,
      description: "Test Description Deposit",
      type: "deposit" as OperationType,
      user_id: user.id as string,
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should be able to do a withdraw statement.", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "test@email.com",
      password: "123test",
    });

    await createStatementUseCase.execute({
      amount: 500,
      description: "Test Description Deposit",
      type: "deposit" as OperationType,
      user_id: user.id as string,
    });

    const statement = await createStatementUseCase.execute({
      amount: 100,
      description: "Test Description Withdraw",
      type: "withdraw" as OperationType,
      user_id: user.id as string,
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should not be able to perform a statement for a nonexistent user.", async () => {
    await expect(
      createStatementUseCase.execute({
        amount: 500,
        description: "to test amount",
        type: "withdraw" as OperationType,
        user_id: "invalidId",
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be able to perform a withdraw statement with insufficient funds.", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "test@email.com",
      password: "123test",
    });

    await expect(
      createStatementUseCase.execute({
        amount: 500,
        description: "to test amount",
        type: "withdraw" as OperationType,
        user_id: user.id as string,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
