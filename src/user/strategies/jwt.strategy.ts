import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { JwtPayload } from "src/user/interfaces/jwt.interface";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private configService: ConfigService
    ){

        super({
            secretOrKey: configService.get('JWT_SECRET') as string,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const {id} = payload;
         const user = await this.userRepository.findOneBy({id});

         if(!user) throw new UnauthorizedException(`Token not valid`);
         
         if(!user.isActive) throw new UnauthorizedException(`User is not active`);
         
         delete user.password;

         return user;
    }
    
}