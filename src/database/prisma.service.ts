import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    const maxRetries = Number(process.env.DB_CONNECT_RETRIES ?? 5);
    const retryDelayMs = Number(process.env.DB_CONNECT_RETRY_DELAY_MS ?? 2000);

    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
      try {
        await this.$connect();

        if (attempt > 1) {
          this.logger.log(
            `Database connected after ${attempt} attempts.`,
          );
        }

        return;
      } catch (error) {
        const initializationError =
          error instanceof Prisma.PrismaClientInitializationError ? error : null;
        const code = initializationError?.errorCode
          ? ` (${initializationError.errorCode})`
          : '';

        if (attempt >= maxRetries) {
          this.logger.error(
            `Database connection failed after ${maxRetries} attempts${code}.`,
          );
          throw error;
        }

        this.logger.warn(
          `Database connection attempt ${attempt}/${maxRetries} failed${code}. Retrying in ${retryDelayMs}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
