import { Injectable } from '@nestjs/common';
import { RoleName } from 'src/shared/constants/role.constant';

@Injectable()
export class RoleService {
    private clientRoleId: number | null = null;

    constructor(private readonly prismaService: any) {}

    async getClientRoleId() {
        if(this.clientRoleId) {
            return this.clientRoleId;
        }

        const role = await this.prismaService.role.findUnique({
            where: {
                name: RoleName.CLIENT
            }
        })

        this.clientRoleId = role.id;
        return role.id;
    }
}
