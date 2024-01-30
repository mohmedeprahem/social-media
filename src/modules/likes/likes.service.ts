import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserRepository } from 'src/database/repositories';
import { LikeRepository } from 'src/database/repositories/like.repository';

@Injectable()
export class LikesService {
  constructor(
    private readonly _likesRepository: LikeRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  async userLikesPost(userUuid: string, postId: number): Promise<boolean> {
    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });
    if (!user) {
      throw new Error();
    }

    return await this._likesRepository.IsUserLikedPost(user.id, postId);
  }

  async likePost(userUuid: string, postId: number) {
    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new Error();
    }

    return await this._likesRepository.likePost(user.id, postId);
  }
}
