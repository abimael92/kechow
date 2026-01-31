#!/usr/bin/env node
/**
 * Identifies all places using i18n translation (t(), $t()) so they can be
 * replaced with correct Spanish content instead of translation keys.
 *
 * Usage: node scripts/find-translation-usage.mjs [--json] [--out file]
 *   --json   Output machine-readable JSON
 *   --out    Write report to file (default: stdout)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'src');

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const outIdx = args.indexOf('--out');
const outFile = outIdx >= 0 ? args[outIdx + 1] : null;

// Patterns to find translation usage:
// - t('key'), t("key"), t(`key`)
// - t('key', { ... }) with interpolation
// - $t('key') in templates
// - useI18n() import / const { t } = useI18n()
const T_KEY_SIMPLE = /\bt\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
const T_KEY_WITH_PARAMS = /\bt\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*\{[^}]*\}\s*\)/g;
const T_KEY_TEMPLATE = /\bt\s*\(\s*`([^`]+)`\s*\)/g;
const T_KEY_DYNAMIC = /\bt\s*\(\s*([^)]+)\s*\)/g; // t(someVar), t(`key.${x}`)
const DOLLAR_T = /\$t\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
const DOLLAR_T_PARAMS = /\$t\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*[^)]+\)/g;
const USE_I18N = /useI18n\s*\(\s*\)/g;
const BIND_T = /:[\w.-]+="\s*t\s*\([^)]+\)\s*"/g;
const BIND_T_ATTR = /[\s:][\w.-]+="[^"]*\bt\s*\([^)]+\)[^"]*"/g;

function* walkDir(dir, ext = ['.vue', '.ts', '.js']) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules' && !e.name.startsWith('.')) {
      yield* walkDir(full, ext);
    } else if (e.isFile() && ext.some((x) => e.name.endsWith(x))) {
      yield full;
    }
  }
}

function extractMatches(content, regex, group = 1) {
  const out = [];
  let m;
  const re = new RegExp(regex.source, regex.flags);
  while ((m = re.exec(content)) !== null) {
    out.push(m[group] ?? m[0]);
  }
  return out;
}

function findAllMatches(filePath, content) {
  const lines = content.split(/\r?\n/);
  const results = [];

  // t('key') or t("key")
  const tSimple = /\bt\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  let m;
  while ((m = tSimple.exec(content)) !== null) {
    const lineNum = content.slice(0, m.index).split(/\r?\n/).length;
    results.push({
      line: lineNum,
      type: 't(key)',
      key: m[1],
      snippet: lines[lineNum - 1]?.trim().slice(0, 100) || '',
    });
  }

  // t('key', { ... })
  const tParams = /\bt\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*\{/g;
  while ((m = tParams.exec(content)) !== null) {
    const lineNum = content.slice(0, m.index).split(/\r?\n/).length;
    results.push({
      line: lineNum,
      type: 't(key, params)',
      key: m[1],
      snippet: lines[lineNum - 1]?.trim().slice(0, 100) || '',
    });
  }

  // $t('key') or $t("key")
  const dollarT = /\$t\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  while ((m = dollarT.exec(content)) !== null) {
    const lineNum = content.slice(0, m.index).split(/\r?\n/).length;
    results.push({
      line: lineNum,
      type: '$t(key)',
      key: m[1],
      snippet: lines[lineNum - 1]?.trim().slice(0, 100) || '',
    });
  }

  // $t('key', count) or $t('key', params)
  const dollarTParams = /\$t\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*[^)]+\)/g;
  while ((m = dollarTParams.exec(content)) !== null) {
    const lineNum = content.slice(0, m.index).split(/\r?\n/).length;
    results.push({
      line: lineNum,
      type: '$t(key, params)',
      key: m[1],
      snippet: lines[lineNum - 1]?.trim().slice(0, 100) || '',
    });
  }

  // t(`key`) or t(someVar) - dynamic key
  const tDynamic = /\bt\s*\(\s*(`[^`]+`|[a-zA-Z_$.]+(?:\.[a-zA-Z_$0-9]+)*)\s*\)/g;
  while ((m = tDynamic.exec(content)) !== null) {
    const key = m[1];
    if (key.startsWith("'") || key.startsWith('"')) continue; // already covered
    const lineNum = content.slice(0, m.index).split(/\r?\n/).length;
    results.push({
      line: lineNum,
      type: 't(dynamic)',
      key: key,
      snippet: lines[lineNum - 1]?.trim().slice(0, 100) || '',
    });
  }

  // useI18n() - one per file
  if (/\buseI18n\s*\(\s*\)/.test(content)) {
    const idx = content.indexOf('useI18n()');
    const lineNum = content.slice(0, idx).split(/\r?\n/).length;
    results.push({
      line: lineNum,
      type: 'useI18n()',
      key: '(remove when replacing with Spanish)',
      snippet: 'const { t } = useI18n(); or similar',
    });
  }

  return results;
}

function suggestSpanish(key) {
  const map = {
    dashboard: 'Panel',
    subtitle: 'Gestiona tu negocio',
    welcomeBack: 'Bienvenido de nuevo',
    lastLogin: 'Último acceso',
    viewAll: 'Ver todo',
    recentOrders: 'Pedidos recientes',
    orderNumber: 'Pedido',
    items: 'artículos',
    continueShopping: 'Seguir comprando',
    myCart: 'Mi carrito',
    removeItem: 'Quitar del carrito',
    each: 'c/u',
    browseMenu: 'Ver restaurantes',
    subtotal: 'Subtotal',
    total: 'Total',
    free: 'Gratis',
    deliveryFee: 'Envío',
    saveChanges: 'Guardar cambios',
    reset: 'Restablecer',
    cancel: 'Cancelar',
    settings: 'Configuración',
    orders: 'Pedidos',
    retry: 'Reintentar',
    favorites: 'Favoritos',
    totalOrders: 'Total de pedidos',
    track: 'Rastrear',
    owner: 'Propietario',
    delivery: 'Repartidor',
    email: 'Correo electrónico',
    confirmPassword: 'Confirmar contraseña',
    password: 'Contraseña',
    name: 'Nombre',
  };
  const lower = key.split('.').pop()?.toLowerCase() || key.toLowerCase();
  return map[lower] ?? `[ES: ${key}]`;
}

function main() {
  const byFile = new Map();

  for (const filePath of walkDir(SRC)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(path.join(SRC, '..'), filePath);
    const matches = findAllMatches(filePath, content);
    if (matches.length > 0) {
      const withSuggestions = matches.map((m) => ({
        ...m,
        suggestedSpanish: m.type.startsWith('t(') || m.type.startsWith('$t') ? suggestSpanish(m.key) : null,
      }));
      byFile.set(relativePath, withSuggestions);
    }
  }

  const report = {
    summary: {
      filesWithTranslations: byFile.size,
      totalUsages: [...byFile.values()].reduce((acc, arr) => acc + arr.length, 0),
    },
    byFile: Object.fromEntries(
      [...byFile.entries()].sort((a, b) => a[0].localeCompare(b[0]))
    ),
  };

  let output;
  if (asJson) {
    output = JSON.stringify(report, null, 2);
  } else {
    const lines = [
      '# Text to replace with correct Spanish content (no translation)',
      '',
      `Found ${report.summary.totalUsages} translation usages in ${report.summary.filesWithTranslations} files.`,
      '',
      'Replace each t(...) / $t(...) with the suggested Spanish (or your own).',
      'Then remove useI18n() where no longer needed.',
      '',
      '---',
      '',
    ];
    for (const [file, usages] of Object.entries(report.byFile)) {
      lines.push(`## ${file}`);
      lines.push('');
      for (const u of usages) {
        lines.push(`- **L${u.line}** \`${u.type}\` key: \`${u.key}\``);
        if (u.suggestedSpanish) {
          lines.push(`  → Suggested Spanish: **${u.suggestedSpanish}**`);
        }
        if (u.snippet) {
          lines.push(`  Snippet: ${u.snippet.replace(/\s+/g, ' ')}`);
        }
        lines.push('');
      }
      lines.push('');
    }
    output = lines.join('\n');
  }

  if (outFile) {
    fs.writeFileSync(outFile, output, 'utf8');
    console.error(`Report written to ${outFile}`);
  } else {
    console.log(output);
  }
}

main();
