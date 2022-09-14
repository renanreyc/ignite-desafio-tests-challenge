import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;


describe('Get statement operation', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('should be able to get a statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'name test',
      email: 'mail@mail.com',
      password: 'password'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'test'
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id!, statement_id: statement.id!
    });

    expect(operation).toHaveProperty('id');
    expect(operation.amount).toEqual(100);
    expect(operation.type).toEqual('deposit');
  });

  it('should be able to get a values deposit equal to expected', async () => {
    const valueExpected = 100;

    const user = await createUserUseCase.execute({
      name: 'name test',
      email: 'mail@mail.com',
      password: 'password'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: valueExpected,
      description: 'test'
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id!, statement_id: statement.id!
    });

    expect(operation.amount).toEqual(valueExpected);    
  });

  it('should be able to get a type deposit equal to expected', async () => {
    const typeExpected = OperationType.DEPOSIT

    const user = await createUserUseCase.execute({
      name: 'name test',
      email: 'mail@mail.com',
      password: 'password'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: typeExpected,
      amount: 100,
      description: 'test'
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id!, statement_id: statement.id!
    });

    expect(operation.type).toEqual(typeExpected); 
  });

  it("should not be able to get statement operation if the user not exist", () => {
    expect(async () => {
        await getStatementOperationUseCase.execute({
          user_id: "user invalided", 
          statement_id: "statement"
        });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get statement operation if the statement not exist", () => {
    expect(async () => {

        const user = await createUserUseCase.execute({
          name: 'name test',
          email: 'mail@mail.com',
          password: 'password'
        });

        await getStatementOperationUseCase.execute({
          user_id: user.id!, 
          statement_id: "statement invalided"
        });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  }) 
});
