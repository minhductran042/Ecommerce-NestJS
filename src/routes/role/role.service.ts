import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repo';

@Injectable()
export class RoleService {
    constructor(private readonly roleRepo: RoleRepository) {}

    
}
