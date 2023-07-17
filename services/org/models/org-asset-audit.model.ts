import { BaseEntity } from './../../shared';

export class OrgAssetsAudit implements BaseEntity {
  constructor(
    public id?: number,
    public monitor?: number,
    public assettype?: string,
    public assetname?: string,
    public version?: string,
    public vendor?: string,
    public comments?: string,
    public location?: string,
    public createddate?: any,
    public createdby?: string,
    public updateddate?: any,
    public updatedby?: string,
    public orgAssetId?: number,
    public modifiedBy?: string,
    public modifiedDate?: any,
    public action?: string,
    public orgId?: number
  ) {}
}
