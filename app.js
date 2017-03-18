"use strict";

const listElement = document.querySelector('.list');
const filtersElement = document.querySelector('.filters');
// const itemElementList = listElement.children;

class Statistics {
    constructor() {
        const statisticElement = document.querySelector('.statistic');
        this.total = statisticElement.querySelector('.statistic__total');
        this.done = statisticElement.querySelector('.statistic__done');
        this.todo = statisticElement.querySelector('.statistic__left');
    }
    _get(type) { return parseInt(this[type].innerHTML) }
    _set(type, value) { this[type].innerHTML = value }

    _add(type) { this._set(type ,this._get(type) + 1) }
    _rm(type) { this._set(type ,this._get(type) - 1) }

    add(type) {
        if (type == 'total') return;
        this._add('total');
        this._add(type);
    }
    rm(type) {
        if (type == 'total') return;
        this._rm('total');
        this._rm(type);
    }
}
const statistics = new Statistics();

const templateElement = document.getElementById('todoTemplate');
const templateContainer = 'content' in templateElement ? templateElement.content : templateElement;

// сформируем задачки
let todoList = [
    {
        name: 'Позвонить в сервис',
        status: 'todo'
    },
    {
        name: 'Купить хлеб',
        status: 'done'
    },
    {
        name: 'Захватить мир',
        status: 'todo'
    },
    {
        name: 'Добавить тудушку в список',
        status: 'todo'
    }
];

// функция по генерации элементов
function addTodoFromTemplate(todo) {
    const newElement = templateContainer.querySelector('.task').cloneNode(true);
    newElement.querySelector('.task__name').textContent = todo.name;
    setTodoStatusClassName(newElement, todo.status === 'todo');

    return newElement;
}

function setTodoStatusClassName(todo, flag) {
    todo.classList.toggle('task_todo', flag);
    todo.classList.toggle('task_done', !flag);
}

function onListClick(event) {
    const target = event.target;
    let element;

    if (isStatusBtn(target)) {
        element = target.parentNode;
        changeTodoStatus(element);
    }

    if (isDeleteBtn(target)) {
        element = target.parentNode;
        deleteTodo(element);
    }
}

function onFilterBtnClick(event) {
    const curFilter = event.target;
    if (!curFilter.classList.contains('filters__item')) return;
    const oldFilters = filtersElement.querySelectorAll('.filters__item_selected');
    Array.prototype.map.call(oldFilters, element => element.classList.remove('filters__item_selected'));
    curFilter.classList.add('filters__item_selected');
}

function isStatusBtn(target) {
    return target.classList.contains('task__status');
}

function isDeleteBtn(target) {
    return target.classList.contains('task__delete-button');
}

function isTodoElem(element) {
    return element.classList.contains('task_todo');
}

function changeTodoStatus(element) {
    const [prevType, newType] = isTodoElem(element) ? ['todo', 'done'] : ['done', 'todo'];
    statistics.rm(prevType);
    statistics.add(newType);
    setTodoStatusClassName(element, !isTodoElem(element));
}

function deleteTodo(element) {
    statistics.rm(isTodoElem(element) ? 'todo': 'done');
    listElement.removeChild(element);
}

function onInputKeydown(event) {
    if (event.keyCode !== 13) {
        return;
    }

    const ENTER_KEYCODE = 13;
    if (event.keyCode !== ENTER_KEYCODE) {
        return;
    }

    const todoName = inputElement.value.trim();

    if (todoName.length === 0 || checkIfTodoAlreadyExists(todoName)) {
        return;
    }

    const todo = createNewTodo(todoName);
    insertTodoElement(addTodoFromTemplate(todo));
    statistics.add('todo');
    inputElement.value = '';
}

function checkIfTodoAlreadyExists(todoName) {
    const todoElements = listElement.querySelectorAll('.task__name');
    const namesList = Array.prototype.map.call(todoElements, element => element.textContent);
    return namesList.indexOf(todoName) > -1;
}

function createNewTodo(name) {
    return {
        name: name,
        status: 'todo'
    }
}

todoList
    .map(addTodoFromTemplate)
    .forEach(insertTodoElement);

// Add statistics:
todoList
    .map(todo => todo.status)
    .forEach(type => statistics.add(type));

listElement.addEventListener('click', onListClick);
filtersElement.addEventListener('click', onFilterBtnClick);

const inputElement = document.querySelector('.add-task__input');
inputElement.addEventListener('keydown', onInputKeydown);

// Задача:
// исправьте багу с добавлением insertBefore в пустой массив
// создайте статистику
//
function insertTodoElement(elem) {
    if (listElement.children) {
        listElement.insertBefore(elem, listElement.firstElementChild);
    } else {
        listElement.appendChild(elem);
    }
}
