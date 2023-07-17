import { BaseEntity } from './../../shared';

export class OrgSubscription implements BaseEntity {
  constructor(
    public id?: number,
    public startDate?: any,
    public endDate?: any,
    public moduleName?: BaseEntity[],
    public subKey?: BaseEntity[],
    public status?: string,
    public orgId?: number,
    public response?: string,
    public message?: string
  ) {}
}
