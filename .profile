xinput set-prop `xinput list | grep -i touchpad | awk '{ print $6 }' | sed 's/id=//'` "Device Enabled" 0
xrandr --listmonitors |  awk '{ print $2 }' | sed 's/[+0-9]//' | grep '\bHDMI-1-1' && xrandr --output HDMI-1-1 --auto --right-of eDP-1-1
~/.scripts/load_keyboard_config

wal -i ~/.config/wall.png >/dev/null
wal -R
compton &
nm-applet &
{ sleep 10; /usr/bin/redshift; } &

PATH="$PATH:/home/uygar/.scripts"
TERMINAL="xfce4-terminal"
alias vi="vim"

function dcc() {
    /snap/bin/discord || dcc;
}

# mount other storage
if [ ! -e "/media/$(whoami)/Steam" ]; then sudo mkdir "/media/$(whoami)/Steam"; fi
sudo mount /dev/sda2 "/media/$(whoami)/Steam"

[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
