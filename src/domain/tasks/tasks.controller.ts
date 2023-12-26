import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../users/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTaskDto: CreateTaskDto, @Request() request: Request) {
    return this.tasksService.create(createTaskDto, request['userId']);
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Request() request: Request) {
    return this.tasksService.findAll(request['userId']);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @Request() request: Request) {
    return this.tasksService.findOne(id, request['userId']);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() request: Request,
  ) {
    return this.tasksService.update(id, updateTaskDto, request['userId']);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() request: Request) {
    return this.tasksService.remove(id, request['userId']);
  }
}
