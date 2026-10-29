import { exec } from 'child_process';
import util from 'util';
import os from 'os';

const execPromise = util.promisify(exec);

async function runPowerShell(script) {
  try {
    const encodedScript = Buffer.from(script, 'utf16le').toString('base64');
    const command = `powershell -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${encodedScript}`;
    const { stdout } = await execPromise(command, { maxBuffer: 5 * 1024 * 1024 });
    return stdout ? stdout.trim() : '';
  } catch (err) {
    return null;
  }
}

export async function getSystemMetrics() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsagePercent = Math.round((usedMem / totalMem) * 100);

  const psScript = `
    $cpu = Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average | Select-Object -ExpandProperty Average
    $disk = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'" | Select-Object Size, FreeSpace
    @{
      CPU = [math]::Round($cpu, 1)
      DiskTotalGB = [math]::Round($disk.Size / 1GB, 1)
      DiskFreeGB = [math]::Round($disk.FreeSpace / 1GB, 1)
    } | ConvertTo-Json
  `;

  let cpuLoad = 12; // default fallback
  let diskStats = { total: 500, free: 250 };

  const rawJson = await runPowerShell(psScript);
  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      if (parsed.CPU !== undefined && parsed.CPU !== null) cpuLoad = parsed.CPU;
      if (parsed.DiskTotalGB) diskStats.total = parsed.DiskTotalGB;
      if (parsed.DiskFreeGB) diskStats.free = parsed.DiskFreeGB;
    } catch (e) {}
  }

  const uptimeHours = Math.floor(os.uptime() / 3600);
  const uptimeMinutes = Math.floor((os.uptime() % 3600) / 60);

  return {
    os: `${os.type()} ${os.release()} (${os.arch()})`,
    hostname: os.hostname(),
    cpuCount: os.cpus().length,
    cpuModel: os.cpus()[0]?.model || 'Processor',
    cpuUsage: cpuLoad,
    ramTotalGB: (totalMem / (1024 ** 3)).toFixed(1),
    ramUsedGB: (usedMem / (1024 ** 3)).toFixed(1),
    ramPercent: memUsagePercent,
    diskTotalGB: diskStats.total,
    diskFreeGB: diskStats.free,
    diskPercent: Math.round(((diskStats.total - diskStats.free) / diskStats.total) * 100),
    uptime: `${uptimeHours}h ${uptimeMinutes}m`
  };
}
