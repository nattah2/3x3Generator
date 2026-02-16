export enum Gender {
    Male,
    Female
};

export enum Path {
    Destruction,
    Hunt,
    Erudition,
    Harmony,
    Nihility,
    Preservation,
    Abundance,
    Rememberance
};

export type character = {
    name   : string;
    gender : Gender;    
    path   : Path;
    images : String[]
};
