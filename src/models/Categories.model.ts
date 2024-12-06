import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  FindOptionsWhere,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Book } from "./Books.model";
import { User } from "./User.model";
import { BaseModel } from "./BaseModel";
import { getPaginationData } from "../utils/getPaginationData";
import { getServerIPAddress } from "../utils/getServerIpAddress";

@Entity()
export class Category extends BaseModel {
  @Column()
  name: string;

  @Column({ nullable: true })
  imageUrl: string;
  fullImageUrl: string = null;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  setFullImageUrl() {
    if (this.imageUrl) {
      this.fullImageUrl = getServerIPAddress() + this.imageUrl;
    }
  }
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

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  chekCategoryImage() {
    if (!this.imageUrl) {
      this.fullImageUrl = getServerIPAddress() + "/public/default/category.jpg";
    }
  }

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
