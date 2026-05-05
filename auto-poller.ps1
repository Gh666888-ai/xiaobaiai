function Get-Inbox {
    try {
        $r = Invoke-WebRequest http://localhost:9724/inbox -Method GET -TimeoutSec 3
        return ($r.Content | ConvertFrom-Json)
    } catch { return $null }
}

function Send-Reply($id, $text) {
    $body = @{
        id = $id
        acked = $id
        status = "done"
        result = @{ output = $text }
    } | ConvertTo-Json -Compress
    Invoke-WebRequest http://localhost:9724/reply -Method POST -Body $body -ContentType "application/json" -TimeoutSec 10 | Out-Null
}

$lastIds = @{}
Write-Host "Auto poller started at $(Get-Date -Format 'HH:mm:ss')"

while ($true) {
    $inbox = Get-Inbox
    if ($inbox -and $inbox.messages.Count -gt 0) {
        foreach ($msg in $inbox.messages) {
            if ($lastIds.ContainsKey($msg.id)) { continue }
            $lastIds[$msg.id] = $true
            Write-Host "Executing:" $msg.message
            try {
                $out = Invoke-Expression $msg.message 2>&1 | Out-String
                Send-Reply $msg.id $out
                Write-Host "Done:" $msg.id
            } catch {
                $errMsg = $_.Exception.Message
                Send-Reply $msg.id "Error: $errMsg"
                Write-Host "Error:" $errMsg
            }
        }
    }
    Start-Sleep -Seconds 5
}
