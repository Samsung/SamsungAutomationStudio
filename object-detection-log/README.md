# object-detection-log

This node records the detected motion poses and objects and saves them to a file.

The files are saved in the entered storage location by date named log-yyyy-MM-dd.

<br>

## Input

### log-directory
the location of log files (default : /var/log/nodered/D5MI)

<br>

## Output

### file name
${entered directory}/log-yyyy-MM-dd.log  

### content
{ Pose : 'seat', Location : 'sofa', Date : '2022. 9. 28. 오후 1:57:58' }
