#!/usr/bin/env node
/**
 * MUI v5 → v6 sx migration script
 *
 * Converts shorthand layout props on Box, Typography, Stack, and Grid
 * into the sx prop. Also handles PaperProps→slotProps and InputProps→slotProps.
 *
 * Usage:
 *   node migrate-mui-sx.js                  # dry run (shows diffs, no writes)
 *   node migrate-mui-sx.js --write          # apply changes
 *   node migrate-mui-sx.js --write --dir src/components   # limit to a folder
 */

const fs = require("fs");
const path = require("path");

// ─── Config ──────────────────────────────────────────────────────────────────

const DEFAULT_DIR = "src";
const EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];

// Props that must be moved into sx={} on these components
const SX_COMPONENTS = ["Box", "Typography", "Stack", "Grid", "Paper"];

// All props eligible for sx migration (covers Box system + common layout props)
const SX_PROPS = new Set([
  // spacing
  "m",
  "mt",
  "mr",
  "mb",
  "ml",
  "mx",
  "my",
  "p",
  "pt",
  "pr",
  "pb",
  "pl",
  "px",
  "py",
  // layout
  "display",
  "overflow",
  "textOverflow",
  "visibility",
  "whiteSpace",
  // flexbox
  "flexDirection",
  "flexWrap",
  "justifyContent",
  "alignItems",
  "alignContent",
  "order",
  "flexGrow",
  "flexShrink",
  "flexBasis",
  "flex",
  "alignSelf",
  "justifySelf",
  // grid
  "gridTemplateColumns",
  "gridTemplateRows",
  "gridColumn",
  "gridRow",
  "gridAutoFlow",
  // sizing
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  // positioning
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "zIndex",
  // borders
  "border",
  "borderTop",
  "borderRight",
  "borderBottom",
  "borderLeft",
  "borderColor",
  "borderRadius",
  // backgrounds & colors (shorthand only — full `color` kept as a Typography prop)
  "bgcolor",
  // typography shorthand props removed in v6
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
  "textAlign",
  "textTransform",
  // gap (was a valid shorthand in v5 via Box)
  "gap",
  "rowGap",
  "columnGap",
  // misc
  "boxShadow",
  "textDecoration",
]);

// Props that are NOT sx — keep them as-is even if they appear on SX_COMPONENTS
const KEEP_AS_PROP = new Set([
  "variant",
  "color",
  "align",
  "gutterBottom",
  "noWrap",
  "paragraph",
  "component",
  "href",
  "to",
  "onClick",
  "onChange",
  "onClose",
  "onOpen",
  "key",
  "ref",
  "id",
  "className",
  "style",
  "children",
  "aria-label",
  "direction",
  "spacing",
  "divider",
  "useFlexGap", // Stack's own props
  "container",
  "size",
  "columns",
  "                                    offset", // Grid's own props
  "elevation",
  "square", // Paper's own props
  "sx",
  "...",
  "data-testid",
]);

// ─── Separate migrations ──────────────────────────────────────────────────────

/**
 * PaperProps={{ ... }} → slotProps={{ paper: { ... } }}
 * Only on Menu, Select, Autocomplete, Popover, Popper (MUI v6 change)
 */
function migratePaperProps(src) {
  return src.replace(
    /PaperProps=\{(\{[\s\S]*?\})\}/g,
    (_, inner) => `slotProps={{ paper: ${inner} }}`
  );
}

/**
 * InputProps={{ ... }} → slotProps={{ input: { ... } }}
 * On TextField / Input / OutlinedInput
 */
function migrateInputProps(src) {
  // InputProps (capital I) = the inner <input> element props in v5
  return src.replace(
    /InputProps=\{(\{[\s\S]*?\})\}/g,
    (_, inner) => `slotProps={{ input: ${inner} }}`
  );
}

/**
 * InputLabelProps={{ ... }} → slotProps={{ inputLabel: { ... } }}
 */
function migrateInputLabelProps(src) {
  return src.replace(
    /InputLabelProps=\{(\{[\s\S]*?\})\}/g,
    (_, inner) => `slotProps={{ inputLabel: ${inner} }}`
  );
}

// ─── Core sx migration ────────────────────────────────────────────────────────

/**
 * Tokenise a JSX opening tag into an array of tokens:
 *   { type: 'prop', name, value }   ← a prop with its raw value string
 *   { type: 'text', value }         ← whitespace / other text
 */
