import { BaseEntity } from './../../shared';

export class OrgUserAudit implements BaseEntity {
  constructor(
    public id?: number,
    public firstname?: string,
    public lastname?: string,
    public email?: string,
    public phone?: string,
    public roleId?: number,
    public roleName?: string,
    public status?: string,
    public orgUserId?: number,
    public orgId?: number,
    public modifiedBy?: string,
    public modifiedDate?: Date,
    public action?: string
  ) {}
}
