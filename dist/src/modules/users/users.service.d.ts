import { PrismaService } from '../../database/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findOne(idUsuario: number): Promise<UserResponseDto>;
}
