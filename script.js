class LanguageLearningPlatform {
    constructor() {
        this.init();
        this.practiceTemplates = this.initializeTemplates();
        this.vocabularyDatabase = this.initializeVocabulary();
    }

    init() {
        this.bindEvents();
        this.updateCurrentDate();
    }

    bindEvents() {
        const generateBtn = document.getElementById('generateBtn');
        const regenerateBtn = document.getElementById('regenerateBtn');
        const saveBtn = document.getElementById('saveBtn');
        const startPracticeBtn = document.getElementById('startPracticeBtn');
        const userInput = document.getElementById('userInput');

        generateBtn.addEventListener('click', () => this.generatePlan());
        regenerateBtn.addEventListener('click', () => this.regeneratePlan());
        saveBtn.addEventListener('click', () => this.savePlan());
        startPracticeBtn.addEventListener('click', () => this.startPractice());
        
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generatePlan();
            }
        });
    }

    updateCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        const today = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        dateElement.textContent = today.toLocaleDateString('zh-CN', options);
    }

    async generatePlan() {
        const userInput = document.getElementById('userInput').value.trim();
        
        if (!userInput) {
            this.showNotification('请输入您的学习需求', 'warning');
            return;
        }

        this.showLoading();
        
        try {
            // 模拟API调用延迟
            await this.delay(2000);
            
            const plan = this.generateCustomPlan(userInput);
            this.displayPlan(plan);
            this.hideLoading();
            this.showResults();
            
        } catch (error) {
            console.error('生成计划时出错:', error);
            this.showNotification('生成计划失败，请重试', 'error');
            this.hideLoading();
        }
    }

    generateCustomPlan(userInput) {
        const analysis = this.analyzeUserInput(userInput);
        const difficulty = this.determineDifficulty(analysis);
        
        return {
            difficulty: difficulty,
            warmUp: this.generateWarmUp(analysis),
            mainPractice: this.generateMainPractice(analysis),
            scenarios: this.generateScenarios(analysis),
            vocabulary: this.generateVocabulary(analysis),
            homework: this.generateHomework(analysis)
        };
    }

    analyzeUserInput(input) {
        const keywords = {
            business: ['商务', '商业', '工作', '会议', '客户', '谈判', '演讲'],
            daily: ['日常', '生活', '购物', '餐厅', '旅游', '交通'],
            academic: ['学术', '考试', '雅思', '托福', '论文', '研究'],
            social: ['社交', '朋友', '聚会', '约会', '闲聊'],
            beginner: ['初学', '基础', '入门', '简单'],
            intermediate: ['中级', '进阶', '提高'],
            advanced: ['高级', '流利', '专业', '深入']
        };

        const analysis = {
            topics: [],
            level: 'intermediate',
            focus: [],
            timePreference: '30分钟'
        };

        const lowerInput = input.toLowerCase();

        // 分析主题
        Object.keys(keywords).forEach(category => {
            if (['beginner', 'intermediate', 'advanced'].includes(category)) {
                if (keywords[category].some(keyword => lowerInput.includes(keyword))) {
                    analysis.level = category;
                }
            } else {
                if (keywords[category].some(keyword => lowerInput.includes(keyword))) {
                    analysis.topics.push(category);
                }
            }
        });

        // 如果没有识别到特定主题，默认为日常对话
        if (analysis.topics.length === 0) {
            analysis.topics.push('daily');
        }

        // 分析时间偏好
        if (lowerInput.includes('分钟')) {
            const timeMatch = lowerInput.match(/(\d+)分钟/);
            if (timeMatch) {
                analysis.timePreference = timeMatch[1] + '分钟';
            }
        }

        return analysis;
    }

    determineDifficulty(analysis) {
        const levelMap = {
            beginner: '初级',
            intermediate: '中级',
            advanced: '高级'
        };
        return levelMap[analysis.level] || '中级';
    }

    generateWarmUp(analysis) {
        const warmUpExercises = {
            beginner: [
                '发音练习：练习基础音标 /θ/, /ð/, /r/, /l/，每个音标重复10次',
                '口型训练：对着镜子练习元音发音，注意嘴型变化',
                '节奏练习：跟读简单句子，注意语调和重音'
            ],
            intermediate: [
                '连读练习：练习常见连读规则，如 "want to" → "wanna"',
                '语调训练：练习疑问句和陈述句的不同语调',
                '流利度练习：快速重复绕口令 3-5 遍'
            ],
            advanced: [
                '语音变化：练习弱读、省音等高级语音现象',
                '语调模仿：模仿native speaker的语调和节奏',
                '即兴发音：随机选择单词进行快速准确发音'
            ]
        };

        return warmUpExercises[analysis.level] || warmUpExercises.intermediate;
    }

    generateMainPractice(analysis) {
        const practiceTemplates = {
            business: {
                beginner: [
                    '自我介绍：用英语介绍自己的工作和职责（2分钟）',
                    '电话礼仪：练习接听和拨打商务电话的基本用语',
                    '邮件表达：大声朗读商务邮件常用句型'
                ],
                intermediate: [
                    '会议发言：准备一个3分钟的项目汇报',
                    '客户沟通：模拟与客户讨论产品特性的对话',
                    '谈判技巧：练习表达不同意见和寻求妥协的语言'
                ],
                advanced: [
                    '战略讨论：就公司发展策略进行5分钟演讲',
                    '危机处理：模拟处理客户投诉的复杂对话',
                    '跨文化交流：练习在国际会议中的发言技巧'
                ]
            },
            daily: {
                beginner: [
                    '购物对话：在商店询问价格和试穿衣服',
                    '餐厅点餐：练习看菜单和与服务员交流',
                    '问路指路：练习询问和给出方向指示'
                ],
                intermediate: [
                    '生活分享：描述你的周末活动和兴趣爱好',
                    '意见表达：就日常话题表达个人观点',
                    '经历叙述：讲述一次难忘的旅行经历'
                ],
                advanced: [
                    '深度讨论：就社会现象进行分析和评论',
                    '文化比较：比较不同国家的生活方式',
                    '未来规划：详细描述个人职业和生活规划'
                ]
            }
        };

        const topic = analysis.topics[0] || 'daily';
        const level = analysis.level;
        
        return practiceTemplates[topic]?.[level] || practiceTemplates.daily.intermediate;
    }

    generateScenarios(analysis) {
        const scenarios = {
            business: [
                '场景一：新员工入职，与同事进行自我介绍和了解公司文化',
                '场景二：参加部门会议，需要汇报工作进展和提出建议',
                '场景三：接待外国客户，介绍公司产品和服务'
            ],
            daily: [
                '场景一：在咖啡店与朋友聊天，讨论最近的生活和工作',
                '场景二：在健身房遇到新朋友，交流健身心得和经验',
                '场景三：参加朋友的生日聚会，与不同的人进行社交对话'
            ],
            academic: [
                '场景一：在图书馆与同学讨论课程作业和学习方法',
                '场景二：参加学术研讨会，提问和回答专业问题',
                '场景三：与导师讨论论文进展和研究方向'
            ]
        };

        const topic = analysis.topics[0] || 'daily';
        return scenarios[topic] || scenarios.daily;
    }

    generateVocabulary(analysis) {
        const vocabularyByTopic = {
            business: {
                words: ['negotiate', 'proposal', 'deadline', 'revenue', 'strategy'],
                phrases: ['close a deal', 'meet the deadline', 'market share', 'bottom line', 'win-win situation'],
                expressions: ['Let\'s get down to business', 'That\'s a deal breaker', 'We need to think outside the box']
            },
            daily: {
                words: ['convenient', 'delicious', 'exhausted', 'fascinating', 'gorgeous'],
                phrases: ['take it easy', 'piece of cake', 'break a leg', 'hit the books', 'call it a day'],
                expressions: ['How\'s it going?', 'What\'s up?', 'Long time no see', 'Take care', 'See you around']
            }
        };

        const topic = analysis.topics[0] || 'daily';
        const vocab = vocabularyByTopic[topic] || vocabularyByTopic.daily;

        return [
            `核心词汇：${vocab.words.join(', ')}`,
            `常用短语：${vocab.phrases.join(', ')}`,
            `地道表达：${vocab.expressions.join(', ')}`,
            '练习方法：每个词汇造句3个，录音回放检查发音'
        ];
    }

    generateHomework(analysis) {
        const homeworkTasks = {
            beginner: [
                '录制今日练习内容，回放检查发音准确性',
                '选择一个感兴趣的英语视频，跟读5分钟',
                '用今天学到的词汇写5个句子'
            ],
            intermediate: [
                '找一个英语播客，听10分钟并总结要点',
                '与语言交换伙伴进行15分钟对话练习',
                '写一篇100字的英语日记，使用今天的词汇'
            ],
            advanced: [
                '观看TED演讲，模仿演讲者的语调和表达方式',
                '参加在线英语讨论组，积极发言20分钟',
                '准备明天的即兴演讲话题，练习3分钟演讲'
            ]
        };

        return homeworkTasks[analysis.level] || homeworkTasks.intermediate;
    }

    displayPlan(plan) {
        document.getElementById('difficultyLevel').textContent = plan.difficulty;
        
        this.displaySection('warmUpContent', plan.warmUp);
        this.displaySection('mainPracticeContent', plan.mainPractice);
        this.displaySection('scenariosContent', plan.scenarios);
        this.displaySection('vocabularyContent', plan.vocabulary);
        this.displaySection('homeworkContent', plan.homework);
    }

    displaySection(elementId, content) {
        const element = document.getElementById(elementId);
        if (Array.isArray(content)) {
            element.innerHTML = '<ul>' + content.map(item => `<li>${item}</li>`).join('') + '</ul>';
        } else {
            element.innerHTML = content;
        }
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showResults() {
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }

    regeneratePlan() {
        this.generatePlan();
    }

    savePlan() {
        const plan = this.getCurrentPlan();
        const planData = {
            date: new Date().toISOString(),
            userInput: document.getElementById('userInput').value,
            plan: plan
        };
        
        localStorage.setItem('savedPlan_' + Date.now(), JSON.stringify(planData));
        this.showNotification('练习计划已保存！', 'success');
    }

    getCurrentPlan() {
        return {
            difficulty: document.getElementById('difficultyLevel').textContent,
            warmUp: document.getElementById('warmUpContent').innerHTML,
            mainPractice: document.getElementById('mainPracticeContent').innerHTML,
            scenarios: document.getElementById('scenariosContent').innerHTML,
            vocabulary: document.getElementById('vocabularyContent').innerHTML,
            homework: document.getElementById('homeworkContent').innerHTML
        };
    }

    startPractice() {
        this.showNotification('开始练习！建议按照计划顺序进行，记得录音检查效果。', 'info');
        
        // 可以在这里添加计时器功能
        this.startTimer();
    }

    startTimer() {
        let seconds = 0;
        const timer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            
            // 可以在页面上显示计时器
            console.log('练习时间:', timeString);
        }, 1000);
        
        // 保存计时器引用，以便后续停止
        this.currentTimer = timer;
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || '#17a2b8';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    initializeTemplates() {
        // 可以扩展更多模板
        return {};
    }

    initializeVocabulary() {
        // 可以扩展词汇数据库
        return {};
    }
}

// 添加通知动画样式
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

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new LanguageLearningPlatform();
});