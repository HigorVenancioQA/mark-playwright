import { test, expect } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TaskPage } from './support/pages/tasks'
import data from './fixtures/tasks.json'

test.describe('cadastro', ()=> {
    test('Deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
        const task = data.success as TaskModel
    
        await deleteTaskByHelper(request, task.name)
    
        const tasksPage: TaskPage = new TaskPage(page)
        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.shouldHaveText(task.name)
    })
    
    test('Não deve permitir tarefa duplicada', async ({ page, request }) => {
        const task = data.duplicate as TaskModel
    
        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)
    
        const tasksPage: TaskPage = new TaskPage(page)
        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')
    })
    
    test('Campo obrigatório', async ({ page }) => {
        const task = data.required as TaskModel
    
        const tasksPage: TaskPage = new TaskPage(page)
        await tasksPage.go()
        await tasksPage.create(task)
    
        const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMessage).toEqual('This is a required field')
    })
})

test.describe('atualização', ()=> {
test('Deve concluir uma tarefa', async ({ page, request }) => {
    const task = data.update as TaskModel

    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    const tasksPage: TaskPage = new TaskPage(page)

    await tasksPage.go()
    await tasksPage.toggle(task.name)
    await tasksPage.shouldBeDone(task.name)
})  
})

test.describe('Exclusão', ()=> {
    test('Deve excluir uma tarefa', async ({ page, request }) => {
        const task = data.delete as TaskModel
    
        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)
    
        const tasksPage: TaskPage = new TaskPage(page)
    
        await tasksPage.go()
        await tasksPage.remove(task.name)
        await tasksPage.shouldNotExist(task.name)
    })  
    })