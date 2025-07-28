/**
 * Demo Placeholder System
 * Handles temporary demo launches and code viewing for blueprint pages
 */

// Demo placeholder functionality
function initializeDemoPlaceholders() {
    // Handle all demo launch buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('demo-launch-btn') || 
            e.target.closest('.demo-launch-btn')) {
            
            const button = e.target.classList.contains('demo-launch-btn') ? 
                          e.target : e.target.closest('.demo-launch-btn');
            const demoId = button.getAttribute('onclick')?.match(/launchDemo\('([^']+)'\)/)?.[1] || 'demo';
            
            e.preventDefault();
            launchDemo(demoId);
        }
        
        if (e.target.classList.contains('demo-button') || 
            e.target.closest('.demo-button')) {
            
            const button = e.target.classList.contains('demo-button') ? 
                          e.target : e.target.closest('.demo-button');
            
            if (button.getAttribute('onclick')?.includes('launchDemo')) {
                const demoId = button.getAttribute('onclick')?.match(/launchDemo\('([^']+)'\)/)?.[1] || 'demo';
                e.preventDefault();
                launchDemo(demoId);
            } else if (button.getAttribute('onclick')?.includes('viewCode')) {
                const codeId = button.getAttribute('onclick')?.match(/viewCode\('([^']+)'\)/)?.[1] || 'code';
                e.preventDefault();
                viewCode(codeId);
            }
        }
    });

    // Handle code tab switching
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('code-tab')) {
            const targetLang = e.target.getAttribute('data-lang') || e.target.getAttribute('data-tab');
            if (targetLang) {
                switchCodeTab(e.target, targetLang);
            }
        }
    });
}

// Launch demo placeholder
function launchDemo(demoId) {
    const modal = createDemoModal(demoId);
    document.body.appendChild(modal);
    
    // Show modal with animation
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
}

// View code placeholder
function viewCode(codeId) {
    const modal = createCodeModal(codeId);
    document.body.appendChild(modal);
    
    // Show modal with animation
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
}

// Create demo modal
function createDemoModal(demoId) {
    const demoTitles = {
        'flexgrid-bi': 'Interactive FlexGrid Demo',
        'charts-bi': 'Real-time Charting Demo',
        'blazor-hybrid-grid': 'Blazor Hybrid Data Grid Demo',
        'maui-shell': '.NET MAUI Shell Demo'
    };

    const modal = document.createElement('div');
    modal.className = 'demo-modal';
    modal.innerHTML = `
        <div class="demo-modal-content">
            <div class="demo-modal-header">
                <h3>${demoTitles[demoId] || 'Interactive Demo'}</h3>
                <button class="demo-modal-close">&times;</button>
            </div>
            <div class="demo-modal-body">
                <div class="demo-placeholder-content">
                    <div class="demo-placeholder-icon">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <h4>Demo Coming Soon</h4>
                    <p>This interactive demo is currently being prepared. It will showcase:</p>
                    <ul class="demo-features">
                        ${getDemoFeatures(demoId).map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <div class="demo-actions">
                        <button class="btn btn-primary" onclick="requestDemo('${demoId}')">
                            <i class="fas fa-envelope"></i> Request Demo Access
                        </button>
                        <button class="btn btn-secondary" onclick="viewDocumentation('${demoId}')">
                            <i class="fas fa-book"></i> View Documentation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add close functionality
    const closeBtn = modal.querySelector('.demo-modal-close');
    closeBtn.addEventListener('click', () => closeDemoModal(modal));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDemoModal(modal);
        }
    });

    return modal;
}

// Create code modal
function createCodeModal(codeId) {
    const modal = document.createElement('div');
    modal.className = 'demo-modal';
    modal.innerHTML = `
        <div class="demo-modal-content code-modal">
            <div class="demo-modal-header">
                <h3>Code Example</h3>
                <button class="demo-modal-close">&times;</button>
            </div>
            <div class="demo-modal-body">
                <div class="code-placeholder-content">
                    <div class="code-tabs">
                        <button class="code-tab active" data-lang="javascript">JavaScript</button>
                        <button class="code-tab" data-lang="csharp">C#</button>
                        <button class="code-tab" data-lang="html">HTML</button>
                    </div>
                    <div class="code-content">
                        <pre class="code-block active" data-lang="javascript"><code>// Sample JavaScript code for ${codeId}
function initialize${codeId.charAt(0).toUpperCase() + codeId.slice(1)}() {
    // Initialize component
    const element = document.getElementById('${codeId}');
    
    // Configure options
    const options = {
        autoResize: true,
        enableVirtualization: true,
        theme: 'modern'
    };
    
    // Create instance
    const instance = new Component(element, options);
    
    return instance;
}</code></pre>
                        <pre class="code-block" data-lang="csharp"><code>// Sample C# code for ${codeId}
public class ${codeId.charAt(0).toUpperCase() + codeId.slice(1)}Controller : ControllerBase
{
    [HttpGet]
    public async Task&lt;IActionResult&gt; Initialize()
    {
        // Initialize component
        var options = new ComponentOptions
        {
            AutoResize = true,
            EnableVirtualization = true,
            Theme = "modern"
        };
        
        var result = await ComponentService.InitializeAsync(options);
        return Ok(result);
    }
}</code></pre>
                        <pre class="code-block" data-lang="html"><code>&lt;!-- Sample HTML for ${codeId} --&gt;
&lt;div id="${codeId}" class="component-container"&gt;
    &lt;div class="component-header"&gt;
        &lt;h3&gt;Component Title&lt;/h3&gt;
    &lt;/div&gt;
    &lt;div class="component-body"&gt;
        &lt;!-- Component content will be rendered here --&gt;
    &lt;/div&gt;
&lt;/div&gt;</code></pre>
                    </div>
                    <div class="code-actions">
                        <button class="btn btn-primary" onclick="copyCode()">
                            <i class="fas fa-copy"></i> Copy Code
                        </button>
                        <button class="btn btn-secondary" onclick="downloadCode('${codeId}')">
                            <i class="fas fa-download"></i> Download Sample
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add close functionality
    const closeBtn = modal.querySelector('.demo-modal-close');
    closeBtn.addEventListener('click', () => closeDemoModal(modal));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDemoModal(modal);
        }
    });

    return modal;
}

