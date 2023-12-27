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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../users/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTaskDto: CreateTaskDto, @Request() request: Request) {
    return this.tasksService.create(createTaskDto, request['userId']);
  }

  @ApiOperation({ summary: 'Get all tasks' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Request() request: Request) {
    return this.tasksService.findAll(request['userId']);
  }

  @ApiOperation({ summary: 'Get a task' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @Request() request: Request) {
    return this.tasksService.findOne(id, request['userId']);
  }

  @ApiOperation({ summary: 'Update a task' })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'Delete a task' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() request: Request) {
    return this.tasksService.remove(id, request['userId']);
  }
}
