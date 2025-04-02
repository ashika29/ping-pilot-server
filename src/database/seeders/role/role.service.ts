import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/model/roles.model';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeederService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async seed() {
    const roles = [
      {
        name: 'Admin',
      },
      {
        name: 'User',
      },
    ];

    for (const role of roles) {
      const roleEntity = this.roleRepository.create(role);
      await this.roleRepository.save(roleEntity);
    }
  }
}
