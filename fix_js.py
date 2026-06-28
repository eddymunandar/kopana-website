import os
import re

html_files = [
    '/Users/admin/Documents/Website/index.html',
    '/Users/admin/Documents/Website/pengurus.html',
    '/Users/admin/Documents/Website/daftar.html',
    '/Users/admin/Documents/Website/pengunduran.html'
]

for file in html_files:
    if os.path.exists(file):
        with open(file, 'r') as f:
            content = f.read()
        
        # Replace EMAIL_KOPERASI with kopanayk@gmail.com
        content = content.replace('EMAIL_KOPERASI', 'kopanayk@gmail.com')
        
        # Change id='dyn-kontak-email' to class='dyn-email'
        content = content.replace('id=\"dyn-kontak-email\"', 'class=\"dyn-email\"')
        
        # Add class='dyn-email' to the one in contact section if it doesn't have it
        content = content.replace(
            '<a href=\"mailto:kopanayk@gmail.com\" aria-label=\"Email KOPANA\">',
            '<a href=\"mailto:kopanayk@gmail.com\" aria-label=\"Email KOPANA\" class=\"dyn-email\">'
        )
        
        with open(file, 'w') as f:
            f.write(content)
        print(f'Modified {os.path.basename(file)}')

# Now modify script.js
script_path = '/Users/admin/Documents/Website/assets/js/script.js'
with open(script_path, 'r') as f:
    js_content = f.read()

# Replace setEl('dyn-kontak-email'...
js_content = re.sub(
    r"if\s*\(data\.email\)\s*setEl\('dyn-kontak-email',\s*data\.email,\s*'href',\s*`mailto:\$\{data\.email\}`\);",
    """if (data.email) {
        document.querySelectorAll('.dyn-email').forEach(el => {
          el.textContent = data.email;
          el.href = `mailto:${data.email}`;
        });
      }""",
    js_content
)

# Replace the block for el('dyn-kontak-email')
old_block = r"if\s*\(data\.email\s*&&\s*el\('dyn-kontak-email'\)\)\s*\{\s*el\('dyn-kontak-email'\)\.textContent\s*=\s*data\.email;\s*el\('dyn-kontak-email'\)\.href\s*=\s*`mailto:\$\{data\.email\}`;\s*\}"

new_block = """if (data.email) {
        document.querySelectorAll('.dyn-email').forEach(elem => {
          elem.textContent = data.email;
          elem.href = `mailto:${data.email}`;
        });
      }"""

js_content = re.sub(old_block, new_block, js_content, flags=re.MULTILINE)

with open(script_path, 'w') as f:
    f.write(js_content)
print('Finished modifying script.js')
