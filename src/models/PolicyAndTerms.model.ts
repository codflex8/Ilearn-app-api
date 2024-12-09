import { Column, Entity } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity()
export class PolicyAndTerms extends BaseModel {
  @Column({ type: "longtext" })
  policy: string;

  @Column({ type: "longtext" })
  terms: string;
}
