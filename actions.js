export const INIT = 'init';
export const ADD = 'add';
export const REMOVE = 'remove';
export const DONE = 'done';
export const FILTER = 'filter';

export function init (state) {
  return {
    type: INIT,
    state
  };
}

export function add (task) {
  return {
    type: ADD,
    task
  };
}

export function remove (index) {
  return {
    type: REMOVE,
    index
  };
}

export function done (index, isDone) {
  return {
    type: DONE,
    index,
    isDone
  };
}

export function filter (filter) {
  return {
    type: FILTER,
    filter
  };
}
