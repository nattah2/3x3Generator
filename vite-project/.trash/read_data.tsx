// const directoryPath = '../public/'; // Replace with your directory path


import      metadata from './manifest.json'; 
import      { Gender, Path } from './type.ts'
import type { Character } from './type.ts'


export function extractCharacters(directory: string) {
    /* TODO This is probably bad, since it doesn't automatically reflect
    /* what's inside the JSON file. Fix please. */
    const correctMetadata = Object.entries(metadata).map(([key, val]) =>
    { 
        return {
            name         : key,
            elo          : 1000,
            gender       : val.gender,
            path         : val.path,
            images       : [val.defaultImage, ...val.images]
        }
    }
    );
    return correctMetadata;
}


            // defaultImage : val.defaultImage
