// any and as
const CONSTANT_NAME = 'John Doe' as string

// Use of Enums
enum Status {
  Active = 'active',
  Inactive = 'inactive'
}

const firstStatus = Status.Active
console.log(`Result 1: ${firstStatus}`);
const secondStatus = Status.Inactive
console.log(`Result 2: ${secondStatus}`);

// interface
interface Contact {
  id: number;
  name: string;
  address?: string;
}
interface Profile {
  name: string;
  age: number;
}
interface Product {
  id: number;
  name: string;
  clone(name: string): void; 
  clone_alt: (name: string) => void; 
  clone_optional?(name: string): void; 
}
type Clone = (name: string) => Contact; 

const clone =  (source: string, func: Clone): Contact => {
  const response = func(source)
  return response
}
const func = (str: string): Contact => {
  return {id: 1, name:str}
}
const clone_result = clone('Joh Doe', func)
console.log(`Result 3: ${JSON.stringify(clone_result, null, 2)}`);

// discriminated unions
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };

const shape1: Shape = {kind: "circle", radius: 10}
const shape2: Shape = {kind: "square", x: 10}
const shape3: Shape = {kind: "triangle", x: 10, y: 10}

// interface with dynamic keys
interface Counter {
  [key: string]: number
}

// Generics VER 1
const clone_generics =  <T>(source: string, func: (str: string) => T): T => {
  const response = func(source)
  return response
}

const func_generics = (str: string): Profile => {
  return {age: 2, name:str}
}
const clone_generics_result = clone_generics<Profile>('Mary Jane', func_generics)
console.log(`Result 4: ${JSON.stringify(clone_generics_result, null, 2)}`);

// Generics VER 2 with constraint (i.e. T2 extends Contact)
const clone_generics_ver2 =  <T1, T2 extends Contact>(source: T1, func: (str: T1) => T2): T2 => {
  const response = func(source)
  return response
}

const func_generics_ver2 = (str: string): Contact => {
  return {id: 3, name:str}
}
const clone_generics_result_ver2 = clone_generics_ver2<string, Contact>('Mary Jane', func_generics_ver2)
console.log(`Result 4: ${JSON.stringify(clone_generics_result, null, 2)}`);

// Extend types ver 1
interface UserProfileContact1 extends Profile, Contact {}
const testUser1: UserProfileContact1 = {
  id: 5,
  name: 'Joh Doe',
  age: 33
}

// Extend types ver 2
type UserProfileContact2 = Profile & Contact
const testUser2: UserProfileContact2 = {
  id: 5,
  name: 'Joh Doe',
  age: 33
}

// keyof
type ContactField = keyof Contact
const testKeyField: ContactField = "name"

function getValue<T, U extends keyof T>(source: T, propertyName: U) {
  return source[propertyName];
}
const testKeyValue = getValue(testUser1, "name")

// typeof
const myType = {min: 100, max:300}
function save(source: typeof myType): string {
  // I/O operations
  return 'Data is saved!'
}
const myTypeResult = save({min:10, max:20})


// index type
type CloneOpt = Product["clone_optional"]

// extend specific type
const testUsers: UserProfileContact1[] = [
  {
  id: 5,
  name: 'Joh Doe',
  age: 33
  },
  {
  id: 6,
  name: 'Joh Doe',
  age: 33
  },
  {
  id: 7,
  name: 'Joh Doe',
  age: 33
  },
]
function getNextId<T1 extends {id: number}>(items: T1[]): number{
  return items.reduce((max, x) => x.id > max ? max : x.id, 0) + 1
}
const testUserId = getNextId(testUsers)

// Record string
let recordTyped: Record<string, string> 
recordTyped = {name: 'John Doe'}
// recordTyped = {name: 123} // Error out as record is typed to have string key, and value

// Record string using keyof. note with keyof, all fields in `Contact` must be present in the derived variable
let recordTypedAlt: Record<keyof Contact, string | number> 
recordTypedAlt = {id: 8, name: 'John Doe', address: 'Cabra'}

// Derived type ===> partial helper
let recordTypedAltPartial: Partial<Record<keyof Contact, string | number>>
recordTypedAltPartial = {name: 'John Doe'}

// Derived type ===> omit helper
type RecordOmitType = Omit<Partial<Record<keyof Contact, string | number>>, "name">
let recordTypedAltOmit: RecordOmitType
recordTypedAltOmit = {id: 9}

// Derived type ===> pick helper
type RecordPickType = Partial<
      Pick<
        Record<keyof Contact, string | number>
        , 'id' | 'address'
        >
      >
