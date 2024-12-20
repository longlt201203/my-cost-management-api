import { Module } from "@nestjs/common";
import { AuthController, Auth2Controller } from "./controllers";
import { Auth2Service, AuthService } from "./services";

const services = [AuthService, Auth2Service];

@Module({
	controllers: [AuthController, Auth2Controller],
	providers: [...services],
	exports: [...services],
})
export class AuthModule {}
