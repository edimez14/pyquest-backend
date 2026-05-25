import { UsersService } from './users.service';
import { FindUserParamsDto } from './dto/find-user-params.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findOne(params: FindUserParamsDto): Promise<import("./dto/user-response.dto").UserResponseDto>;
}
