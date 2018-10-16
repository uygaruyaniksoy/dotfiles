export EDITOR="vi"
alias rm='trash'
cd () { builtin cd "$@" && ls; }

alias emulator='$ANDROID_HOME/tools/emulator -avd Nexus_5X_API_23 -use-system-libs'
alias webstorm='/usr/local/WebStorm-173.4548.30/bin/webstorm.sh'
alias studio='~/.android-studio/bin/studio.sh'
alias android-stuido='studio'

alias logout!='cinnamon-session-quit --force'
alias shutdown!='systemctl poweroff'
alias restart!='systemctl reboot'
alias reboot!='restart!'
alias suspend!='systemctl suspend'
alias stw='date +%s > /home/uygar/.switch_to_windows && reboot!'

alias mplab='/opt/microchip/mplabx/v4.15/mplab_ide/bin/mplab_ide'

alias unity='~/.Unity-2018.2.7f1/Editor/Unity'
alias brightness='xrandr --output eDP-1 --brightness'
alias idea='/usr/local/idea-IU-181.4892.42/bin/idea.sh'

alias ytdlm='youtube-dl -q -x --audio-format mp3'
alias play="mpg321 -v -x --gain 20 -Z"
alias music='reptyr $(pgrep music-player.sh)'
alias clion='~/.clion-2018.2.2/bin/clion.sh'

alias ms='~/Project/music-player/index.sh'
alias ml='ms'
alias tm='node /home/uygar/Project/terminal-renderer/index.js '
alias nbash="$EDITOR ~/.bash_aliases"
alias sbash="source ~/.bash_aliases"
alias editbash="nbash && sbash"
alias ebash="editbash"
alias ezsh="$EDITOR ~/.zshrc && source ~/.zshrc"
alias rider="/home/uygar/.JetBrains\ Rider-2018.2.3/bin/rider.sh"
ss () { bash ~/.scripts/*$@* }
alias tor="/home/uygar/.tor-browser_en-US/Browser/start-tor-browser -allow-remote"
alias gcalcli="gcalcli --calendar 'uygaruyaniksoy@gmail.com'"
alias gcalw="gcalcli calw --military --monday "
alias gcaladd='echo "title: " && read -r input && echo "when: " && read -r inputt && gcalcli add --duration 60 --title "$(echo $input | sed -r '\''s/(.*)/\1/'\'')" --when "$(echo $inputt | sed -r  '\''s/(.*)/\1/'\'')"'

PROMPT_COMMAND='echo -ne "\033]0;${PWD/#$HOME/\~}\007"'

export PATH=~/Android/Sdk/tools:$PATH
export PATH=~/Android/Sdk/platform-tools:$PATH
