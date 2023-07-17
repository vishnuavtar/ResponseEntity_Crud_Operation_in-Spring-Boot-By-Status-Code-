import { BaseEntity } from './../../shared';

export class OrgAnalyst implements BaseEntity {
  constructor(public id?: number, public userId?: number, public orgId?: number) {}
}
