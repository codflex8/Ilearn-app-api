import { Column, Entity } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity()
export class AppLinks extends BaseModel {
  @Column({ type: "longtext" })
  androidLink: string;

  @Column({ type: "longtext" })
  appleLink: string;
}
