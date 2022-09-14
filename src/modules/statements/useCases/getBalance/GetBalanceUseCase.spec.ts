import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get a Balance", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );
        getBalanceUseCase = new GetBalanceUseCase(
            inMemoryStatementsRepository,
            inMemoryUsersRepository,
        )
    })

    it("should be able to get a balance", async () => {
        const user: ICreateUserDTO =  {
            name: "name Test",
            email: "emailTest@test.com",
            password: "password Test"
        };

        const userCreated = await createUserUseCase.execute(user);

        const balance = await getBalanceUseCase.execute({
            user_id: userCreated.id!
        });

        expect(balance).toHaveProperty("statement");
    });

    
    it("should be able to get a statement array length expected", async () => {
        const user: ICreateUserDTO =  {
            name: "name Test",
            email: "emailTest@test.com",
            password: "password Test"
        };

        const userCreated = await createUserUseCase.execute(user);
        const statementArrayLength = 3

        for(let i = 0; i < statementArrayLength; i++) {
            await createStatementUseCase.execute({
                user_id: userCreated.id!,
                type: OperationType.DEPOSIT,
                amount: i,
                description: "deposit description test"
            });
        }

        const balance = await getBalanceUseCase.execute({
            user_id: userCreated.id!
        });

        expect(balance.statement.length).toEqual(statementArrayLength);
    });

    it("should be able to get a balance the values expected", async () => {
        const expectedValue = 30;

        const user: ICreateUserDTO =  {
            name: "name Test",
            email: "emailTest@test.com",
            password: "password Test"
        };

        const userCreated = await createUserUseCase.execute(user);

        await createStatementUseCase.execute({
            user_id: userCreated.id!,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "deposit description test"
        });

        await createStatementUseCase.execute({
            user_id: userCreated.id!,
            type: OperationType.WITHDRAW,
            amount: 70,
            description: "withdraw description test"
        });

        const balance = await getBalanceUseCase.execute({
            user_id: userCreated.id!
        });

        expect(balance.balance).toBe(expectedValue);
    });

    it("should not be able to get balance if the user not exist", () => {
        expect(async () => {
            await getBalanceUseCase.execute({
                user_id: "id user invalided"
            });
        }).rejects.toBeInstanceOf(GetBalanceError);
    }) 


});
