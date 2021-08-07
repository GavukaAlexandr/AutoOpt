import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public title: string;
 
  @Column()
  public content: string;
}
