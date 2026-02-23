path = r'C:\Code\foxpurstudios.github.io\ProjectVega\index.html'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start = None
end = None
for i, line in enumerate(lines):
    if 'Add new updates at the top' in line:
        start = i
for i in range(start + 5, len(lines)):
    if '        </div>' in lines[i]:
        end = i
        break

print(f"Block: lines {start} to {end}")
print("Last line of block:", repr(lines[end]))

new_lines = [
    '          <!-- Add new updates at the top -->\n',
    '          <div class="update">\n',
    '            <div class="stamp">2026-02-21</div>\n',
    '            <div class="u-body">\n',
    '              <b>Introductory video live on YouTube</b>\n',
    '              <p>\n',
    '                The Hospital Starship Vega intro video is now live &mdash; ship exteriors, hangar bay, crew portraits, PRS-630 flyby.\n',
    '                AI-generated using Kling, Sora, and xAI. Created by Fox Purtill &amp; Lyra Evergrowth.\n',
    '                <a href="https://www.youtube.com/watch?v=bHifokR64RM" target="_blank" rel="noopener" style="color:var(--accent);">Watch on YouTube &rarr;</a>\n',
    '              </p>\n',
    '            </div>\n',
    '          </div>\n',
    '\n',
    '          <div class="update">\n',
    '            <div class="stamp">2026-02-21</div>\n',
    '            <div class="u-body">\n',
    '              <b>First crew dossiers published</b>\n',
    '              <p>\n',
    '                Eleven crew members now on record: Shha Flar, Sharon Xerces, Dr. Halorn Jex, Dr. Vinta P&apos;Raan,\n',
    '                Telan Maur, Tesk &apos;Wren&apos; Varrow, Dr. Amia Rell, Reff Orrell, Eron, Keth Ahlidren, and Nurseform Lyra.\n',
    '                20&ndash;30 additional crew in development.\n',
    '              </p>\n',
    '            </div>\n',
    '          </div>\n',
    '\n',
    '          <div class="update">\n',
    '            <div class="stamp">2026-02-14</div>\n',
    '            <div class="u-body">\n',
    '              <b>Vega subpage foundation created</b>\n',
    '              <p>\n',
    '                Layout, crew dossiers, gallery, merch cards, and contact form.\n',
    '                Universe co-created by Fox Purtill and Lyra Evergrowth.\n',
    '              </p>\n',
    '            </div>\n',
    '          </div>\n',
]

lines[start:end] = new_lines

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('SUCCESS')
