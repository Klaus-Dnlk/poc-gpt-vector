import Router from '@koa/router';

const router = new Router({});

router.get('/', async ctx => {
  ctx.body = {
    message: 'welcome to server',
  };
  return;
});

export default router;
