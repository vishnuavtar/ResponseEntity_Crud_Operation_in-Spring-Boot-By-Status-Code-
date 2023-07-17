import { BaseEntity } from './../../shared';

export class OrgUser implements BaseEntity {
  constructor(
    public id?: number,
    public firstname?: string,
    public lastname?: string,
    public email?: string,
    public phone?: string,
    public roleId?: number,
    public orgId?: number,
    public role?: BaseEntity,
    public org?: BaseEntity,
    public roleName?: string,
    public status?: string,
    public message?: string,
    public eulaAccept?: boolean
  ) {}
}
