# scripts
rm -rf $HOME/.scripts
ln -s $PWD/scripts $HOME/.scripts

rm -rf $HOME/.profile
ln -s $PWD/profile $HOME/.profile
source $HOME/.profile

# config
CONFIGS=( i3 sxhkd polybar kitty zsh picom kmonad karabiner )
for c in "${CONFIGS[@]}"
do
	echo "Link $c? (y/n)"
	read RESPONSE
	if [ $RESPONSE = 'y' ]; then
		rm -rf $CONFIG/$c
		ln -s $PWD/$c $CONFIG/$c
	fi 
done
