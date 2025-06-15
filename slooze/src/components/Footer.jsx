export default function Footer() {
  return (
    <footer className="bg-[#fff7f0] border-t border-[#f3dede] py-10 px-6 md:px-10 text-[#333]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 text-[#ff4d4d]">
              <svg viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold">Slooze</span>
          </div>
          <p className="text-sm text-[#6c6c6c]">
            Role-based food ordering system for Admins, Managers, and Members.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:items-center gap-2 text-sm">
          <h4 className="font-semibold text-[#111418] mb-1">Quick Links</h4>
          <a href="#" className="hover:text-[#ff4d4d] transition-colors">Dashboard</a>
          <a href="#" className="hover:text-[#ff4d4d] transition-colors">Restaurants</a>
          <a href="#" className="hover:text-[#ff4d4d] transition-colors">Orders</a>
          <a href="#" className="hover:text-[#ff4d4d] transition-colors">Payments</a>
        </div>

        {/* Policies & Legal */}
        <div className="flex flex-col md:items-end gap-2 text-sm">
          <h4 className="font-semibold text-[#111418] mb-1">Legal</h4>
          <a href="#" className="hover:text-[#ff4d4d] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#ff4d4d] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#ff4d4d] transition-colors">Cookie Settings</a>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-[#888]">
        © {new Date().getFullYear()} Slooze. All rights reserved.
      </div>
    </footer>
  );
}
