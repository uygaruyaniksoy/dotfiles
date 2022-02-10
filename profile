~/.scripts/load_keyboard_config

wal -i ~/.config/wall.png >/dev/null
wal -R
compton &
nm-applet &
{ sleep 10; /usr/bin/redshift; } &


alias brightness='xrandr --output eDP-1 --brightness'
