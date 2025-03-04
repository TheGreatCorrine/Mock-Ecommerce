import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NewReturn() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // 检查用户是否已登录
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!previewImage) {
      toast.error('请上传商品图片');
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      const userId = Cookies.get('userId');

      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('description', data.description);
      formData.append('image', data.image[0]);

      const response = await axios.post('http://localhost:5000/api/returns', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('退货申请已提交！');
      setTimeout(() => {
        router.push('/returns');
      }, 1500);
    } catch (error) {
      console.error('提交失败:', error);
      toast.error(error.response?.data?.message || '提交失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>申请退货 - 电商平台</title>
        <meta name="description" content="申请退货" />
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
              <button
                onClick={() => router.back()}
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl leading-6 font-medium text-gray-900">
              申请退货
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              请填写退货信息并上传商品图片
            </p>
          </div>

          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        退货原因
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="请描述退货原因..."
                        {...register('description', { required: '请输入退货原因' })}
                      />
                      {errors.description && (
                        <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>

                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        商品图片
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          {previewImage ? (
                            <div>
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="mx-auto h-64 w-auto object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => setPreviewImage(null)}
                                className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                移除图片
                              </button>
                            </div>
                          ) : (
                            <>
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="image"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                                >
                                  <span>上传图片</span>
                                  <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    {...register('image', { required: '请上传商品图片' })}
                                  />
                                </label>
                                <p className="pl-1">或拖放图片到此处</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF 最大 10MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      {errors.image && (
                        <p className="mt-2 text-sm text-red-600">{errors.image.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {isLoading ? '提交中...' : '提交退货申请'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 