// Minimal .xlsx writer: one sheet of text and numbers in an uncompressed zip. Opens in Excel, Google Sheets and Numbers.
const CRC = Array.from({ length: 256 }, (_, n) => {
  for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n >>> 0;
});
export const crc32 = bytes => {
  let c = ~0;
  for (const b of bytes) c = CRC[(c ^ b) & 255] ^ (c >>> 8);
  return ~c >>> 0;
};

// Little-endian header fields: [[value, byteLength], ...]
const le = fields => {
  const out = new Uint8Array(fields.reduce((s, [, n]) => s + n, 0)), v = new DataView(out.buffer);
  let i = 0;
  for (const [x, n] of fields) { n === 2 ? v.setUint16(i, x, true) : v.setUint32(i, x, true); i += n; }
  return out;
};

function zip(files) {
  const te = new TextEncoder(), local = [], central = [];
  let offset = 0;
  for (const [path, text] of files) {
    const name = te.encode(path), data = te.encode(text);
    // version 2.0, no flags, stored, time 0, date 1980-01-01, crc, sizes, name length, no extra field
    const meta = [[20, 2], [0, 2], [0, 2], [0, 2], [33, 2], [crc32(data), 4], [data.length, 4], [data.length, 4], [name.length, 2], [0, 2]];
    local.push(le([[0x04034b50, 4], ...meta]), name, data);
    central.push(le([[0x02014b50, 4], [20, 2], ...meta, [0, 2], [0, 2], [0, 2], [0, 4], [offset, 4]]), name);
    offset += 30 + name.length + data.length;
  }
  const size = central.reduce((s, b) => s + b.length, 0);
  const end = le([[0x06054b50, 4], [0, 2], [0, 2], [files.length, 2], [files.length, 2], [size, 4], [offset, 4], [0, 2]]);
  return new Blob([...local, ...central, end], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

// Student names are free text: drop characters XML 1.0 forbids, or Excel refuses the whole file.
const x = s => String(s ?? '')
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
  .replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const cell = v => (typeof v === 'number' && Number.isFinite(v)
  ? `<c t="n"><v>${v}</v></c>`
  : `<c t="inlineStr"><is><t xml:space="preserve">${x(v)}</t></is></c>`);
const NS = 'http://schemas.openxmlformats.org';

// rows: arrays of strings/numbers, first row is the header. widths: column widths in characters.
export function xlsx(rows, widths = []) {
  const cols = widths.length ? `<cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols>` : '';
  const head = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  return zip([
    ['[Content_Types].xml', `${head}<Types xmlns="${NS}/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`],
    ['_rels/.rels', `${head}<Relationships xmlns="${NS}/package/2006/relationships"><Relationship Id="rId1" Type="${NS}/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`],
    ['xl/workbook.xml', `${head}<workbook xmlns="${NS}/spreadsheetml/2006/main" xmlns:r="${NS}/officeDocument/2006/relationships"><sheets><sheet name="Results" sheetId="1" r:id="rId1"/></sheets></workbook>`],
    ['xl/_rels/workbook.xml.rels', `${head}<Relationships xmlns="${NS}/package/2006/relationships"><Relationship Id="rId1" Type="${NS}/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`],
    ['xl/worksheets/sheet1.xml', `${head}<worksheet xmlns="${NS}/spreadsheetml/2006/main">${cols}<sheetData>${rows.map(r => `<row>${r.map(cell).join('')}</row>`).join('')}</sheetData></worksheet>`],
  ]);
}
