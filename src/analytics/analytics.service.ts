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

 async getTrafficAnal(startDay: string, role: string) {
    return this.dataSource.query('SELECT f.alluser, p.tim\
    FROM (\
      SELECT \
        date_trunc(\'hour\',traffic."createdAt")::time \
        AS time, count(traffic."userId") as allUser \
      FROM traffic, public."user" as u \
      WHERE  \
      u.id = traffic."userId" AND \
		  u.role = \''+role+'\' AND \
      traffic."createdAt"::date = \''+startDay+'\' \
      GROUP BY 1 ) as f \
    RIGHT JOIN  \
      (SELECT date_trunc(\'hour\', hh):: time as tim \
    FROM generate_series \
            ( \'2023-02-01 00:00:00.0000\'::timestamp \
            , \'2023-02-01 23:00:00.00000\'::timestamp \
            , \'1 hour\'::interval) hh \
            ) as p ON p.tim = f.time')
 }

 async getOperatorStat(operatorId: number) {
    const avgRaitConst = await this.avgRaiting(operatorId);
    const favoriteCountConst = await this.favoriteCount(operatorId);
    const callForTodayCount = await this.callForToday(operatorId);
    const callForWeekConst = await this.callForWeek(operatorId);
    const callForMonthConst = await this.callForMonth(operatorId);
    const moneyConst = await this.getMoney(operatorId);
    
    console.log('avgRaitConst', avgRaitConst);
    console.log('favoriteCountConst', favoriteCountConst);
    console.log('callForTodayCount', callForTodayCount);
    console.log('callForWeekConst', callForWeekConst);
    console.log('callForMonthConst', callForMonthConst);
    console.log('moneyConst', moneyConst);

    const data = {
      avgRaitConst: Math.floor(avgRaitConst[0].avg*100)/100,
      favoriteCountConst: favoriteCountConst[0].count,
      callForTodayCount: callForTodayCount[0].count,
      callForWeekConst: callForWeekConst[0].count,
      callForMonthConst: callForMonthConst[0].count,
      moneyConst: moneyConst[0].sum,
    };

    return data;

 }

 async avgRaiting(operatorId: number) {
  return this.dataSource.query(
    'SELECT AVG(review."grade") FROM review \
     WHERE review."operatorId" = ' + operatorId
  );
 }

 async favoriteCount(operatorId: number) {
  return this.dataSource.query(
  'SELECT count(*) FROM favorite' +
  ' WHERE favorite."operatorId" =' + operatorId
  );

 }

 async callForToday(operatorId: number) {
  return this.dataSource.query(
    'SELECT count(*) FROM call \
      WHERE call."createdAt" >= date_trunc(\'day\',current_timestamp - interval \'1 day\') \
      AND call."createdAt" <  date_trunc(\'day\',current_timestamp) + interval \'1 day\' \
      AND call."operatorId" = ' + operatorId 
  );
 }

 async callForWeek(operatorId: number) {
  return this.dataSource.query(
    'SELECT count(*) FROM call \
      WHERE call."createdAt" >= date_trunc(\'day\',current_timestamp - interval \'7 day\') \
      AND call."createdAt" <  date_trunc(\'day\',current_timestamp) + interval \'1 day\' \
      AND call."operatorId" = ' + operatorId 
  );
 }

 async callForMonth(operatorId: number) {
  return this.dataSource.query(
    'SELECT count(*) FROM call \
      WHERE call."createdAt" >= date_trunc(\'day\',current_timestamp - interval \'30 day\') \
      AND call."createdAt" <  date_trunc(\'day\',current_timestamp) + interval \'1 day\'\
      AND call."operatorId" = ' + operatorId 
  );
 }

 async getMoney(operatorId: number) {
    return this.dataSource.query(
      'SELECT SUM(call."cost") FROM call' + 
      ' WHERE call."operatorId" = ' + operatorId
    );
 }

}