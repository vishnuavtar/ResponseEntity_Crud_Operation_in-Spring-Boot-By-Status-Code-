import { BaseEntity } from './../../shared';

export class Org implements BaseEntity {
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
    public website?: string,
    public startDate?: any,
    public endDate?: any,
    public moduleName?: BaseEntity[],
    public parentid?: number,
    public noOfUsers?: number,
    public orgUsers?: BaseEntity[],
    public orgAssets?: BaseEntity[],
    public orgDetails?: BaseEntity[],
    public status?: string,
    public rootOrg?: string,
    public message?: string,
    public referer?: string,
    public pov?: string,
    public thirdPartyDomainsEnable?: boolean,
    public noOfDigitalRisksKeyWords?: number,
    public crmAccountLink?: string,
    public crmOpportunityLink?: string
  ) {}
}
