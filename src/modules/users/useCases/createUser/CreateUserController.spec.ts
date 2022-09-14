import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;
describe('Create user controller', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create a new user", async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .send({
                name: 'user test',
                email: 'user@mail.com',
                password: '123456'
            });
  
      expect(response.status).toBe(201);
    });
});