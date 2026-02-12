
// Đây là cầu nối giữa Frontend và Backend
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Hàm helper để gọi API
async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token'); // Lấy token đăng nhập nếu có
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API Error');
    }

    const result: ApiResponse<T> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`API Call Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Sản phẩm
  products: {
    getAll: () => fetchClient<any[]>('/products'),
    getById: (id: string) => fetchClient<any>(`/products/${id}`),
    create: (data: any) => fetchClient<any>('/products', { method: 'POST', body: JSON.stringify(data) }),
  },
  
  // Xác thực
  auth: {
    login: (email: string, pass: string) => fetchClient<any>('/auth/login', { 
        method: 'POST', body: JSON.stringify({ email, pass }) 
    }),
    register: (data: any) => fetchClient<any>('/auth/register', { 
        method: 'POST', body: JSON.stringify(data) 
    }),
    profile: () => fetchClient<any>('/auth/profile'),
  },

  // Đấu giá (Cần Realtime -> Socket.io, nhưng đây là API cơ bản)
  bidding: {
    placeBid: (productId: string, amount: number) => fetchClient<any>(`/bidding/${productId}`, {
        method: 'POST', body: JSON.stringify({ amount })
    })
  },

  // Đơn hàng
  orders: {
    create: (cartItems: any[]) => fetchClient<any>('/orders', {
        method: 'POST', body: JSON.stringify({ items: cartItems })
    }),
    getMyOrders: () => fetchClient<any[]>('/orders/me'),
  },

  // Live streaming
  liveStreams: {
    getAll: () => fetchClient<any[]>('/livestreams'),
    getById: (id: string) => fetchClient<any>(`/livestreams/${id}`),
    create: (data: any) => fetchClient<any>('/livestreams', { 
        method: 'POST', body: JSON.stringify(data) 
    }),
    updateStatus: (id: string, status: string) => fetchClient<any>(`/livestreams/${id}/status`, {
        method: 'PUT', body: JSON.stringify({ status })
    }),
    addChatMessage: (id: string, message: string) => fetchClient<any>(`/livestreams/${id}/chat`, {
        method: 'POST', body: JSON.stringify({ message })
    })
  },

  // Content management
  content: {
    getAll: () => fetchClient<any[]>('/content'),
    create: (data: any) => fetchClient<any>('/content', { 
        method: 'POST', body: JSON.stringify(data) 
    }),
    getMyContent: () => fetchClient<any[]>('/content/me'),
  },

  // User management
  users: {
    updateProfile: (data: any) => fetchClient<any>('/users/profile', {
        method: 'PUT', body: JSON.stringify(data)
    }),
    updateBalance: (data: any) => fetchClient<any>('/users/balance', {
        method: 'PUT', body: JSON.stringify(data)
    })
  },

  // AI services
  ai: {
    generateContent: (prompt: string) => fetchClient<any>('/ai/generate-content', {
        method: 'POST', body: JSON.stringify({ prompt })
    }),
    generateKOL: (industry: string) => fetchClient<any>('/ai/generate-kol', {
        method: 'POST', body: JSON.stringify({ industry })
    })
  }
};
