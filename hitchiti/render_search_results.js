export async function renderSentence(sentence) {
  
  const addSentence = document.createElement("tr");
  addSentence.setAttribute('class', 'sentence')

  // column for the segnum
  const segnumColumn = document.createElement("td");
  segnumColumn.setAttribute("class", "segnum_column");
  segnumColumn.innerText = sentence["segnum"]; // add the title here?
  addSentence.appendChild(segnumColumn);



  // column for the actual sentence content
  const contentColumn = document.createElement("td");
  contentColumn.setAttribute("class", "content_column");
  const content = document.createElement("table");
  content.setAttribute("class", "content");

  // assemble the original Swanton two-line gloss as a table and append
  if (askForSwanton.checked) { 
  const originalVersion = document.createElement("tr");
  originalVersion.setAttribute('class', 'original_version');

  const originalLabel = document.createElement("td");
  originalLabel.setAttribute('class', 'label');
  originalLabel.innerText = "original: "
  originalVersion.appendChild(originalLabel);

  const originalMaterial = document.createElement("td");
  originalMaterial.setAttribute('class', 'material');

      const originalVersionTable = document.createElement("table");
      originalVersionTable.setAttribute('class', 'original_version_table');
      const originalBaseline = document.createElement("tr");
      originalBaseline.setAttribute('class', 'original_baseline');
      const originalGloss = document.createElement("tr");
      originalGloss.setAttribute('class', 'original_gloss');

      for (const word of sentence.original) {
          const addWordText = document.createElement("td");
          addWordText.setAttribute('class', 'baseline');
          addWordText.innerText = word["original_transcription"]
          originalBaseline.appendChild(addWordText);

          const addWordGloss = document.createElement("td");
          addWordGloss.setAttribute('class', 'gloss');
          addWordGloss.innerText = word["original_gloss"]
          originalGloss.appendChild(addWordGloss);
      }
      originalVersionTable.appendChild(originalBaseline);
      originalVersionTable.appendChild(originalGloss);

  originalMaterial.appendChild(originalVersionTable);
  originalVersion.appendChild(originalMaterial);
  contentColumn.append(originalVersion)
  }

  // assemble the modern three-line gloss as a table and append
  if (askForGloss.checked) {
  const newVersion = document.createElement("tr");
  newVersion.setAttribute('class', 'new_version');

  const newLabel = document.createElement("td");
  newLabel.setAttribute('class', 'label');
  newLabel.innerText = "modern: "
  newVersion.appendChild(newLabel);

  const newMaterial = document.createElement("td");
  newMaterial.setAttribute('class', 'material');

      const newVersionTable = document.createElement("table");
      newVersionTable.setAttribute('class', 'new_version_table');
      const newBaseline = document.createElement("tr");
      newBaseline.setAttribute('class', 'new_baseline');
      const newGloss = document.createElement("tr");
      newGloss.setAttribute('class', 'new_gloss');

      for (const word of sentence.word_list) {
          const addWordText = document.createElement("td");
          addWordText.setAttribute('class', 'baseline');
          addWordText.innerText = word["word_text"]
          newBaseline.appendChild(addWordText);

          const addWordGloss = document.createElement("td");
          addWordGloss.setAttribute('class', 'gloss');
              const wordLevelGloss = document.createElement("table");

              if (word.morphs.length) {
              wordLevelGloss.setAttribute('class', 'word_level_gloss');
                  const glossMkRow = document.createElement("tr");
                  const glossEnRow = document.createElement("tr");
              for (const morph of word.morphs) {
                  const glossMk = document.createElement("td");
                  if (morph["morph_txt"]) {
                      glossMk.innerText = morph["morph_txt"]
                  } else {
                      glossMk.innerText = "" // change this string to "?" or something if you wanna see the cells
                  }
                  glossMkRow.appendChild(glossMk);
                  wordLevelGloss.appendChild(glossMkRow);

                  const glossEn = document.createElement("td");
                  if (morph["morph_gls"]) {
                      glossEn.innerText = morph["morph_gls"]
                  } else {
                      glossEn.innerText = "" // change this string to "?" or something if you wanna see the cells
                  }
                  glossEnRow.appendChild(glossEn);
                  wordLevelGloss.appendChild(glossEnRow);
              }
              addWordGloss.appendChild(wordLevelGloss)
              } else {
                  wordLevelGloss.innerHTML = `
                  <tr><td>?</td></tr>
                  <tr><td>?</td></tr>
                  `
                  addWordGloss.appendChild(wordLevelGloss)
          };
          newGloss.appendChild(addWordGloss);
      }
      newVersionTable.appendChild(newBaseline);
      newVersionTable.appendChild(newGloss);

  newMaterial.appendChild(newVersionTable);
  newVersion.appendChild(newMaterial);
  contentColumn.append(newVersion)
  } else {
      const newVersion = document.createElement("tr");
      newVersion.setAttribute('class', 'new_version');

      const newLabel = document.createElement("td");
      newLabel.setAttribute('class', 'label');
      newLabel.innerText = "modern: "
      newVersion.appendChild(newLabel);

      const newMaterial = document.createElement("td");
      newMaterial.setAttribute('class', 'material');

          const newVersionTable = document.createElement("table");
          newVersionTable.setAttribute('class', 'new_version_table');
          const newBaseline = document.createElement("tr");
          newBaseline.setAttribute('class', 'new_baseline');

          for (const word of sentence.word_list) {
          const addWordText = document.createElement("td");
          addWordText.setAttribute('class', 'baseline');
          addWordText.innerText = word["word_text"];
          newBaseline.appendChild(addWordText);
          }
      
      newVersionTable.appendChild(newBaseline);
      newMaterial.appendChild(newVersionTable);
      newVersion.appendChild(newMaterial);
      contentColumn.append(newVersion)
  }

  // add the translation
  if (askForTranslation.checked) {
  const addTranslation = document.createElement("tr");
  addTranslation.setAttribute('class', 'translation');

  const translationLabel = document.createElement("td");
  translationLabel.setAttribute('class', 'label');
  translationLabel.innerText = "translation: "
  addTranslation.appendChild(translationLabel);

      const translationMaterial = document.createElement("td");
      translationMaterial.setAttribute('class', 'translation_material');
      if (sentence["translation_en"]) {
          translationMaterial.innerText = sentence["translation_en"]
      } else {
          translationMaterial.innerText = "(no translation yet)"
      }
      addTranslation.appendChild(translationMaterial)
      
  contentColumn.appendChild(addTranslation);
  }

  // add the notes
  if (askForNotes.checked) {
  const addNotes = document.createElement("tr");
  addNotes.setAttribute('class', 'notes');

  const notesLabel = document.createElement("td");
  notesLabel.setAttribute('class', 'label');
  notesLabel.innerText = "notes: "
  addNotes.appendChild(notesLabel);

  const notesMaterial = document.createElement("td");
      notesMaterial.setAttribute('class', 'notes')
      notesMaterial.innerText = "(notes will go here...)"
      addNotes.appendChild(notesMaterial)
  contentColumn.appendChild(addNotes);
  }

  // add the whole content column to the sentence object
  addSentence.appendChild(contentColumn);



  // column for a little feedback button that I will write the feedback script for later
  const feedbackColumn = document.createElement("td");
  feedbackColumn.setAttribute("class", "feedback_column");

      function openFeedbackWindow() {
          const citation = `${title} §${segnumColumn.innerText}`;
          navigator.clipboard.writeText(citation);
          const feedbackWindow = document.createElement("td");
          feedbackWindow.setAttribute("class", "feedbackWindow");
          feedbackWindow.innerHTML = `<input class="feedbackTextBox" placeholder="Type feedback here:"><button class="submitToMe">submit</button>`
          // to do: combine the text name and segnum with the stuff that goes in the input
          // to do: email it to me?
          addSentence.appendChild(feedbackWindow);
      }

      function copyPlaintext() {
          console.log("Sorry, I haven't finished getting this to work yet!")
      }

      function copyLatex() {
          console.log("need to ask LaTeX users how they format their three-line glosses...")
      }

      const feedbackButton = document.createElement("button");
      feedbackButton.setAttribute("class", "feedback");
      feedbackButton.innerText = "submit erratum"
      feedbackButton.addEventListener("click", openFeedbackWindow);
      feedbackColumn.appendChild(feedbackButton);

      const copyPlaintextButton = document.createElement("button");
      copyPlaintextButton.setAttribute("class", "feedback");
      copyPlaintextButton.innerText = "copy (plaintext)"
      feedbackColumn.appendChild(copyPlaintextButton);
      copyPlaintextButton.addEventListener("click", copyPlaintext);

      const copyLatexButton = document.createElement("button");
      copyLatexButton.setAttribute("class", "feedback");
      copyLatexButton.innerText = "copy (LaTeX)"
      feedbackColumn.appendChild(copyLatexButton);
      copyLatexButton.addEventListener("click", copyLatex);

      addSentence.appendChild(feedbackColumn);

  textArea.appendChild(addSentence)
}