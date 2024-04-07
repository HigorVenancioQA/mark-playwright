import { test, expect } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TaskPage } from './support/pages/tasks'


test('Deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
    const task: TaskModel = {
        name: 'Ler um livro TypeScript',
        is_done: false
    }

    await deleteTaskByHelper(request, task.name)

    const tasksPage: TaskPage = new TaskPage(page)
    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.shouldHaveText(task.name)
})

test('Não deve permitir tarefa duplicada', async ({ page, request }) => {
    const task: TaskModel = {
        name: 'Comprar Ketchup',
        is_done: false
    }

    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    const tasksPage: TaskPage = new TaskPage(page)
    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.alertHaveText('Task already exists!')
})

test('Campo obrigatório', async ({ page }) => {
    const task: TaskModel = {
        name: '',
        is_done: false
    }
    const tasksPage: TaskPage = new TaskPage(page)
    await tasksPage.go()
    await tasksPage.create(task)

    const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
    expect(validationMessage).toEqual('This is a required field')
})