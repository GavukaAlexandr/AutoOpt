import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AdminService } from '../../admin/admin.service';
import { Public } from '../../auth/decorators';
import { AuthService } from '../auth.service';
import { Admin, AdminCreateInput, AdminInput, Token } from './auth.model';
import { GraphqlAuthGuard } from './gql-auth.guard';

@Resolver((of) => Admin)
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private adminService: AdminService,
  ) {}

  @Public()
  @UseGuards(GraphqlAuthGuard)
  @Query((returns) => Token)
  async login(
    @Args({ name: 'variables', type: () => AdminInput, nullable: true })
    variables,
  ) {
    return await this.authService.login(variables);
  }

  @Public()
  @Mutation((returns) => Admin)
  async create(
    @Args({ name: 'adminCreateInput', type: () => AdminCreateInput })
    adminCreateInput,
  ) {
    return this.adminService.register(adminCreateInput);
  }
}
