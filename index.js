import { $el } from 'el_';
import { createStore } from 'redux';
import * as actions from './actions';
import reducer from './reducer';

const store = createStore(reducer);

const FILTER_ALL = 'all';
const FILTER_DONE = 'done';
const FILTER_UNDONE = 'undone';

function renderFlter () {
  return $el(`
    <ul>
      <li><a data-all-btn href="#${FILTER_ALL}">All</a></li>
      <li><a data-done-btn href="#${FILTER_DONE}">Done</a></li>
      <li><a data-undone-btn href="#${FILTER_UNDONE}">Undone</a></li>
    </ul>
  `, {
    'onclick [data-all-btn]': (el, event) => {
      event.preventDefault();
      store.dispatch(actions.filter(FILTER_ALL));
    },
    'onclick [data-done-btn]': (el, event) => {
      event.preventDefault();
      store.dispatch(actions.filter(FILTER_DONE));
    },
    'onclick [data-undone-btn]': (el, event) => {
      event.preventDefault();
      store.dispatch(actions.filter(FILTER_UNDONE));
    }
  });
}

function renderTask (task, index) {
  return $el(`
    <label>
      <input data-task-done type="checkbox" name="tasks[]" />
      <span data-task-title></span>
      <button data-task-remove>&times;</button>
    </label>
  `, {
    'className': 'task',
    'find [data-task-title]': task.title,
    'find [data-task-done]': (el) => {
      el.onclick = (event) => store.dispatch(actions.done(index, el.checked));
      el.checked = task.done;
    },
    'onclick [data-task-remove]': (el, event) => {
      event.preventDefault();
      store.dispatch(actions.remove(index));
    }
  }, 'li');
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
    return $el(`<p>Empty.</p>`);
  }
  return $el(filteredTasks, null, 'ul');
}

function renderForm () {
  return $el(`
    <form data-form>
      <input data-query type="text" name="query" />
      <input type="submit" />
    </form>
  `, {
    'onsubmit [data-form]': (el, event) => {
      event.preventDefault();
      let queryEl = el.querySelector('input[name="query"]');
      store.dispatch(actions.add({
        title: queryEl.value,
        done: false
      }));
      queryEl.value = '';
      queryEl.focus();
    },
    'find [data-query]': (el) => {
      el.focus();
    }
  });
}

function watch (store, fn) {
  let el = fn(store.getState());
  store.subscribe(() => {
    el.innerHTML = '';
    el.appendChild(fn(store.getState()));
  });
  return el;
}

function renderApp (store) {
  return $el(`
      <div data-form></div>
      <nav data-filter></nav>
      <div data-tasks></div>
    `, {
    'find [data-filter]': watch(store, (state) => renderFlter(state.filter)),
    'find [data-tasks]':  watch(store, (state) => renderTasks(state.tasks, state.filter)),
    'find [data-form]':   renderForm()
  });
}

function main () {
  document.getElementById('app').appendChild(renderApp(store));
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
