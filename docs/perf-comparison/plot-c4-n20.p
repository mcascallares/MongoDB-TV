set terminal png nocrop enhanced font verdana 12 size 640,640
set output "c4-n20.png"

set title "FS vs GridFS (c=4, n=20)"

set grid y

set xlabel "request"
set ylabel "response time (ms)"

plot "fs-c4-n20.dat" using 9 smooth sbezier with lines title 'FS', "grid-c4-n20.dat" using 9 smooth sbezier with lines title 'GridFS'