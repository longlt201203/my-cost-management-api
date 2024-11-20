import { AccountEntity, BoardEntity } from "@db/entities";
import { ClsStore } from "nestjs-cls";

export interface McmClsStore extends ClsStore {
	account: AccountEntity;
	board: BoardEntity;
}
