import { nanoid } from 'nanoid';
import * as _ from 'lodash';
export function randomIdProfanityFilter() {
    let id;
    let result = -1;
    let profanity: any;
    do {
        id = randomId();
        result = _.findIndex(profanity, o => id.includes(o));
    } while (result !== -1);

    return id;
}

export function randomId() {
    return nanoid();
}