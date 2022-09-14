import { app } from '../../../../app';
import request from 'supertest';
import createConnection from '../../../../database';
import { Connection } from 'typeorm';

let connection: Connection;
describe('Show User Profile Controller', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should be able to show an user profile', async () => {
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

        const profile = await request(app).get('/api/v1/profile').set({
        authorization: `Bearer ${session.body.token}`,
        });

        expect(profile.status).toBe(200);
        expect(profile.body.name).toBe('user test');
    });
});