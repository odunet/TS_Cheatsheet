/**
 * Misc
 */

// Set 1
enum Status {
  inProgress = 'in-progress',
  todo = 'todo'
}
type TodoDate = Date | number | string
interface Todo {
  id: number;
  title: string;
  status: string;
  completedOn?: TodoDate;
}
const todoItems: Todo[] = [
  { id: 1, title: "Learn HTML", status: "done", completedOn: new Date("2021-09-11") },
  { id: 2, title: "Learn TypeScript", status: Status.inProgress },
  { id: 3, title: "Write the best app in the world", status: Status.todo },
]

function addTodoItem(todo: string): Todo {
  const id = getNextID<Todo>(todoItems)

  const newTodo: Todo = {
      id,
      title: todo,
      status: Status.todo,
  }

  todoItems.push(newTodo)

  return newTodo
}

function getNextID<T1 extends {id: number}>(items: T1[]): number{
  return items.reduce((max, x) => x.id > max ? max : x.id, 0) + 1
}

const newTodo = addTodoItem("Buy lots of stuff with all the money we make from the app")

console.log(JSON.stringify(newTodo))

// Set 2
type ExerQuery = {
  [TProp in keyof Contact]?: Query<Contact[TProp]>
}

function query<T>(
  items: T[],
  query:  {
    [TProp in keyof T]?: (name: T[TProp]) => boolean
  }
) {
  return items.filter(item => {
      // iterate through each of the item's properties
      for (const property of Object.keys(item) as (keyof T)[]) {

          // get the query for this property name
          const propertyQuery = query[property]

          // see if this property value matches the query
          if (propertyQuery && propertyQuery(item[property])) {
              return true
          }
      }

      // nothing matched so return false
      return false
  })
}

const matches = query([
      { name: "Ted", age: 12 },
      { name: "Angie", age: 31 }
  ],
  {
      name: name => name === "Angie",
      age: age => age > 30
  })
