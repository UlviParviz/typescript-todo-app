import { v4 as uuidV4 } from 'uuid';

type Task = { id: string; title: string; completed: boolean; createdAt: Date };

const list = document.querySelector<HTMLUListElement>('#list');
const form = document.getElementById('new-task-form') as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>('#new-task-title');

let tasks: Task[] = loadTasks();

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input?.value === '' || input?.value == null) return;

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(newTask);

  addListItem(newTask);
  input.value = '';

  saveTasks();
});

function addListItem(task: Task) {
  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkBox = document.createElement('input');
  const deleteButton = document.createElement('button');

  item.style.display = 'flex';
  item.style.justifyContent = 'space-between';

  checkBox.addEventListener('change', () => {
    task.completed = checkBox.checked;
    saveTasks();
  });

  deleteButton.addEventListener('click', () => {
    deleteListItem(task);
    item.remove(); // Remove the task from the DOM when deleted
  });

  checkBox.type = 'checkbox';
  checkBox.checked = task.completed;
  deleteButton.textContent = 'Delete';
  deleteButton.style.border = 'none';
  deleteButton.style.outline = 'none';
  deleteButton.style.backgroundColor = 'white';
  deleteButton.style.color = 'red';
  label.append(checkBox, task.title);
  item.append(label);
  item.append(deleteButton);
  list?.append(item);
}

function deleteListItem(task: Task) {
  const index = tasks.findIndex((t) => t.id === task.id);
  if (index !== -1) {
    tasks.splice(index, 1);
    saveTasks();
  }
}

function saveTasks() {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
}

function loadTasks(): Task[] {
  try {
    const taskJSON = localStorage.getItem('tasks');
    const loadedTasks = taskJSON ? JSON.parse(taskJSON) : [];
    list.innerHTML = ''; // Clear the list before adding tasks
    loadedTasks.forEach(addListItem);
    return loadedTasks;
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
}
