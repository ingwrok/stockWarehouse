import { CreateDateColumn, DeleteDateColumn, FindOptionsWhere, In, Not, PrimaryGeneratedColumn, Repository, SaveOptions, UpdateDateColumn } from "typeorm";
import PostgresTypeORMConnection from "../utils/postgresDB/connector/typeorm/index";

export interface BaseProperties {
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}

export abstract class BaseEntity implements BaseProperties {
  static readonly pk = "id";

  static readonly connectionName;
  static readonly table_full_name: string;
  static readonly table_short_name: string;

  static mainContentFieldID = "";

  constructor(data?: BaseProperties) {
    if (!data) return;
    this.set = data ?? {};
  }

  static get entityConstructor() {
    return (this.constructor as typeof BaseEntity);
  }

  get entityConstructor() {
    return (this.constructor as typeof BaseEntity);
  }

  static get datasource() {
    return PostgresTypeORMConnection.getConnected(this.connectionName);
  }

  static repository<T extends typeof BaseEntity>(this: T) {
    return new Repository(this, this.datasource.manager) as Repository<InstanceType<T>>;
  }

  static load<T extends typeof BaseEntity>(this: T, id: number) {
    return this.repository().findOne({
      where: {
        [this.pk]: id
      } as FindOptionsWhere<InstanceType<T>>
    });
  }

  static countAll() {
    return this.repository().count();
  }

  static loadByIds<T extends typeof BaseEntity>(this: T, ids: number[]) {
    return this.repository().find({
      where: {
        [this.pk]: In(ids)
      } as FindOptionsWhere<InstanceType<T>>
    });
  }

  static loadByNotIds<T extends typeof BaseEntity>(this: T, ids: number[]) {
    return this.repository().find({
      where: {
        [this.pk]: Not(In(ids))
      } as FindOptionsWhere<InstanceType<T>>
    });
  }

  static loadByMain<T extends typeof BaseEntity>(this: T, mainContentID: number) {
    return this.repository().findBy({
      [this.mainContentFieldID]: mainContentID,
    } as FindOptionsWhere<InstanceType<T>>);
  }

  static loadByMainIds<T extends typeof BaseEntity>(this: T, ...mainContentIDs: number[]) {
    return this.repository().findBy({
      [this.mainContentFieldID]: In(mainContentIDs),
    } as FindOptionsWhere<InstanceType<T>>);
  }

  set set(data: BaseProperties) {
    Object.assign(this, data);
  }

  save(options?: SaveOptions) {
    this.updated_at = new Date();
    return this.entityConstructor.repository().save(this, { reload: true, ...options })
      .then(() => {
        return this;
      });
  }

  delete(isHardDelete: boolean = false) {
    if (isHardDelete) return this.entityConstructor.repository().remove(this);
    return this.save().then(() => {
      return this.entityConstructor.repository().softRemove(this);
    });
  }

  @PrimaryGeneratedColumn()
  declare id: number;

  @CreateDateColumn()
  declare created_at: Date;

  @UpdateDateColumn()
  declare updated_at: Date;

  @DeleteDateColumn()
  declare deleted_at?: Date | null;
}