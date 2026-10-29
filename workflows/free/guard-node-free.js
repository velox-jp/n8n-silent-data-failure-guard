// ===== Silent Data Failure Guard (Free) v1.0 =====
// Place this Code node right after the node you want to check.
// Turn on "Always Output Data" on that previous node, so this Guard still runs when it returns nothing.
// If a check fails, this node throws an error: the execution is marked as failed
// and your Error Workflow (Workflow settings > Error Workflow) is triggered.
// If all checks pass, the items go through unchanged.
//
// The Free version checks for empty output and one required field.
// The Pro version adds: any number of required fields, minimum item count,
// sudden-drop detection, type/format rules, and an alert template for email, Slack and Telegram.

// ----- Settings -----
const REQUIRED_FIELD = 'id';  // One field name that every item must have. Dot paths work: customer.email. '' = off
// ----- End of settings -----

const PREFIX = '[Silent Data Failure Guard]';
const MAX_EXAMPLES = 3;

const items = $input.all();
const isEmptyObject = (j) => !j || (typeof j === 'object' && Object.keys(j).length === 0);
const nonEmpty = items.filter((item) => !isEmptyObject(item.json));
const count = nonEmpty.length;
const ignored = items.length - count;
const problems = [];

const getPath = (obj, path) =>
  path.split('.').reduce((value, key) => (value == null ? undefined : value[key]), obj);
const isBlank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const itemList = (indexes) =>
  indexes.slice(0, MAX_EXAMPLES).map((i) => `#${i + 1}`).join(', ') + (indexes.length > MAX_EXAMPLES ? ', ...' : '');

// 1. Empty output
if (count === 0) {
  problems.push(`Received 0 items` + (ignored > 0 ? ` (${ignored} empty item(s) ignored)` : ''));
}

// 2. One required field
const field = String(REQUIRED_FIELD || '').trim();
if (field && count > 0) {
  const missing = [];
  nonEmpty.forEach((item, i) => {
    if (isBlank(getPath(item.json, field))) missing.push(i);
  });
  if (missing.length > 0) {
    problems.push(`Field "${field}" is missing or empty in ${missing.length} of ${count} item(s) (${itemList(missing)})`);
  }
}

if (problems.length > 0) {
  throw new Error(`${PREFIX} ${problems.join(' | ')}`);
}

return items;
