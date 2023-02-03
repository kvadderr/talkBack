import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import fetch from "node-fetch";
import { Payment } from './payment.model'

import { UserService } from '../user/user.service';

const { uuid } = require('uuidv4');

const appKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTc4MCwiZXhwIjo4ODA3NTI4NzM4M30.KHu4n-fBfFm-Ln3r8-q_6afXccjkvl8l3ycdIQrlj7Y';
const shopID = 'kRdlPU0fMMrJU9tb';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private userService: UserService,
  ) {}

  async generateLink(data) {
    
    const id: string = uuid();
    data.order_id = id;
    const dataPay = {
      shop_id: shopID,
      amount: data.amount,
      order_id: data.order_id
    }
    const payment = await this.paymentRepository.save(data);
    const response = await fetch('https://api.cryptocloud.plus/v1/invoice/create', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + appKey
      },
      body: JSON.stringify(dataPay)
    });
    return response.json();
  }

  async postBank(data) {

    const order_id = data.order_id;
    const payment = await this.paymentRepository.findOne({
      where: { order_id },
    });
    
    payment.status = data.status;
    payment.amount_crypto = data.amount_crypto;
    payment.currency = data.currency;
    const updatePayment = await this.paymentRepository.save(payment);

    if (data.status === 'success') {
      console.log('sees');
      console.log(payment.user_id);
      console.log(payment.amount);
      const operBalanceSave = await this.userService.populateBalance(payment.user_id, payment.amount);
      return operBalanceSave;
    }
    

  }
    
}