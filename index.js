import { $el } from 'el_';
import { createStore } from 'redux';
import * as actions from './actions';
import reducer from './reducer';
import cx from 'classnames';

const store = createStore(reducer);

const FILTER_ALL = 'all';
const FILTER_ACTIVE = 'active';
const FILTER_COMPLETED = 'completed';
const FILTERS = {
  [FILTER_ALL]: 'All',
  [FILTER_ACTIVE]: 'Active',
  [FILTER_COMPLETED]: 'Completed'
};

function isTaskFiltered (task, filter) {
  switch (filter) {
    case FILTER_COMPLETED:
      return task.done;
      break;
    case FILTER_ACTIVE:
      return !task.done;
  }
  return true;
}

function renderFilter (filter, label, isSelected) {
  return $el(`
      <a href="#"></a>
  `, {
    'find a': (el) => {
      el.innerHTML = label;
      el.href = '#'+filter;
      el.className = cx({ 'selected': isSelected });
    },
    'onclick a': (el, event) => store.dispatch(actions.filter(filter))
  }, 'li');
}

function renderFilters (currentFilter) {
  return $el(Object.keys(FILTERS).map((filter) => {
      return renderFilter(filter, FILTERS[filter], filter===currentFilter);
    }), { 'className': 'filters' }, 'ul');
}

function renderTask (task, index) {
  return $el(`
    <div class="view">
      <input class="toggle" type="checkbox" checked>
      <label></label>
      <button class="destroy"></button>
    </div>
    <input class="edit" />
  `, {
    'className': cx({ 'completed': task.done, 'editing': task.editing }),
    'find label': task.title,
    'find .edit': (el) => {
      el.value = task.title;
      el.focus();
    },
    'find .toggle': (el) => {
      el.onclick = (event) => store.dispatch(actions.done(index, el.checked));
      el.checked = task.done;
    },
    'onclick .destroy': (el, event) => {
      event.preventDefault();
      store.dispatch(actions.remove(index));
    },
    'onclick label': (el, event) => {
      event.preventDefault();
      store.dispatch(actions.toggleEdit(index, true));
    },
    'onkeyup .edit': (el, event) => {
      switch (event.keyCode) {
        case 13:
          store.dispatch(actions.update(index, el.value));
          break;
        case 27:
          store.dispatch(actions.toggleEdit(index, false));
          break;
      }
    },
    'onblur .edit': (el) => {
      store.dispatch(actions.update(index, el.value));
    }
  }, 'li');
}

function renderTasks (tasks, filter) {
  let filteredTasks = tasks.map((task, index) => {
    if (! isTaskFiltered(task, filter)) {
      return null;
    }
    return renderTask(task, index);
  }).filter((task) => task!==null);
  if (filteredTasks.length===0) {
    return $el(`<p>Empty.</p>`);
  }
  return $el(filteredTasks, { 'className': 'todo-list' }, 'ul');
}

function renderForm () {
  return $el(`
    <form data-form>
      <input class="new-todo" data-query type="text" name="query" />
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

function renderCount (tasks) {
  let tasksLength = tasks.filter((task) => isTaskFiltered(task, FILTER_ACTIVE)).length;
  return $el(`<strong>${tasksLength}</strong> item left`, null, 'span');
}

function watch (store, fn) {
  let el = fn(store.getState());
  store.subscribe(() => {
    let newEl = fn(store.getState());
    el.parentNode.replaceChild(newEl, el);
    el = newEl;
  });
  return el;
}

function renderApp (store) {
  return $el(`
      <section class="todoapp">
        <header class="header">
          <h1>todos</h1>
          <div data-form></div>
        </header>
        <!-- This section should be hidden by default and shown when there are todos -->
        <section class="main">
          <input class="toggle-all" type="checkbox" />
          <label for="toggle-all">Mark all as complete</label>
          <div data-tasks></div>
        </section>
        <!-- This footer should hidden by default and shown when there are todos -->
        <footer class="footer">
          <!-- This should be 0 items left by default -->
          <span class="todo-count"></span>
          <!-- Remove this if you don't implement routing -->
          <div data-filter></div>
          <!-- Hidden if no completed items are left ↓ -->
          <button class="clear-completed">Clear completed</button>
        </footer>
      </section>
  `, {
    'find [data-form]': renderForm(),
    'find [data-filter]': watch(store, (state) => renderFilters(state.filter)),
    'find [data-tasks]': watch(store, (state) => renderTasks(state.tasks, state.filter)),
    'find .todo-count': watch(store, (state) => renderCount(state.tasks)),
    'onclick .clear-completed': (el, event) => {
      event.preventDefault();
      store.dispatch(actions.clearCompleted());
    },
    'onclick .toggle-all': (el, event) => {
      event.preventDefault();
      store.dispatch(actions.toggleAllCompleted());
    }
  });
}

function main () {
  let tasks = null;
  if ('localStorage' in window) {
    tasks = window.localStorage.getItem('tasks');
    try {
      tasks = JSON.parse(tasks);
    } catch (e) { }
    store.subscribe(() =>
      window.localStorage.setItem('tasks', JSON.stringify(store.getState().tasks)));
  }
  document.getElementById('app').appendChild(renderApp(store));
  store.dispatch(actions.init({
    filter: location.hash.substring(1) || FILTER_ALL,
    tasks: tasks || [
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