function tokeniseTag(tagBody) {
  const tokens = [];
  let i = 0;

  while (i < tagBody.length) {
    // Skip whitespace between props
    const wsMatch = tagBody.slice(i).match(/^(\s+)/);
    if (wsMatch) {
      tokens.push({ type: "text", value: wsMatch[1] });
      i += wsMatch[1].length;
      continue;
    }

    // Boolean prop: just a name (no =)  e.g. gutterBottom
    const boolMatch = tagBody
      .slice(i)
      .match(/^([A-Za-z_][A-Za-z0-9_.-]*)(?=[\s/>]|$)/);
    if (boolMatch) {
      const name = boolMatch[1];
      tokens.push({ type: "prop", name, value: null }); // null = boolean true
      i += name.length;
      continue;
    }

    // Spread  {...something}
    const spreadMatch = tagBody.slice(i).match(/^(\{\.\.\.[\s\S]*?\})/);
    if (spreadMatch) {
      tokens.push({ type: "text", value: spreadMatch[1] });
      i += spreadMatch[1].length;
      continue;
    }

    // Prop with value:  name="..." or name={...}
    const nameMatch = tagBody.slice(i).match(/^([A-Za-z_][A-Za-z0-9_.-]*)=/);
    if (nameMatch) {
      const name = nameMatch[1];
      i += name.length + 1; // skip "name="

      let value;
      if (tagBody[i] === '"') {
        // String literal "..."
        const end = tagBody.indexOf('"', i + 1);
        value = tagBody.slice(i, end + 1);
        i = end + 1;
      } else if (tagBody[i] === "'") {
        const end = tagBody.indexOf("'", i + 1);
        value = tagBody.slice(i, end + 1);
        i = end + 1;
      } else if (tagBody[i] === "{") {
        // Brace-balanced expression
        let depth = 0;
        let j = i;
        while (j < tagBody.length) {
          if (tagBody[j] === "{") depth++;
          else if (tagBody[j] === "}") {
            depth--;
            if (depth === 0) break;
          }
          j++;
        }
        value = tagBody.slice(i, j + 1);
        i = j + 1;
      } else {
        // Fallback: grab until whitespace
        const end = tagBody.slice(i).search(/[\s/>]/);
        value = tagBody.slice(i, i + (end === -1 ? tagBody.length : end));
        i += value.length;
      }

      tokens.push({ type: "prop", name, value });
      continue;
    }

    // Anything else (e.g. "/>", ">") — stop
    break;
  }

  return tokens;
}

/**
 * Given the tokens for a single JSX tag, collect props that should
 * move into sx and rebuild the tag.
 */
function rebuildTag(componentName, tagBody, trailingClose) {
  const tokens = tokeniseTag(tagBody);

  const sxProps = []; // { name, value } to fold into sx
  const keepTokens = []; // tokens to keep as-is

  // Find existing sx prop if any
  let existingSxToken = null;

  for (const tok of tokens) {
    if (tok.type !== "prop") {
      keepTokens.push(tok);
      continue;
    }

    if (tok.name === "sx") {
      existingSxToken = tok;
      keepTokens.push(tok); // placeholder — we'll replace it
      continue;
    }

    if (SX_PROPS.has(tok.name) && !KEEP_AS_PROP.has(tok.name)) {
      sxProps.push(tok);
    } else {
      keepTokens.push(tok);
    }
  }

  if (sxProps.length === 0) return null; // nothing to migrate

  // Build sx value pairs string
  const newPairs = sxProps.map((p) => {
    if (p.value === null) return `${p.name}: true`;
    if (p.value.startsWith('"') || p.value.startsWith("'")) {
      // string → keep as string
      return `${p.name}: ${p.value}`;
    }
    // {expr} → strip outer braces for sx object
    const inner = p.value.slice(1, -1);
    return `${p.name}: ${inner}`;
  });

  let newSxValue;
  if (existingSxToken) {
    // Merge into existing sx={{ ... }}
    const existing = existingSxToken.value; // e.g. {{ p: 3, mb: 2 }}
    // Strip outer { ... } and inner { ... }
    const innerMatch = existing.match(/^\{([\s\S]*)\}$/);
    const innerObj = innerMatch ? innerMatch[1].trim() : existing;
    // innerObj might be "{ p: 3, mb: 2 }" — strip inner braces too
    const objBody = innerObj.replace(/^\{([\s\S]*)\}$/, "$1").trim();
    const merged = [objBody, ...newPairs].filter(Boolean).join(", ");
    newSxValue = `{{ ${merged} }}`;
  } else {
    newSxValue = `{{ ${newPairs.join(", ")} }}`;
  }

  // Rebuild the token list
  const finalTokens = keepTokens.map((tok) => {
    if (tok === existingSxToken) {
      return { type: "prop", name: "sx", value: newSxValue };
    }
    return tok;
  });

  // If no existing sx token, append it (with leading space)
  if (!existingSxToken) {
    finalTokens.push({ type: "text", value: " " });
    finalTokens.push({ type: "prop", name: "sx", value: newSxValue });
  }

  // Serialise back
  let out = "";
  for (const tok of finalTokens) {
    if (tok.type === "text") {
      out += tok.value;
    } else if (tok.type === "prop") {
      if (tok.value === null) {
        out += tok.name;
      } else {
        out += `${tok.name}=${tok.value}`;
      }
    }
  }

  // Collapse runs of 2+ spaces (but preserve newline-based indentation)
  out = out.replace(/([^\n]) {2,}/g, "$1 ");

  return out + trailingClose;
}

