import { Column, Entity } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity()
export class AppLinks extends BaseModel {
  @Column({ type: "longtext", nullable: true })
  androidLink: string;

  @Column({ nullable: true })
  androidVersion: string;

  @Column({ type: "longtext", nullable: true })
  appleLink: string;

  @Column({ nullable: true })
  appleVersion: string;
}
