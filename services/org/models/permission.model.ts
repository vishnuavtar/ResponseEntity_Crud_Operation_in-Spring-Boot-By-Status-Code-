import { BaseEntity } from './../../shared';

export class Permission implements BaseEntity {
  constructor(public id?: number, public permission?: string, public roles?: BaseEntity[]) {}
}
