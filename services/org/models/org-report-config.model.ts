import { BaseEntity } from './../../shared';

export class OrgReportConfig implements BaseEntity {
  constructor(public id?: number, public orgId?: number, public configKey?: string, public configValue?: string) {}
}
