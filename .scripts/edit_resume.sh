cd ~/Documents/resume
while inotifywait --exclude ".*(log|pdf|aux|out)$" -e modify ~/Documents/resume/; do
    trash ~/Documents/resume/resume.pdf
    pdflatex ~/Documents/resume/resume.tex > /dev/null
    killall zathura
    zathura ~/Documents/resume/resume.pdf &
done &
vi ~/Documents/resume/resume.tex
killall inotifywait
exit
