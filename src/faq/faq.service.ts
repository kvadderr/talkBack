import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FAQ } from './faq.model'

@Injectable()
export class FAQService {
  constructor(
    @InjectRepository(FAQ)
    private faqRepository: Repository<FAQ>,
  ) {}

  async getAll() {
    return this.faqRepository.find();
  }

    async create(faq: FAQ) {

        const faqSaved = await this.faqRepository.save(faq);

        if (!faqSaved) {
        throw new HttpException(
            { message: 'Ошибка при создании FAQ' },
            HttpStatus.BAD_REQUEST,
        );
        }

        return faqSaved;
    }

}