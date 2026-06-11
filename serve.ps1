# serve.ps1 - Pure PowerShell Lightweight HTTP Server
$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:${port}/")
$listener.Prefixes.Add("http://127.0.0.1:${port}/")
try {
    $listener.Start()
    Write-Output "Web server started successfully!"
    Write-Output "Navigate to: http://localhost:${port}/index.html or http://127.0.0.1:${port}/index.html"
} catch {
    Write-Error "Failed to start listener on port ${port}: $_"
    exit
}

$currentDir = "C:\Users\Shardul Patil\.gemini\antigravity\scratch\wiseman_analytics"
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }
        
        # Simple URL decode for spaces and paths
        $cleanPath = $urlPath.Replace("%20", " ").Replace("/", "\").TrimStart("\")
        $filePath = Join-Path $currentDir $cleanPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            
            # Set basic content type headers
            if ($filePath.EndsWith(".html")) { $response.ContentType = "text/html; charset=utf-8" }
            elseif ($filePath.EndsWith(".css")) { $response.ContentType = "text/css; charset=utf-8" }
            elseif ($filePath.EndsWith(".js")) { $response.ContentType = "application/javascript; charset=utf-8" }
            elseif ($filePath.EndsWith(".svg")) { $response.ContentType = "image/svg+xml" }
            else { $response.ContentType = "application/octet-stream" }
            
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.OutputStream.Close()
    } catch {
        Write-Output "Request error: $_"
    }
}
