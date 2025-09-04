import { Injectable } from '@nestjs/common';
import { RoleName } from 'src/shared/constants/role.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class RoleService {
    private clientRoleId: number | null = null;

    constructor(private readonly prismaService: PrismaService) {}

    async getClientRoleId() {
        if(this.clientRoleId) {
            return this.clientRoleId;
        }

        const role = await this.prismaService.role.findUnique({
            where: {
                name: RoleName.CLIENT
            }
        })

        if(!role) {
            throw new Error(`Role ${RoleName.CLIENT} not found`);
        }

        this.clientRoleId = role.id;
        return role.id;
    }
}
