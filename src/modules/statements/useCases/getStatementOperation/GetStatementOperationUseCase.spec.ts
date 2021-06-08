import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
  }

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to list an operation by providing an user id and statement id.", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "test@email.com",
      password: "123test",
    });

    const statement = await inMemoryStatementsRepository.create({
      amount: 500,
      description: "Test Description Deposit",
      type: "deposit" as OperationType,
      user_id: user.id as string,
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(operation.id).toEqual(statement.id);
  });

  it("Should not be able to list an operation for a non-existing user", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "test@email.com",
      password: "123test",
    });

    const statement = await inMemoryStatementsRepository.create({
      amount: 500,
      description: "Test Description Deposit",
      type: "deposit" as OperationType,
      user_id: user.id as string,
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: "invalidId",
        statement_id: statement.id as string,
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get a statement operation for a nonexistent statement.", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "test@email.com",
      password: "123test",
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "invalidId",
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
