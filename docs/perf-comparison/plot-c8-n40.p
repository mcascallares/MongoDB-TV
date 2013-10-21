set terminal png nocrop enhanced font verdana 12 size 640,640
set output "c8-n40.png"

set title "FS vs GridFS (c=8, n=40)"

set grid y

set xlabel "request"
set ylabel "response time (ms)"

plot "fs-c8-n40.dat" using 9 smooth sbezier with lines title 'FS', "grid-c8-n40.dat" using 9 smooth sbezier with lines title 'GridFS'