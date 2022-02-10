ROOT="$(dirname "$(readlink -fm "$0")")"

# remove old links
rm -rf 				\
	~/.config/i3 		\
	~/.config/sxhkd     	\
	~/.config/polybar 	\
	~/.config/kitty     	\
	~/.scripts

# config
ln -s $ROOT/i3 ~/.config/i3
ln -s $ROOT/sxhkd ~/.config/sxhkd
ln -s $ROOT/polybar ~/.config/polybar
ln -s $ROOT/kitty ~/.config/kitty

# scripts
ln -s $ROOT/scripts ~/.scripts
