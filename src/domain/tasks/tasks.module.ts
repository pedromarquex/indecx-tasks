import { TaskSchema } from '@/infra/database/schemas/task.schema';
import { UserSchema } from '@/infra/database/schemas/user.schema';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Task', schema: TaskSchema },
    ]),
  ],
})
export class TasksModule {}
