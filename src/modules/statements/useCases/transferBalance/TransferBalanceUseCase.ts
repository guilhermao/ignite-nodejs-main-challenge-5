import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransferBalanceDTO } from "./ITransferBalanceDTO";
import { TransferBalanceError } from "./TransferBalanceError";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

@injectable()
class TransferBalanceUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    user_id,
    target_id,
    amount,
    description,
  }: ITransferBalanceDTO): Promise<Statement> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new TransferBalanceError.UserNotFound();
    }

    const transferTargetUser = await this.usersRepository.findById(target_id);

    if (!transferTargetUser) {
      throw new TransferBalanceError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id,
      sender_id: user_id,
    });

    console.log(balance, amount);
    if (balance < amount) {
      throw new TransferBalanceError.InsufficientFunds();
    }

    const statementOperation = await this.statementsRepository.create({
      user_id: target_id,
      sender_id: user_id,
      type: "transfer" as OperationType,
      amount,
      description,
    });

    return statementOperation;
  }
}

export { TransferBalanceUseCase };
