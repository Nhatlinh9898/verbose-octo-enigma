
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

  // Orders
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
  },

  // Avatar management
  avatars: {
    getAll: () => fetchClient<any[]>('/avatars'),
    getPublic: () => fetchClient<any[]>('/avatars/public'),
    getPopular: () => fetchClient<any[]>('/avatars/popular'),
    getById: (id: string) => fetchClient<any>(`/avatars/${id}`),
    create: (data: any) => fetchClient<any>('/avatars', {
      method: 'POST', body: JSON.stringify(data)
    }),
    update: (id: string, data: any) => fetchClient<any>(`/avatars/${id}`, {
      method: 'PUT', body: JSON.stringify(data)
    }),
    delete: (id: string) => fetchClient<any>(`/avatars/${id}`, {
      method: 'DELETE'
    }),
    getCategories: () => fetchClient<string[]>('/avatars/categories')
  },

  // Customer Support
  support: {
    getMyTickets: () => fetchClient<any[]>('/support'),
    getAllTickets: (params?: any) => fetchClient<any>('/support/all', {
      method: 'GET', 
      headers: params ? { 'Content-Type': 'application/json' } : {}
    }),
    getTicketById: (id: string) => fetchClient<any>(`/support/${id}`),
    createTicket: (data: any) => fetchClient<any>('/support', {
      method: 'POST', body: JSON.stringify(data)
    }),
    addMessage: (id: string, data: any) => fetchClient<any>(`/support/${id}/messages`, {
      method: 'POST', body: JSON.stringify(data)
    }),
    updateStatus: (id: string, data: any) => fetchClient<any>(`/support/${id}/status`, {
      method: 'PUT', body: JSON.stringify(data)
    }),
    rateTicket: (id: string, data: any) => fetchClient<any>(`/support/${id}/rating`, {
      method: 'PUT', body: JSON.stringify(data)
    }),
    getCategories: () => fetchClient<any[]>('/support/categories'),
    getStats: () => fetchClient<any>('/support/stats')
  },

  // Admin Dashboard
  admin: {
    getDashboardStats: (timeRange?: string) => fetchClient<any>(`/admin/stats${timeRange ? `?timeRange=${timeRange}` : ''}`),
    getAllUsers: (params?: any) => fetchClient<any>('/admin/users', {
      method: 'GET',
      headers: params ? { 'Content-Type': 'application/json' } : {}
    }),
    updateUserStatus: (id: string, status: string) => fetchClient<any>(`/admin/users/${id}/status`, {
      method: 'PUT', body: JSON.stringify({ status })
    }),
    getAllProducts: (params?: any) => fetchClient<any>('/admin/products', {
      method: 'GET',
      headers: params ? { 'Content-Type': 'application/json' } : {}
    }),
    updateProductStatus: (id: string, data: any) => fetchClient<any>(`/admin/products/${id}/status`, {
      method: 'PUT', body: JSON.stringify(data)
    }),
    getAllOrders: (params?: any) => fetchClient<any>('/admin/orders', {
      method: 'GET',
      headers: params ? { 'Content-Type': 'application/json' } : {}
    }),
    getFinancialReports: (timeRange?: string) => fetchClient<any>(`/admin/reports/financial${timeRange ? `?timeRange=${timeRange}` : ''}`),
    getSystemHealth: () => fetchClient<any>('/admin/system/health'),
    getActivityLogs: (params?: any) => fetchClient<any>('/admin/logs', {
      method: 'GET',
      headers: params ? { 'Content-Type': 'application/json' } : {}
    })
  },

  // Super Deals
  deals: {
    getActiveDeals: (params?: any) => fetchClient<any>('/deals', {
      method: 'GET',
      headers: params ? { 'Content-Type': 'application/json' } : {}
    }),
    getDealById: (id: string) => fetchClient<any>(`/deals/${id}`),
    createDeal: (data: any) => fetchClient<any>('/deals', {
      method: 'POST', body: JSON.stringify(data)
    }),
    updateDeal: (id: string, data: any) => fetchClient<any>(`/deals/${id}`, {
      method: 'PUT', body: JSON.stringify(data)
    }),
    deleteDeal: (id: string) => fetchClient<any>(`/deals/${id}`, {
      method: 'DELETE'
    }),
    getMyDeals: () => fetchClient<any>('/deals/my-deals'),
    getStats: () => fetchClient<any>('/deals/stats')
  },

  // Cart Management
  cart: {
    getCart: () => fetchClient<any>('/cart'),
    getCartSummary: () => fetchClient<any>('/cart/summary'),
    addToCart: (data: any) => fetchClient<any>('/cart/add', {
      method: 'POST', body: JSON.stringify(data)
    }),
    updateItemQuantity: (itemId: string, quantity: number) => fetchClient<any>(`/cart/items/${itemId}`, {
      method: 'PUT', body: JSON.stringify({ quantity })
    }),
    removeFromCart: (itemId: string) => fetchClient<any>(`/cart/items/${itemId}`, {
      method: 'DELETE'
    }),
    clearCart: () => fetchClient<any>('/cart/clear', {
      method: 'DELETE'
    }),
    applyCoupon: (couponCode: string) => fetchClient<any>('/cart/apply-coupon', {
      method: 'POST', body: JSON.stringify({ couponCode })
    }),
    removeCoupon: () => fetchClient<any>('/cart/remove-coupon', {
      method: 'DELETE'
    }),
    mergeCart: (guestCartItems: any[]) => fetchClient<any>('/cart/merge', {
      method: 'POST', body: JSON.stringify({ guestCartItems })
    })
  },

  // Bidding REST API
  bidding: {
    placeBid: (data: any) => fetchClient<any>('/bidding/place', {
      method: 'POST', body: JSON.stringify(data)
    }),
    getBidHistory: (productId: string, limit?: number) => fetchClient<any>(`/bidding/history/${productId}${limit ? `?limit=${limit}` : ''}`),
    getHighestBid: (productId: string) => fetchClient<any>(`/bidding/highest/${productId}`),
    getMyBids: (options?: any) => fetchClient<any>('/bidding/my-bids', {
      method: 'GET'
    }),
    withdrawBid: (bidId: string) => fetchClient<any>(`/bidding/withdraw/${bidId}`, {
      method: 'DELETE'
    }),
    setAutoBid: (data: any) => fetchClient<any>('/bidding/auto-bid', {
      method: 'POST', body: JSON.stringify(data)
    }),
    cancelAutoBid: (autoBidId: string) => fetchClient<any>(`/bidding/auto-bid/${autoBidId}`, {
      method: 'DELETE'
    }),
    getBiddingStats: () => fetchClient<any>('/bidding/stats'),
    getAuctionStatus: (productId: string) => fetchClient<any>(`/bidding/auction-status/${productId}`)
  }
};
