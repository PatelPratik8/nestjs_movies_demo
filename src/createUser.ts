import "./bootstrrap";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AuthService } from "./auth/auth.service";
import { AuthModule } from "./auth/auth.module";
import * as bcrypt from "bcrypt";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const authService = await app.select(AuthModule).get(AuthService);

  try {
    const saltOrRounds = 10;
    const password = "abc";
    const hash = await bcrypt.hash(password, saltOrRounds);
    const user1 = authService.createUser(
      "Pratik",
      "pratik7601@gmail.com",
      hash,
      "admin"
    );
    const user2 = authService.createUser("abc", "abc@gmail.com", hash, "user");
    await Promise.all([user1, user2]);
    console.log("user add successfully");
  } catch (e) {
    console.log(e);
  }
  console.log("app close");
  await app.close();
}
bootstrap();
