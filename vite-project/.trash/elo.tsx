import { extractCharacters } from './read_data.tsx';
import * as path from 'path';

class Ranking {
    private characterList: Character[];
    private currentPool: Character[];
    private eliminated: Character[];
    private foundFavorites: Character[];

    /**
     * A few notes on this.
    /** foundFavorites + currentPool = characterList;     */
    /**
     */

    function pick_two(): [character, character] {
        const shuffled = [...this.characterList]; 

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return [shuffled[0], shuffled[1]];
    }

    function filter(
        callback: (char: Character) => boolean = char => char.gender === "Female"
        )
    {
        return this.characterList.filter(callback);
    }

    function setFilterToPool(
        callback: (char: Character) => boolean = char => char.gender === "Female"
        )
    {
        this.characterList = filter(callback)
    }
}



export function display() {
    let characterList = extractCharacters("../public/art");
    characterList = filter(characterList);
    const [charA, charB] = pick_two(characterList);
    return [charA, charB];
}


    // let randomA = keys[Math.floor(Math.random() * keys.length)];
    // let randomB = keys[Math.floor(Math.random() * keys.length)];
