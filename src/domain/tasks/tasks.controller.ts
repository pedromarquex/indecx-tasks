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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../users/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({
    summary: 'Create a new task',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateTaskDto',
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTaskDto: CreateTaskDto, @Request() request: Request) {
    return this.tasksService.create(createTaskDto, request['userId']);
  }

  @ApiOperation({ summary: 'Get all tasks' })
  @ApiOkResponse({
    description: 'The records have been successfully retrieved.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Request() request: Request) {
    return this.tasksService.findAll(request['userId']);
  }

  @ApiOperation({ summary: 'Get a task' })
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @Request() request: Request) {
    return this.tasksService.findOne(id, request['userId']);
  }

  @ApiOperation({
    summary: 'Update a task',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UpdateTaskDto',
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
  })
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
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() request: Request) {
    return this.tasksService.remove(id, request['userId']);
  }
}
