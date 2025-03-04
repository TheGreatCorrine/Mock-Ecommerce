import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ReturnDetail() {
  const [returnData, setReturnData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // 检查用户是否已登录
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // 获取退货详情
    const fetchReturnDetail = async () => {
      if (!id) return;
      
      try {
        const response = await axios.get(`http://localhost:5000/api/returns/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setReturnData(response.data);
      } catch (error) {
        console.error('获取退货详情失败:', error);
        toast.error('获取退货详情失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReturnDetail();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!returnData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="h-16 w-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">未找到退货记录</h3>
          <p className="mt-1 text-gray-500">该退货记录不存在或您没有权限查看</p>
          <div className="mt-6">
            <Link href="/returns" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              返回退货列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>退货详情 - 电商平台</title>
        <meta name="description" content="查看退货详情" />
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
              <Link href="/returns" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                退货列表
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl leading-6 font-medium text-gray-900">
              退货详情
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              退货编号: {returnData.returnId}
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">退货原因</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {returnData.description}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">提交时间</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(returnData.createdAt).toLocaleString()}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">商品图片</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <img 
                      src={returnData.image} 
                      alt="Return item" 
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">API 数据</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                    <pre className="text-xs">
                      {JSON.stringify({
                        userId: returnData.userId,
                        returnId: returnData.returnId,
                        description: returnData.description,
                        image: returnData.image.substring(0, 50) + '...' // 截断显示
                      }, null, 2)}
                    </pre>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    注：实际API返回的完整图片数据（base64或URL）
                  </p>
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <Link href="/returns" className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              返回列表
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 