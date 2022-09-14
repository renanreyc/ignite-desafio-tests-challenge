import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';
import { CreateUserError } from "./CreateUserError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase

describe("Create User", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to create a new user", async () => {
        const user = {
            name: "name Test",
            email: "emailTest@test.com",
            password: "password Test"
        };

        await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
        });

        const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

        expect(userCreated).toHaveProperty("id") ;
        expect(userCreated?.email).toBe(user.email);
    });

    it("should not be able to create a new user with email already exists", async () => {
        expect(async() => {
            const user = {
                name: "name Test",
                email: "emailTest@test.com",
                password: "password Test"
            };
            
            
            await createUserUseCase.execute({
                name: user.name,
                email: user.email,
                password: user.password
            });
                
            await createUserUseCase.execute({
                name: user.name,
                email: user.email,
                password: user.password
            });
        }).rejects.toBeInstanceOf(CreateUserError)
    })
});
