function parseMessages(data) {
            if (!data || !Array.isArray(data.value)) return [];

            function extractConversationId(html) {
                if (!html) return null;
                const match = html.match(/> ?([A-Z0-9]+)<\/a>/i);
                return match ? match[1] : null;
            }

            function extractEscalationMsg(html) {
                if (!html) return null;
                const match = html.match(/EscalationexceptionMessage:\s*([^<]+)/i);
                return match ? match[1].trim() : null;
            }

            function extractUsername(html) {
                if (!html) return null;
                const match = html.match(/Username:\s*([^<\s]+@[^<\s]+)/i);
                return match ? match[1].trim() : null;
            }

            return data.value.map(msg => {
                const html = (msg.body && msg.body.content) || "";
                return {
                    ConversationID: extractConversationId(html),
                    EscalationexceptionMessage: extractEscalationMsg(html),
                    receivedDateTime: msg.receivedDateTime || null,
                    Username: extractUsername(html)
                };
            });
        }

        function processJson() {
            const inputTextarea = document.getElementById('inputJson');
            const outputTextarea = document.getElementById('outputJson');
            const messageDiv = document.getElementById('message');

            try {
                const inputValue = inputTextarea.value.trim();
                
                if (!inputValue) {
                    throw new Error('Please enter JSON data');
                }

                const jsonData = JSON.parse(inputValue);
                const result = parseMessages(jsonData);
                
                outputTextarea.value = JSON.stringify(result, null, 2);
                messageDiv.innerHTML = '<div class="success">✓ Extraction completed successfully</div>';
                
            } catch (error) {
                messageDiv.innerHTML = `<div class="error">✗ Error: ${error.message}</div>`;
                outputTextarea.value = '';
            }
        }

        function copyUrl() {
            const urlInput = document.getElementById('apiUrl');
            urlInput.select();
            document.execCommand('copy');
            
            const messageDiv = document.getElementById('message');
            messageDiv.innerHTML = '<div class="success">✓ URL copied to clipboard</div>';
            setTimeout(() => messageDiv.innerHTML = '', 2000);
        }

        // Allow processing with Ctrl+Enter
        document.getElementById('inputJson').addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                processJson();
            }
        });
