import { BaseEntity } from './../../shared';

export class OrgReportFrequency implements BaseEntity {
  constructor(
    public id?: number,
    public orgId?: number,
    public reportTypeId?: number,
    public defaultTime?: string,
    public frequency?: string
  ) {}
}
