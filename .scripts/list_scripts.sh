# select script
urxvt -e $( echo -n ~/.scripts/ && ls ~/.scripts | dmenu ) && exit
