import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Returns() {
  const [returns, setReturns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 检查用户是否已登录
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // 获取退货历史
    const fetchReturns = async () => {
      try {
        const userId = Cookies.get('userId');
        const response = await axios.get(`http://localhost:5000/api/returns?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setReturns(response.data);
      } catch (error) {
        console.error('获取退货历史失败:', error);
        toast.error('获取退货历史失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReturns();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>我的退货 - 电商平台</title>
        <meta name="description" content="查看退货历史" />
      </Head>

      <ToastContainer position="top-right" autoClose={3000} />

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-primary">电商平台</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                首页
              </Link>
              <Link href="/returns/new" className="ml-4 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                申请退货
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl leading-6 font-medium text-gray-900">
                我的退货历史
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                查看所有退货申请记录
              </p>
            </div>
            <Link href="/returns/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              新建退货
            </Link>
          </div>

          {isLoading ? (
            <div className="px-4 py-5 sm:p-6 text-center">
              <svg className="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-sm text-gray-500">加载中...</p>
            </div>
          ) : returns.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无退货记录</h3>
              <p className="mt-1 text-sm text-gray-500">开始创建您的第一个退货申请</p>
              <div className="mt-6">
                <Link href="/returns/new" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  申请退货
                </Link>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {returns.map((returnItem) => (
                  <li key={returnItem.returnId} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 mr-4">
                          <img 
                            className="h-16 w-16 rounded-md object-cover" 
                            src={returnItem.image} 
                            alt={`Return ${returnItem.returnId}`} 
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            退货编号: {returnItem.returnId}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {returnItem.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            提交时间: {new Date(returnItem.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Link 
                          href={`/returns/${returnItem.returnId}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          查看详情
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 