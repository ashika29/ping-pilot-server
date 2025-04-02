import { Injectable } from '@nestjs/common';
import { UsersSeedService } from './user/users.service';
import { DataSource } from 'typeorm';
import { RoleSeederService } from './role/role.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userSeederService: UsersSeedService,
    private readonly roleSeederService: RoleSeederService,
  ) {}

  async seed() {
    try {
      console.log('Starting role seeding...');
      await this.roleSeederService.seed();
      console.log('Role seeding completed.');

      console.log('Starting user seeding...');
      await this.userSeederService.seed();
      console.log('User seeding completed.');
    } catch (error) {
      console.error('Error during seeding:', error);
    }
  }

  async drop() {
    await this.dropTable('users');
    await this.dropTable('roles');
  }

  async dropTable(tableName: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.dropTable(tableName);
      await queryRunner.commitTransaction();
      console.log(`Table ${tableName} dropped successfully.`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(`Error dropping table ${tableName}:`, error);
    } finally {
      await queryRunner.release();
    }
  }
}
