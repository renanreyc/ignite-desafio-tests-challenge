import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    });

    it("should be abe show a user", async () => {
        const user: ICreateUserDTO =  {
            name: "name Test",
            email: "emailTest@test.com",
            password: "password Test"
        };

        const userCreated = await createUserUseCase.execute(user);

        const userShowed = await showUserProfileUseCase.execute(userCreated.id!);

        expect(userShowed.email).toBe(user.email);
    });

    it("should be not show a user with id invalided", () => {
        expect(async () => {
            
            await showUserProfileUseCase.execute("id user invalided");

        }).rejects.toBeInstanceOf(ShowUserProfileError)
    });
});