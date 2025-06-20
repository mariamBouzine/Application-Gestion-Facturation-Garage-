import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';

class DatabaseService {
  private static instance: DatabaseService;
  public prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
    });

    // Log database queries in development
    this.prisma.$on('query', (e) => {
      logger.debug(`Query: ${e.query}`);
      logger.debug(`Params: ${e.params}`);
      logger.debug(`Duration: ${e.duration}ms`);
    });

    this.prisma.$on('error', (e) => {
      logger.error(`Database error: ${e.message}`);
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      logger.info('✅ Database connected successfully');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      logger.info('Database disconnected');
    } catch (error) {
      logger.error('Error disconnecting from database:', error);
      throw error;
    }
  }
}

export const db = DatabaseService.getInstance();
export const prisma = db.prisma;