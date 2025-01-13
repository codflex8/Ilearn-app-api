import { Column, Entity } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity()
export class UsersActivities extends BaseModel {
  @Column()
  count: number;

  @Column()
  date: Date;

  @Column({ type: "simple-array", nullable: true })
  usersIds: string[];
}
