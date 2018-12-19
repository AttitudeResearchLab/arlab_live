#!/bin/bash

if [[ ${1} == 0 ]]; then
	echo "ERROR: The index of barrage file cannot be '0'."
else
 	cp static/res/barrages${1}.json static/res/barrages0.json
fi