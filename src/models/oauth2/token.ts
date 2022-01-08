import {
  DataTypes, Model, Optional, Sequelize,
} from 'sequelize';
import { enumToArray, User } from '@getf1tickets/sdk';
import { OAuth2ClientGrants } from '@/models/oauth2/client/grant';
import { OAuth2Client } from './client';

interface OAuth2TokenAttributes {
  id: number;
  hashedAccessToken: string;
  accessTokenExpireAt: Date;
  hashedRefreshToken?: string;
  refreshTokenExpireAt?: Date;
  grant: OAuth2ClientGrants;
  scopes: string[];
}

interface OAuth2TokenCreationAttributes extends Optional<OAuth2TokenAttributes, 'id' | 'scopes' | 'hashedRefreshToken' | 'refreshTokenExpireAt'> {}

export class OAuth2Token
  extends Model<OAuth2TokenAttributes, OAuth2TokenCreationAttributes>
  implements OAuth2TokenAttributes {
  declare id: number;

  declare hashedAccessToken: string;

  declare accessTokenExpireAt: Date;

  declare hashedRefreshToken: string;

  declare refreshTokenExpireAt: Date;

  declare grant: OAuth2ClientGrants;

  declare scopes: string[];

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;

  static fn(sequelize: Sequelize) {
    OAuth2Token.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        hashedAccessToken: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        accessTokenExpireAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        hashedRefreshToken: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        refreshTokenExpireAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        grant: {
          type: DataTypes.ENUM(...enumToArray(OAuth2ClientGrants, true)),
          allowNull: false,
        },
        scopes: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'f1tickets_oauth2_token',
        freezeTableName: true,
        paranoid: true,
      },
    );
  }

  static associate() {
    OAuth2Client.hasMany(OAuth2Token, {
      sourceKey: 'id',
      foreignKey: 'clientId',
      as: 'tokens',
    });

    User.hasMany(OAuth2Token, {
      sourceKey: 'id',
      foreignKey: 'userId',
      as: 'tokens',
    });
  }
}

export default OAuth2Token;
