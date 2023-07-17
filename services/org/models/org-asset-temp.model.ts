import { BaseEntity } from './../../shared';

export class OrgAssetsTemp implements BaseEntity {
  constructor(
    public id?: number,
    public orgId?: number,
    public monitor?: number,
    public assettype?: string,
    public assetname?: string,
    public version?: string,
    public vendor?: string,
    public comments?: string,
    public location?: string,
    public copied?: boolean,
    public copiedBy?: string
  ) {}
}
