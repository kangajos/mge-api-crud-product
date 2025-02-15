import { Controller, Post, Get, Body, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        return { token: await this.userService.validateUser(body.username, body.password) };
    }

    @Post('register')
    async register(@Body() body: { username: string; password: string }) {
        return this.userService.create(body.username, body.password);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }

    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() updateData: any) {
        return this.userService.updateUser(id, updateData);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}
