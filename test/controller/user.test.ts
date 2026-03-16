import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

describe('test/controller/user.wxlogin', () => {
  it('should POST /api/user/wxlogin without code return error', async () => {
    const app = await createApp<Framework>();
    const result = await createHttpRequest(app).post('/api/user/wxlogin').send({});
    expect(result.status).toBe(200);
    expect(result.body.code).toBe('500');
    expect(result.body.data).toBe('参数错误');
    await close(app);
  });
});
