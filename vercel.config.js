module.exports = {
    // التكوين الأساسي
    trailingSlash: true,
    
    // كيفية التعامل مع طلبات API
    rewrites: async () => {
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ];
    },
    
    // كيفية التعامل مع المسارات غير الموجودة
    redirects: async () => {
      return [
        {
          source: '/((?!api|_next/static|favicon.ico).*)',
          missing: [
            {
              type: 'header',
              key: 'next-router-prefetch',
            },
            {
              type: 'header',
              key: 'purpose',
              value: 'prefetch',
            },
          ],
          permanent: false,
          destination: '/index.html',
        },
      ];
    },
  };