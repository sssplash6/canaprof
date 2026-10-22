// Walks the zip the xlsx writer produces and checks every entry's checksum and the sheet's escaping.
import assert from 'node:assert/strict';
import { crc32 as zcrc } from 'node:zlib';
import { crc32, xlsx } from './public/js/xlsx.js';

assert.equal(crc32(new TextEncoder().encode('123456789')), 0xcbf43926);

const bytes = new Uint8Array(await xlsx([['Имя', 'Score'], ['Ali & <Vali>\u0007', 96]], [20, 10]).arrayBuffer());
const v = new DataView(bytes.buffer), td = new TextDecoder(), files = {};
let i = 0;
while (v.getUint32(i, true) === 0x04034b50) {
  const size = v.getUint32(i + 18, true), nameLen = v.getUint16(i + 26, true);
  const name = td.decode(bytes.subarray(i + 30, i + 30 + nameLen)), data = bytes.subarray(i + 30 + nameLen, i + 30 + nameLen + size);
  assert.equal(v.getUint32(i + 14, true), zcrc(data), `crc of ${name}`);
  files[name] = td.decode(data);
  i += 30 + nameLen + size;
}
assert.deepEqual(Object.keys(files).sort(), ['[Content_Types].xml', '_rels/.rels', 'xl/_rels/workbook.xml.rels', 'xl/workbook.xml', 'xl/worksheets/sheet1.xml']);
const sheet = files['xl/worksheets/sheet1.xml'];
assert.ok(sheet.includes('Ali &amp; &lt;Vali&gt;</t>'), 'escaped, control char dropped');
assert.ok(sheet.includes('<c t="n"><v>96</v></c>'));
assert.equal(v.getUint32(bytes.length - 22, true), 0x06054b50, 'end of central directory');
console.log('xlsx: ok');
