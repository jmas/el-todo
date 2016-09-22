import { el, apply, refresh } from 'el_';
import { createStore } from 'redux';
import * as actions from './actions';
import reducer from './reducer';
import diff from 'deep-diff';
import clone from 'clone';

const store = createStore(reducer);

const FILTER_ALL = 'all';
const FILTER_DONE = 'done';
const FILTER_UNDONE = 'undone';

function renderFlter () {
  return apply(`
    <ul>
      <li><a data-all-btn href="#${FILTER_ALL}">All</a></li>
      <li><a data-done-btn href="#${FILTER_DONE}">Done</a></li>
      <li><a data-undone-btn href="#${FILTER_UNDONE}">Undone</a></li>
    </ul>
  `, {
    '[data-all-btn]': (el) => el.onclick = (event) => {
      event.preventDefault();
      store.dispatch(actions.filter(FILTER_ALL));
    },
    '[data-done-btn]': (el) => el.onclick = (event) => {
      event.preventDefault();
      store.dispatch(actions.filter(FILTER_DONE));
    },
    '[data-undone-btn]': (el) => el.onclick = (event) => {
      event.preventDefault();
      store.dispatch(actions.filter(FILTER_UNDONE));
    }
  });
}

function renderTask (task, index) {
  return apply(el(`
    <li>
      <label>
        <input data-task-done type="checkbox" name="tasks[]" />
        <span data-task-title></span>
        <button data-task-remove>&times;</button>
      </label>
    </li>
  `, { className: 'task' }), {
    '[data-task-title]': task.title,
    '[data-task-done]': (el) => {
      el.onclick = (event) => {
        store.dispatch(actions.done(index, el.checked));
      };
      el.checked = task.done;
    },
    '[data-task-remove]': (el) => el.onclick = (event) => {
      event.preventDefault();
      store.dispatch(actions.remove(index));
    }
  });
}

function renderTasks (tasks, filter) {
  let filteredTasks = tasks.map((task, index) => {
    switch (filter) {
      case FILTER_DONE:
        if (task.done!==true) {
          return null;
        }
        break;
      case FILTER_UNDONE:
        if (task.done===true) {
          return null;
        }
        break;
    }
    return renderTask(task, index);
  }).filter((task) => task!==null);
  if (filteredTasks.length===0) {
    return el(`<p>Empty.</p>`);
  }
  return el(filteredTasks);
}

function renderForm () {
  return apply(`
    <form data-form>
      <input data-query type="text" name="query" />
      <input type="submit" />
    </form>
  `, {
    '[data-form]': (el) => el.onsubmit = (event) => {
      event.preventDefault();
      let queryEl = el.querySelector('input[name="query"]');
      store.dispatch(actions.add({
        title: queryEl.value,
        done: false
      }));
      queryEl.value = '';
      queryEl.focus();
    },
    '[data-query]': (el) => {
      el.focus();
    }
  });
}

function link (fn, paramNames, store) {
  let state = clone(store.getState());
  let el = fn.apply(null, paramNames.map((paramName) => state[paramName]));
  store.subscribe(() => {
    let newState = store.getState();
    let diffs = diff(state, newState);
    if (!diffs) {
      return;
    }
    if (diffs.some((d) => paramNames.indexOf(d.path[0])!==-1)) {
      refresh(el, fn.apply(null, paramNames.map((paramName) => newState[paramName])));
    }
    state = clone(newState);
  });
  return el;
}

function renderApp (rootEl, data) {
  return apply(rootEl, {
    '#app': `
      <div data-form></div>
      <nav data-filter></nav>
      <ul data-tasks></ul>
    `,
    '[data-filter]': link(renderFlter, ['filter'], store),
    '[data-tasks]':  link(renderTasks, ['tasks', 'filter'], store),
    '[data-form]':   renderForm()
  });
}

function main () {
  renderApp(document.body, store.getState());
  store.dispatch(actions.init({
    filter: location.hash.substring(1) || FILTER_ALL,
    tasks: [
      {
        title: 'Make an app',
        done: true
      },
      {
        title: 'Publish to github',
        done: false
      },
      {
        title: 'Make another app',
        done: false
      }
    ]
  }));
}

main();
