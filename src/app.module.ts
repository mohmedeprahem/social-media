import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './database/models/User.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { KeysService } from './utils/keysService.util';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { UsersFollowing } from './database/models/UsersFollowing.entity';
import { UsersModule } from './modules/users/users.module';
import { Post } from './database/models/Post.entity';
import { PostsModule } from './modules/posts/posts.module';
import { PostsLike } from 'src/database/models/PostsLike.entity';
import { Comment } from './database/models/Comment.entity';
import { CommentsModule } from './modules/comments/comments.module';
import { AuthOrAnonymousMiddleware } from './common/middleware';
import { JWTService } from './utils';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      ...KeysService.getDatabaseKeys(process.env.NODE_ENV),
      models: [User, UsersFollowing, Post, PostsLike, Comment],
    }),
    JwtModule.register({ secret: process.env.JWT_AT_SECRET }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [
    JWTService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthOrAnonymousMiddleware)
      .forRoutes(
        { path: '/api/v1/posts/users/:uuid', method: RequestMethod.GET },
        { path: '/api/v1/users/profile/:uuid', method: RequestMethod.GET },
      );
  }
}
