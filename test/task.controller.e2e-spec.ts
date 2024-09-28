import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TaskService } from '../src/task/task.service';

describe('Task API (e2e)', () => {
  let app: INestApplication;
  const taskService = {
    findAll: () => [
      {
        id: '1',
        title: 'Test Task',
        description: 'Test Desc',
        completed: false,
      },
    ],
    findOne: (id: string) => ({
      id,
      title: 'Test Task',
      description: 'Test Desc',
      completed: false,
    }),
    create: (task: any) => ({ id: '2', ...task }),
    update: (id, task) => ({ id, ...task }),
    remove: (id: string) => ({ deleted: true }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TaskService)
      .useValue(taskService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Test GET /tasks
  it('GET /tasks - should return all tasks', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect(taskService.findAll());
  });

  // Test GET /tasks/:id
  it('GET /tasks/:id - should return a single task by ID', () => {
    const taskId = '1';
    return request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .expect(200)
      .expect(taskService.findOne(taskId));
  });

  // Test POST /tasks
  it('POST /tasks - should create a new task', () => {
    const newTask = {
      title: 'New Task',
      description: 'New Task Description',
      completed: false,
    };
    return request(app.getHttpServer())
      .post('/tasks')
      .send(newTask)
      .expect(201)
      .expect(taskService.create(newTask));
  });

  // Test PUT /tasks/:id
  it('PUT /tasks/:id - should update a task by ID', () => {
    const updatedTask = {
      title: 'Updated Task',
      description: 'Updated Task Description',
      completed: true,
    };
    const taskId = '1';
    return request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .send(updatedTask)
      .expect(200)
      .expect(taskService.update(taskId, updatedTask));
  });

  // Test DELETE /tasks/:id
  it('DELETE /tasks/:id - should delete a task by ID', () => {
    const taskId = '1';
    return request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .expect(200)
      .expect(taskService.remove(taskId));
  });
});
