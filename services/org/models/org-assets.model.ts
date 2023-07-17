import { BaseEntity } from './../../shared';

export class OrgAssets implements BaseEntity {
  constructor(
    public id?: number,
    public assettype?: string,
    public vendor?: string,
    public assetname?: string,
    public version?: string,
    public orgId?: number,
    public org?: BaseEntity,
    public monitor?: number,
    public status?: any,
    public message?: any,
    public comments?: any,
    public cpematch?: any,
    public cpe?: any,
    public socialHandlerIds?: any
  ) {}
}
