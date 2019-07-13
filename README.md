```
#packages
sudo apt install $(cat packages)

#oh-my-zsh
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
git clone https://github.com/zsh-users/zsh-autosuggestions             ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions\

#vim
git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/          bundle/Vundle.vim\
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \\
     https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim\
mkdir -p ~/.vim/autoload ~/.vim/bundle && \\
    curl -lsso ~/.vim/autoload/pathogen.vim https://tpo.pe/pathogen.vim

#bumblebee-status for i3
git clone git://github.com/tobi-wan-kenobi/bumblebee-status .bumblebee-status
cp ~/.bumblebee-status-modules/* ~/.bumblebee-status/bumblebee/modules/
```
