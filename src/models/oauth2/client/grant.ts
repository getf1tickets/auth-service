import {
  DataTypes, Model, Optional, Sequelize,
} from 'sequelize';

export enum OAuth2ClientGrants {
  AUTHORIZATION_CODE = 'authorization_code',
  CLIENT_CREDENTIALS = 'client credentials',
  REFRESH_TOKEN = 'refresh_token',
  PASSWORD = 'password',
}

interface OAuth2ClientGrantAttributes {
  id: number;
  type: OAuth2ClientGrants;
}

interface OAuth2ClientGrantCreationAttributes extends Optional<OAuth2ClientGrantAttributes, 'id'> {}

export class OAuth2ClientGrant
  extends Model<OAuth2ClientGrantAttributes, OAuth2ClientGrantCreationAttributes>
  implements OAuth2ClientGrantAttributes {
  declare id: number;

  declare type: OAuth2ClientGrants;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  static fn(sequelize: Sequelize) {
    OAuth2ClientGrant.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'f1tickets_oauth2_client_grant',
        freezeTableName: true,
      },
    );
  }
}

export default OAuth2ClientGrant;