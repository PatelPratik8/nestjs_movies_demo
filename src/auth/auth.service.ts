import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}
  async signIn(email: string, pass: string) {
    const user = await this.userModel.findOne({ email }).exec();  
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(pass,user?.password,);
    
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { name: user.name, role : user.role ,id: user._id} ;
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async createUser(name:string,email:string,password:string,role:string):Promise<any>{
    return this.userModel.create({name,email,password,role})
  }

}
