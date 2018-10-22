cd ~/Documents/resume
while inotifywait --exclude ".*(log|pdf)$" -e modify ~/Documents/resume/; do
    trash ~/Documents/resume/resume.pdf;
    killall zathura;
    pdflatex ~/Documents/resume/resume.tex > /dev/null;
    zathura ~/Documents/resume/resume.pdf &
done &
vi ~/Documents/resume/resume.tex