let recordTypedAltPick: RecordPickType
recordTypedAltPick = {address: 'John Doe'}

// Derived type ===> omit helper
type RecordRequiredType = Required<Contact>
let recordTypedAltRequired: RecordRequiredType
recordTypedAltRequired = {
  id: 9,
  name: 'John Doe',
  address: 'Cabra'  // No longer optional
}

// mapped indexer
interface Query<TProp> {
  sort?: 'asc' | 'desc';
  matches(val: TProp): boolean;
}
type ContactQuery = {
  [TProp in keyof Contact]?: Query<Contact[TProp]>
}

// decorator
// method decorator: logs values and operation within method
function methodDecorator(...args: number[]) {
  console.log("methodDecorator(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const wrapped = descriptor.value

    descriptor.value = function() {
      const values = [...arguments, ...args]
      const result = wrapped.apply(this, values)
      console.log('+++++++++++++++++++')
      console.log(`count value is: ${values.length}`)
      console.log(`${propertyKey.split('V')[0].slice(3)} value is: ${result}`) // hacky way to filter our mean/mode from getxxxxValue
      console.log('+++++++++++++++++++')
      return result
    }

    console.log("methodDecorator(): called");
  };
}

// class decorator: Freezes class's constructor
function classDecorator(constructor: Function) {
  Object.freeze(constructor)
  Object.freeze(constructor.prototype)
}

// class decorator: Performs more powerful modification/extension of class
function classDecoratorDynamic<T extends { new(...args: any[]): {} } >(constructor: T) {
  return class ClassDecoratorDynamic extends constructor {
    static _instance: null | ClassDecoratorDynamic = null 

    constructor(...args: any[]) {
      super(...args);
      if (ClassDecoratorDynamic._instance) throw Error("Duplicate Instance")
      else ClassDecoratorDynamic._instance = this
      
    }
  }
}

// property decorator: logs modification of assigned property
/**
 * target property being decorated
 * name of property
 */
// function propertyDecorator(target: Record<keyof ModeValue | string, unknown>, key: keyof ModeValue | string) {
function propertyDecorator<T extends object, U extends keyof T>(target: T, key: U ) {
  // get the initial value, before the decorator is applied
  let val = target[key];
  // let val = typeof key === 'string' ? target[key.toString()] : target[key];

  // then overwrite the property with a custom getter and setter
  Object.defineProperty(target, key, {
      get: () => val,
      set: (newVal) => {
        console.log('##########################');
        console.log(`${key.toString()} changed: `, newVal);
        console.log('##########################');
        val = newVal;
      },
      enumerable: true,
      configurable: true
  })
}

/**
 * Test Class 1
 */
class MeanValue {
  @methodDecorator(14,17,19)
  getMeanValue(...args: Array<number>): number | undefined {
    if(!Array.isArray(args)) return
  
    let count = 0
    const sum = args.reduce((previousValue, currentValue) => {
      if (typeof currentValue !== 'number') return previousValue
      previousValue = Number(previousValue) + Number(currentValue)
      count += 1
      return previousValue
    },0)
    const mean = count ? sum/count : undefined
    return mean
  }
}
const meanValueInstance = new MeanValue()
const meanValue = meanValueInstance.getMeanValue(1,2,3,4,5,6,10)

/**
 * Test Class 2
 */
@classDecoratorDynamic
@classDecorator
class ModeValue {
  @propertyDecorator
  static count: number = 0

  values: number[] = [1,2,3,4,5,6] // class instance variables type definition
  private suburb: string = 'Pacific Ocean' // fields only available within class
  static city: string = 'Indian Ocean' // static properties, available only on class, not instance


  constructor(values: number[]) {
    this.values = values
  }

  @methodDecorator()
  getModeValue(...args: Array<number | string>) {
    if(!Array.isArray(args)) return
  
    let countObject: Counter = {}
    args.forEach(currentValue => {
      if (countObject[currentValue]) countObject[currentValue] += 1
      else countObject[currentValue] = 1
    })
    ModeValue.count += 1
    const maxValue = Object.entries(countObject).sort((x, y) => y[1] - x[1])[0]
    return maxValue ? maxValue[0] :  undefined
  }

  // getter
  getValues() {
    return this.values
  }

  // setter
  setValues(...args: number[]) {
    this.values = [...this.values, ...args]
  }
}

const modeValueInstance: ModeValue  = new ModeValue([1,2,3,3,5,5,5,8])
const modeValue = modeValueInstance.getModeValue(1,2,3,3,5,5,5,8)
// const modeValueInstance2: ModeValue  = new ModeValue([1,2,3,3,5,5,5,8]) // duplicate instance to trigger error