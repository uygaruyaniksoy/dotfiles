source .exports

xinput set-prop `xinput list | grep -i touchpad | awk '{ print $6 }' | sed 's/id=//'` "Device Enabled" 0
xrandr --listmonitors |  awk '{ print $2 }' | sed 's/[+0-9]//' | grep '\bHDMI-1-1' && xrandr --output HDMI-1-1 --auto --right-of eDP-1-1
~/.scripts/load_keyboard_config

wal -i ~/.config/wall.png >/dev/null
wal -R
compton &
nm-applet &
polybar &
{ sleep 10; /usr/bin/redshift; } &
~/Programs/i3-alternating-layout/alternating_layouts.py &


function dcc() {
    /snap/bin/discord || dcc;
}

# mount other storage
if [ ! -e "/media/$(whoami)/Steam" ]; then sudo mkdir "/media/$(whoami)/Steam"; fi
sudo mount /dev/sda2 "/media/$(whoami)/Steam"

export PATH=$PATH:$HOME/.scripts
export EDITOR='vim'
export BROWSER="chromium-browser"
export TERMINAL="rxvt-unicooe"
export TERM="rxvt-unicode"

export PATH="/home/uygar/Android/Sdk/platform-tools:/home/uygar/Android/Sdk/tools:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/home/uygar/.vim/bundle/vim-live-latex-preview/bin:/home/uygar/.scripts:/home/uygar/.vimpkg/bin"

export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# The next line updates PATH for the Google Cloud SDK.
if [ -f '/home/uygar/Downloads/google-cloud-sdk/path.zsh.inc' ]; then . '/home/uygar/Downloads/google-cloud-sdk/path.zsh.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '/home/uygar/Downloads/google-cloud-sdk/completion.zsh.inc' ]; then . '/home/uygar/Downloads/google-cloud-sdk/completion.zsh.inc'; fi
