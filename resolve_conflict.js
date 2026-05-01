const fs = require('fs');

let lines = fs.readFileSync('myfrontend/src/pages/MyProfile.jsx', 'utf8').split('\n');

let newLines = [];
let i = 0;
while (i < lines.length) {
    if (lines[i].startsWith('<<<<<<< HEAD')) {
        let blockStart = i;
        while (i < lines.length && !lines[i].startsWith('=======')) {
            i++;
        }
        let mid = i;
        while (i < lines.length && !lines[i].startsWith('>>>>>>>')) {
            i++;
        }
        let blockEnd = i;
        
        let headContent = lines.slice(blockStart + 1, mid);
        let remoteContent = lines.slice(mid + 1, blockEnd);

        // Detect which block it is based on content
        if (headContent.some(l => l.includes('SVG ICON COMPONENTS'))) {
            // Block 1: SVGs. Use remote SVGs + add FileText and Upload
            newLines.push('/* ─────────────────────────────────────────');
            newLines.push('   SVG ICON COMPONENTS');
            newLines.push('───────────────────────────────────────── */');
            newLines.push(...remoteContent);
            newLines.push('const IconFileText = ({ size = 14, color = "currentColor" }) => (');
            newLines.push('  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">');
            newLines.push('    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />');
            newLines.push('    <polyline points="14 2 14 8 20 8" />');
            newLines.push('    <line x1="16" y1="13" x2="8" y2="13" />');
            newLines.push('    <line x1="16" y1="17" x2="8" y2="17" />');
            newLines.push('    <polyline points="10 9 9 9 8 9" />');
            newLines.push('  </svg>');
            newLines.push(');');
            newLines.push('const IconUpload = ({ size = 14, color = "currentColor" }) => (');
            newLines.push('  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">');
            newLines.push('    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />');
            newLines.push('    <polyline points="17 8 12 3 7 8" />');
            newLines.push('    <line x1="12" y1="3" x2="12" y2="15" />');
            newLines.push('  </svg>');
            newLines.push(');');
        } 
        else if (headContent.some(l => l.includes('setViewers(res.data.data'))) {
            // Block 2: viewers
            newLines.push(...remoteContent);
        }
        else if (headContent.some(l => l.includes('handleCvSelect'))) {
            // Block 3: CV Handlers
            let cvHandlers = headContent.filter(l => true); // just keep head, but let's carefully extract CV handlers
            // Actually, HEAD contains handleDeletePhoto and handleSetPrimary which are dupes, so we filter them out
            let cvStart = headContent.findIndex(l => l.includes('/* ── CV handlers ── */'));
            let cvEnd = headContent.findIndex(l => l.includes('/* ── Render helpers ── */'));
            if (cvStart !== -1 && cvEnd !== -1) {
                newLines.push(...headContent.slice(cvStart, cvEnd));
            }
            newLines.push(...remoteContent);
        }
        else if (headContent.some(l => l.includes('id: "basic"'))) {
            // Block 4: Tabs
            newLines.push(...remoteContent);
        }
        else if (headContent.some(l => l.includes('Upload button'))) {
            // Block 5: The render conflict
            newLines.push(...remoteContent);
        }
        else {
            // fallback
            newLines.push(...remoteContent);
        }
        
        i++; // skip the >>>>>>> line
    } else {
        newLines.push(lines[i]);
        i++;
    }
}

let result = newLines.join('\n');

// Modify IconEye to support size and color
result = result.replace(/const IconEye      = \(\) => <svg width="16"/, 'const IconEye      = ({ size = 16, color = "currentColor" }) => <svg width={size} stroke={color}');
// Add CV section to Career tab
const cvHtml = `
                {/* ── CV SECTION ── */}
                <div className="mp-cv-section">
                  <div className="mp-cv-header">
                    <IconFileText size={16} color="#6B3F69" />
                    <h4>CV / Resume</h4>
                  </div>

                  {profile.cvUrl ? (
                    <div className="mp-cv-uploaded">
                      <div className="mp-cv-file-info">
                        <IconFileText size={24} color="#6B3F69" />
                        <div>
                          <span className="mp-cv-filename">Resume uploaded</span>
                          <span className="mp-cv-status">✓ Available</span>
                        </div>
                      </div>
                      <div className="mp-cv-actions">
                        <a
                          href={profile.cvUrl.startsWith('http') ? profile.cvUrl : profile.cvUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mp-cv-view-btn"
                        >
                          <IconEye size={14} color="#fff" /> View CV
                        </a>
                        <button
                          className="mp-cv-replace-btn"
                          onClick={() => cvInputRef.current?.click()}
                        >
                          <IconUpload size={14} color="#6B3F69" /> Replace
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mp-cv-empty">
                      <IconFileText size={32} color="#c9a0dc" />
                      <p>No CV uploaded yet</p>
                      <button
                        className="mp-cv-upload-btn"
                        onClick={() => cvInputRef.current?.click()}
                      >
                        <IconUpload size={15} color="#fff" /> Upload CV
                      </button>
                    </div>
                  )}

                  {/* Hidden file input for CV */}
                  <input
                    ref={cvInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style={{ display: "none" }}
                    onChange={handleCvSelect}
                  />

                  {/* Show selected file + upload button */}
                  {cvFile && (
                    <div className="mp-cv-pending">
                      <span className="mp-cv-pending-name">{cvFile.name}</span>
                      <button
                        className="mp-cv-upload-now-btn"
                        onClick={handleCvUpload}
                        disabled={uploadingCv}
                      >
                        {uploadingCv ? "Uploading…" : "Upload Now"}
                      </button>
                      <button
                        className="mp-cv-cancel-btn"
                        onClick={() => { setCvFile(null); if (cvInputRef.current) cvInputRef.current.value = ""; }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
`;
result = result.replace(/(\{\s*activeTab === "career" && \()([\s\S]*?<\/div>\s*<\/div>\s*)\)\s*\}/, `$1<>$2${cvHtml}</>)}`);

fs.writeFileSync('myfrontend/src/pages/MyProfile.jsx', result);
console.log("Merge completed cleanly.");
