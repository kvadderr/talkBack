import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { In, Repository, DataSource } from 'typeorm';

@Injectable()
export class AnalyticsService {
  
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async mainAnalytics(startDay: string, endDay: string) {

    console.log(startDay, endDay);

    
    const convers1 = await this.getConversionOne(startDay, endDay);
    const convers2 = await this.getConversionTwo(startDay, endDay);
    const traff = await this.getTraffic(startDay, endDay);
    const avgCheck = await this.getAvgCheck(startDay, endDay);
    const talkTime = await this.getTalkTime(startDay, endDay);
    const avgTalkTime = await this.getAvgTalkTime(startDay, endDay);
    const profit = await this.getProfit(startDay, endDay);
    const retentOne = await this.getRetentionOne(startDay);
    const retentTwo = await this.getRetentionTwo(startDay, endDay);

    const data = {
      convers1: convers1[0].count,
      convers2: convers2[0].count,
      traff: traff[0].count,
      avgCheck: avgCheck[0].avgcheck,
      talkTime: talkTime[0].sum,
      avgTalkTime: avgTalkTime[0].avgtime,
      profit: profit[0].sum,
      retentOne: retentOne[0].count,
      retentTwo: retentTwo[0].count
    };

    return data;

  }

  async getConversionOne(startDay: string, endDay: string) {
    
    return this.dataSource.query('SELECT count(id) FROM (SELECT id FROM public."user" WHERE ("createdAt" BETWEEN \''+startDay+'\' AND \''+endDay+'\')) as id_us WHERE EXISTS (SELECT user_id FROM payment WHERE user_id = id_us.id)');
  }

  async getConversionTwo(startDay: string, endDay: string) {
    return this.dataSource.query('SELECT count(id) FROM public."user" WHERE ("createdAt" BETWEEN \''+startDay+'\' AND \''+endDay+'\') AND role = \'CLIENT\'');
  }

  async getTraffic(startDay: string, endDay: string) {
    return this.dataSource.query('SELECT count("userId") FROM (SELECT "userId" FROM traffic WHERE "userId" NOT IN (SELECT id as "userId" FROM public."user" WHERE role = \'OPERATOR\') AND "createdAt" BETWEEN \''+startDay+'\' AND \''+endDay+'\' GROUP BY "userId" ) as count');
  }

  async getAvgCheck(startDay: string, endDay: string) {
    return this.dataSource.query('SELECT SUM(cost)/COUNT(cost) as avgCheck FROM call WHERE duration != 0 AND cost != 0 AND "createdAt" BETWEEN \''+startDay+'\' AND \''+endDay+'\'');
  }

  async getTalkTime(startDay: string, endDay: string) {
    return this.dataSource.query('SELECT SUM(duration) FROM call WHERE duration != 0 AND cost != 0 AND "createdAt" BETWEEN \''+startDay+'\' AND \''+endDay+'\'');
  }

  async getAvgTalkTime(startDay: string, endDay: string) {
    return this.dataSource.query('SELECT SUM(duration)/COUNT(duration) as avgTime FROM call WHERE duration != 0 AND cost != 0 AND "createdAt" BETWEEN \''+startDay+'\' AND \''+endDay+'\'');
  }

  async getProfit(startDay: string, endDay: string) {
    return this.dataSource.query('SELECT SUM(amount) FROM payment WHERE status=\'success\' AND "createdAt" BETWEEN \''+startDay+'\' AND \''+endDay+'\'');
  }

  async getRetentionOne(startDay: string) {
    return this.dataSource.query('SELECT count(id) FROM public."user" WHERE ("createdAt" BETWEEN \''+startDay+'\' AND \''+startDay+'\') AND role = \'CLIENT\'');
  }

  async getRetentionTwo(startDay: string, endDay: string) {
    return this.dataSource.query('SELECT count(id) FROM (SELECT id FROM public."user" WHERE ("createdAt" BETWEEN \''+startDay+'\' AND \''+startDay+'\') AND role = \'CLIENT\' ) as id_us WHERE EXISTS (SELECT "userId" FROM traffic WHERE "userId" = id_us.id AND ("createdAt" BETWEEN \''+endDay+'\' AND \''+endDay+'\'))');
  }


  async getClientAnal(startDay: string, endDay: string) {
    return this.dataSource.query( 'SELECT \
      us.id, us.login, us."FIO", us."createdAt", us.balance, \
      MAX(traffic."createdAt"), \
      call."clientId", count(call."clientId") as talkCount, SUM(call.cost) as totalCost, SUM(call."companyCost") as totalCompany, \
      MAX(p."createdAt") as lastPay,\
      COUNT(favorite.id)\
      \
      FROM (SELECT * FROM public."user" WHERE role = \'CLIENT\')\
      as us \
      LEFT JOIN \
        traffic ON us.id = traffic."userId" \
      LEFT JOIN \
        call ON call."clientId" =us.id AND call."createdAt" BETWEEN \''+startDay+'\' AND \''+endDay+'\'\
      LEFT JOIN \
        (SELECT * FROM payment WHERE status=\'success\' AND "createdAt" BETWEEN \''+startDay+'\' AND \''+endDay+'\') as p ON p.user_id = us.id\
      LEFT JOIN \
        favorite ON favorite."userId" = us.id\
      GROUP BY \
        us.id, \
        us.login, \
        us."FIO",\
        us."createdAt", \
        us.balance,\
        call."clientId"')
  }


 async getOperatorAnal(startDay: string, endDay: string) {
    return this.dataSource.query('SELECT \
      us.id, us.login, \
      us."FIO", us.balance, \
      operator.percent, operator.price, \
      SUM(call.duration), count(call.duration) as callcount, \
      SUM(call."companyCost") as profitCompany,\
      sum(traffic.duration) as allTraffic, MAX(traffic."createdAt"),\
      count(favorite.id) as favcount\
      FROM (SELECT * FROM public."user" WHERE role = \'OPERATOR\') \
      as us \
      LEFT JOIN operator ON operator."userId" = us.id\
      LEFT JOIN call ON call."clientId" = us.id AND call.duration > 5 AND call."createdAt" BETWEEN \''+startDay+'\' AND \''+endDay+'\'\
      LEFT JOIN favorite ON favorite."operatorId" = us.id\
      LEFT JOIN traffic ON traffic."userId" = us.id AND traffic."createdAt" BETWEEN \''+startDay+'\' AND \''+endDay+'\'\
      GROUP BY us.id, us.login, us."FIO", us.balance, operator.percent, operator.price')
 }


}