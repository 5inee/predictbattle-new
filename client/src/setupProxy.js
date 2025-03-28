const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // يستخدم هذا في بيئة التطوير المحلية فقط
  // في الإنتاج على Vercel، سيتم استخدام تكوين vercel.json
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      logLevel: 'debug',
    })
  );
};