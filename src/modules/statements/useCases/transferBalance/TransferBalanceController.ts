import { Request, Response } from "express";
import { container } from "tsyringe";

import { TransferBalanceUseCase } from "./TransferBalanceUseCase";

class TransferBalanceController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { target_id } = request.params;
    const { amount, description } = request.body;

    const transferBalance = container.resolve(TransferBalanceUseCase);

    const statement = await transferBalance.execute({
      user_id,
      target_id,
      amount,
      description,
    });

    return response.status(201).json(statement);
  }
}

export { TransferBalanceController };
