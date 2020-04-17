export EDITOR=/usr/bin/vi
export BROWSER="/usr/bin/chromium-browser"
export QT_QPA_PLATFORMTHEME="qt5ct"
export GTK2_RC_FILES="$HOME/.gtkrc-2.0"
export TERMINAL="urxvt"

xinput set-prop `xinput list | grep -i touchpad | awk '{ print $6 }' | sed 's/id=//'` "Device Enabled" 0
xrandr --listmonitors |  awk '{ print $2 }' | sed 's/[+0-9]//' | grep '\bDP-1-1' && xrandr --output DP-1-1 --auto --right-of eDP-1-1
~/.scripts/load_keyboard_config

wal -i ~/.config/wall.png >/dev/null
wal -R
compton &
redshift &
nm-applet &


# mount other storage
if [ ! -e "/media/$(whoami)/Steam" ]; then sudo mkdir "/media/$(whoami)/Steam"; fi
sudo mount /dev/sda2 "/media/$(whoami)/Steam"
