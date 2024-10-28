import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  @ManyToMany(() => Book)
  @JoinTable({
    name: "CategoriesBooks",
    joinColumn: {
      name: "categoryId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "bookId",
      referencedColumnName: "id",
    },
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
