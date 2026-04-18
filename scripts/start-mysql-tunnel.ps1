param(
  [string]$KeyPath = 'D:\SSH Key\kwlee_rsa',
  [string]$VmUser = 'ubuntu',
  [string]$VmHost = '118.107.202.103',
  [int]$LocalPort = 3307,
  [int]$RemotePort = 3306
)

$listener = Get-NetTCPConnection -LocalPort $LocalPort -State Listen -ErrorAction SilentlyContinue
if ($listener) {
  Write-Output "MySQL tunnel already listening on 127.0.0.1:$LocalPort"
  return
}

$ssh = 'C:\Windows\System32\OpenSSH\ssh.exe'
$forward = "${LocalPort}:127.0.0.1:${RemotePort}"
$target = "$VmUser@$VmHost"
$process = Start-Process $ssh -ArgumentList @('-i', $KeyPath, '-o', 'StrictHostKeyChecking=no', '-N', '-L', $forward, $target) -WindowStyle Hidden -PassThru

Start-Sleep -Seconds 3
$listener = Get-NetTCPConnection -LocalPort $LocalPort -State Listen -ErrorAction SilentlyContinue
if (-not $listener) {
  throw "Failed to start the MySQL tunnel on 127.0.0.1:$LocalPort"
}

Write-Output "MySQL tunnel ready on 127.0.0.1:$LocalPort (PID: $($process.Id))"
