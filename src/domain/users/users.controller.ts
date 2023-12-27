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
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create a new user',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateUserDto',
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Login a user',
  })
  @ApiOkResponse({
    description: 'The user has been successfully logged in.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({
    description: 'The user has been successfully retrieved.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  me(@Request() request: Request) {
    return this.usersService.me(request['userId']);
  }

  @ApiOperation({
    summary: 'update user profile',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UpdateUserDto',
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'The user has been successfully updated.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() request: Request,
  ) {
    return this.usersService.updateUser(id, updateUserDto, request['userId']);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiNoContentResponse({
    description: 'The user has been successfully deleted.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: Request) {
    return this.usersService.remove(id, request['userId']);
  }
}
