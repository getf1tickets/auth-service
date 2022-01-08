import {
  DataTypes, Model, Optional, Sequelize,
} from 'sequelize';

interface OAuth2ClientRedirectUriAttributes {
  id: number;
  uri: string;
}

interface OAuth2ClientRedirectUriCreationAttributes extends Optional<OAuth2ClientRedirectUriAttributes, 'id'> {}

export class OAuth2ClientRedirectUri
  extends Model<OAuth2ClientRedirectUriAttributes, OAuth2ClientRedirectUriCreationAttributes>
  implements OAuth2ClientRedirectUriCreationAttributes {
  declare id: number;

  declare uri: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  static fn(sequelize: Sequelize) {
    OAuth2ClientRedirectUri.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        uri: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'f1tickets_oauth2_client_redirect_uri',
        freezeTableName: true,
      },
    );
  }
}

export default OAuth2ClientRedirectUri;
