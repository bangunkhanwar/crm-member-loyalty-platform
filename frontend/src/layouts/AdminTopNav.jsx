export default function AdminTopNav({ adminUser }) {
  return (
    <header className="fixed top-0 left-[260px] right-0 h-[66px] bg-admin-bg flex items-center justify-between px-8 pl-8 font-inter z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center bg-white rounded-xl px-2.5 py-2 w-[312px] h-9 relative">
          <i className="fas fa-search text-[#6B7280] text-[17px]" />
          <input
            type="text"
            placeholder="Search data..."
            className="flex-1 outline-none border-none text-base pl-2.5"
          />
          <div className="absolute right-3 bg-[#E7EEFF] border border-border rounded-xl px-1.5 py-0.5 text-[10px] font-plus-jakarta flex items-center gap-1">
            <i className="fas fa-command" /> -F
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-xl text-admin-text">
          <i className="fas fa-bell" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger border-2 border-admin-bg rounded-full" />
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-xl text-admin-text">
          <i className="fas fa-comment" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-[37px] h-9 rounded-full bg-border bg-cover" />
          <div className="flex flex-col">
            <strong className="text-sm text-text-black">{adminUser.name}</strong>
            <small className="text-xs text-admin-text">{adminUser.role}</small>
          </div>
        </div>
      </div>
    </header>
  );
}