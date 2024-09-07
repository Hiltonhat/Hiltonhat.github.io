# this script will take the lexicon from a flex project (aka "flexicon") and create a json object with its contents
# allowing it to be more easily shared with other people and studied using javascript or python
# pretty barebones at the moment, doesn't capture different entry structures or include notes, but I'll add that soon
# by Seth Katenkamp, based on similar work by Sunkulp Ananthanarayan

############ Things you should change:

# Add the name of the FLEx project 
# (not the unique ID from flexbridge, but the name that shows up in FLEx on your computer)
project_name = "projectname"

# Now decide the folder where you'd like your json file to go once it's been built:
json_dir = "C:/Users/me/.../"

# What would you like your file to be called?
new_file = "new_flexicon"

# What is the code for the vernacular writing system (i.e. the language your dictionary entries are for)?
# You can find this in FLEx by going to Format >> Set Up Vernacular Writing System. 
# The code will be listed at the top of the "General" tab for each writing system.
writing_system = "lang"

############ If you've done that you should be good to go!



import json
import os
from xml.etree import ElementTree as ET

project_dir = "C:/ProgramData/SIL/FieldWorks/Projects/" + project_name + "/Linguistics/"
lexicon_dir = project_dir + "Lexicon/"
lexdb_files = [file for file in os.listdir(lexicon_dir) if file.endswith(".lexdb")]
print("Found the lexicon files.")



# get the parts of speech
fs = ET.parse(project_dir + "MorphologyAndSyntax/PartsOfSpeech.list").getroot()
parts_of_speech = []
for ownseq in fs.findall(".//ownseq[@class='PartOfSpeech']"):
    part_of_speech = {"guid": ownseq.attrib["guid"], "name": ownseq.find("./Name/AUni").text}
    parts_of_speech.append(part_of_speech)

print("Found the parts of speech.")



# create the json object
new_json = {"flexicon_from": project_name}

# create the target directory if it doesn't already exist
try:
    os.mkdir(json_dir)
except:
    pass

# assembling the lexicon
lexicon = []

for file in lexdb_files:
    ft = ET.parse(lexicon_dir + file).getroot()
    for lex_entry in ft.findall(".//LexEntry"):
        word = {}

        try:
            word["guid"] = lex_entry.find(".//MoStemAllomorph").attrib["guid"]
        except:
            word["guid"] = "didn't find because the word is an affix or variant, will address later..."

        word["homograph_number"] = lex_entry.find("./HomographNumber").attrib["val"]
        headword_tag = ".//Form/AUni[@ws='" + writing_system + "']"
        word["headword"] = lex_entry.find(headword_tag).text

        # getting the part of speech
        try:
            pos_guid = lex_entry.find(".//PartOfSpeech/objsur").attrib["guid"]
            for pos in parts_of_speech:
                if pos["guid"] == pos_guid:
                    word["part_of_speech"] = pos["name"]
        except:
            word["part_of_speech"] = ""
        
        # getting the definitions
        senses = []

        for sense in lex_entry.findall(".//ownseq"):
            pair = {"definition": "", "gloss": ""}
            try:
                pair["definition"] = sense.find(".//Definition/AStr/Run").text
            except:
                pass
            try:
                pair["gloss"] = sense.find(".//Gloss/AUni").text
            except:
                pass
            senses.append(pair)

        word["number_of_senses"] = len(senses)
        word["senses"] = senses

        # getting the various notes fields
        try:
            word["grammar_note"] = lex_entry.find(".//GrammarNote/AStr/Run").text
        except:
            word["grammar_note"] = ""
        try:
            word["semantics_note"] = lex_entry.find(".//SemanticsNote/AStr/Run").text
        except:
            word["semantics_note"] = ""
        try:
            word["phonology_note"] = lex_entry.find(".//PhonologyNote/AStr/Run").text
        except:
            word["phonology_note"] = ""

        # add the word to the main lexicon
        lexicon.append(word)

new_json["lexicon"] = lexicon

print("Writing the data to a json file.")

# create the new file
json.dump(new_json, open(json_dir + new_file + ".json", mode="w", encoding="utf8"), indent=1)

print("Done! There are " + str(len(lexicon)) + " entries.")