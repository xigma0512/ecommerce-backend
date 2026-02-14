import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @ManyToOne(() => Order, (order: Order) => order.items, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => Product, (product: Product) => product.orderItems)
  product: Product;
}
