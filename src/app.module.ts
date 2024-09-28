import { Module } from '@nestjs/common';
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class AppModule {}
