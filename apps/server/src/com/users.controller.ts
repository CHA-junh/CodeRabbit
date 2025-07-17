import { Controller, Post, Body } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { User, UserSearchParams, UserSearchResponseDto } from './dto/users.dto'

/**
 * 사용자 관련 API 컨트롤러
 * 사용자 검색 기능을 제공합니다.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 사용자 검색 API
   * @param body - 검색 조건
   * @param body.userNm - 사용자명
   * @returns 검색된 사용자 목록과 프로시저 정보
   */
  @Post('search')
  @ApiOperation({ 
    summary: '사용자 검색',
    description: '사용자명으로 사용자를 검색하고 프로시저 정보를 포함하여 반환합니다.'
  })
  @ApiBody({ 
    type: UserSearchParams,
    description: '사용자 검색 조건'
  })
  @ApiResponse({ 
    status: 200, 
    description: '사용자 검색 성공',
    type: UserSearchResponseDto
  })
  async searchUsers(@Body() body: UserSearchParams): Promise<UserSearchResponseDto> {
    return this.usersService.searchUsers(body.userNm, body.hqDiv, body.deptDiv)
  }
} 