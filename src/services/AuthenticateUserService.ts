import UserRepository from "../repositories/UserRepository";

export default class AuthenticateUserService {
    private userRepository: UserRepository;

    constructor(repository: UserRepository){
        this.userRepository = repository;
    }

    public async execute(scheme: string, token: string){
        /*if(!/^Bearer$/i.test(scheme)){
            return res.status(401).send({ error: 'Token malformatted'});
        }

        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if(err) {
                return res.status(401).send({error: 'Token invalid'});
            }

            req.userId = decoded.id;
            return next();
        });*/
    }
}