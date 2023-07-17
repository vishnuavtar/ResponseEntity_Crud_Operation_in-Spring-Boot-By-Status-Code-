import { BaseEntity } from './../../shared';

export class OrgSubscriptionAudit implements BaseEntity {
  constructor(
    public id?: number,
    public startDate?: any,
    public endDate?: any,
    public moduleName?: BaseEntity[],
    public modifiedby?: any,
    public modifiedDate?: any,
    public status?: string,
    public actions?: string
  ) {}
}
