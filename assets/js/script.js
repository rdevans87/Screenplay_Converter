function convert() {
    const file = document.getElementById('input').files[0];
    const reader = new FileReader();
    reader.onload = function() {
      const input = reader.result.trim();
      const scenes = input.split(/\n(?=[A-Z ]{2,}[\n ]+)/);
      const story = [];
      for (let scene of scenes) {
        if (/^\.\.\./.test(scene)) {
          // Transition
          story.push(`${scene.trim()}\n`);
        } else if (/^[A-Z ]{2,}[\n ]+/.test(scene)) {
          // Slugline
          story.push(`\n${scene.trim()}\n`);
        } else if (/^([A-Z ]+ ?)+\n/.test(scene)) {
          // Shot
          story.push(`\n${scene.trim()}\n`);
        } else if (/^[^\n]+[\n ]+[^\n]+/.test(scene)) {
          // Action
          story.push(`${scene.trim()}\n`);
        } else if (/^([A-Z ]+ ?)+$/.test(scene)) {
          // Character name
          story.push(`\n${scene.trim()}\n`);
        } else if (/^[ \t]*\(.+\)[ \t]*$/.test(scene)) {
          // Parenthetical
          story[story.length-1] += `, ${scene.trim()}`;
        } else if (/^[ \t]*[A-Z].*[^\n]/.test(scene)) {
          // Dialogue
          const character = /([A-Z ]+)(\(.+\))?/.exec(scene)[1].trim();
          const dialogue = /([A-Z ]+)(\(.+\))?:(.+)/.exec(scene)[3].trim();
          const quote = `"${dialogue}"`;
          const attribution = `said ${character}`;
          const punctuation = /[?!]$/.test(dialogue) ? '?' : '';
          story[story.length-1] += ` ${quote} ${attribution}${punctuation}\n`;
        }
      }
      const output = document.getElementById('output');
      output.innerText = story.join('');
      document.getElementById('download').setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(story.join('')));
      document.getElementById('download').setAttribute('download', `${file.name.split('.').shift()}_story.txt`);
    }
    reader.readAsText(file);
  }
  
  function download() {
    document.getElementById('download').click();
  }
  