// Get demo features based on ID
function getDemoFeatures(demoId) {
    const features = {
        'flexgrid-bi': [
            'Virtual scrolling with 1M+ records',
            'Real-time data filtering and sorting',
            'Excel-like editing capabilities',
            'Custom cell formatting',
            'Export to Excel functionality'
        ],
        'charts-bi': [
            'Real-time data visualization',
            '60+ chart types available',
            'Interactive tooltips and legends',
            'Responsive design',
            'Custom styling options'
        ],
        'blazor-hybrid-grid': [
            'Cross-platform data grid',
            'Shared business logic',
            'Platform-specific optimizations',
            'Real-time data synchronization',
            'Native desktop performance'
        ],
        'maui-shell': [
            'Native .NET MAUI window management',
            'Blazor WebView integration',
            'Platform-specific features',
            'Cross-platform deployment',
            'Native look and feel'
        ]
    };
    
    return features[demoId] || [
        'Interactive user interface',
        'Real-time data processing',
        'Responsive design',
        'Modern UI components',
        'Cross-platform compatibility'
    ];
}

// Switch code tabs
function switchCodeTab(clickedTab, targetLang) {
    const container = clickedTab.closest('.code-placeholder-content') || clickedTab.closest('.code-showcase');
    if (!container) return;

    // Update active tab
    container.querySelectorAll('.code-tab').forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');

    // Update active code block
    container.querySelectorAll('.code-block').forEach(block => {
        block.classList.remove('active');
        if (block.getAttribute('data-lang') === targetLang || block.getAttribute('data-content') === targetLang) {
            block.classList.add('active');
        }
    });
}

// Close demo modal
function closeDemoModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Placeholder actions
function requestDemo(demoId) {
    alert(`Demo request for ${demoId} submitted! You will be contacted with access details.`);
    const modal = document.querySelector('.demo-modal');
    if (modal) closeDemoModal(modal);
}

function viewDocumentation(demoId) {
    alert(`Opening documentation for ${demoId}...`);
    // In real implementation, would open docs in new tab
}

function copyCode() {
    const activeCode = document.querySelector('.code-block.active code');
    if (activeCode) {
        navigator.clipboard.writeText(activeCode.textContent).then(() => {
            alert('Code copied to clipboard!');
        });
    }
}

function downloadCode(codeId) {
    alert(`Downloading sample code for ${codeId}...`);
    // In real implementation, would trigger download
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeDemoPlaceholders);

// Export for global access
window.launchDemo = launchDemo;
window.viewCode = viewCode;
window.requestDemo = requestDemo;
window.viewDocumentation = viewDocumentation;
window.copyCode = copyCode;
window.downloadCode = downloadCode;