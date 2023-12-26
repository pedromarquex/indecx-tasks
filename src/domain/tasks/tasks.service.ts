import { Task } from '@/infra/database/schemas/task.schema';
import { User } from '@/infra/database/schemas/user.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const createdTask = await this.taskModel.create({
      ...createTaskDto,
      user: userId,
    });

    return createdTask;
  }

  async findAll(userId: string) {
    const userExists = await this.userModel.findById(userId);

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const tasks = await this.taskModel.find({ user: userId }).populate('user', {
      password: 0,
    });

    return tasks;
  }

  async findOne(id: string, userId: string) {
    const userExists = await this.userModel.findById(userId);

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    return task.populate('user', { password: 0 });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const userExists = await this.userModel.findById(userId);

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    if (task.user.toString() !== userId) {
      throw new HttpException(
        'You cannot update a task that is not yours',
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedTask = await this.taskModel.findOneAndUpdate(
      { _id: id },
      updateTaskDto,
      {
        new: true,
      },
    );

    return updatedTask.populate('user', { password: 0 });
  }

  async remove(id: string, userId: string) {
    const userExists = await this.userModel.findById(userId);

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    if (task.user.toString() !== userId) {
      throw new HttpException(
        'You cannot delete a task that is not yours',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.taskModel.findByIdAndDelete(id);
  }
}
