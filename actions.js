export const INIT = 'init';
export const ADD = 'add';
export const REMOVE = 'remove';
export const DONE = 'done';
export const FILTER = 'filter';
export const CLEAR_COMPLETED = 'clear_completed';
export const TOGGLE_EDIT = 'toggle_edit';
export const UPDATE = 'update';
export const TOGGLE_ALL_COMPLETED = 'toggle_all_completed';
export const STOP_EDITING = 'stop_editing';

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

export function clearCompleted () {
  return {
    type: CLEAR_COMPLETED
  };
}

export function toggleEdit (index, edit) {
  return {
    type: TOGGLE_EDIT,
    index,
    edit
  };
}

export function update (index, title) {
  return {
    type: UPDATE,
    index,
    title
  };
}

export function toggleAllCompleted () {
  return {
    type: TOGGLE_ALL_COMPLETED
  };
}

