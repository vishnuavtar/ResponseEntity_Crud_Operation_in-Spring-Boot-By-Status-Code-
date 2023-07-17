import { BaseEntity } from './../../shared';

export class OrgDetails implements BaseEntity {
  constructor(
    public id?: number,
    public key?: string,
    public value?: string,
    public orgId?: number | string,
    public org?: BaseEntity,
    public status?: any,
    public message?: any
  ) {}
}
