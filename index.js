import { el, apply } from 'el_';
import { createStore } from 'redux';
import * as actions from './actions';
import reducer from './reducer';

const store = createStore(reducer);

const FILTER_ALL = 'all';
const FILTER_DONE = 'done';
const FILTER_UNDONE = 'undone';

function renderFlter () {
  return apply(el(`
    <ul>
      <li><a data-all-btn href="#${FILTER_ALL}">All</a></li>
      <li><a data-done-btn href="#${FILTER_DONE}">Done</a></li>
      <li><a data-undone-btn href="#${FILTER_UNDONE}">Undone</a></li>
    </ul>
  `), {
    '[data-all-btn]': (el) => el.onclick = (event) => {
      store.dispatch(actions.filter(FILTER_ALL));
    },
    '[data-done-btn]': (el) => el.onclick = (event) => {
      store.dispatch(actions.filter(FILTER_DONE));
    },
    '[data-undone-btn]': (el) => el.onclick = (event) => {
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
  `), {
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
  return el(tasks.map((task, index) => {
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
  }).filter((task) => task!==null));
}

function renderForm () {
  return apply(el(`
    <form data-form>
      <input data-query type="text" name="query" />
    </form>
  `), {
    '[data-form]': (el) => el.onsubmit = (event) => {
      event.preventDefault();
      let queryEl = el.querySelector('input[name="query"]');
      store.dispatch(actions.add({
        title: queryEl.value,
        done: false
      }));
      queryEl.value = '';
    }
  });
}

function renderApp (rootEl, data) {
  return apply(rootEl, {
    '#app': el(`
      <div data-form></div>
      <nav data-filter></nav>
      <ul data-tasks></ul>
    `),
    '[data-filter]': renderFlter(data.filter),
    '[data-tasks]':  renderTasks(data.tasks, data.filter),
    '[data-form]':   renderForm(),
    '[data-form] [data-query]': (el) => {
      el.focus();
    }
  });
}

function main () {
  store.subscribe(() => renderApp(document.body, store.getState()));
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
