# Wiseman Analytics Prototype compiler
$index = Get-Content -Path "index.html" -Raw -Encoding utf8
$css = Get-Content -Path "css\style.css" -Raw -Encoding utf8

$content = $index.Replace('<link rel="stylesheet" href="css/style.css">', "<style>`n$css`n</style>")

$jsFiles = @("config.js", "risk.js", "ai.js", "chart.js", "terminator.js", "auth.js", "app.js")
$jsCombined = ""

foreach ($file in $jsFiles) {
    $jsPath = "js\$file"
    if (Test-Path $jsPath) {
        $jsText = Get-Content -Path $jsPath -Raw -Encoding utf8
        $jsCombined += "// --- START $file ---`n$jsText`n// --- END $file ---`n`n"
    } else {
        Write-Warning "File not found: $jsPath"
    }
}

$content = $content.Replace('<script src="js/config.js"></script>', "")
$content = $content.Replace('<script src="js/risk.js"></script>', "")
$content = $content.Replace('<script src="js/ai.js"></script>', "")
$content = $content.Replace('<script src="js/chart.js"></script>', "")
$content = $content.Replace('<script src="js/terminator.js"></script>', "")
$content = $content.Replace('<script src="js/auth.js"></script>', "")
$content = $content.Replace('<script src="js/app.js"></script>', "<script>`n$jsCombined`n</script>")

Set-Content -Path "prototype.html" -Value $content -Encoding utf8
Write-Output "prototype.html compiled successfully!"
