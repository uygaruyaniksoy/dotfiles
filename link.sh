ROOT="$(dirname "$(readlink -fm "$0")")"

ln -sf $ROOT/i3 ~/.config/i3
ln -sf $ROOT/sxhkd ~/.config/sxhkd
ln -sf $ROOT/scripts ~/.scripts
ln -sf $ROOT/polybar ~/.config/polybar
