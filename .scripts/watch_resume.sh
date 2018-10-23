cd ~/Documents/resume
while inotifywait --exclude ".*(log|pdf|aux|out)$" -e modify ~/Documents/resume/; do
    killall zathura
    trash ~/Documents/resume/resume.pdf
    pdflatex ~/Documents/resume/resume.tex > /dev/null
    zathura ~/Documents/resume/resume.pdf &
done &
vi ~/Documents/resume/resume.tex
killall inotifywait
exit
