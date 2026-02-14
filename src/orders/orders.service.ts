import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(private dataSource: DataSource) {}

  async create(user: User, createOrderDto: CreateOrderDto) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const order = new Order();
      order.user = user;
      order.items = [];
      let totalAmount = 0;

      for (const itemDto of createOrderDto.items) {
        const product = await manager.findOne(Product, {
          where: { id: itemDto.productId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${itemDto.productId} not found`,
          );
        }

        if (product.stock < itemDto.quantity) {
          throw new BadRequestException(
            `Product ${product.title} is out of stock (Available: ${product.stock})`,
          );
        }

        const newStock = product.stock - itemDto.quantity;
        await manager.update(Product, product.id, { stock: newStock });

        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.price = product.price;
        orderItem.quantity = itemDto.quantity;

        order.items.push(orderItem);
        totalAmount += Number(product.price) * itemDto.quantity;
      }

      order.totalPrice = totalAmount;

      return await manager.save(order);
    });
  }

  async findOne(id: string) {
    return this.dataSource.getRepository(Order).findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });
  }
}
