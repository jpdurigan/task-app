import { type } from "os";

// COMMON DECLATIONS
let name: string = "João";
let age: number;
let isStudent: boolean;

// ARRAYS AND TUPLES
let hobbies: string[];
let role: [number, string]; // declaring tuples

// OBJECTS
// as TYPE
type Person1 = {
    name: string;
    age?: number; // ?: makes property optional
};

let person1: Person1 = {name: "Jojo", age: 25}
let person11: Person1 = {name: "Jojo"} // this is allowed
// let person12: Person = {age: 25} // this is not
let personArray: Person1[];

type Worker1 = Person1 & {
    profession: string;
}

// as INTERFACE
interface Person2 {
    name: string;
    age?: number;
}

let person2: Person2 = {name: "Jojo", age: 25}

interface Worker2 extends Person2 {
    profession: string;
}

// UNION TYPE
let unionType: string | number; // accepts both types
unionType = "oi";
unionType = 23;

// FUNCTIONS
let printNameType1: Function;
let printNameType2: (name: string) => void;
function printName1(name: string): void {
    console.log(name);
}
const printName2 = (name: string): void => {
    console.log(name);
}

let variable: any; // accepts anything
let variable2: unknown;
// void functions returns undefined
// never functions don't return (infinite loops or error throw)

export {};