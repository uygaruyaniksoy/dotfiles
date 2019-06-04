export EDITOR=/usr/bin/vi
export BROWSER="/usr/bin/chromium-browser"
export QT_QPA_PLATFORMTHEME="qt5ct"
export GTK2_RC_FILES="$HOME/.gtkrc-2.0"
export TERMINAL="urxvt"

setxkbmap us
xinput set-prop `xinput list | grep -i touchpad | awk '{ print $6 }' | sed 's/id=//'` "Device Enabled" 0
xmodmap ~/.xmodmap
xcape -e "Mode_switch=Escape"
xrandr --listmonitors |  awk '{ print $2 }' | sed 's/[+0-9]//' | grep '\bDP-1-1' && xrandr --output DP-1-1 --auto --right-of eDP-1-1
sxhkd &
xset r rate 200 40
xset r 108 r on


