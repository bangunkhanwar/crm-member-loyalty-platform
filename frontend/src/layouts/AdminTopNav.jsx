export default function AdminTopNav({ adminUser, onMenuClick, sidebarOpen, onToggle }) {
  return (
    <header
      className={`fixed top-0 right-0 h-[66px] bg-admin-bg border-b border-black/20
        flex items-center justify-between px-4 md:px-8 font-inter z-30
        transition-[left] duration-300 ease-out
        left-0 ${sidebarOpen ? 'lg:left-[260px]' : 'lg:left-0'}`}
    >
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <button onClick={onMenuClick} className="lg:hidden text-xl text-admin-text shrink-0" aria-label="Buka menu">
          <i className="fas fa-bars" />
        </button>
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg text-lg text-admin-text hover:bg-white transition-colors shrink-0"
          aria-label={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
          title={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
        >
          <i className={`fas ${sidebarOpen ? 'fa-angles-left' : 'fa-bars'}`} />
        </button>
        <div className="hidden md:flex items-center bg-white rounded-xl px-2.5 py-2 w-full max-w-[312px] h-9 relative border border-black/20">
          <i className="fas fa-search text-[#6B7280] text-[17px]" />
          <input
            type="text"
            placeholder="Search data..."
            className="flex-1 outline-none border-none text-base pl-2.5 bg-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button className="relative w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-lg md:text-xl text-admin-text hover:bg-white transition-colors">
          <i className="fas fa-bell" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger border-2 border-admin-bg rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-2 md:pl-3 md:border-l md:border-black/20">
          <div className="w-9 h-9 md:w-[37px] md:h-9 rounded-full bg-border bg-cover shrink-0" />
          <div className="hidden sm:flex flex-col">
            <strong className="text-sm text-text-black">{adminUser.fullName}</strong>
            <small className="text-xs text-admin-text">{adminUser.role}</small>
          </div>
        </div>
      </div>
    </header>
  );
}