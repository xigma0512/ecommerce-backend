import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @OneToMany(() => OrderItem, (item: OrderItem) => item.product)
  orderItems: OrderItem[];
}
