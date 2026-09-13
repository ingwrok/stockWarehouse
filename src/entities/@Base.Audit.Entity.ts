import { Column } from "typeorm";

import { BaseEntity, BaseProperties } from "./@Base.Entity";

export interface BaseAuditProperties extends BaseProperties {
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
}

export abstract class BaseAuditEntity extends BaseEntity implements BaseAuditProperties {
  constructor(data?: BaseProperties) {
    super(data);
  }

  @Column({ type: "int4", nullable: true })
  declare created_by?: number | null;

  @Column({ type: "int4", nullable: true })
  declare updated_by?: number | null;

  @Column({ type: "int4", nullable: true })
  declare deleted_by?: number | null;
}