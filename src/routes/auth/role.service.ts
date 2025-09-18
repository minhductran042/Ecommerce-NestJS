import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RoleName } from 'src/shared/constants/role.constant';
import { PrismaService } from 'src/shared/services/prisma.service';
import { RoleType } from './auth.model';

@Injectable()
export class RoleService {
    private clientRoleId: number | null = null;

    constructor(private readonly prismaService: PrismaService) {}

    async getClientRoleId() {
        if(this.clientRoleId) {
            return this.clientRoleId;
        }

        const [role] = await this.prismaService.$queryRaw<Array<RoleType>>(Prisma.sql`
            SELECT *
            FROM "Role"
            WHERE "name" = ${RoleName.CLIENT} AND "deletedAt" IS NULL
            LIMIT 1
        `)

        if(!role) {
            throw new Error(`Role ${RoleName.CLIENT} not found`);
        }

        this.clientRoleId = role.id;
        return role.id;
    }
}
