import { OmitType } from "@nestjs/swagger";
import { CreateBoardRequest } from "./create-board.request";

export class UpdateBoardRequest extends OmitType(CreateBoardRequest, [
	"currencyUnit",
	"language",
]) {}
