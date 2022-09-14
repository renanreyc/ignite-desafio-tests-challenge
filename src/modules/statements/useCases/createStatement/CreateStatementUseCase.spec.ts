import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Create a new Statement", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );
    })

    it("should be able to create a statement deposit", async () => {
        const user: ICreateUserDTO =  {
            name: "name Test",
            email: "emailTest@test.com",
            password: "password Test"
        };

        const userCreated = await createUserUseCase.execute(user);

        const statement = await createStatementUseCase.execute({
            user_id: userCreated.id!,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "deposit description test"
        });

        expect(statement).toHaveProperty("id");
    });

    it("should be able to create a statement withdraw", async () => {
        const user: ICreateUserDTO =  {
            name: "name Test",
            email: "emailTest@test.com",
            password: "password Test"
        };

        const userCreated = await createUserUseCase.execute(user);

        const statement = await createStatementUseCase.execute({
            user_id: userCreated.id!,
            type: OperationType.WITHDRAW,
            amount: 0,
            description: "withdraw description test"
        });    

        expect(statement).toHaveProperty("id");
    });

    it("should be not able to create a statement withdraw without balance", () => {
        expect(async () => {
            const user: ICreateUserDTO =  {
                name: "name Test",
                email: "emailTest@test.com",
                password: "password Test"
            };
    
            const userCreated = await createUserUseCase.execute(user);
    
            const statement = await createStatementUseCase.execute({
                user_id: userCreated.id!,
                type: OperationType.WITHDRAW,
                amount: 100,
                description: "withdraw description test"
            });    
    
            expect(statement).toHaveProperty("id");
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    });
});
