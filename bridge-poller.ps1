while ($true) {
    try {
        $inbox = Invoke-RestMethod http://localhost:9724/inbox -Method GET -TimeoutSec 3
        if ($inbox.messages.Count -gt 0) {
            foreach ($msg in $inbox.messages) {
                Write-Host "New message:" $msg.id $msg.task
                $body = @{
                    id = $msg.id
                    acked = $msg.id
                    status = "done"
                    result = @{ task = $msg.task; note = "ClawX auto-poller running" }
                } | ConvertTo-Json -Compress
                Invoke-RestMethod http://localhost:9724/reply -Method POST -Body $body -ContentType "application/json" -TimeoutSec 10 | Out-Null
                Write-Host "Replied to" $msg.id
            }
        }
    } catch {
        Write-Host "Poll error:" $_.Exception.Message
    }
    Start-Sleep -Seconds 5
}
