import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Book } from "./Books.model";
import { User } from "./User.model";
import { BaseModel } from "./BaseModel";

@Entity()
export class Category extends BaseModel {
  @Column()
  name: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => Book, (book) => book.category, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  books: Book[];

  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn({
    name: "userId",
  })
  user: User;

  static getUserCategoryById(userId: string, categoryId: string) {
    return this.findOne({
      where: {
        id: categoryId,
        user: { id: userId },
      },
      relations: {
        books: true,
      },
    });
  }
}
