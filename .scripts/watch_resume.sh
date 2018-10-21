while inotifywait -e modify ~/Documents/resume/resume.tex; do
    killall zathura; pdflatex ~/Documents/resume/resume.tex > /dev/null; zathura ~/Documents/resume/resume.pdf &
done

