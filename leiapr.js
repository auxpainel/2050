(function() {
    'use strict';

    let count = 0;
    let maxTimes = 300;
    let intervalId;
    let isRunning = false;
    let detectQuiz = true;
    let autoContinueAfterQuiz = false;
    let intervalTime = 1000;
    let quizCheckIntervalId = null;

    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

        :root {
            --primary-color: #4a90e2;
            --background-color: #222;
            --text-color: #f5f7fa;
            --success-color: #2ecc71;
            --danger-color: #e74c3c;
            --input-background: #2e3a45;
        }

        .leiacheat-bar {
            position: fixed;
            top: 16px;
            right: 16px;
            color: var(--text-color);
            padding: 10px 12px;
            border-radius: 10px;
            font-family: 'Roboto', sans-serif;
            z-index: 10000;
            cursor: pointer;
            background-color: rgba(74, 144, 226, 0.9);
            border: 1px solid rgba(255,255,255,0.06);
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            font-weight: 700;
            font-size: 13px;
        }

        .leiacheat-menu {
            display: block; /* ABERTO por padrão */
            position: fixed;
            top: 60px;
            right: 16px;
            background-color: var(--background-color);
            color: var(--text-color);
            padding: 12px;
            border-radius: 10px;
            font-family: 'Roboto', sans-serif;
            z-index: 10000;
            box-shadow: 0 8px 30px rgba(0,0,0,0.6);
            width: 270px;
            max-width: 90%;
        }

        .leiacheat-menu-header {
            text-align: center;
            margin-bottom: 8px;
        }

        .leiacheat-menu-header h2 {
            font-size: 16px;
            margin: 0;
            color: var(--primary-color);
        }

        .leiacheat-menu-section {
            margin-bottom: 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .leiacheat-menu button {
            padding: 8px 10px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.15s ease;
            width: 100%;
        }

        #start-btn { background-color: var(--success-color); color: #fff; }
        #stop-btn { background-color: var(--danger-color); color: #fff; }

        #seconds-input, #milliseconds-input {
            width: 100%;
            padding: 8px;
            border-radius: 6px;
            border: none;
            background: var(--input-background);
            color: var(--text-color);
            font-size: 13px;
        }

        .small-row {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .small-row label {
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
        }

        .leiacheat-menu-footer {
            text-align: center;
            margin-top: 6px;
            font-size: 11px;
            color: rgba(255,255,255,0.6);
        }

        @media (max-width: 480px) {
            .leiacheat-menu { width: 95%; right: 50%; transform: translateX(50%); top: 70px; }
            .leiacheat-bar { right: 50%; transform: translateX(50%); }
        }
    `;
    document.head.appendChild(style);

    function createBar() {
        const bar = document.createElement('div');
        bar.className = 'leiacheat-bar';
        bar.id = 'leiacheat-bar';
        bar.innerHTML = `LeiaCheat`;
        document.body.appendChild(bar);

        bar.addEventListener('click', toggleMenu);
    }

    function createMenu() {
        // evita criar menu duplicado
        if (document.querySelector('.leiacheat-menu')) return;

        const menu = document.createElement('div');
        menu.className = 'leiacheat-menu';
        menu.innerHTML = `
            <div class="leiacheat-menu-header">
                <h2>LeiaCheat</h2>
            </div>

            <div class="leiacheat-menu-section">
                <button id="start-btn">Iniciar</button>
                <button id="stop-btn" disabled>Parar</button>
            </div>

            <div class="leiacheat-menu-section">
                <div class="small-row">
                    <input type="number" id="seconds-input" placeholder="Segundos (ex: 2)">
                </div>
                <div class="small-row">
                    <input type="number" id="milliseconds-input" placeholder="Milissegundos (ex: 500)">
                </div>
            </div>

            <div class="leiacheat-menu-section">
                <label class="small-row"><input type="checkbox" id="detect-quiz" checked> Detectar atividade</label>
                <label class="small-row"><input type="checkbox" id="auto-continue"> Auto-continuar</label>
            </div>

            <div class="leiacheat-menu-footer">
                <div>v3.2 — wyzop__</div>
            </div>
        `;
        document.body.appendChild(menu);

        document.getElementById('start-btn').addEventListener('click', startInterval);
        document.getElementById('stop-btn').addEventListener('click', stopInterval);
        document.getElementById('seconds-input').addEventListener('input', updateIntervalFromSeconds);
        document.getElementById('milliseconds-input').addEventListener('input', updateIntervalFromMilliseconds);

        document.getElementById('detect-quiz').addEventListener('change', (e) => {
            detectQuiz = e.target.checked;
        });
        document.getElementById('auto-continue').addEventListener('change', (e) => {
            autoContinueAfterQuiz = e.target.checked;
        });
    }

    function toggleMenu() {
        const menu = document.querySelector('.leiacheat-menu');
        if (!menu) return;
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'leiacheat-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 18px;
            right: 18px;
            background: rgba(74,144,226,0.95);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            z-index: 10001;
            font-family: Roboto, sans-serif;
            font-size: 13px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) notification.parentNode.removeChild(notification);
            }, 300);
        }, 2200);
    }

    function updateIntervalFromSeconds() {
        const seconds = document.getElementById('seconds-input').value;
        if (seconds) {
            intervalTime = seconds * 1000;
            document.getElementById('milliseconds-input').value = '';
        }
    }

    function updateIntervalFromMilliseconds() {
        const milliseconds = document.getElementById('milliseconds-input').value;
        if (milliseconds) {
            intervalTime = parseInt(milliseconds);
            document.getElementById('seconds-input').value = '';
        }
    }

    function startInterval() {
        if (isRunning) {
            showNotification("O script já está em execução");
            return;
        }

        const secondsInput = document.getElementById('seconds-input').value;
        const millisecondsInput = document.getElementById('milliseconds-input').value;

        if (!secondsInput && !millisecondsInput) {
            showNotification("Defina tempo em segundos ou milissegundos.");
            return;
        }

        if (secondsInput && millisecondsInput) {
            showNotification("Escolha apenas segundos ou milissegundos.");
            return;
        }

        isRunning = true;
        count = 0;
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39, which: 39, bubbles: true });

        intervalId = setInterval(() => {
            if (detectQuiz && (document.querySelector('[data-quiz]') || document.querySelector('#quiz') || document.querySelector('.quiz-container') || document.querySelector('.activity-wrapper'))) {
                if (autoContinueAfterQuiz) {
                    if (!quizCheckIntervalId) {
                        quizCheckIntervalId = setInterval(() => {
                            if (!document.querySelector('[data-quiz]') && !document.querySelector('#quiz') && !document.querySelector('.quiz-container') && !document.querySelector('.activity-wrapper')) {
                                clearInterval(quizCheckIntervalId);
                                quizCheckIntervalId = null;
                                showNotification("Atividade finalizada. Continuando.");
                                document.dispatchEvent(event);
                            }
                        }, 1000);
                    }
                } else {
                    stopInterval();
                    showNotification("Parado por atividade (quiz).");
                }
                return;
            }

            document.dispatchEvent(event);
            count++;
        }, intervalTime);

        showNotification("Iniciado");
        document.getElementById('start-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;
    }

    function stopInterval() {
        if (!isRunning) return;
        clearInterval(intervalId);
        if (quizCheckIntervalId) {
            clearInterval(quizCheckIntervalId);
            quizCheckIntervalId = null;
        }
        isRunning = false;
        showNotification("Parado");
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        if (startBtn) startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
    }

    const RAYZEResolver = {
        bugDetected: false,
        learningData: {},
        adaptationThreshold: 3,

        initialize: function() {
            this.loadLearningData();
        },

        loadLearningData: function() {
            const savedData = localStorage.getItem('RAYZELearningData');
            if (savedData) {
                try {
                    this.learningData = JSON.parse(savedData);
                } catch (e) { this.learningData = {}; }
            }
        },

        saveLearningData: function() {
            try {
                localStorage.setItem('RAYZELearningData', JSON.stringify(this.learningData));
            } catch (e) {}
        },

        checkForBugs: function() {
            const detectedBugs = [
                this.checkQuizDetectionBug(),
                this.checkAutoContinueBug(),
                this.checkIntervalConsistencyBug(),
                this.checkUIResponsivenessBug()
            ].filter(bug => bug !== null);

            if (detectedBugs.length > 0) {
                this.bugDetected = true;
                this.learnAndAdapt(detectedBugs);
                showNotification("RAYZE: bugs detectados.");
            }
        },

        learnAndAdapt: function(detectedBugs) {
            detectedBugs.forEach(bug => {
                if (!this.learningData[bug.type]) {
                    this.learningData[bug.type] = { occurrences: 0, lastSolution: null };
                }

                this.learningData[bug.type].occurrences++;
                this.learningData[bug.type].lastSolution = String(bug.solution);

                if (this.learningData[bug.type].occurrences >= this.adaptationThreshold) {
                    this.implementPermanentFix(bug.type);
                }

                try { bug.solution(); } catch (e) {}
            });

            this.saveLearningData();
        },

        implementPermanentFix: function(bugType) {
            switch(bugType) {
                case 'quizDetection':
                    detectQuiz = () => {
                        return document.querySelector('[data-quiz], #quiz, .quiz-container, .activity-wrapper');
                    };
                    break;
                case 'autoContinue':
                    this.enhanceAutoContinue();
                    break;
                case 'intervalConsistency':
                    this.implementDynamicInterval();
                    break;
                case 'uiResponsiveness':
                    this.optimizeUIUpdates();
                    break;
            }
            showNotification(`RAYZE: fix aplicada ${bugType}`);
        },

        checkQuizDetectionBug: function() {
            if (detectQuiz && document.querySelector('[data-quiz]') && isRunning) {
                return {
                    type: 'quizDetection',
                    solution: () => {
                        stopInterval();
                        detectQuiz = () => document.querySelector('[data-quiz], #quiz');
                    }
                };
            }
            return null;
        },

        checkAutoContinueBug: function() {
            if (autoContinueAfterQuiz && !quizCheckIntervalId && isRunning) {
                return {
                    type: 'autoContinue',
                    solution: this.setupQuizCheckInterval
                };
            }
            return null;
        },

        checkIntervalConsistencyBug: function() {
            // função de medição simplificada
            return null;
        },

        checkUIResponsivenessBug: function() {
            return null;
        },

        setupQuizCheckInterval: function() {
            quizCheckIntervalId = setInterval(() => {
                if (!detectQuiz()) {
                    clearInterval(quizCheckIntervalId);
                    quizCheckIntervalId = null;
                    showNotification("Atividade encerrada. Continuando.");
                    startInterval();
                }
            }, 1000);
        },

        enhanceAutoContinue: function() {
            autoContinueAfterQuiz = true;
            const enhancedQuizCheck = () => {
                if (!document.querySelector('[data-quiz], #quiz, .quiz-container, .activity-wrapper')) {
                    clearInterval(quizCheckIntervalId);
                    quizCheckIntervalId = null;
                    showNotification("Atividade finalizada. Continuando.");
                    startInterval();
                }
            };
            quizCheckIntervalId = setInterval(enhancedQuizCheck, 500);
        },

        implementDynamicInterval: function() {
            // placeholder leve para ajuste dinâmico
            setInterval(() => {}, 60000);
        },

        optimizeUIUpdates: function() {
            // throttle simples
            const originalShow = showNotification;
            let inThrottle = false;
            showNotification = function(msg) {
                if (inThrottle) return;
                originalShow(msg);
                inThrottle = true;
                setTimeout(() => inThrottle = false, 800);
            };
        }
    };

    RAYZEResolver.initialize();
    setInterval(() => { RAYZEResolver.checkForBugs(); }, 5000);

    createBar();
    createMenu();

})();