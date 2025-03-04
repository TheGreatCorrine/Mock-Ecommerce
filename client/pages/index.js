import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>电商平台 - 退货API演示</title>
        <meta name="description" content="电商平台退货API演示" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-primary">电商平台</h1>
              </div>
            </div>
            <div className="flex items-center">
              {isLoggedIn ? (
                <>
                  <Link href="/returns" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                    我的退货
                  </Link>
                  <Link href="/returns/new" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                    申请退货
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-4 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    退出登录
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                    登录
                  </Link>
                  <Link href="/register" className="ml-4 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl leading-6 font-medium text-gray-900">
              欢迎使用电商平台退货API演示
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              这是一个简单的电商平台原型，用于展示退货API功能。
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">功能特点</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>用户注册和登录</li>
                    <li>退货申请（包含图片上传）</li>
                    <li>查看退货历史</li>
                  </ul>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">开始使用</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isLoggedIn ? (
                    <Link href="/returns/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      申请退货
                    </Link>
                  ) : (
                    <Link href="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      立即注册
                    </Link>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} 电商平台 API 演示
          </p>
        </div>
      </footer>
    </div>
  );
} 