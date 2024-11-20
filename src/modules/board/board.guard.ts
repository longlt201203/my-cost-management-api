import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { McmClsStore } from "@utils";
import { ClsService } from "nestjs-cls";
import { BoardService } from "./board.service";
import { Request } from "express";
import { BoardNotFoundError } from "./errors";
import { Tracing } from "magic-otel";

@Injectable()
export class BoardGuard implements CanActivate {
	constructor(
		private readonly cls: ClsService<McmClsStore>,
		private readonly boardService: BoardService,
	) {}

	@Tracing()
	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest<Request>();
		const boardId = parseInt(request.params.boardId);
		if (!boardId) throw new BoardNotFoundError();
		const board = await this.boardService.getOneOrFail(boardId);
		this.cls.set("board", board);
		return true;
	}
}
