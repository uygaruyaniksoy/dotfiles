# config
export CONFIG="$HOME/.config"
export XDG_CONFIG_HOME=$CONFIG
export ZDOTDIR="$CONFIG/zsh"

# programs
export EDITOR=nvim
export TERMINAL=kitty
export TERM=kitty
export SHELL=zsh
export BROWSER=google-chrome-stable

# misc
export GTK2_RC_FILES="$HOME/.gtkrc-2.0"
export QT_QPA_PLATFORMTHEME="qt5ct"
export PATH="$PATH:$HOME/.scripts"

# aliases
alias brightness='xrandr --output eDP-1 --brightness'
alias rm='trash'
