import { BaseEntity } from './../../shared';

export class OrgReportRecipient implements BaseEntity {
  constructor(
    public id?: number,
    public orgId?: number,
    public reportTypeId?: number,
    public email?: string,
    public status?: string,
    public message?: string
  ) {}
}
