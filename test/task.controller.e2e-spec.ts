import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Task API (e2e)', () => {
  let app: INestApplication;
  let taskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

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
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        taskId = res.body.id;
      });
  });

  it('GET /tasks/:id - should return a single task by ID', () => {
    return request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', taskId);
      });
  });

  it('PUT /tasks/:id - should update a task by ID', () => {
    const updatedTask = {
      title: 'Updated Task',
      description: 'Updated Task Description',
      completed: true,
    };
    return request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .send(updatedTask)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', taskId);
        expect(res.body.title).toBe(updatedTask.title);
        expect(res.body.completed).toBe(true);
      });
  });

  it('DELETE /tasks/:id - should delete a task by ID', () => {
    return request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain('Task deleted');
      });
  });
});
