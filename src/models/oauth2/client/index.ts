import {
  Association,
  DataTypes,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model, Optional, Sequelize,
} from 'sequelize';
import { UUID } from '@getf1tickets/sdk';

// association dependencies
import { OAuth2ClientGrant } from '@/models/oauth2/client/grant';
import { OAuth2ClientRedirectUri } from '@/models/oauth2/client/redirect';

interface OAuth2ClientAttributes {
  id: UUID;
  clientId: string;
  clientSecret: string;
}

interface OAuth2ClientCreationAttributes extends Optional<OAuth2ClientAttributes, 'id'> {}

export class OAuth2Client extends Model<OAuth2ClientAttributes, OAuth2ClientCreationAttributes>
  implements OAuth2ClientAttributes {
  // model attributes
  declare id: UUID;

  declare clientId: string;

  declare clientSecret: string;

  // timestamps attributes
  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;

  // association attributes
  declare readonly grants?: OAuth2ClientGrant[];

  declare getGrants: HasManyGetAssociationsMixin<OAuth2ClientGrant>;

  declare createGrant: HasManyCreateAssociationMixin<OAuth2ClientGrant>;

  declare readonly redirectUris?: OAuth2ClientRedirectUri[];

  declare getRedirectUris: HasManyGetAssociationsMixin<OAuth2ClientRedirectUri>;

  declare createRedirectUri: HasManyCreateAssociationMixin<OAuth2ClientRedirectUri>;

  declare static associations: {
    grants: Association<OAuth2Client, OAuth2ClientGrant>;
    redirectUris: Association<OAuth2Client, OAuth2ClientRedirectUri>;
  };

  static fn(sequelize: Sequelize) {
    OAuth2Client.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        clientId: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        clientSecret: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'f1tickets_oauth2_client',
        freezeTableName: true,
        paranoid: true,
      },
    );
  }
}

export * from '@/models/oauth2/client/grant';
export * from '@/models/oauth2/client/redirect';
export default [
  OAuth2Client,
  OAuth2ClientGrant,
  OAuth2ClientRedirectUri,
];