/**
 * Process a single file's source code.
 * Returns { changed: bool, output: string }
 */
function migrateSource(src) {
  let output = src;

  // 1. Non-sx migrations first (simple regex, safe)
  output = migratePaperProps(output);
  output = migrateInputProps(output);
  output = migrateInputLabelProps(output);

  // 2. Build a regex that matches opening tags of our target components
  //    e.g.  <Box   or  <Typography
  const compPattern = SX_COMPONENTS.join("|");

  // Match:  <ComponentName  [attrs]  (> or />)
  // We capture the tag body between the component name and the closing > or />
  const tagRe = new RegExp(
    `(<(?:${compPattern}))(\\b[^]*?)(\\s*(?:/>|(?=>)))`,
    "g"
  );

  output = output.replace(tagRe, (match, open, body, close) => {
    const componentName = open.slice(1); // strip leading <
    const rebuilt = rebuildTag(componentName, body, close);
    if (rebuilt === null) return match;
    return open + rebuilt;
  });

  return { changed: output !== src, output };
}

// ─── File walking ─────────────────────────────────────────────────────────────

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        ["node_modules", ".git", "dist", "build", ".next"].includes(entry.name)
      )
        continue;
      walk(full, files);
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

// ─── Diff helper ─────────────────────────────────────────────────────────────

function simpleDiff(original, updated, filename) {
  const a = original.split("\n");
  const b = updated.split("\n");
  const lines = [];
  const maxLen = Math.max(a.length, b.length);
  let shown = 0;

  for (let i = 0; i < maxLen; i++) {
    if (a[i] !== b[i]) {
      if (shown >= 40) {
        lines.push("  ... (truncated)");
        break;
      }
      lines.push(`  Line ${i + 1}:`);
      if (a[i] !== undefined) lines.push(`  - ${a[i]}`);
      if (b[i] !== undefined) lines.push(`  + ${b[i]}`);
      shown++;
    }
  }
  return lines.join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const dirIdx = args.indexOf("--dir");
  const targetDir = dirIdx !== -1 ? args[dirIdx + 1] : DEFAULT_DIR;

  if (!fs.existsSync(targetDir)) {
    console.error(`Directory not found: ${targetDir}`);
    process.exit(1);
  }

  const files = walk(targetDir);
  let changedCount = 0;
  let errorCount = 0;

  console.log(`\n🔍  Scanning ${files.length} file(s) in "${targetDir}"...\n`);

  for (const file of files) {
    try {
      const src = fs.readFileSync(file, "utf8");
      const { changed, output } = migrateSource(src);

      if (!changed) continue;
      changedCount++;

      const rel = path.relative(process.cwd(), file);
      if (write) {
        fs.writeFileSync(file, output, "utf8");
        console.log(`✅  ${rel}`);
      } else {
        console.log(`📝  ${rel}  (dry run)`);
        console.log(simpleDiff(src, output, rel));
        console.log();
      }
    } catch (err) {
      errorCount++;
      console.error(`❌  Error processing ${file}: ${err.message}`);
    }
  }

  console.log("\n────────────────────────────────────────");
  if (write) {
    console.log(`✅  Done. Modified ${changedCount} file(s).`);
  } else {
    console.log(
      `🔍  Dry run complete. ${changedCount} file(s) would be modified.`
    );
    console.log(`    Run with --write to apply changes.`);
  }
  if (errorCount > 0) console.log(`⚠️   ${errorCount} file(s) had errors.`);
  console.log();
}

main();
