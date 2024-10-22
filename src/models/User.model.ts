import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: "datetime", nullable: true })
  passwordChangedAt: Date;

  @Column({ type: "int", nullable: true })
  passwordResetCode: number;

  @Column({ type: "datetime", nullable: true })
  passwordResetExpires: Date;

  @Column({ type: "boolean", default: false })
  passwordResetVerified: Boolean;
}
