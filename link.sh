ROOT="$(dirname "$(readlink -fm "$0")")"

# config
CONFIGS=( i3 sxhkd polybar kitty zsh )
for c in "${CONFIGS[@]}"
do
	rm -rf $CONFIG/$c
	ln -s $ROOT/$c $CONFIG/$c
done

# scripts
rm -rf $HOME/.scripts
ln -s $ROOT/scripts $HOME/.scripts
