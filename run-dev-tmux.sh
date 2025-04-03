#!/bin/bash

# Start a new tmux session named "metals"
tmux new-session -d -s metals

# Bind the "x" key to kill the session
tmux bind-key x kill-session

# Split the window horizontally
tmux split-window -h

# Adjust the size of the panes
tmux resize-pane -t 0 -x 50%  # Make both panes equal width

# Run commands in each pane
tmux select-pane -t 0
tmux send-keys "cd $(pwd)/server && source venv/bin/activate && python run_heavy_metal_api.py" C-m

tmux select-pane -t 1
tmux send-keys "cd $(pwd)/client && npm run dev" C-m

# Enable mouse mode for easy pane switching
tmux setw -g mouse on

# Set window title
tmux set-option -g set-titles on
tmux set-option -g set-titles-string "🎸 METALS 🎸"

# Increase scrollback buffer
tmux set-option -g history-limit 50000

# Attach to the session only if in iTerm2
if [ "$TERM_PROGRAM" = "iTerm.app" ]; then
  tmux -CC attach-session -t metals
else
  tmux attach-session -t metals
fi 