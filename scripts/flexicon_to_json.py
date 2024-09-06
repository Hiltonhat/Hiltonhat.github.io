# this script will take the lexicon from a flex project (aka "flexicon") and create a json object with its contents
# allowing it to be more easily shared with other people and studied using javascript or python
# pretty barebones at the moment, doesn't capture different entry structures or include notes, but I'll add that soon
# by Seth Katenkamp, based on similar work by Sunkulp Ananthanarayan

import json
import os
from xml.etree import ElementTree as ET



####### Things you should change:

# Add the name of the FLEx project 
# (not the unique ID from flexbridge, but the name that shows up in FLEx on your computer)
project_name = "myprojectname"

# Now decide the folder where you'd like your json file to go once it's been built:
json_dir = "C:/Users/me/OneDrive/destinationfolder/"

# What would you like your file to be called?
new_file = "new_flexicon"

####### If you've done that you should be good to go!



print("Finding the lexicon files...")

lexicon_dir = "C:/ProgramData/SIL/FieldWorks/Projects/" + project_name + "/Linguistics/Lexicon/"
lexdb_files = [file for file in os.listdir(lexicon_dir) if file.endswith(".lexdb")]

# create the json object
print("Putting the json together...")

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
        word["headword"] = lex_entry.find(".//Form/AUni[@ws='cho-QM-x-OK']").text # gonna have to make this able to change by language
        
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

        # add the word to the main lexicon
        lexicon.append(word)

new_json["lexicon"] = lexicon

# print(lexicon)

# create the new file
json.dump(new_json, open(json_dir + new_file + ".json", mode="w", encoding="utf8"), indent=1)

print("Done! There are " + str(len(lexicon)) + " entries.")