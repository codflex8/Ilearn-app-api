import { Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { User } from "./User.model";

@Entity()
export class ShareApp extends BaseModel {
  @ManyToOne(() => User, (user) => user.shareGroups, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;
}
