import { ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Int, Mutation, ID, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'libs/db/src/prisma.service';
import { AdminService } from '../../admin/admin.service';
import { Public } from '../../auth/decorators';
import { AuthService } from '../auth.service';
import { LocalAuthGuard } from '../local-auth.guard';
import { Admin, AdminCreateInput, AdminInput, Token } from './auth.model';
import { GraphqlAuthGuard } from './gql-auth.guard';

@Resolver(of => Admin)
export class AuthResolver {
    constructor(private authService: AuthService, private adminService: AdminService) { }
    
    @Public()
    @UseGuards(GraphqlAuthGuard)
    @Query(returns => Token)
    async login(@Args({ name: 'variables', type: () => AdminInput, nullable: true }) variables) {
        return await this.authService.login(variables);
    }

    @Public()
    @Mutation(returns => Admin)
    async create(@Args({ name: 'adminCreateInput', type: () => AdminCreateInput }) adminCreateInput) {
        return this.adminService.register(adminCreateInput);
    }
}
