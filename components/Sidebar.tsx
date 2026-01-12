import React from 'react';
import { Upload, Settings, CloudCog, GitFork, ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '../types';
import Icon from './Icon';

interface SidebarProps {
  sidebarOpen: boolean;
  sidebarWidthClass: string;
  isSidebarCollapsed: boolean;
  navTitleText: string;
  navTitleShort: string;
  selectedCategory: string;
  categories: Category[];
  repoUrl: string;
  onSelectAll: () => void;
  onSelectCategory: (category: Category) => void;
  onToggleCollapsed: () => void;
  onOpenCategoryManager: () => void;
  onOpenImport: () => void;
  onOpenBackup: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  sidebarWidthClass,
  isSidebarCollapsed,
  navTitleText,
  navTitleShort,
  selectedCategory,
  categories,
  repoUrl,
  onSelectAll,
  onSelectCategory,
  onToggleCollapsed,
  onOpenCategoryManager,
  onOpenImport,
  onOpenBackup,
  onOpenSettings
}) => {
  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-30 ${sidebarWidthClass} transform transition-all duration-300 ease-in-out
        bg-white/80 dark:bg-slate-950/70 border-r border-slate-200/60 dark:border-white/10 backdrop-blur flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div className={`h-16 flex items-center border-b border-slate-100/80 dark:border-white/10 shrink-0 relative ${isSidebarCollapsed ? 'justify-center px-2' : 'px-6'}`}>
        <span className={`text-xl font-semibold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent ${isSidebarCollapsed ? 'text-base px-2 py-1 rounded-lg bg-slate-100/70 dark:bg-slate-800/70' : ''}`}>
          {isSidebarCollapsed ? navTitleShort : navTitleText}
        </span>
        <button
          onClick={onToggleCollapsed}
          className="hidden lg:inline-flex absolute right-2 p-1.5 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          title={isSidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
          aria-label={isSidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto space-y-1 scrollbar-hide ${isSidebarCollapsed ? 'px-2 py-4' : 'p-4'}`}>
        <button
          onClick={onSelectAll}
          title="置顶网站"
          className={`rounded-xl transition-all ${isSidebarCollapsed ? 'w-full flex items-center justify-center px-2 py-3' : 'w-full flex items-center gap-3 px-4 py-3'} ${
            selectedCategory === 'all'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <div className={`${isSidebarCollapsed ? 'p-2.5 rounded-xl' : 'p-1'} ${selectedCategory === 'all' ? 'bg-blue-100 dark:bg-blue-800' : 'bg-slate-100 dark:bg-slate-800'} flex items-center justify-center`}>
            <Icon name="LayoutGrid" size={18} />
          </div>
          {!isSidebarCollapsed && <span>置顶网站</span>}
        </button>

        <div className={`flex items-center pt-4 pb-2 ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
          {!isSidebarCollapsed && (
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              分类目录
            </span>
          )}
          <button
            onClick={onOpenCategoryManager}
            className="p-1 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            title="管理分类"
          >
            <Settings size={14} />
          </button>
        </div>

        {categories.map((cat) => {
          const categoryBaseClasses = isSidebarCollapsed
            ? 'w-full flex items-center justify-center gap-0 px-2.5 py-2.5'
            : 'w-full flex items-center gap-3 px-4 py-2.5';
          const selectedClasses = selectedCategory === cat.id
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700';
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              title={isSidebarCollapsed ? cat.name : undefined}
              className={`rounded-xl transition-all group ${categoryBaseClasses} ${selectedClasses}`}
            >
              <div className={`${isSidebarCollapsed ? 'p-2.5 rounded-xl' : 'p-1.5 rounded-lg'} transition-colors flex items-center justify-center ${selectedCategory === cat.id ? 'bg-blue-100 dark:bg-blue-800' : 'bg-slate-100 dark:bg-slate-800'}`}>
                <Icon name={cat.icon} size={16} />
              </div>
              {!isSidebarCollapsed && (
                <span className="truncate flex-1 text-left">{cat.name}</span>
              )}
              {!isSidebarCollapsed && selectedCategory === cat.id && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              )}
            </button>
          );
        })}
      </div>

      {!isSidebarCollapsed && (
        <div className="p-4 border-t border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 shrink-0">
          <div className="grid grid-cols-3 gap-2 mb-2">
            <button
              onClick={onOpenImport}
              className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 transition-all"
              title="导入书签"
            >
              <Upload size={14} />
              <span>导入</span>
            </button>

            <button
              onClick={onOpenBackup}
              className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 transition-all"
              title="备份与恢复"
            >
              <CloudCog size={14} />
              <span>备份</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 transition-all"
              title="AI 设置"
            >
              <Settings size={14} />
              <span>设置</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs px-2 mt-2">
            <span className="text-slate-400">本地保存 + WebDAV 备份</span>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Fork this project on GitHub"
            >
              <GitFork size={14} />
              <span>Fork 项目 v1.7</span>
            </a>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
