import React from 'react';
import { Search, Plus, Moon, Sun, Menu, Monitor, Settings, ExternalLink } from 'lucide-react';
import { ExternalSearchSource, SearchMode } from '../types';

interface MainHeaderProps {
  navTitleText: string;
  siteCardStyle: 'detailed' | 'simple';
  themeMode: 'light' | 'dark' | 'system';
  darkMode: boolean;
  isMobileSearchOpen: boolean;
  searchMode: SearchMode;
  searchQuery: string;
  externalSearchSources: ExternalSearchSource[];
  hoveredSearchSource: ExternalSearchSource | null;
  selectedSearchSource: ExternalSearchSource | null;
  showSearchSourcePopup: boolean;
  onOpenSidebar: () => void;
  onToggleTheme: () => void;
  onViewModeChange: (mode: 'simple' | 'detailed') => void;
  onAddLink: () => void;
  onSearchModeChange: (mode: SearchMode) => void;
  onOpenSearchConfig: () => void;
  onSearchQueryChange: (value: string) => void;
  onExternalSearch: () => void;
  onSearchSourceSelect: (source: ExternalSearchSource) => void;
  onHoverSearchSource: (source: ExternalSearchSource | null) => void;
  onIconHoverChange: (value: boolean) => void;
  onPopupHoverChange: (value: boolean) => void;
  onToggleMobileSearch: () => void;
  onToggleSearchSourcePopup: () => void;
  linksCount: number;
  categoriesCount: number;
  pinnedCount: number;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  navTitleText,
  siteCardStyle,
  themeMode,
  darkMode,
  isMobileSearchOpen,
  searchMode,
  searchQuery,
  externalSearchSources,
  hoveredSearchSource,
  selectedSearchSource,
  showSearchSourcePopup,
  onOpenSidebar,
  onToggleTheme,
  onViewModeChange,
  onAddLink,
  onSearchModeChange,
  onOpenSearchConfig,
  onSearchQueryChange,
  onExternalSearch,
  onSearchSourceSelect,
  onHoverSearchSource,
  onIconHoverChange,
  onPopupHoverChange,
  onToggleMobileSearch,
  onToggleSearchSourcePopup,
  linksCount,
  categoriesCount,
  pinnedCount
}) => {
  return (
    <header className="px-4 lg:px-10 pt-6 pb-6">
      <div className="flex items-center justify-between">
        <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300">
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-2">
          <div className={`${isMobileSearchOpen ? 'hidden' : 'flex'} lg:flex items-center bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-white/10 rounded-full p-1 backdrop-blur`}>
            <button
              onClick={() => onViewModeChange('simple')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                siteCardStyle === 'simple'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
              title="简约版视图"
            >
              简约
            </button>
            <button
              onClick={() => onViewModeChange('detailed')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                siteCardStyle === 'detailed'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
              title="详情版视图"
            >
              详情
            </button>
          </div>

          <button
            onClick={onToggleTheme}
            title={themeMode === 'system' ? '主题: 跟随系统' : darkMode ? '主题: 暗色' : '主题: 亮色'}
            className={`${isMobileSearchOpen ? 'hidden' : 'flex'} lg:flex p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/70 border border-transparent hover:border-slate-200/60 dark:hover:border-white/10 transition-colors`}
          >
            {themeMode === 'system' ? <Monitor size={18} /> : darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className={`${isMobileSearchOpen ? 'hidden' : 'flex'}`}>
            <button
              onClick={onAddLink}
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg shadow-sky-500/30"
            >
              <Plus size={16} /> <span className="hidden sm:inline">添加</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center text-center">
        <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900 dark:text-slate-100 font-display">
          {navTitleText}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          一个简洁、可维护的个人导航页
        </p>

        <div className="mt-6 w-full max-w-2xl">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={onToggleMobileSearch}
              className="sm:flex md:hidden lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/70 rounded-full transition-colors"
              title="搜索"
            >
              <Search size={20} />
            </button>

            <div className="hidden sm:hidden md:flex lg:flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-white/10 rounded-full p-1 backdrop-blur">
                <button
                  onClick={() => onSearchModeChange('internal')}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all flex items-center justify-center min-h-[24px] min-w-[40px] ${
                    searchMode === 'internal'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                  title="站内搜索"
                >
                  站内
                </button>
                <button
                  onClick={() => onSearchModeChange('external')}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all flex items-center justify-center min-h-[24px] min-w-[40px] ${
                    searchMode === 'external'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                  title="站外搜索"
                >
                  站外
                </button>
              </div>

              {searchMode === 'external' && (
                <button
                  onClick={onOpenSearchConfig}
                  className="p-1.5 text-slate-500 hover:text-sky-500 hover:bg-white/70 dark:hover:bg-slate-900/70 rounded-full transition-colors border border-transparent hover:border-slate-200/60 dark:hover:border-white/10"
                  title="管理搜索源"
                >
                  <Settings size={14} />
                </button>
              )}
            </div>

            <div className={`relative w-full ${isMobileSearchOpen ? 'block' : 'hidden'} sm:block`}>
              {searchMode === 'external' && showSearchSourcePopup && (
                <div
                  className="absolute left-0 top-full mt-2 w-full bg-white/90 dark:bg-slate-900/80 rounded-lg shadow-lg border border-slate-200/70 dark:border-white/10 p-3 z-50 backdrop-blur"
                  onMouseEnter={() => onPopupHoverChange(true)}
                  onMouseLeave={() => onPopupHoverChange(false)}
                >
                  <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
                    {externalSearchSources
                      .filter((source) => source.enabled)
                      .map((source, index) => (
                        <button
                          key={index}
                          onClick={() => onSearchSourceSelect(source)}
                          onMouseEnter={() => onHoverSearchSource(source)}
                          onMouseLeave={() => onHoverSearchSource(null)}
                          className="px-2 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1 justify-center"
                        >
                          <img
                            src={`https://www.faviconextractor.com/favicon/${new URL(source.url).hostname}?larger=true`}
                            alt={source.name}
                            className="w-4 h-4"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNlYXJjaCI+PHBhdGggZD0ibTIxIDIxLTQuMzQtNC4zNCI+PC9wYXRoPjxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjgiPjwvY2lyY2xlPjwvc3ZnPg==';
                            }}
                          />
                          <span className="truncate hidden sm:inline">{source.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 cursor-pointer"
                onMouseEnter={() => searchMode === 'external' && onIconHoverChange(true)}
                onMouseLeave={() => onIconHoverChange(false)}
                onClick={() => {
                  if (searchMode === 'external') {
                    onToggleSearchSourcePopup();
                  }
                }}
              >
                {searchMode === 'internal' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
                    <path d="m21 21-4.35-4.35"></path>
                    <circle cx="11" cy="11" r="8"></circle>
                  </svg>
                ) : (hoveredSearchSource || selectedSearchSource) ? (
                  <img
                    src={`https://www.faviconextractor.com/favicon/${new URL((hoveredSearchSource || selectedSearchSource).url).hostname}?larger=true`}
                    alt={(hoveredSearchSource || selectedSearchSource).name}
                    className="w-4 h-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNlYXJjaCI+PHBhdGggZD0ibTIxIDIxLTQuMzQtNC4zNCI+PC9wYXRoPjxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjgiPjwvY2lyY2xlPjwvc3ZnPg==';
                    }}
                  />
                ) : (
                  <Search size={16} />
                )}
              </div>

              <input
                type="text"
                placeholder={
                  searchMode === 'internal'
                    ? '搜索站内内容...'
                    : selectedSearchSource
                      ? `在${selectedSearchSource.name}搜索内容`
                      : '搜索站外内容...'
                }
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchMode === 'external') {
                    onExternalSearch();
                  }
                }}
                className="w-full pl-9 pr-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-white/10 text-sm focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all backdrop-blur"
                style={{ fontSize: '16px' }}
                inputMode="search"
                enterKeyHint="search"
              />

              {searchMode === 'external' && searchQuery.trim() && (
                <button
                  onClick={onExternalSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-500"
                  title="执行站外搜索"
                >
                  <ExternalLink size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span>{linksCount} 个站点</span>
        <span>{categoriesCount} 个分类</span>
        <span>{pinnedCount} 置顶</span>
      </div>
    </header>
  );
};

export default MainHeader;
