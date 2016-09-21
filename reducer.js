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
  }
  return state;
};
