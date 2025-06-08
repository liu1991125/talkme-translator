class MultilingualTranslator {
    constructor() {
        this.config = {
            apiProvider: 'openai',
            apiKey: '',
            model: 'gpt-3.5-turbo',
            baseUrl: 'https://api.openai.com/v1',
            sourceLanguage: 'chinese',
            targetLanguages: ['simplified_chinese', 'traditional_chinese', 'english', 'japanese', 'korean', 'spanish', 'russian', 'german', 'french', 'portuguese_br', 'vietnamese', 'arabic'],
            customPrompt: '请将以下{source_language}文本翻译成{language}，保持原意和语调：\n\n{text}'
        };
        
        this.sourceLanguageConfig = {
            chinese: {
                name: '中文',
                flag: '🇨🇳',
                prompt: '中文'
            },
            english: {
                name: 'English',
                flag: '🇺🇸',
                prompt: 'English'
            }
        };
        
        this.languageConfig = {
            simplified_chinese: {
                name: '简体中文',
                flag: '🇨🇳',
                prompt: '简体中文'
            },
            traditional_chinese: {
                name: '繁体中文',
                flag: '🇹🇼',
                prompt: '繁体中文（台湾用法）'
            },
            english: {
                name: 'English',
                flag: '🇺🇸',
                prompt: 'English'
            },
            japanese: {
                name: '日本語',
                flag: '🇯🇵',
                prompt: '日语（日本語）'
            },
            korean: {
                name: '한국어',
                flag: '🇰🇷',
                prompt: '韩语（한국어）'
            },
            spanish: {
                name: 'Español',
                flag: '🇪🇸',
                prompt: '西班牙语（Español）'
            },
            russian: {
                name: 'Русский',
                flag: '🇷🇺',
                prompt: '俄语（Русский）'
            },
            german: {
                name: 'Deutsch',
                flag: '🇩🇪',
                prompt: '德语（Deutsch）'
            },
            french: {
                name: 'Français',
                flag: '🇫🇷',
                prompt: '法语（Français）'
            },
            portuguese_br: {
                name: 'Português (BR)',
                flag: '🇧🇷',
                prompt: '葡萄牙语（巴西）'
            },
            vietnamese: {
                name: 'Tiếng Việt',
                flag: '🇻🇳',
                prompt: '越南语（Tiếng Việt）'
            },
            arabic: {
                name: 'العربية',
                flag: '🇸🇦',
                prompt: '阿拉伯语（العربية）'
            }
        };
        
        this.translationHistory = [];
        this.isTranslating = false;
        this.currentTranslations = {};
    }
    
    init() {
        this.loadConfig();
        this.loadHistory();
        this.setupEventListeners();
        this.renderLanguageCheckboxes();
        this.updateStats();
    }
    
    setupEventListeners() {
        // 配置面板切换 - 点击整个header区域都可以切换
        const configHeader = document.querySelector('.config-header');
        if (configHeader) {
            configHeader.addEventListener('click', () => {
                this.toggleConfigPanel();
            });
        }
        
        // 保存配置
        const saveConfig = document.getElementById('saveConfig');
        if (saveConfig) {
            saveConfig.addEventListener('click', () => {
                this.saveConfig();
            });
        }
        
        // 翻译按钮
        const translateBtn = document.getElementById('translateBtn');
        if (translateBtn) {
            translateBtn.addEventListener('click', () => {
                this.translateText();
            });
        }
        
        // 清空输入
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearInput();
            });
        }
        
        // 粘贴按钮
        const pasteBtn = document.getElementById('pasteBtn');
        if (pasteBtn) {
            pasteBtn.addEventListener('click', () => {
                this.pasteText();
            });
        }
        
        // 清空历史
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                this.clearHistory();
            });
        }
        
        // 复制全部结果
        const copyAllBtn = document.getElementById('copyAllBtn');
        if (copyAllBtn) {
            copyAllBtn.addEventListener('click', () => {
                this.copyAllResults();
            });
        }
        
        // 导出结果
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportResults();
            });
        }
        
        // 输入框字符计数
        const sourceText = document.getElementById('sourceText');
        if (sourceText) {
            sourceText.addEventListener('input', (e) => {
                this.updateCharCount(e.target.value.length);
            });
        }
        
        // 源语言选择器
        const sourceLanguage = document.getElementById('sourceLanguage');
        if (sourceLanguage) {
            sourceLanguage.addEventListener('change', (e) => {
                this.config.sourceLanguage = e.target.value;
                this.updatePlaceholder();
            });
        }
        
        // 快捷键支持
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.translateText();
                } else if (e.key === 'k') {
                    e.preventDefault();
                    document.getElementById('sourceText').focus();
                }
            }
        });
    }
    
    toggleConfigPanel() {
        const content = document.getElementById('configContent');
        const toggle = document.getElementById('toggleConfig');
        
        if (content.classList.contains('show')) {
            content.classList.remove('show');
            toggle.classList.remove('rotated');
        } else {
            content.classList.add('show');
            toggle.classList.add('rotated');
        }
    }
    
    renderLanguageCheckboxes() {
        const container = document.getElementById('languageCheckboxes');
        container.innerHTML = '';
        
        Object.entries(this.languageConfig).forEach(([key, lang]) => {
            const div = document.createElement('div');
            div.className = 'checkbox-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `lang_${key}`;
            checkbox.value = key;
            checkbox.checked = this.config.targetLanguages.includes(key);
            
            const label = document.createElement('label');
            label.htmlFor = `lang_${key}`;
            label.innerHTML = `${lang.flag} ${lang.name}`;
            
            div.appendChild(checkbox);
            div.appendChild(label);
            container.appendChild(div);
        });
    }
    
    saveConfig() {
        // 获取API配置
        this.config.apiProvider = document.getElementById('apiProvider').value;
        this.config.apiKey = document.getElementById('apiKey').value;
        this.config.model = document.getElementById('model').value;
        this.config.baseUrl = document.getElementById('baseUrl').value;
        this.config.customPrompt = document.getElementById('customPrompt').value;
        this.config.sourceLanguage = document.getElementById('sourceLanguage').value;
        
        // 获取选中的语言
        const selectedLanguages = [];
        document.querySelectorAll('#languageCheckboxes input[type="checkbox"]:checked').forEach(checkbox => {
            selectedLanguages.push(checkbox.value);
        });
        this.config.targetLanguages = selectedLanguages;
        
        // 保存到本地存储
        localStorage.setItem('translatorConfig', JSON.stringify(this.config));
        
        // 显示成功消息
        this.showMessage('配置已保存！', 'success');
    }
    
    loadConfig() {
        const saved = localStorage.getItem('translatorConfig');
        if (saved) {
            this.config = { ...this.config, ...JSON.parse(saved) };
        }
        
        // 填充表单
        document.getElementById('apiProvider').value = this.config.apiProvider;
        document.getElementById('apiKey').value = this.config.apiKey;
        document.getElementById('model').value = this.config.model;
        document.getElementById('baseUrl').value = this.config.baseUrl;
        document.getElementById('customPrompt').value = this.config.customPrompt;
        document.getElementById('sourceLanguage').value = this.config.sourceLanguage;
        
        // 更新占位符文本
        this.updatePlaceholder();
    }
    
    updatePlaceholder() {
        const sourceText = document.getElementById('sourceText');
        const sourceLanguage = this.config.sourceLanguage;
        
        if (sourceLanguage === 'chinese') {
            sourceText.placeholder = '请输入要翻译的文本...';
        } else {
            sourceText.placeholder = 'Please enter the text to translate...';
        }
    }
    
    async translateText() {
        const sourceText = document.getElementById('sourceText').value.trim();
        
        if (!sourceText) {
            this.showMessage('请输入要翻译的文本', 'error');
            return;
        }
        
        if (!this.config.apiKey) {
            this.showMessage('请先配置API密钥', 'error');
            return;
        }
        
        if (this.config.targetLanguages.length === 0) {
            this.showMessage('请至少选择一种目标语言', 'error');
            return;
        }
        
        this.isTranslating = true;
        this.updateTranslateButton(true);
        this.showLoading(true);
        this.currentTranslations = {};
        
        // 显示结果区域
        this.showResults();
        
        try {
            // 并行翻译所有语言
            const translationPromises = this.config.targetLanguages.map(async (langKey) => {
                try {
                    const result = await this.translateToLanguage(sourceText, langKey);
                    this.currentTranslations[langKey] = result;
                    this.updateTranslationCard(langKey, result, false);
                    this.updateProgress();
                    return { success: true, langKey };
                } catch (error) {
                    console.error(`翻译到${langKey}失败:`, error);
                    this.updateTranslationCard(langKey, `翻译失败: ${error.message}`, true);
                    return { success: false, langKey, error };
                }
            });
            
            const results = await Promise.all(translationPromises);
            
            // 检查翻译结果
            const successCount = results.filter(r => r.success).length;
            const totalCount = results.length;
            
            if (successCount > 0) {
                // 有成功的翻译，保存到历史记录
                this.saveToHistory(sourceText, this.currentTranslations);
                this.updateStats();
                
                if (successCount < totalCount) {
                    // 部分成功
                    this.showMessage(`翻译完成，${successCount}/${totalCount} 种语言翻译成功`, 'info');
                } else {
                    // 全部成功
                    this.showMessage('翻译完成', 'success');
                }
            } else {
                // 全部失败
                this.showMessage('所有语言翻译都失败了，请检查配置和网络连接', 'error');
            }
            
        } catch (error) {
            console.error('翻译过程出错:', error);
            this.showMessage('翻译过程中出现严重错误', 'error');
        } finally {
            this.isTranslating = false;
            this.updateTranslateButton(false);
            this.showLoading(false);
        }
    }
    
    async translateToLanguage(text, targetLang) {
        const langConfig = this.languageConfig[targetLang];
        const sourceLanguageConfig = this.sourceLanguageConfig[this.config.sourceLanguage];
        const prompt = this.config.customPrompt
            .replace('{source_language}', sourceLanguageConfig.prompt)
            .replace('{language}', langConfig.prompt)
            .replace('{text}', text);
        
        const requestBody = {
            model: this.config.model,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 2000
        };
        
        const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content.trim();
    }
    
    showResults() {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';
        
        const grid = document.getElementById('translationGrid');
        grid.innerHTML = '';
        
        // 为每种目标语言创建卡片
        this.config.targetLanguages.forEach(langKey => {
            const card = this.createTranslationCard(langKey);
            grid.appendChild(card);
        });
    }
    
    createTranslationCard(langKey) {
        const langConfig = this.languageConfig[langKey];
        
        const card = document.createElement('div');
        card.className = 'translation-card loading';
        card.id = `card_${langKey}`;
        
        card.innerHTML = `
            <div class="card-header">
                <div class="language-label">
                    <span class="language-flag">${langConfig.flag}</span>
                    ${langConfig.name}
                </div>
                <button class="copy-btn" onclick="translator.copyTranslation('${langKey}')">
                    <i class="fas fa-copy"></i> 复制
                </button>
            </div>
            <div class="translation-text" id="text_${langKey}">
                <div class="translation-loading">
                    <div class="mini-spinner"></div>
                    翻译中...
                </div>
            </div>
        `;
        
        return card;
    }
    
    updateTranslationCard(langKey, text, isError = false) {
        const card = document.getElementById(`card_${langKey}`);
        const textElement = document.getElementById(`text_${langKey}`);
        
        if (isError) {
            card.classList.add('error');
            card.classList.remove('loading');
            textElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${text}`;
        } else {
            card.classList.remove('loading', 'error');
            textElement.textContent = text;
        }
    }
    
    updateProgress() {
        const completed = Object.keys(this.currentTranslations).length;
        const total = this.config.targetLanguages.length;
        const percentage = (completed / total) * 100;
        
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
    }
    
    copyTranslation(langKey) {
        const text = this.currentTranslations[langKey];
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                this.showMessage('已复制到剪贴板', 'success');
            }).catch(() => {
                this.showMessage('复制失败', 'error');
            });
        }
    }
    
    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.style.display = 'block';
            // 重置进度条
            const progressFill = document.getElementById('progressFill');
            if (progressFill) {
                progressFill.style.width = '0%';
            }
        } else {
            loading.style.display = 'none';
        }
    }
    
    updateTranslateButton(isTranslating) {
        const btn = document.getElementById('translateBtn');
        if (isTranslating) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 翻译中...';
        } else {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-language"></i> 开始翻译';
        }
    }
    
    updateCharCount(count) {
        const t = this.translations[this.currentLanguage];
        document.getElementById('charCount').textContent = `${count} ${t.characters}`;
    }
    
    clearInput() {
        document.getElementById('sourceText').value = '';
        this.updateCharCount(0);
        document.getElementById('resultsSection').style.display = 'none';
    }
    
    async pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('sourceText').value = text;
            this.updateCharCount(text.length);
        } catch (error) {
            this.showMessage('粘贴失败，请手动粘贴', 'error');
        }
    }
    
    copyAllResults() {
        if (Object.keys(this.currentTranslations).length === 0) {
            this.showMessage('没有可复制的翻译结果', 'error');
            return;
        }
        
        const sourceText = document.getElementById('sourceText').value;
        let content = `原文：${sourceText}\n\n`;
        
        Object.entries(this.currentTranslations).forEach(([langKey, text]) => {
            const langName = this.languageConfig[langKey]?.name || langKey;
            content += `${langName}：\n${text}\n\n`;
        });
        
        navigator.clipboard.writeText(content).then(() => {
            this.showMessage('所有翻译结果已复制到剪贴板', 'success');
        }).catch(() => {
            this.showMessage('复制失败', 'error');
        });
    }
    
    saveToHistory(sourceText, translations) {
        try {
            const historyItem = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                sourceText: sourceText,
                translations: translations,
                languages: Object.keys(translations)
            };
            
            this.translationHistory.unshift(historyItem);
            
            // 限制历史记录数量
            if (this.translationHistory.length > 50) {
                this.translationHistory = this.translationHistory.slice(0, 50);
            }
            
            this.saveHistory();
            this.renderHistory();
        } catch (error) {
            console.warn('保存历史记录时出错:', error);
        }
    }
    
    saveHistory() {
        localStorage.setItem('translationHistory', JSON.stringify(this.translationHistory));
    }
    
    loadHistory() {
        const saved = localStorage.getItem('translationHistory');
        if (saved) {
            this.translationHistory = JSON.parse(saved);
        }
        this.renderHistory();
    }
    
    renderHistory() {
        try {
            const container = document.getElementById('historyList');
            if (!container) {
                console.warn('历史记录容器不存在');
                return;
            }
            
            if (this.translationHistory.length === 0) {
                container.innerHTML = `
                    <div class="empty-history">
                        <i class="fas fa-history"></i>
                        <p>暂无翻译历史</p>
                    </div>
                `;
                return;
            }
        
            container.innerHTML = this.translationHistory.map(item => {
                const time = new Date(item.timestamp).toLocaleString('zh-CN');
                const preview = item.sourceText.length > 100 ? 
                    item.sourceText.substring(0, 100) + '...' : item.sourceText;
                
                return `
                    <div class="history-item" onclick="translator.loadFromHistory('${item.id}')">
                        <div class="history-item-header">
                            <span class="history-time">${time}</span>
                            <button class="tool-btn" onclick="event.stopPropagation(); translator.deleteHistoryItem('${item.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="history-text">${preview}</div>
                        <div class="history-languages">
                            ${item.languages.map(lang => 
                                `<span class="language-tag">${this.languageConfig[lang]?.name || lang}</span>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.warn('渲染历史记录时出错:', error);
        }
    }
    
    loadFromHistory(id) {
        const item = this.translationHistory.find(h => h.id == id);
        if (item) {
            document.getElementById('sourceText').value = item.sourceText;
            this.updateCharCount(item.sourceText.length);
            
            // 显示历史翻译结果
            this.currentTranslations = item.translations;
            this.showResults();
            
            // 更新翻译卡片
            Object.entries(item.translations).forEach(([langKey, text]) => {
                this.updateTranslationCard(langKey, text, false);
            });
        }
    }
    
    deleteHistoryItem(id) {
        this.translationHistory = this.translationHistory.filter(h => h.id != id);
        this.saveHistory();
        this.renderHistory();
        this.updateStats();
    }
    
    clearHistory() {
        if (confirm('确定要清空所有翻译历史吗？')) {
            this.translationHistory = [];
            this.saveHistory();
            this.renderHistory();
            this.updateStats();
            this.showMessage('历史记录已清空', 'success');
        }
    }
    
    exportResults() {
        if (Object.keys(this.currentTranslations).length === 0) {
            this.showMessage('没有可导出的翻译结果', 'error');
            return;
        }
        
        const sourceText = document.getElementById('sourceText').value;
        const timestamp = new Date().toLocaleString('zh-CN');
        
        let content = `翻译结果导出\n`;
        content += `导出时间: ${timestamp}\n`;
        content += `原文: ${sourceText}\n\n`;
        
        Object.entries(this.currentTranslations).forEach(([langKey, text]) => {
            const langName = this.languageConfig[langKey]?.name || langKey;
            content += `${langName}:\n${text}\n\n`;
        });
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `翻译结果_${new Date().getTime()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showMessage('翻译结果已导出', 'success');
    }
    
    updateStats() {
        try {
            const totalTranslationsEl = document.getElementById('totalTranslations');
            if (totalTranslationsEl) {
                totalTranslationsEl.textContent = this.translationHistory.length;
            }
            
            const totalChars = this.translationHistory.reduce((sum, item) => 
                sum + item.sourceText.length, 0);
            const totalCharactersEl = document.getElementById('totalCharacters');
            if (totalCharactersEl) {
                totalCharactersEl.textContent = totalChars;
            }
            
            const languageCount = new Set();
            this.translationHistory.forEach(item => {
                item.languages.forEach(lang => languageCount.add(lang));
            });
            const languageCountEl = document.getElementById('languageCount');
            if (languageCountEl) {
                languageCountEl.textContent = languageCount.size;
            }
        } catch (error) {
            console.warn('更新统计信息时出错:', error);
        }
    }
    
    showMessage(message, type = 'info') {
        // 创建消息提示
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        switch (type) {
            case 'success':
                messageDiv.style.background = '#28a745';
                break;
            case 'error':
                messageDiv.style.background = '#dc3545';
                break;
            default:
                messageDiv.style.background = '#17a2b8';
        }
        
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        // 3秒后自动移除
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
    

}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 初始化翻译器
let translator;
document.addEventListener('DOMContentLoaded', () => {
    translator = new MultilingualTranslator();
    translator.init();
});