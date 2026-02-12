
import React from 'react';
import { Search, ShoppingCart, User as UserIcon, MapPin, Gavel, LayoutGrid, PlusCircle, Package, Video, Sparkles, Zap, BarChart3, Shield, Bot, BrainCircuit, Palette, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  cartCount: number;
  onSearch: (term: string) => void;
  openCart: () => void;
  openSellModal: () => void;
  openOrders: () => void;
  onOpenLiveStudio: () => void;
  onViewLiveStreams: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenCustomerService: () => void;
  onOpenContentStudio: () => void;
  onOpenSuperDeals: () => void;
  onOpenSellerDashboard: () => void;
  onOpenAdminDashboard: () => void;
  onOpenAvatarStudio: () => void;
  onOpenKOLStudio: () => void;
  onOpenColorCustomizer: () => void;
  onOpenUploadPage: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, onSearch, openCart, openSellModal, openOrders, 
  onOpenLiveStudio, onViewLiveStreams, onOpenAuth, onOpenProfile, onOpenCustomerService, onOpenContentStudio, onOpenSuperDeals, onOpenSellerDashboard, onOpenAdminDashboard, onOpenAvatarStudio, onOpenKOLStudio, onOpenColorCustomizer, onOpenUploadPage
}) => {
  const { user } = useAuth();

  return (
    <header className="bg-[#131921] text-white sticky top-0 z-50 shadow-md">
      {/* Top Bar */}
      <div className="max-w-[1500px] mx-auto flex items-center p-2 gap-2 md:gap-4">
        {/* Logo */}
        <div className="flex items-center cursor-pointer p-1 shrink-0" onClick={() => window.location.reload()}>
          <span className="text-xl md:text-2xl font-bold italic flex items-center gap-1">
            <Gavel className="text-[#febd69] w-5 h-5 md:w-6 md:h-6" /> Amaze<span className="text-[#febd69]">Bid</span>
          </span>
        </div>

        {/* Search Bar - Flexible */}
        <div className="flex-1 flex h-9 md:h-10 items-stretch">
          <input 
            type="text" 
            placeholder="Tìm kiếm..."
            className="flex-1 px-3 text-black outline-none rounded-l text-sm"
            onChange={(e) => onSearch(e.target.value)}
          />
          <button className="bg-[#febd69] hover:bg-[#f3a847] px-3 md:px-5 rounded-r text-black">
            <Search size={18} />
          </button>
        </div>

        {/* User Account & Cart */}
        <div className="flex items-center gap-1 md:gap-3 shrink-0">
          <div onClick={user ? onOpenProfile : onOpenAuth} className="p-1 cursor-pointer hover:text-[#febd69]">
            <UserIcon size={22} />
          </div>

          {/* Cart */}
          <div onClick={openCart} className="flex items-center p-1 cursor-pointer hover:text-[#febd69] relative">
            <span className="absolute -top-1 -right-1 bg-[#febd69] text-black text-[10px] font-bold px-1 rounded-full">{cartCount}</span>
            <ShoppingCart size={22} />
          </div>
          
          {/* Orders */}
          <div onClick={user ? openOrders : onOpenAuth} className="p-1 cursor-pointer hover:text-[#febd69] hidden md:block">
            <LayoutGrid size={22} />
          </div>
        </div>
      </div>

      {/* Sub-Nav - Scrollable on Mobile */}
      <div className="bg-[#232f3e] px-2 py-1.5 flex items-center gap-4 text-[13px] font-medium overflow-x-auto no-scrollbar whitespace-nowrap">
        <span onClick={onViewLiveStreams} className="text-[#febd69] font-bold flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Đấu giá trực tiếp
        </span>
        <span onClick={onOpenSuperDeals} className="text-red-400 font-bold flex items-center gap-1">
            <Zap size={14} className="animate-pulse" /> Siêu Ưu Đãi
        </span>
        <span onClick={user ? openSellModal : onOpenAuth} className="flex items-center gap-1">
            <PlusCircle size={14} /> Đăng bán
        </span>
        <span onClick={onOpenKOLStudio} className="text-purple-300">AmazeKOL AI</span>
        <span onClick={onOpenContentStudio} className="text-green-300">Content Studio</span>
        <span onClick={onOpenAvatarStudio} className="text-blue-300">Avatar Studio</span>
        <span onClick={user ? onOpenSellerDashboard : onOpenAuth} className="flex items-center gap-1">
            <Package size={14} /> Seller Dashboard
        </span>
        <span onClick={user ? onOpenAdminDashboard : onOpenAuth} className="flex items-center gap-1">
            <Shield size={14} /> Admin
        </span>
        <span onClick={user ? openOrders : onOpenAuth} className="flex items-center gap-1">
            <LayoutGrid size={14} /> Đơn hàng
        </span>
        <span onClick={onOpenLiveStudio} className="flex items-center gap-1">
            <Video size={14} /> Live Studio
        </span>
        <span onClick={onOpenColorCustomizer} className="flex items-center gap-1 text-yellow-300">
            <Palette size={14} /> Màu & Tương phản
        </span>
        <span onClick={onOpenUploadPage} className="flex items-center gap-1 text-orange-300">
            <Upload size={14} /> Upload
        </span>
        <span onClick={onOpenCustomerService}>Hỗ trợ</span>
      </div>
    </header>
  );
};

export default Navbar;
