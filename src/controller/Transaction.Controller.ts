import { paramId } from "../schemas/@Base.Schema";
import { TTransaction, TTransactyionSummary } from "../dtos/Transaction.dto";
import { transactionQuerySchema, transactionSummaryQuerySchema } from "../schemas/Transaction.Schema";
import { TransactionService } from "../services/Transaction.Service";
import { FastifyReply, FastifyRequest } from "fastify";
import { TSuccess } from "../dtos/@Base.dto";

export class TransactionController {
  static async create(request: FastifyRequest,reply: FastifyReply):Promise<TTransaction> {
    const cashierId = request.user.id
    const body = transactionQuerySchema.parse(request.body)
    const transaction = await TransactionService.create(body,cashierId)
    return transaction
  }

  static async summary(request: FastifyRequest, reply: FastifyReply):Promise<TTransactyionSummary> {
    const query = transactionSummaryQuerySchema.parse(request.query)
    const summary = await TransactionService.summary(query)
    return summary
  }

  static async getById(request: FastifyRequest,reply: FastifyReply):Promise<TTransaction> {
    const param = paramId.parse(request.params)
    const transaction = await TransactionService.getById(param.id)
    return transaction
  }

  static async delete(request: FastifyRequest, reply: FastifyReply):Promise<TSuccess> {
    const cashierId = request.user.id
    const param = paramId.parse(request.params)
    const success = await TransactionService.delete(param.id,cashierId)
    return success
  }

}