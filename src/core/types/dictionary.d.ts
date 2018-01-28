export type NestedDictionary = {
    _id: string;
    [other: string]: string | NestedDictionary
}
export type Dictionary = {
    [key: string]: string | NestedDictionary;
}