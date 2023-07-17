import { BaseEntity } from './../../shared';

export class OrgAssetSuggestion implements BaseEntity {
  constructor(public id?: number, public orgAssetId?: number, public product?: string, public vendor?: string) {}
}
