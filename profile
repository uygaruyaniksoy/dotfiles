# config
export DOTFILES="$HOME/dotfiles"
export ZDOTDIR="$DOTFILES/zsh"
export _Z_CMD=$ZDOTDIR/.z.sh
alias z=$_Z_CMD

# misc
export PATH="$PATH:$HOME/.scripts"
export PATH="$PATH:/opt/homebrew/bin/"

export NVM_DIR="$HOME/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
