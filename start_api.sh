#/bin/bash

# the api process is named 'arlab_live_api'
# to kill the process: pkill -f arlab_live_api
bash -c "exec -a arlab_live_api python main.py"