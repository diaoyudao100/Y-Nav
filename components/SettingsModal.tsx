import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Bot, Key, Globe, Sparkles, PauseCircle, RefreshCw, Info } from 'lucide-react';
import { AIConfig, LinkItem, SiteSettings } from '../types';
import { generateLinkDescription } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIConfig;
  siteSettings: SiteSettings;
  onSave: (config: AIConfig, siteSettings: SiteSettings) => void;
  links: LinkItem[];
  onUpdateLinks: (links: LinkItem[]) => void;
}

const getRandomColor = () => {
    const h = Math.floor(Math.random() * 360);
    const s = 70 + Math.random() * 20;
    const l = 45 + Math.random() * 15;
    return `hsl(${h}, ${s}%, ${l}%)`;
};

const generateSvgIcon = (text: string, color1: string, color2: string) => {
    let char = '';
    if (text && text.length > 0) {
        char = text.charAt(0);
        if (/^[a-zA-Z]$/.test(char)) {
            char = '云';
        }
    } else {
        char = '云';
    }
    
    const gradientId = 'g_' + Math.random().toString(36).substr(2, 9);

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <defs>
            <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${color1}"/>
                <stop offset="100%" stop-color="${color2}"/>
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#${gradientId})" rx="16"/>
        <text x="50%" y="50%" dy=".35em" fill="white" font-family="Arial, sans-serif" font-weight="bold" font-size="32" text-anchor="middle">${char}</text>
    </svg>`.trim();

    try {
        const encoded = window.btoa(unescape(encodeURIComponent(svg)));
        return `data:image/svg+xml;base64,${encoded}`;
    } catch (e) {
        console.error("SVG Icon Generation Failed", e);
        return '';
    }
};

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, onClose, config, siteSettings, onSave, links, onUpdateLinks
}) => {
  const [activeTab, setActiveTab] = useState<'site' | 'ai'>('site');
  const [localConfig, setLocalConfig] = useState<AIConfig>(config);
  
  const [localSiteSettings, setLocalSiteSettings] = useState<SiteSettings>(() => ({
      title: siteSettings?.title || 'CloudNav - 我的导航',
      navTitle: siteSettings?.navTitle || 'CloudNav',
      favicon: siteSettings?.favicon || '',
      cardStyle: siteSettings?.cardStyle || 'detailed'
  }));
  
  const [generatedIcons, setGeneratedIcons] = useState<string[]>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const shouldStopRef = useRef(false);

  const updateGeneratedIcons = (text: string) => {
      const newIcons: string[] = [];
      for (let i = 0; i < 6; i++) {
          const c1 = getRandomColor();
          const h2 = (parseInt(c1.split(',')[0].split('(')[1]) + 30 + Math.random() * 30) % 360;
          const c2 = `hsl(${h2}, 70%, 50%)`;
          newIcons.push(generateSvgIcon(text, c1, c2));
      }
      setGeneratedIcons(newIcons);
  };

  useEffect(() => {
    if (isOpen) {
      setLocalConfig(config);
      const safeSettings = {
          title: siteSettings?.title || 'CloudNav - 我的导航',
          navTitle: siteSettings?.navTitle || 'CloudNav',
          favicon: siteSettings?.favicon || '',
          cardStyle: siteSettings?.cardStyle || 'detailed'
      };
      setLocalSiteSettings(safeSettings);
      if (generatedIcons.length === 0) {
          updateGeneratedIcons(safeSettings.navTitle);
      }

      setIsProcessing(false);
      setProgress({ current: 0, total: 0 });
      shouldStopRef.current = false;
    }
  }, [isOpen, config, siteSettings]);

  const handleChange = (key: keyof AIConfig, value: string) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSiteChange = async (key: keyof SiteSettings, value: any) => {
    setLocalSiteSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(localConfig, localSiteSettings);
    onClose();
  };

  const handleBulkGenerate = async () => {
    if (!localConfig.apiKey) {
        alert("请先配置并保存 API Key");
        return;
    }

    const missingLinks = links.filter(l => !l.description);
    if (missingLinks.length === 0) {
        alert("所有链接都已有描述！");
        return;
    }

    if (!confirm(`发现 ${missingLinks.length} 个链接缺少描述，确定要使用 AI 自动生成吗？这可能需要一些时间。`)) return;

    setIsProcessing(true);
    shouldStopRef.current = false;
    setProgress({ current: 0, total: missingLinks.length });
    
    let currentLinks = [...links];

    for (let i = 0; i < missingLinks.length; i++) {
        if (shouldStopRef.current) break;

        const link = missingLinks[i];
        try {
            const desc = await generateLinkDescription(link.title, link.url, localConfig);
            currentLinks = currentLinks.map(l => l.id === link.id ? { ...l, description: desc } : l);
            onUpdateLinks(currentLinks);
            setProgress({ current: i + 1, total: missingLinks.length });
        } catch (e) {
            console.error(`Failed to generate for ${link.title}`, e);
        }
    }

    setIsProcessing(false);
  };

  if (!isOpen) return null;



  const tabs = [
    { id: 'site', label: '网站设置', icon: Info },
    { id: 'ai', label: 'AI 设置', icon: Bot }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 dark:border-slate-700 flex max-h-[90vh] flex-col md:flex-row">
        <div className="w-full md:w-48 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 flex flex-row md:flex-col p-2 gap-1 overflow-x-auto shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'site' | 'ai')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-white dark:bg-slate-800">
          <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
            <h3 className="text-lg font-semibold dark:text-white">设置</h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
              <X className="w-5 h-5 dark:text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pb-12">
            {activeTab === 'site' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">网页标题 (Title)</label>
                    <input
                      type="text"
                      value={localSiteSettings.title}
                      onChange={(e) => handleSiteChange('title', e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">导航栏标题</label>
                    <input
                      type="text"
                      value={localSiteSettings.navTitle}
                      onChange={(e) => handleSiteChange('navTitle', e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">网站图标 (Favicon URL)</label>
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-600">
                        {localSiteSettings.favicon ? (
                          <img src={localSiteSettings.favicon} className="w-full h-full object-cover" />
                        ) : (
                          <Globe size={20} className="text-slate-400" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={localSiteSettings.favicon}
                        onChange={(e) => handleSiteChange('favicon', e.target.value)}
                        placeholder="https://example.com/favicon.ico"
                        className="flex-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-slate-500">选择生成的随机图标 (点击右侧按钮刷新):</p>
                        <button
                          type="button"
                          onClick={() => updateGeneratedIcons(localSiteSettings.navTitle)}
                          className="text-xs flex items-center gap-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 px-2 py-1 rounded transition-colors"
                        >
                          <RefreshCw size={12} /> 随机生成
                        </button>
                      </div>
                      <div className="flex gap-2">
                        {generatedIcons.map((icon, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSiteChange('favicon', icon)}
                            className="w-8 h-8 rounded hover:ring-2 ring-blue-500 transition-all border border-slate-100 dark:border-slate-600"
                          >
                            <img src={icon} className="w-full h-full rounded" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">AI 提供商</label>
                  <select
                    value={localConfig.provider}
                    onChange={(e) => handleChange('provider', e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="gemini">Google Gemini</option>
                    <option value="openai">OpenAI Compatible (ChatGPT, DeepSeek, Claude...)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">API Key</label>
                  <div className="relative">
                    <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={localConfig.apiKey}
                      onChange={(e) => handleChange('apiKey', e.target.value)}
                      placeholder="sk-..."
                      className="w-full pl-10 p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Key 仅存储在本地浏览器缓存中，不会发送到我们的服务器。</p>
                </div>

                {localConfig.provider === 'openai' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Base URL (API 地址)</label>
                    <input
                      type="text"
                      value={localConfig.baseUrl}
                      onChange={(e) => handleChange('baseUrl', e.target.value)}
                      placeholder="https://api.openai.com/v1"
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">模型名称 (Model Name)</label>
                  <input
                    type="text"
                    value={localConfig.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    placeholder={localConfig.provider === 'gemini' ? "gemini-2.5-flash" : "gpt-3.5-turbo"}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                  <h4 className="text-sm font-semibold mb-2 dark:text-slate-200">批量操作</h4>
                  {isProcessing ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>正在生成描述... ({progress.current}/{progress.total})</span>
                        <button
                          onClick={() => {
                            shouldStopRef.current = true;
                            setIsProcessing(false);
                          }}
                          className="text-red-500 flex items-center gap-1 hover:underline"
                        >
                          <PauseCircle size={12} /> 停止
                        </button>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleBulkGenerate}
                      className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-3 py-2 rounded-lg transition-colors border border-purple-200 dark:border-purple-800"
                    >
                      <Sparkles size={16} /> 一键补全所有缺失的描述
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end bg-slate-50 dark:bg-slate-800/50 shrink-0">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
            >
              <Save size={18} /> 保存更改
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
