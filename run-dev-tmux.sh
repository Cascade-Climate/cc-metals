#!/bin/bash

# Create a new tmux session named "metals"
tmux new-session -d -s metals

# Split the window horizontally
tmux split-window -h -t metals

# Start backend in the left pane
tmux send-keys -t metals:0.0 "cd $(pwd)/server && source venv/bin/activate && python run_heavy_metal_api.py" C-m

# Start frontend in the right pane
tmux send-keys -t metals:0.1 "cd $(pwd)/client && npm run dev" C-m

# Attach to the tmux session
tmux attach-session -t metals 