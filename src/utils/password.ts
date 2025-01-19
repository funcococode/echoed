import {compareSync, genSaltSync, hashSync} from 'bcryptjs';

export function saltAndHashPassword(password: string){
    const saltRounds = 10;
    let hash = null;
    if(password){
        const salt = genSaltSync(saltRounds);
        hash = hashSync(password, salt);
    }

    return hash;+
}

export function comparePassword(password: string, hash: string){
    const result = compareSync(password, hash)
    return result;
}