const fs = require('fs');

function resolveConflict(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Simple logic: keep the 'theirs' version (local work being applied)
    // In git rebase: <<<<<<< HEAD is current base (remote), >>>>>>> is incoming (local)
    
    const lines = content.split('\n');
    const result = [];
    let inConflict = false;
    let conflictPart = ''; // 'ours' or 'theirs'
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('<<<<<<<')) {
            inConflict = true;
            conflictPart = 'ours';
            continue;
        }
        if (line.startsWith('=======')) {
            conflictPart = 'theirs';
            continue;
        }
        if (line.startsWith('>>>>>>>')) {
            inConflict = false;
            conflictPart = '';
            continue;
        }
        
        if (inConflict) {
            if (conflictPart === 'theirs') {
                result.push(line);
            }
        } else {
            result.push(line);
        }
    }
    
    fs.writeFileSync(filePath, result.join('\n'));
    console.log(`Resolved conflicts in ${filePath}`);
}

resolveConflict('myfrontend/src/pages/MyProfile.jsx');
resolveConflict('myfrontend/src/pages/MyProfile.css');
