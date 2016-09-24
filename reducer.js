import * as actions from './actions';

const DEFAULT_STATE = {
  filter: null,
  tasks: []
};

export default function (state=DEFAULT_STATE, action) {
  switch (action.type) {
    case actions.INIT:
      return action.state;
    case actions.ADD:
      action.task.editing = action.task.editing || false;
      action.task.done = action.task.done || false;
      state.tasks.push(action.task);
      return state;
    case actions.REMOVE:
      state.tasks.splice(action.index, 1);
      return state;
    case actions.DONE:
      state.tasks[action.index].done = action.isDone;
      return state;
    case actions.FILTER:
      state.filter = action.filter;
      return state;
    case actions.CLEAR_COMPLETED:
      state.tasks = state.tasks.filter((task) => !task.done);
      return state;
    case actions.EDIT:
      state.tasks[action.index].editing = true;
      return state;
    case actions.UPDATE:
      state.tasks[action.index].title = action.title;
      state.tasks[action.index].editing = false;
      return state;
    case actions.TOGGLE_ALL_COMPLETED:
      state.tasks = state.tasks.map((task) => { task.done = true; return task; })
      return state;
  }
  return state;
};
