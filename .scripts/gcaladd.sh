echo "title: " && read -r input && echo "when: " && read -r inputt && gcalcli --calendar uygaruyaniksoy@gmail.com add --duration 60 --title "$(echo $input | sed -r 's/(.*)/\1/')" --when "$(echo $inputt | sed -r  's/(.*)/\1/')"
exit
