import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';


let connection: Connection;
describe('Get Statement Operation Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to get a statement operation', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'user test',
        email: 'user@mail.com',
        password: '123'
      });

    const session = await request(app).post('/api/v1/sessions').send({
      email: 'user@mail.com',
      password: '123'
    });

    const statement = await request(app).post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: 'deposit test'
      })
      .set({ authorization: `Bearer ${session.body.token}`, })

    const response = await request(app)
      .get(`/api/v1/statements/${statement.body.id}`)
      .set({ authorization: `Bearer ${session.body.token}`, });

    expect(response.status).toEqual(200);
    expect(response.body.user_id).toEqual(session.body.user.id);
    expect(response.body.statement_id).toEqual(statement.body.statement_id);
  });
});