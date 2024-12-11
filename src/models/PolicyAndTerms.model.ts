import { Column, Entity } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity()
export class PolicyAndTerms extends BaseModel {
  @Column({ type: "longtext", nullable: true })
  policy: string;

  @Column({ type: "longtext", nullable: true })
  terms: string;
}
