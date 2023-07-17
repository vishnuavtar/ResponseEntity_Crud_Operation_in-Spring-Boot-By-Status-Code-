import { BaseEntity } from './../../shared';

export class OrgAudit implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public contact?: string,
    public address?: string,
    public city?: string,
    public state?: string,
    public country?: string,
    public zip?: string,
    public email?: string,
    public phone?: string,
    public noOfUsers?: number,
    public parentid?: number,
    public timeZone?: string,
    public rootOrg?: string,
    public status?: string,
    public website?: string,
    public apiKey?: string,
    public is2fa?: boolean,
    public securityKey?: string,
    public orgId?: number,
    public modifiedBy?: string,
    public modifiedDate?: Date,
    public action?: string
  ) {}
}
