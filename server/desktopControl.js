import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';

const execPromise = util.promisify(exec);

// Predefined app mapping
const APP_MAP = {
  'chrome': 'start chrome',
  'navegador': 'start msedge',
  'edge': 'start msedge',
  'vscode': 'code',
  'bloco de notas': 'notepad',
  'notepad': 'notepad',
  'calculadora': 'calc',
  'explorador': 'explorer',
  'arquivos': 'explorer',
  'spotify': 'start spotify',
  'gerenciador de tarefas': 'taskmgr',
  'cmd': 'start cmd',
  'terminal': 'start powershell',
  'configurações': 'start ms-settings:',
  'paint': 'mspaint',
  'word': 'start winword',
  'excel': 'start excel',
  'ferramenta de captura': 'snippingtool'
};

/**
 * Execute PowerShell script
 */
async function runPowerShell(script) {
  try {
    const encodedScript = Buffer.from(script, 'utf16le').toString('base64');
    const command = `powershell -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${encodedScript}`;
    const { stdout, stderr } = await execPromise(command, { maxBuffer: 10 * 1024 * 1024 });
    return { success: true, output: stdout ? stdout.trim() : '', error: stderr ? stderr.trim() : null };
  } catch (err) {
    return { success: false, output: null, error: err.message || String(err) };
  }
}

/**
 * Launch application by name or path
 */
export async function launchApplication(appName) {
  const cleanName = appName.toLowerCase().trim();
  let cmd = APP_MAP[cleanName];

  if (!cmd) {
    // Try generic start for app name
    cmd = `start "" "${appName}"`;
  }

  try {
    await execPromise(cmd, { shell: 'powershell.exe' });
    return { success: true, message: `Aplicativo "${appName}" executado com sucesso.` };
  } catch (err) {
    // Fallback: try powershell Start-Process
    const psResult = await runPowerShell(`Start-Process -FilePath "${appName}" -ErrorAction Stop`);
    if (psResult.success) {
      return { success: true, message: `Aplicativo "${appName}" iniciado via PowerShell.` };
    }
    return { success: false, message: `Não foi possível abrir o aplicativo "${appName}": ${err.message}` };
  }
}

/**
 * Open URL in default browser
 */
export async function openUrl(url) {
  let targetUrl = url;
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }
  try {
    await execPromise(`Start-Process "${targetUrl}"`, { shell: 'powershell.exe' });
    return { success: true, message: `Navegador aberto em: ${targetUrl}` };
  } catch (err) {
    return { success: false, message: `Erro ao abrir URL: ${err.message}` };
  }
}

/**
 * Control Volume (Mute, Up, Down, Set Value)
 */
export async function setVolume(action, value = 10) {
  const script = `
    $wsh = New-Object -ComObject WScript.Shell
    switch ("${action}") {
      "mute" { $wsh.SendKeys([char]173); break }
      "down" { for($i=0; $i -lt ${Math.min(value, 20)}; $i++) { $wsh.SendKeys([char]174) }; break }
      "up"   { for($i=0; $i -lt ${Math.min(value, 20)}; $i++) { $wsh.SendKeys([char]175) }; break }
    }
  `;
  const res = await runPowerShell(script);
  return res.success 
    ? { success: true, message: `Ação de volume (${action}) executada.` }
    : { success: false, message: `Falha ao ajustar volume.` };
}

/**
 * Capture Desktop Screenshot and return Base64 image
 */
export async function captureScreenshot() {
  const tempPath = path.join(os.tmpdir(), `aura_screenshot_${Date.now()}.png`);
  const psScript = `
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen
    $bounds = $screen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
    $bitmap.Save("${tempPath.replace(/\\/g, '\\\\')}", [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
  `;

  const res = await runPowerShell(psScript);

  if (fs.existsSync(tempPath)) {
    const imgBuffer = fs.readFileSync(tempPath);
    const base64Img = `data:image/png;base64,${imgBuffer.toString('base64')}`;
    try { fs.unlinkSync(tempPath); } catch (e) {}
    return { success: true, dataUrl: base64Img, message: 'Captura de tela realizada com sucesso.' };
  }

  return { success: false, message: 'Falha ao capturar a tela do sistema: ' + res.error };
}

/**
 * Get active running processes sorted by memory usage
 */
export async function getRunningProcesses() {
  const psScript = `
    Get-Process | Sort-Object WS -Descending | Select-Object -First 15 Id, ProcessName, @{Name="CPU_Seconds";Expression={[math]::Round($_.CPU, 2)}}, @{Name="Memory_MB";Expression={[math]::Round($_.WS / 1MB, 2)}} | ConvertTo-Json
  `;
  const res = await runPowerShell(psScript);
  if (res.success && res.output) {
    try {
      const parsed = JSON.parse(res.output);
      return { success: true, processes: Array.isArray(parsed) ? parsed : [parsed] };
    } catch (e) {
      return { success: false, error: 'Erro ao interpretar processos.' };
    }
  }
  return { success: false, error: res.error };
}

/**
 * Kill process by PID or Name
 */
export async function killProcess(target) {
  const isPid = /^\d+$/.test(target);
  const cmd = isPid ? `Stop-Process -Id ${target} -Force` : `Stop-Process -Name "${target}" -Force`;
  const res = await runPowerShell(cmd);
  return res.success 
    ? { success: true, message: `Processo "${target}" encerrado.` }
    : { success: false, message: `Não foi possível encerrar o processo "${target}": ${res.error}` };
}

/**
 * Lock System Screen
 */
export async function lockSystem() {
  const res = await runPowerShell('rundll32.exe user32.dll,LockWorkStation');
  return res.success 
    ? { success: true, message: 'Estação de trabalho bloqueada.' }
    : { success: false, message: 'Falha ao bloquear tela.' };
}

/**
 * Empty Recycle Bin
 */
export async function emptyRecycleBin() {
  const res = await runPowerShell('Clear-RecycleBin -Force -ErrorAction SilentlyContinue');
  return { success: true, message: 'Lixeira do Windows limpa com sucesso.' };
}

/**
 * Execute Arbitrary PowerShell / Terminal Command (Safe Output)
 */
export async function runTerminalCommand(commandText) {
  const res = await runPowerShell(commandText);
  return {
    success: res.success,
    command: commandText,
    output: res.output || '(Sem saída de texto)',
    error: res.error
  };
}

/**
 * Simulate typing text
 */
export async function simulateTyping(text) {
  const escapedText = text.replace(/[{}+^~%()\[\]]/g, '{$&}').replace(/"/g, '""');
  const script = `
    $wsh = New-Object -ComObject WScript.Shell
    $wsh.SendKeys("${escapedText}")
  `;
  const res = await runPowerShell(script);
  return res.success ? { success: true, message: 'Texto digitado no sistema.' } : { success: false, error: res.error };
}
