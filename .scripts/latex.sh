while inotifywait --exclude ".*(log|pdf|aux|out)$" -e modify *; do
    trash "$1.pdf"
    pdflatex "$1.tex"
    killall zathura
    zathura "$1.pdf" &
done &
vi "$1.tex"
killall inotifywait
exit
